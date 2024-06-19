import { DBMaybeWishlist, wishlistDBType } from './dbTypes';
import { WishlistModel } from './model/Wishlist';
import { BoolTuple, isValidString } from '../wishlists/mainWishlist';

export async function dbUpdateWishlist(wl: wishlistDBType): Promise<BoolTuple> {
    const queryFn =
        (await WishlistModel.exists({
            discordIdentifier: wl.discordIdentifier,
        })) !== null
            ? WishlistModel.updateOne.bind(WishlistModel)
            : WishlistModel.create.bind(WishlistModel);

    try {
        await queryFn(wl);
        return [true, 'DB save successful'];
    } catch (err) {
        console.log('DB save failed ', err);
        return [false, 'DB save failed'];
    }
}

/**
 * Tries to fetch wishlist data from database.
 * @param userIdentifier is the discordID or steam64/custom name identifier
 *  for a user.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a Wishlist,
 *  or a string explaining what caused the fetch to fail.
 */
export async function dbGetWishlist(
    userIdentifier: string
): Promise<DBMaybeWishlist> {
    /* Extra save check incase discord handles user inputs as anything other 
    than a string. */
    const inputString = userIdentifier.toString();
    if (!isValidString(inputString))
        return [false, "The input you've written is invalid."];

    const response = await WishlistModel.findOne({
        discordIdentifier: inputString,
    });
    const data = JSON.parse(JSON.stringify(response));

    try {
        if (data === null || data === undefined)
            return [false, 'User does not exists in DB'];
        else return [true, data];
    } catch (err) {
        console.log(
            'A DB fetch attempt failed from user input: ' + inputString
        );
        return [false, 'Failed to get wishlist data from DB'];
    }
}
