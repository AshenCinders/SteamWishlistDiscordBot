// File handling fetching a user's Steam whitelist.

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
type SteamWhitelistRecord = Record<SteamRecGameID, SteamRecGameData>;

/**
 * Takes a valid withlist API url and gets
 * @param url is the correct link to get a user's Steam whitelist.
 * @invariant The url must be valid.
 * @returns A Record containing game-ids with game-data records,
 *  or false if failed to fetch.
 */
async function fetchFromSteam(
    url: string
): Promise<SteamWhitelistRecord | boolean> {
    const whitelistAsRecord: SteamWhitelistRecord | false = await fetch(url)
        .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Failed to fetch from Steam');
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
    //console.log(whitelistAsRecord);
    return whitelistAsRecord;
}

//fetchFromSteam('https://store.steampowered.com/wishlist/id/Nivq/wishlistdata/');

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
