import { SteamWLRecGameID, SteamWLRecGameData } from './getWishlistData';

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

export type WishlistArr = Array<WLGameRec>;

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
 * @param target the target WhitelistArr element.
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
