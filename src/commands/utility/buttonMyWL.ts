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
        try {
            await interaction.showModal(wlModal);
            const filter = (interaction: ModalSubmitInteraction) =>
                interaction.customId === 'idModal';
            const modalInteraction = await interaction.awaitModalSubmit({
                filter,
                time: 600_000,
            });
            await modalInteraction.deferReply({
                ephemeral: true,
            });

            const textInput =
                modalInteraction.fields.getTextInputValue('idText');
            console.log(
                `User ${nameOfUser} inputted steam identifier: ${textInput}`
            );

            const wlTuple = await fetchNewWishlist(textInput);
            if (wlTuple[0] === false) {
                console.log(
                    `Steam failed to find a wishlist from user ${nameOfUser}'s ID input`
                );
                await modalInteraction.editReply({
                    // Display reason why the fetch failed.
                    content: wlTuple[1],
                });
            } else {
                const displayStr = wlToMarkdownCustom(wlTuple[1], autoChoices);
                console.log(`Displayed a wishlist to user ${nameOfUser}`);
                await modalInteraction.editReply({
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
        } catch (err) {
            console.log(err);
            return;
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
        }
    }
}
