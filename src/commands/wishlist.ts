import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    Interaction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('wishlist')
    .setDescription('View and share your Steam wishlist through Discord');

/**
 * Start sequence for wishlist command.
 * Prompts user with buttons asking if they want to view their or someone else's wishlist. Upon clicking, a new interaction is fired, and this function terminates.
 * @param interaction slash command 'wishlist'.
 */
export async function execute(interaction: CommandInteraction) {
    const buttonMe = new ButtonBuilder()
        .setCustomId('myWL')
        .setLabel('Mine')
        .setStyle(ButtonStyle.Primary);
    const buttonElse = new ButtonBuilder()
        .setCustomId('elseWL')
        .setLabel("Someone else's")
        .setStyle(ButtonStyle.Primary);

    const response = await interaction.reply({
        content: 'Whose wishlist do you wish to see?',
        ephemeral: true,
        components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                buttonMe,
                buttonElse
            ),
        ],
        fetchReply: true,
    });

    // Handle interaction in another file through bot event handler.
    const collectorFilter = (i: Interaction) =>
        i.user.id === interaction.user.id;
    try {
        await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 60_000,
        });
        // Once user clicks button, remove this interaction message.
        await interaction.deleteReply();
    } catch (err) {
        console.log(
            `User ${interaction.user.displayName} failed to select a button choice in time`
        );
        await interaction.editReply({
            content: 'User failed to select an option, cancelling command.',
            components: [],
        });
    }
}
