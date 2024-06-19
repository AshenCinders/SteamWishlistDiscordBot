import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { dbDeleteWishlist } from '../database/mainDB';

export const data = new SlashCommandBuilder()
    .setName('clearmydata')
    .setDescription(
        'Clear any wishlist data tied to your discordID that is stored by the bot'
    );

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({
        ephemeral: true,
    });
    const nameOfUser = interaction.user.displayName;

    const deleteTuple = await dbDeleteWishlist(interaction.user.id);
    if (deleteTuple[0] === true) {
        console.log(`User ${nameOfUser} sucessfully deleted wishlist data`);
        interaction.editReply({
            content:
                'Your data stored by the bot has been successfully deleted',
        });
    } else {
        console.log(
            `User ${nameOfUser} tried to delete wishlist data, but no data was found`
        );
        interaction.editReply({
            content: 'No data was found for your account',
        });
    }
}
