import { Wishlist } from '../wishlists/constructWishlist';

export type wishlistDBType = {
    discordIdentifier: string;
    givenIdentifier: string;
    unixFetchedAt: number;
    wishlistData: Wishlist;
};

export type DBMaybeWishlist = [true, wishlistDBType] | [false, string];
