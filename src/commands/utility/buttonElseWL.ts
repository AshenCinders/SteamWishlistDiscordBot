import { ButtonInteraction, ModalSubmitInteraction } from 'discord.js';
import { newWishlistModal } from './constructParts';
import {
    getNewWishlistData,
    wlToMarkdownCustom,
} from '../../wishlists/mainWishlist';

/**
 * Interaction to view 'Someone else's wishlist'. The user gets prompted to input the identifier for the account's wishlist they wish to see.
 * A fetch is sent out, if successful the wishlist gets discplayed to the user, else a fail message is shown.
 * @param interaction on pressing 'elsewl' button
 */
export async function onElseWLButton(interaction: ButtonInteraction) {
    const nameOfUser = interaction.user.displayName;
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

        const textInput = modalInteraction.fields.getTextInputValue('idText');
        console.log(
            `User ${nameOfUser} inputted steam identifier: ${textInput}`
        );

        const wlTuple = await getNewWishlistData(textInput);
        if (wlTuple[0] === false) {
            console.log(
                `Steam failed to find a wishlist from user ${nameOfUser}'s ID input`
            );
            await modalInteraction.editReply({
                // Display reason why the fetch failed.
                content: wlTuple[1],
            });
        } else {
            const displayStr = wlToMarkdownCustom(wlTuple[1]);
            console.log(`Displayed a wishlist to user ${nameOfUser}`);
            await modalInteraction.editReply({
                content: displayStr,
            });
        }
    } catch (err) {
        console.log(err);
    }
}
