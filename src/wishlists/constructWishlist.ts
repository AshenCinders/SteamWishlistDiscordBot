import {
    SteamWLRecGameID,
    SteamWLRecGameData,
    SteamWLRecord,
} from './getWishlistData';
import { sortWishlist } from '../lib/sortArray';

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
    addedToWLFormatted: string;
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
        addedToWLFormatted: '',
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

function setAddedToWLFormatted(
    source: SteamWLRecGameData,
    target: WLGameRec
): void {
    const fullDate = new Date(source.added * 1000);
    const year = fullDate.getFullYear().toString();
    let month = fullDate.getMonth().toString();
    let date = fullDate.getDate().toString();

    if (month.length === 1) month = '0' + month;
    if (date.length === 1) date = '0' + date;

    target.addedToWLFormatted = year + '-' + month + '-' + date;
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
    setAddedToWLFormatted(rawData, newElem);

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

    sortWishlist(wlArr);

    return wlArr;
}
