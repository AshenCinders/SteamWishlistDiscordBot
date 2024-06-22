import { ButtonInteraction } from 'discord.js';
import { dbGetWishlist, dbUpdateWishlist } from '../../database/mainDB';
import { wishlistDBType } from '../../database/dbTypes';
import {
    wlToMarkdownCustom,
    getNewWishlistData,
} from '../../wishlists/mainWishlist';
import { unixNow } from '../../lib/miscHelpers';

export async function execute(interaction: ButtonInteraction) {
    interaction.deferReply({ ephemeral: true });
    const fetchTuple = await dbGetWishlist(interaction.user.id);
    if (fetchTuple[0] === false) {
        await interaction.reply({
            content:
                'Something went wrong, retry the wishlist command in a bit.',
        });
        return;
    }
    const givenID = fetchTuple[1].givenIdentifier;
    const wlTuple = await getNewWishlistData(givenID);
    if (wlTuple[0] === false) {
        await interaction.reply({
            content: 'Unable to get data from Steam, try again later.',
        });
        return;
    }

    const displayStr = wlToMarkdownCustom(wlTuple[1], {});
    console.log(`Displayed a wishlist to user ${interaction.user.displayName}`);
    interaction.editReply({
        content: displayStr,
    });

    // Store to DB
    const dbWishlistData: wishlistDBType = {
        givenIdentifier: givenID,
        discordIdentifier: interaction.user.id,
        unixFetchedAt: unixNow(),
        wishlistData: wlTuple[1],
    };
    dbUpdateWishlist(dbWishlistData);
}
