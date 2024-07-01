import {
    Interaction,
    ButtonInteraction,
    ModalSubmitInteraction,
} from 'discord.js';
import {
    newWishlistModal,
    newRefetchRow,
    newMoreDetailsRow,
} from './constructParts';
import {
    isEligibleToRefetch,
    fetchNewWishlist,
    wlToMarkdownCustom,
    wlToMarkdownFull,
} from '../../wishlists/mainWishlist';
import { unixNow } from '../../lib/miscHelpers';
import { dbGetWishlist, dbUpdateWishlist } from '../../database/mainDB';
import {
    DBMaybeWishlistChunkTuple,
    DBWishlistChunk,
    MaybeWishlistTuple,
    Wishlist,
} from '../../projectTypes';

/**
 * Interaction to view 'My wishlist'. If the user is not in DB,
 *  then they are prompted to write their identifier into a modal.
 * If the user is in DB or the fetch from identifier is successful,
 *  then the wishlist gets displayed to the user.
 * There is also options to refetch wishlist data or to display more details.
 * @param interaction on pressing 'mywl' button
 */
export async function onMyWLButton(interaction: ButtonInteraction) {
    const nameOfUser = interaction.user.displayName;
    let wishlist: Wishlist;
    let dataIsFromDB: boolean;

    let wishlistTuple: DBMaybeWishlistChunkTuple | MaybeWishlistTuple =
        await dbGetWishlist(interaction.user.id);

    if (wishlistTuple[0] === false) {
        // DB fetch attempt failed. Prompt user for id
        dataIsFromDB = false;
        console.log(wishlistTuple[1]);

        // Prompt user with a modal.
        const wlModal = newWishlistModal();
        let modalSubmit: ModalSubmitInteraction | undefined;
        try {
            await interaction.showModal(wlModal);
            const filter = (interaction: ModalSubmitInteraction) =>
                interaction.customId === 'idModal';
            modalSubmit = await interaction.awaitModalSubmit({
                filter,
                time: 600_000,
            });
            await modalSubmit.deferReply({
                ephemeral: true,
            });
        } catch (err) {
            // Submit timed out, stop interaction.
            console.log('Wishlist modal timed out (my wishlist)');
            return;
        }

        // If user submitted in time, run new wishlist sequence.
        const textInput = modalSubmit.fields.getTextInputValue('idText');
        wishlistTuple = await fetchNewWishlist(textInput);
        if (wishlistTuple[0] === false) {
            console.log(
                `Steam failed to find a wishlist from user ${nameOfUser}'s ID input`
            );
            await modalSubmit.editReply({
                // Display reason why the fetch failed.
                content: wishlistTuple[1],
            });
            return;
        } else {
            wishlist = wishlistTuple[1];
            // Store to DB
            const dbWishlistData: DBWishlistChunk = {
                givenIdentifier: textInput,
                discordIdentifier: interaction.user.id,
                unixFetchedAt: unixNow(),
                wishlistData: wishlist,
            };
            dbUpdateWishlist(dbWishlistData);
            await modalSubmit.deleteReply();

            // Continue and display to user.
        }
    } else {
        // DB fetch attempt succeeded
        dataIsFromDB = true;
        console.log(`${nameOfUser}'s wishlist was found in DB`);
        wishlist = wishlistTuple[1].wishlistData;
    }

    // Display wishlist sequence.
    const unixFetched = dataIsFromDB
        ? (wishlistTuple[1] as DBWishlistChunk).unixFetchedAt
        : unixNow();
    const refetchToDisabled = !isEligibleToRefetch(unixFetched);
    const refetchRow = newRefetchRow(
        refetchToDisabled,
        'Update data (after 10min)'
    );

    const replyVariant = dataIsFromDB
        ? interaction.reply.bind(interaction)
        : interaction.followUp.bind(interaction);
    console.log(`Displayed a wishlist to user ${nameOfUser}`);
    const response = await replyVariant({
        content: wlToMarkdownCustom(wishlist),
        components: [newMoreDetailsRow(), refetchRow],
        fetchReply: true,
        ephemeral: true,
    });

    // Wait to see if user wants to refetch wishlist data or display details.
    const collectorFilter = (newInteraction: Interaction) =>
        newInteraction.user.id === interaction.user.id;
    try {
        const btnInteraction = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60_000,
        });

        if (btnInteraction.customId === 'refetch') {
            // Once user clicks refetch, remove this interaction message.
            // Handle in separate interaction file.
            interaction.deleteReply();
        } else if (btnInteraction.customId === 'morewishlist') {
            btnInteraction.reply({
                ephemeral: true,
                content: wlToMarkdownFull(wishlist),
            });
            // Clear buttons
            // Will crash if last reply is a followup.
            if (dataIsFromDB) interaction.editReply({ components: [] });
        }
    } catch (err) {
        console.log('Option to refetch or display more details timed out');
        return;
    }
}
