// File handling fetching a user's Steam wishlist.

// ONLY SUPPORTS steam64 from universe1 (public) as well as unique name IDs.
// For further reading regarding SteamIDs:
// https://developer.valvesoftware.com/wiki/SteamID

// Types for data fetched from Steam.
export type SteamWLRecGameID = string; // Steam game ID which is a number in string form.
// Fields are predefined by Steam.
export type SteamWLRecGameData = {
    name: string; // Game title.
    priority: number; // User/default priority list ordering.
    review_desc: string; // E.g. 'Mostly Positive'
    release_date: string; // Unix time in string form
    release_string: string; // E.g. '4 Aug, 2022'
    added: number; // Unix time of when user added to WL
    tags: Array<string>; // E.g. [ 'Co-op', 'Management', 'Cooking', 'Roguelite', 'Building' ]
};
// Each entry represents a game.
export type SteamWLRecord = Record<SteamWLRecGameID, SteamWLRecGameData>;
export type RawMaybeWishlist = [true, SteamWLRecord] | [false, string];

/**
 * Takes a valid withlist API url and gets wishlist data from Steam.
 * @example const wishlist = fetchFromSteam('https://store.steampowered.com/wishlist/id/Nivq/wishlistdata/');
 *  returns a SteamWLRecord.
 * @param url is the correct link to get a user's Steam wishlist.
 * @precondition The url must be a valid fetch link, the account needn't exist.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a Record containing game-ids with game-data records,
 *  or a string explaining what caused the failure.
 */
async function fetchFromSteam(url: string): Promise<RawMaybeWishlist> {
    const wishlistRecordTuple = await fetch(url)
        .then((res) => {
            /* There is no success: true/false property as there is in 
            specific game data response. It seems that the fetch limit is a 
            lot higher than for specific game data. */
            if (res.ok) {
                const data = res.json();
                return [true, data];
            } else throw new Error('Failed to fetch from Steam website');
        })
        .catch((err) => {
            return [false, err];
        });

    try {
        const testData = wishlistRecordTuple[1] as SteamWLRecord;
        const testGame = testData[Object.keys(testData)[0]];
        const testName = testGame.name;
        if (typeof testName !== 'string')
            throw new Error(
                `Steam failed to return wishlist data. \
                    This may be because the fetch limit has \
                    been surpassed.`
            );
    } catch (err) {
        return [false, err as string];
    }

    //console.log(wishlistAsRecord);
    return wishlistRecordTuple as RawMaybeWishlist;
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
 * @param isSteam64 True if steam64OrUniqueName, false if unique name id.
 * @precondition steam64OrUniqueName must be a valid steam64 or ID format.
 * @returns a steam url string for fetching wishlist data.
 */
function steamIdentifierToURL(
    steam64OrUniqueName: string,
    isSteam64: boolean
): string {
    let prefix: string;
    isSteam64
        ? // Fetch only works if steam64 is combined with this prefix.
          (prefix = 'https://store.steampowered.com/wishlist/profiles/')
        : // Fetch only works if cusom name such as 'St4ck' is combined with this prefix.
          (prefix = 'https://store.steampowered.com/wishlist/id/');

    return prefix + steam64OrUniqueName + '/wishlistdata/';
}

/**
 * Checks if a string has the correct form for a steam64 ID.
 * It does NOT look up if an account with the ID exists.
 * @example isValidSteam64('11112222333344445'); returns true.
 * @param inputString from user.
 * @returns true if valid, false if invalid.
 */
function isValidSteam64(inputString: string): boolean {
    return !/^\d*$/.test(inputString)
        ? false
        : inputString.length !== 17
          ? false
          : true;
}

/**Checks if a string has the correct form for a Steam custom URL name.
 * It does NOT look up of an account with the name exists.
 * @example isValidSteamUniqueID('St4ck'); returns true.
 * @param inputString from user.
 * @returns true if valid, false if invalid.
 */
function isValidSteamUniqueID(inputString: string): boolean {
    return !/^[A-Za-z0-9_.~-]*$/.test(inputString)
        ? false
        : inputString.length < 3
          ? false
          : inputString.length > 32
            ? false
            : true;
}

/**
 * Called when a new/updated Steam Wishlist is to be fetched.
 * @param userInput is the steam64/nameID string which may not be validated,
 *  but must be a string.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a SteamWLRecord, or a string explaining what caused the failure.
 */
export function newWishlistRecord(userInput: string): RawMaybeWishlist {
    let validURL: string;
    if (isValidSteam64(userInput))
        validURL = steamIdentifierToURL(userInput, true);
    else if (isValidSteamUniqueID(userInput))
        validURL = steamIdentifierToURL(userInput, false);
    else
        return [
            false,
            "The steam64 or custom name you've inputted is not valid.",
        ];

    /* Conversion of type 'Promise<RawMaybeWishlist>' to type 
    'RawMaybeWishlist' may be a mistake because neither type 
    sufficiently overlaps with the other. */
    const wishlistTuple = fetchFromSteam(validURL) as unknown as Awaited<
        Promise<RawMaybeWishlist>
    >;
    return wishlistTuple;
}
