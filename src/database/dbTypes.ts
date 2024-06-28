import { Wishlist } from '../projectTypes';

export type wishlistDBType = {
    discordIdentifier: string;
    givenIdentifier: string;
    unixFetchedAt: number;
    wishlistData: Wishlist;
};

export type DBMaybeWishlist = [true, wishlistDBType] | [false, string];
