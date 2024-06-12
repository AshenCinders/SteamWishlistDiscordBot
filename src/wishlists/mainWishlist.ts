import { Wishlist, constructWishlist } from './constructWishlist';
import { newWishlistRecord } from './getWishlistData';

export type BoolTuple = [true, string] | [false, string];
export type MaybeWishlist = [true, Wishlist] | [false, string];

export type StringifyWLChoices = {
    showTags?: boolean;
    showReviewGrade?: boolean;
    showReleaseDateFormatted?: boolean;
    showAddedToWLFormatted?: boolean;
};

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
 * If a newline character exists at the end of input string str,
 *  it will then get removed.
 * Function does not require input str to have a newline at the end.
 * @param str is any string.
 * @returns str without a newline character at the end.
 */
export function delLastNewline(str: string): string {
    if (/\n$/.test(str)) return str.slice(0, -2);
    else return str;
}

/**
 * Converts an array of strings to a single string.
 * @param inputArr an array with all elements as strings.
 * @returns a string with all elements in a single string separated by commas.
 */
export function stringArrayToString(inputArr: Array<string>): string {
    let listStr = '';
    for (let i = 0; i < inputArr.length; i++) {
        listStr += inputArr[i].toString() + ', ';
    }
    // Remove last comma.
    listStr = listStr.slice(0, -1);

    return listStr;
}

/**
 * Tries to fetch wishlist data from database.
 * @param userIdentifier is the discordID or steam64/custom name identifier
 *  for a user.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a DATAREPRESENTATION,
 *  or a string explaining what caused the fetch to fail.
 */
export function fetchWLFromDB(userIdentifier: string): BoolTuple {
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
