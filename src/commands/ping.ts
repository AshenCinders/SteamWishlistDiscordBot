import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Test if the bot is responding');

export async function execute(interaction: CommandInteraction) {
    await interaction.reply({
        content: 'Hello ' + interaction.user.displayName,
        ephemeral: true,
    });
}
