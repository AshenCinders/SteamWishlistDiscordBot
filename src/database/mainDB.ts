import { BoolTuple, isValidString } from '../wishlists/mainWishlist';
/**
 * Tries to fetch wishlist data from database.
 * @param userIdentifier is the discordID or steam64/custom name identifier
 *  for a user.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a DATAREPRESENTATION,
 *  or a string explaining what caused the fetch to fail.
 */
export function dbGetWishlist(userIdentifier: string): BoolTuple {
    /* Extra save check incase discord handles user inputs as anything other 
    than a string. */
    const inputString = userIdentifier.toString();
    if (!isValidString(inputString))
        return [false, "The input you've written is invalid."];

    // try fetching
    const fetchAttempt = 'temp';
    // conds

    return [true, fetchAttempt];
}
