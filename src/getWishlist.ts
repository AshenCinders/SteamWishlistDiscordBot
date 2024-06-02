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
