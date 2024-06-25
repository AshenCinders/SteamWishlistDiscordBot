import { Wishlist, MaybeWishlist, StringifyWLChoices } from './typesWishlist';
import { constructWishlist } from './constructWishlist';
import { newWishlistRecord } from './getWishlistData';
import {
    bold,
    italic,
    wrapColors,
    blue,
    cyan,
    green,
    gray,
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
        // If failed, return tuple with fail string.
        if (fetchTuple[0] === false) return fetchTuple;

        const createdWL: Wishlist = constructWishlist(fetchTuple[1]);
        return [true, createdWL];
    });
    return result as MaybeWishlist;
}

/**
 * Constructs a string with markdown syntax for displaying a wishlist.
 * @param wl a wishlist of type Wishlist.
 * @param choiceRec a record of type StringifyWLChoices.
 *  Any property that is omitted will by default be ignored.
 * @returns a string with markdown syntax which will be under 2000 characters.
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
        wl.length >= 99
            ? 'This wishlist contains more than 99 games!\n'
            : 'This wishlist contains ' + wl.length.toString() + ' games!\n';
    fullString +=
        italic('Here are as many as we can display in a message!') + '\n';

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
                green('Release Date: ' + game.releaseDateFormatted) + '\n';
        }
        if (choiceRec.showAddedToWLFormatted === true) {
            otherInfo +=
                gray(
                    'Date when added to wishlist: ' + game.addedToWLFormatted
                ) + '\n';
        }

        if (otherInfo !== '') {
            // Remove last newline char.
            otherInfo = delLastNewline(otherInfo);
            otherInfo = wrapColors(otherInfo);

            // Needed for Discord message limit.
            if (fullString.length + otherInfo.length >= 2000) break;

            fullString += otherInfo;
        }
    }

    return fullString;
}
