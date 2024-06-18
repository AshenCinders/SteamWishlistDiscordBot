import { Wishlist, constructWishlist } from './constructWishlist';
import { SteamWLRecord, newWishlistRecord } from './getWishlistData';
import {
    bold,
    italic,
    wrapColors,
    blue,
    cyan,
    green,
    gray,
} from '../mdWrappers';

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
export function isValidString(str: any): str is string {
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
 * Generates new user wishlist data from Steam.
 * @param userIdentifier is the discordID or steam64/custom name identifier
 *  for a user.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a Wishlist,
 *  or a string explaining what caused the fetch to fail.
 */
export async function getNewWishlistData(
    userIdentifier: string
): Promise<MaybeWishlist> {
    const inputString = userIdentifier.toString();
    if (!isValidString(inputString))
        return [false, "The input you've written is invalid."];

    const result = await newWishlistRecord(inputString).then((fetchTuple) => {
        // If failed, return tuple with fail string.S
        if (fetchTuple[0] === false) return fetchTuple;

        const createdWL: Wishlist = constructWishlist(fetchTuple[1]);
        return [true, createdWL];
    });
    return result as MaybeWishlist;
}

/**
 * Constructs a string with markdown syntax for displaying a whole wishlist.
 * @param wl a wishlist of type Wishlist.
 * @param choiceRec a record of type StringifyWLChoices.
 *  Any property that is  omitted will by default be ignored.
 * @returns a string with markdown syntax.
 */
export function wlToMarkdownCustom(
    wl: Wishlist,
    choiceRec: StringifyWLChoices
): string {
    // Assigning default hide values if caller omitted any.
    choiceRec.showTags ??= false;
    choiceRec.showReviewGrade ??= false;
    choiceRec.showReleaseDateFormatted ??= false;
    choiceRec.showAddedToWLFormatted ??= false;

    let fullString =
        italic('This wishlist contains ' + wl.length.toString() + ' games!') +
        '\n';

    // Each loop appends one game.
    for (let i = 0; i < wl.length; i++) {
        const game = wl[i];
        fullString += bold(game.name) + '\n';

        let otherInfo = '';
        if (choiceRec.showTags === true) {
            const tagStr = stringArrayToString(game.tags);
            otherInfo += cyan('Tags: ' + tagStr) + '\n';
        }
        if (choiceRec.showReviewGrade === true) {
            otherInfo += blue('Review Score: ' + game.reviewGrade) + '\n';
        }
        if (choiceRec.showReleaseDateFormatted === true) {
            otherInfo +=
                green('Game Released: ' + game.releaseDateFormatted) + '\n';
        }
        if (choiceRec.showAddedToWLFormatted === true) {
            otherInfo +=
                gray(
                    'Date player added to wishlist: ' + game.addedToWLFormatted
                ) + '\n';
        }

        if (otherInfo !== '') {
            // Remove last newline char.
            otherInfo = delLastNewline(otherInfo);
            otherInfo = wrapColors(otherInfo);
            fullString += otherInfo;
        }
    }

    return fullString;
}
