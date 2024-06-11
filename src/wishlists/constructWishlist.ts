import {
    SteamWLRecGameID,
    SteamWLRecGameData,
    SteamWLRecord,
} from './getWishlistData';

export type WLGameRec = {
    appid: number;
    priority: number;
    name: string;
    tags: Array<string>;
    reviewGrade: string;
    // Need to convert string to number (is unix time),
    // value comes as a string from fetch data.
    releaseDateUnix: number;
    releaseDateFormatted: string;
    addedToWLUnix: number;
};

export type Wishlist = Array<WLGameRec>;
/**
 * @returns a new WLGameRec record with all properties as empty.
 */
function newWLGameRecTemplate(): WLGameRec {
    return {
        appid: 0,
        priority: 0,
        name: '',
        tags: [],
        reviewGrade: '',
        releaseDateUnix: 0,
        releaseDateFormatted: '',
        addedToWLUnix: 0,
    };
}

// Setters for wishlist array elements

/**
 * Sets appid (number) based on the appid key string from Steam.
 * @param appid raw key string for a wishlist game object fetched from Steam.
 * @param target the target WishlistArr element.
 */
function setAppid(appid: string, target: WLGameRec): void {
    target.appid = Number(appid);
}

function setPriority(source: SteamWLRecGameData, target: WLGameRec): void {
    target.priority = source.priority;
}

function setName(source: SteamWLRecGameData, target: WLGameRec): void {
    target.name = source.name;
}

function setTags(source: SteamWLRecGameData, target: WLGameRec): void {
    target.tags = source.tags;
}

function setReviewGrade(source: SteamWLRecGameData, target: WLGameRec): void {
    target.reviewGrade = source.review_desc;
}

function setReleaseDateUnix(
    source: SteamWLRecGameData,
    target: WLGameRec
): void {
    target.releaseDateUnix = Number(source.release_date);
}

function setReleaseDateFormatted(
    source: SteamWLRecGameData,
    target: WLGameRec
): void {
    target.releaseDateFormatted = source.release_string;
}

function setAddedToWLUnix(source: SteamWLRecGameData, target: WLGameRec): void {
    target.addedToWLUnix = source.added;
}

/**
 * Construction function for a new element in a wishlist array.
 * @param rawData is raw wishlist game data fetched from steam WL.
 *  It is the data for a single game.
 * @returns An element for a wishlist array.
 */
function constructWLElem(
    appidString: SteamWLRecGameID,
    rawData: SteamWLRecGameData
): WLGameRec {
    const newElem = newWLGameRecTemplate();

    setAppid(appidString, newElem);
    setPriority(rawData, newElem);
    setName(rawData, newElem);
    setTags(rawData, newElem);
    setReviewGrade(rawData, newElem);
    setReleaseDateUnix(rawData, newElem);
    setReleaseDateFormatted(rawData, newElem);
    setAddedToWLUnix(rawData, newElem);

    return newElem;
}

/**
 * Creates a new Wishlist data structure.
 *  that is sorted based on user WL ranking priority.
 * @param wlFetchData is a JS object containing wishlist data from Steam.
 * @returns A wishlist structure of type Wishlist.
 */
export function constructWishlist(wlFetchData: SteamWLRecord): Wishlist {
    let wlArr: Wishlist = [];

    for (const gameKey in wlFetchData) {
        wlArr.push(constructWLElem(gameKey, wlFetchData[gameKey]));
    }

    // TODO sort based on prio

    return wlArr;
}
