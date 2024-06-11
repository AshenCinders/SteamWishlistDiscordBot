import { Wishlist, constructWishlist } from './constructWishlist';
import { newWishlistRecord } from './getWishlistData';

export type MaybeWishlist = [true, Wishlist] | [false, string];

/**
 * Rough check to avoid parsing long/empty strings.
 * @param str to be checked.
 * @returns true if 0 < length < 51, else false.
 */
function isValidString(str: any): str is string {
    return typeof str !== 'string'
        ? false
        : str.length > 50
          ? false
          : str.length < 1
            ? false
            : true;
}

/**
 * Generates new user wishlist data from Steam.
 * @param userIdentifier is the discordID or steam64/custom name identifier
 *  for a user.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a Wishlist,
 *  or a string explaining what caused the fetch to fail.
 */
export function getNewWishlistData(userIdentifier: string): MaybeWishlist {
    const inputString = userIdentifier.toString();
    if (!isValidString(inputString))
        return [false, "The input you've written is invalid."];

    const fetchTuple = newWishlistRecord(inputString);
    if (fetchTuple[0] === false) return fetchTuple;

    const createdWL: Wishlist = constructWishlist(fetchTuple[1]);
    return [true, createdWL];
}
