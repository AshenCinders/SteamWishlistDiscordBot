// File handling fetching a user's Steam wishlist.

// ONLY SUPPORTS steam64 from universe1 (public) as well as unique name IDs.
// For further reading regarding SteamIDs:
// https://developer.valvesoftware.com/wiki/SteamID

// Types for data fetched from Steam.
type SteamRecGameID = string; // Steam game ID which is a number in string form.
// Fields are predefined by Steam.
type SteamRecGameData = {
    name: string; // Game title.
    priority: number; // User/default priority list ordering.
};
// Each entry represents a game.
type SteamWishlistRecord = Record<SteamRecGameID, SteamRecGameData>;

/**
 * Takes a valid withlist API url and gets wishlist data from Steam.
 * @example const wishlist = fetchFromSteam('https://store.steampowered.com/wishlist/id/Nivq/wishlistdata/');
 *  returns a SteamWishlistRecord.
 * @param url is the correct link to get a user's Steam wishlist.
 * @returns A Record containing game-ids with game-data records,
 *  or false if failed to fetch.
 */
async function fetchFromSteam(
    url: string
): Promise<SteamWishlistRecord | boolean> {
    const wishlistAsRecord = await fetch(url)
        .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Failed to fetch from Steam');
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    //console.log(wishlistAsRecord);
    return wishlistAsRecord as Promise<SteamWishlistRecord | boolean>;
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
 * @precondition steam64OrUniqueName must be a valid steam64 or ID.
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
