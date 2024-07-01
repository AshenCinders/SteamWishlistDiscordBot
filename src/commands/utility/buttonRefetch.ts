import { ButtonInteraction } from 'discord.js';
import { dbGetWishlist, dbUpdateWishlist } from '../../database/mainDB';
import { DBWishlistChunk } from '../../projectTypes';
import {
    wlToMarkdownCustom,
    fetchNewWishlist,
} from '../../wishlists/mainWishlist';
import { unixNow } from '../../lib/miscHelpers';

export async function onRefetchButton(interaction: ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const fetchTuple = await dbGetWishlist(interaction.user.id);
    if (fetchTuple[0] === false) {
        await interaction.reply({
            content:
                'Something went wrong, retry the wishlist command in a bit.',
        });
        return;
    }

    const givenID = fetchTuple[1].givenIdentifier;
    const wishlistTuple = await fetchNewWishlist(givenID);
    if (wishlistTuple[0] === false) {
        await interaction.reply({
            content: 'Unable to get data from Steam, try again later.',
        });
        return;
    }

    console.log(`Displayed a wishlist to user ${interaction.user.displayName}`);
    interaction.editReply({
        content: wlToMarkdownCustom(wishlistTuple[1]),
    });

    // Store to DB
    const dbWishlistData: DBWishlistChunk = {
        givenIdentifier: givenID,
        discordIdentifier: interaction.user.id,
        unixFetchedAt: unixNow(),
        wishlistData: wishlistTuple[1],
    };
    dbUpdateWishlist(dbWishlistData);
}
