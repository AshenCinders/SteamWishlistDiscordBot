import {
    Interaction,
    ButtonInteraction,
    ModalSubmitInteraction,
} from 'discord.js';
import { newMoreDetailsRow, newWishlistModal } from './constructParts';
import {
    fetchNewWishlist,
    wlToMarkdownCustom,
    wlToMarkdownFull,
} from '../../wishlists/mainWishlist';

/**
 * Interaction to view 'Someone else's wishlist'.
 * The user gets prompted to input the identifier for the
 *  account's wishlist they want to see.
 * A fetch is sent out, if successful the wishlist gets discplayed to the user,
 *  else a fail message is shown.
 * On success the user can also view more details for that wishlist.
 * @param interaction on pressing 'elsewl' button
 */
export async function onElseWLButton(interaction: ButtonInteraction) {
    const nameOfUser = interaction.user.displayName;

    const wlModal = newWishlistModal();
    let modalSubmit: ModalSubmitInteraction;
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
        return;
    } else {
        modalSubmit.deleteReply();
        console.log(`Displayed a wishlist to user ${nameOfUser}`);
        const response = await interaction.followUp({
            content: wlToMarkdownCustom(wlTuple[1]),
            components: [newMoreDetailsRow()],
            fetchReply: true,
            ephemeral: true,
        });

        // Wait to see if user wants to display details.
        const collectorFilter = (newInteraction: Interaction) =>
            newInteraction.user.id === interaction.user.id;
        try {
            const btnInteraction = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

            if (btnInteraction.customId === 'morewishlist') {
                btnInteraction.reply({
                    ephemeral: true,
                    content: wlToMarkdownFull(wlTuple[1]),
                });
            }
        } catch (err) {
            console.log('Option display more details timed out');
            return;
        }
    }
}
