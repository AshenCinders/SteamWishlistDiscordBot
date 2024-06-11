import {
    Interaction,
    SlashCommandBuilder,
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalSubmitInteraction,
} from 'discord.js';
import { fetchWLFromDB } from '../../wishlists/mainWishlist';

export const data = new SlashCommandBuilder()
    .setName('onmywl')
    .setDescription('Utility file for wishlist button');

/**
 * Interaction to view 'My wishlist'. If the user is not in DB, then they are prompted to write their identifier into a modal.
 * If the user is in DB or the fetch from identifier is successful, then the wishlist gets displayed to the user.
 * @param interaction on pressing 'mywl' button
 */
export async function execute(interaction: ButtonInteraction) {
    console.log('Button pressed: mywl');
    const fetchTuple = fetchWLFromDB(interaction.user.id);

    // DB fetch attempt failed.
    if (fetchTuple[0] === false) {
        // Prompt user for id
        console.log('User was not found in DB');
        console.log(fetchTuple[1]);

        const identifierModal = new ModalBuilder({
            customId: 'idModal',
            title: 'WishlistBot',
        });
        const indentifierInput = new TextInputBuilder({
            customId: 'idText',
            label: 'Steam64/custom name',
            style: TextInputStyle.Paragraph,
            maxLength: 100,
            placeholder:
                'Please write your Steam64ID or custom name (from your custom Steam URL if you have one)',
            required: true,
        });
        const textActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                indentifierInput
            );
        identifierModal.addComponents(textActionRow);

        await interaction.showModal(identifierModal);

        const filter = (interaction: ModalSubmitInteraction) =>
            interaction.customId === 'idModal';

        await interaction
            .awaitModalSubmit({ filter, time: 300_000 })
            // ASYNC IMPORTANT!
            .then(async (modalInteraction) => {
                const textInput =
                    modalInteraction.fields.getTextInputValue('idText');
                console.log(textInput);

                await modalInteraction.deferReply({
                    ephemeral: true,
                });

                // start sequence and save to DB
                // TODO
                await modalInteraction.editReply({ content: 'data gotten' });
            })
            .catch((err) => {
                console.log(err);
            });
        // DB fetch attempt succeeded
    } else console.log('in db');
    /* fetchTuple[1] is data
        load and show how long since fetch.
        Let user click button to refresh it, be unclickable 
        if within ~10min since. */
}
