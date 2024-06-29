// File handling fetching a user's Steam wishlist.

// ONLY SUPPORTS steam64 from universe1 (public) as well as unique name IDs.
// For further reading regarding SteamIDs:
// https://developer.valvesoftware.com/wiki/SteamID

import { MaybeRawWLTuple } from '../projectTypes';

/**
 * Takes a valid wishlist API url and gets wishlist data from Steam.
 * @example const wishlist = fetchWishlistFromSteam(
 *  'https://store.steampowered.com/wishlist/id/SomeCustomName/wishlistdata/');
 *  returns a MaybeRawWLTuple.
 * @param url is the correct link to get a user's Steam wishlist.
 * @precondition The url must be a valid fetch link, the account needn't exist.
 * @returns A MaybeRawWLTuple, with [1] containing either
 *  a RawWishlist, or a string explaining what caused the fetch to fail.
 */
export async function fetchWishlistFromSteam(
    url: string
): Promise<MaybeRawWLTuple> {
    const failString =
        'Steam failed to return wishlist data.\n' +
        '**You may have inputted an invalid account identifier**\n' +
        'or the Steam fetch limit has been surpassed.';
    let rawWishlistTuple: MaybeRawWLTuple | undefined;

    /* There is no success: true/false property as there is in 
    specific game data response. It seems that the fetch limit is a 
    lot higher than for specific game data as well. */
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            rawWishlistTuple = [true, data];
        } else throw new Error();
    } catch (err) {
        console.log('Steam fetch response is invalid');
        return [false, failString];
    }

    // Extra check to determine if wishlist data was returned.
    try {
        /* Fetch suceeded, but invalid data structure
        This can occur for example if the wishlist is empty
        or the user does not exist*/
        const testData = rawWishlistTuple[1];
        const testGame = testData[Object.keys(testData)[0]];
        if (typeof testGame.name !== 'string') throw new Error();
    } catch (err) {
        console.log(
            'Steam fetch response is invalid, ' +
                'OR the user has no games in their wishlist'
        );
        return [false, failString];
    }

    return rawWishlistTuple;
}

/**
 * Constructs the correct Steam url based on inputted steam64
 *  or custom name id.
 * @example const a = steamIdentifierToURL('76561111111111111', true);
 *  returns 'https://store.steampowered.com/wishlist/profiles/76561111111111111/wishlistdata/'
 * @example const b = steamIdentifierToURL('St4ck', false);
 *  returns 'https://store.steampowered.com/wishlist/id/St4ck/wishlistdata/'
 * @param steam64OrUniqueName Either a steam64 in string form, or a
 *  unique identifier sometimes used by distinguished accounts such as 'St4ck'.
 * @param isSteam64 true if steam64OrUniqueName is a Steam64,
 *  false if it is a custom URL name.
 * @precondition steam64OrUniqueName must be a valid steam64 or
 *  custom URL name format.
 * @returns a URL string for fetching wishlist data from Steam.
 */
export function steamIdentifierToURL(
    steam64OrUniqueName: string,
    isSteam64: boolean
): string {
    let prefix: string;
    isSteam64
        ? // Fetch only works if steam64 is combined with this prefix.
          (prefix = 'https://store.steampowered.com/wishlist/profiles/')
        : // Fetch only works if custom name such as 'St4ck' is combined
          // with this prefix.
          (prefix = 'https://store.steampowered.com/wishlist/id/');

    return `${prefix}${steam64OrUniqueName}/wishlistdata/`;
}

/**
 * Checks if a string has the correct form for a steam64 ID.
 * It does NOT look up if an account with the ID exists.
 * @example isValidSteam64('11112222333344445'); returns true.
 * @param inputString from user.
 * @returns true if valid, false if invalid.
 */
export function isValidSteam64(inputString: string): boolean {
    return !/^\d*$/.test(inputString)
        ? false
        : inputString.length !== 17
          ? false
          : true;
}

/**
 * Checks if a string has the correct form for a Steam custom URL name.
 * It does NOT look up of an account with the name exists.
 * @example isValidSteamUniqueID('St4ck'); returns true.
 * @param inputString from user.
 * @returns true if valid, false if invalid.
 */
export function isValidSteamCustomID(inputString: string): boolean {
    return !/^[A-Za-z0-9_.~-]*$/.test(inputString)
        ? false
        : inputString.length < 3
          ? false
          : inputString.length > 32
            ? false
            : true;
}

/**
 * Called when a new/updated RawWishlist is to be fetched.
 * @param userInput is the steam64/name from custom URL string,
 *  which may not be validated, but must be a string.
 * @returns a MaybeRawWLTuple, with [1] containing either a RawWishlist,
 *  or a string explaining what caused fetch to fail.
 */
export async function newRawWishlist(
    userInput: string
): Promise<MaybeRawWLTuple> {
    let validURL: string;
    if (isValidSteam64(userInput))
        validURL = steamIdentifierToURL(userInput, true);
    else if (isValidSteamCustomID(userInput))
        validURL = steamIdentifierToURL(userInput, false);
    else
        return [
            false,
            "The steam64 or custom name you've inputted is not valid.",
        ];

    return fetchWishlistFromSteam(validURL);
}
