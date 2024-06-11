import {
    Interaction,
    SlashCommandBuilder,
    ButtonInteraction,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('onelsewl')
    .setDescription('Utility file for wishlist button');

/**
 * Interaction to view 'Someone else's wishlist'. The user gets prompted to input the identifier for the account's wishlist they wish to see.
 * A fetch is sent out, if successful the wishlist gets discplayed to the user, else a fail message is shown.
 * @param interaction on pressing 'elsewl' button
 */
export async function execute(interaction: ButtonInteraction) {
    console.log('Button pressed: elsewl');

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
            'Please write the Steam64ID or custom name (from the custom Steam URL if there is one)',
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

            // start sequence and DON'T save user WL
            // TODO
            await modalInteraction.editReply({ content: 'data gotten' });
        })
        .catch((err) => {
            console.log(err);
        });
}
