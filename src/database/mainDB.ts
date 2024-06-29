import {
    DBMaybeWishlistChunkTuple,
    DBWishlistChunk,
    OutcomeTuple,
} from '../projectTypes';
import { WishlistModel } from './model/Wishlist';
import { isValidString } from '../lib/miscHelpers';

/**
 * Updates a DBWishlistChunk entry in DB,
 *  or creates a new one if it does not already exist.
 * @param wishlistChunk a DBWishlistChunk.
 * @returns an OutcomeTuple with [0] a bool denoting success/fail,
 *  and [1] a information string.
 */
export async function dbUpdateWishlist(
    wishlistChunk: DBWishlistChunk
): Promise<OutcomeTuple> {
    const queryFn =
        (await WishlistModel.exists({
            discordIdentifier: wishlistChunk.discordIdentifier,
        })) !== null
            ? WishlistModel.updateOne.bind(WishlistModel)
            : WishlistModel.create.bind(WishlistModel);

    try {
        await queryFn(wishlistChunk);
        return [true, 'DB save successful'];
    } catch (err) {
        console.log('DB save failed ', err);
        return [false, 'DB save failed'];
    }
}

/**
 * Tries to fetch wishlist data from database.
 * @param discordID is the discordID for a user.
 * @returns a DBMaybeWishlistChunkTuple, with [1] containing either
 *  a DBWishlistChunk, or a string explaining what caused the fetch to fail.
 */
export async function dbGetWishlist(
    discordID: string
): Promise<DBMaybeWishlistChunkTuple> {
    if (!isValidString(discordID))
        return [false, "The input you've written is invalid."];

    try {
        const response = await WishlistModel.findOne({
            discordIdentifier: discordID,
        });
        const data = JSON.parse(JSON.stringify(response));

        if (data === null || data === undefined)
            return [
                false,
                'A wishlist data fetch was unable to find the user in DB',
            ];
        else return [true, data];
    } catch (err) {
        console.log('A DB fetch attempt failed from user input: ' + discordID);
        console.log(err);
        return [false, 'Failed to get wishlist data from DB'];
    }
}

/**
 * Tries to delete wishlist data from database.
 * @param discordID is the discordID for a user.
 * @returns an OutcomeTuple with [0] a bool denoting success/fail,
 *  and [1] an information string.
 */
export async function dbDeleteWishlist(
    discordID: string
): Promise<OutcomeTuple> {
    const inputString = discordID.toString();
    if (!isValidString(inputString))
        return [false, "The input you've written is invalid."];

    if (
        (await WishlistModel.exists({
            discordIdentifier: inputString,
        })) == null
    ) {
        return [false, 'The user was not found in DB'];
    }

    try {
        await WishlistModel.deleteOne({
            discordIdentifier: inputString,
        });
        return [true, 'Successfully deleted user wishlist data'];
    } catch (err) {
        console.log('A DB delete attempt failed: ', err);
        return [false, 'Failed to delete wishlist data in DB'];
    }
}
