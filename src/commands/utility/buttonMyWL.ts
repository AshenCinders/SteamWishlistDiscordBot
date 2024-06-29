import {
    Interaction,
    ButtonInteraction,
    ModalSubmitInteraction,
} from 'discord.js';
import { newWishlistModal, newRefetchButton } from './constructParts';
import {
    isEligibleToRefetch,
    fetchNewWishlist,
    wlToMarkdownCustom,
} from '../../wishlists/mainWishlist';
import { unixNow } from '../../lib/miscHelpers';
import { dbGetWishlist, dbUpdateWishlist } from '../../database/mainDB';
import { DBWishlistChunk } from '../../projectTypes';

/**
 * Interaction to view 'My wishlist'. If the user is not in DB, then they are prompted to write their identifier into a modal.
 * If the user is in DB or the fetch from identifier is successful, then the wishlist gets displayed to the user.
 * @param interaction on pressing 'mywl' button
 */
export async function onMyWLButton(interaction: ButtonInteraction) {
    const nameOfUser = interaction.user.displayName;
    const autoChoices = {
        showTags: true,
        showReviewGrade: true,
        showReleaseDateFormatted: true,
        showAddedToWLFormatted: true,
    };

    const fetchTuple = await dbGetWishlist(interaction.user.id);
    if (fetchTuple[0] === false) {
        // DB fetch attempt failed. Prompt user for id
        console.log(fetchTuple[1]);

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

        const textInput = modalSubmit.fields.getTextInputValue('idText');
        const wlTuple = await fetchNewWishlist(textInput);
        if (wlTuple[0] === false) {
            console.log(
                `Steam failed to find a wishlist from user ${nameOfUser}'s ID input`
            );
            await modalSubmit.editReply({
                // Display reason why the fetch failed.
                content: wlTuple[1],
            });
        } else {
            const displayStr = wlToMarkdownCustom(wlTuple[1], autoChoices);
            console.log(`Displayed a wishlist to user ${nameOfUser}`);
            await modalSubmit.editReply({
                content: displayStr,
            });

            // Store to DB
            const dbWishlistData: DBWishlistChunk = {
                givenIdentifier: textInput,
                discordIdentifier: interaction.user.id,
                unixFetchedAt: unixNow(),
                wishlistData: wlTuple[1],
            };
            await dbUpdateWishlist(dbWishlistData);
        }
    } else {
        // DB fetch attempt succeeded
        console.log(`${nameOfUser}'s wishlist was found in DB`);

        const wishlist = fetchTuple[1].wishlistData;
        const displayStr = wlToMarkdownCustom(wishlist, autoChoices);

        let disableButton = isEligibleToRefetch(fetchTuple[1].unixFetchedAt)
            ? false
            : true;
        const refetchButton = newRefetchButton(
            disableButton,
            'Update data (after 10min)'
        );
        console.log(`Displayed a wishlist to user ${nameOfUser}`);
        const response = await interaction.reply({
            content: displayStr,
            ephemeral: true,
            components: [refetchButton],
        });
        // CURRENTLY DOES NOT REMOVE MESSAGE
        // Wait to see if user wants to refetch wishlist data.
        const collectorFilter = (i: Interaction) =>
            i.user.id === interaction.user.id;
        try {
            await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });
            // Once user clicks button, remove this interaction message.
            interaction.deleteReply();
        } catch (err) {
            console.log('Option to refetch wishlist data timed out');
            return;
        }
    }
}
