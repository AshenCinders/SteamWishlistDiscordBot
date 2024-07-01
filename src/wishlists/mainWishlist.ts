import {
    Wishlist,
    MaybeWishlistTuple,
    StringifyWLChoices,
} from '../projectTypes';
import { constructWishlist } from './constructWishlist';
import { newRawWishlist } from './getWishlistData';
import {
    bold,
    italic,
    wrapColors,
    blue,
    cyan,
    green,
    pink,
} from '../lib/mdWrappers';
import {
    unixNow,
    isValidString,
    delLastNewline,
    stringArrayToString,
} from '../lib/miscHelpers';

/**
 * Check if enough time has passed since last fetch request.
 * @param unixLastFetch is when user made last fetch.
 * @returns true if more than 10min has passed.
 */
export function isEligibleToRefetch(unixLastFetch: number): boolean {
    return unixNow() - unixLastFetch > 600;
}

/**
 * Generates new user wishlist data from Steam.
 * @param userIdentifier is the discordID or steam64/custom name identifier
 *  for a user.
 * @returns A MaybeWishlistTuple denoting outcome, with [1] containing either
 *  a Wishlist, or a string explaining what caused the fetch to fail.
 */
export async function fetchNewWishlist(
    userIdentifier: string
): Promise<MaybeWishlistTuple> {
    if (!isValidString(userIdentifier))
        return [false, "The input you've written is invalid."];

    const fetchTuple = await newRawWishlist(userIdentifier);
    // If failed, return tuple with fail string.
    if (fetchTuple[0] === false) return fetchTuple;

    const createdWishlist = constructWishlist(fetchTuple[1]);
    return [true, createdWishlist];
}

/**
 * Constructs a string with markdown syntax for displaying a Wishlist.
 * @param wishlist of type Wishlist.
 * @param choiceRec an optional record of type StringifyWLChoices.
 *  Any property that is omitted will by default be set to false.
 * @returns a string in markdown syntax under 2000 characters.
 */
export function wlToMarkdownCustom(
    wishlist: Wishlist,
    choiceRec?: StringifyWLChoices
): string {
    choiceRec ??= {};
    // Assigning default hide values if caller omitted any.
    choiceRec.showTags ??= false;
    choiceRec.showReviewGrade ??= false;
    choiceRec.showReleaseDateFormatted ??= false;
    choiceRec.showAddedToWLFormatted ??= false;

    let result =
        wishlist.length >= 99
            ? `This wishlist contains more than 99 games!\n`
            : `This wishlist contains ${wishlist.length.toString()} games!\n`;
    result += italic('Here are as many as we can display in a message!') + '\n';

    // Each loop appends one game.
    for (let i = 0; i < wishlist.length; i++) {
        const game = wishlist[i];

        let otherInfo = '';
        if (choiceRec.showTags === true) {
            const tagStr = stringArrayToString(game.tags);
            otherInfo += cyan(`Tags: ${tagStr}`) + '\n';
        }
        if (choiceRec.showReviewGrade === true) {
            otherInfo += blue(`Review Score: ${game.reviewGrade}`) + '\n';
        }
        if (choiceRec.showReleaseDateFormatted === true) {
            otherInfo +=
                green(`Release Date: ${game.releaseDateFormatted}`) + '\n';
        }
        if (choiceRec.showAddedToWLFormatted === true) {
            otherInfo +=
                pink(`Date added to wishlist: ${game.addedToWLFormatted}`) +
                '\n';
        }

        /* Check if 2000 character limit has been surpassed.
        (Required for simple Discord messages.) */
        // +25 is needed to offset wrapColors
        if (result.length + game.name.length + otherInfo.length + 25 >= 2000)
            break;

        result += bold(game.name) + '\n';
        if (otherInfo !== '') {
            // Remove last newline char.
            otherInfo = delLastNewline(otherInfo);
            otherInfo = wrapColors(otherInfo);
            result += otherInfo;
        }
    }

    return result;
}

/**
 * Shortcut alias to wlToMarkdownCustom with all choices as true.
 * Constructs a string with markdown syntax for displaying a Wishlist
 *  with all allowed details being included.
 * @param wishlist of type Wishlist.
 * @returns a string in markdown syntax under 2000 characters.
 */
export function wlToMarkdownFull(wishlist: Wishlist): string {
    const fullChoices = {
        showTags: true,
        showReviewGrade: true,
        showReleaseDateFormatted: true,
        showAddedToWLFormatted: true,
    };
    return wlToMarkdownCustom(wishlist, fullChoices);
}
