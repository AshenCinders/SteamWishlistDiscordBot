import { ButtonInteraction, ModalSubmitInteraction } from 'discord.js';
import { newWishlistModal } from './constructParts';
import {
    fetchNewWishlist,
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
        console.log("Wishlist modal timed out (someone else's wishlist)");
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
        const displayStr = wlToMarkdownCustom(wlTuple[1]);
        console.log(`Displayed a wishlist to user ${nameOfUser}`);
        await modalSubmit.editReply({
            content: displayStr,
        });
    }
}
