import {
    RawWishlistGameID,
    RawWishlistGame,
    RawWishlist,
    WishlistGame,
    Wishlist,
} from '../projectTypes';
import { sortWishlist } from '../lib/sortArray';

/**
 * @returns a new WishlistGame with all properties as empty.
 */
export function wishlistGameTemplate(): WishlistGame {
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

// Setters for WishlistGame properties.

/**
 * Sets appid (number) based on the appid key string from Steam.
 * @param appid raw key string for WishlistGame record fetched from Steam.
 * @param target the WishlistGame.
 */
function setAppid(appid: string, target: WishlistGame): void {
    target.appid = Number(appid);
}

function setPriority(source: RawWishlistGame, target: WishlistGame): void {
    target.priority = source.priority;
}

function setName(source: RawWishlistGame, target: WishlistGame): void {
    target.name = source.name;
}

function setTags(source: RawWishlistGame, target: WishlistGame): void {
    target.tags = source.tags;
}

function setReviewGrade(source: RawWishlistGame, target: WishlistGame): void {
    target.reviewGrade = source.review_desc;
}

export function setReleaseDateUnix(
    source: RawWishlistGame,
    target: WishlistGame
): void {
    target.releaseDateUnix = Number(source.release_date.toString());
}

function setReleaseDateFormatted(
    source: RawWishlistGame,
    target: WishlistGame
): void {
    target.releaseDateFormatted = source.release_string;
}

export function setAddedToWLUnix(
    source: RawWishlistGame,
    target: WishlistGame
): void {
    target.addedToWLUnix = Number(source.added);
}
/**
 * Sets formatted date property on WishlistGame in yyyy-mm-dd format.
 */
export function setAddedToWLFormatted(
    source: RawWishlistGame,
    target: WishlistGame
): void {
    const fullDate = new Date(Number(source.added) * 1000);
    const year = fullDate.getUTCFullYear().toString();
    // Get month has Jan === 0.
    let month = (fullDate.getUTCMonth() + 1).toString();
    let date = fullDate.getUTCDate().toString();

    if (month.length === 1) month = '0' + month;
    if (date.length === 1) date = '0' + date;

    target.addedToWLFormatted = `${year}-${month}-${date}`;
}

/**
 * Construction function for new WishlistGame.
 * @param gameID is key for RawWishlistGame.
 * @param rawGame is RawWishlistGame.
 *  It is the data for a single game.
 * @returns A WishlistGame with values based on rawGame parameter.
 */
function constructWishlistGame(
    gameID: RawWishlistGameID,
    rawGame: RawWishlistGame
): WishlistGame {
    const newGame = wishlistGameTemplate();

    setAppid(gameID, newGame);
    setPriority(rawGame, newGame);
    setName(rawGame, newGame);
    setTags(rawGame, newGame);
    setReviewGrade(rawGame, newGame);
    setReleaseDateUnix(rawGame, newGame);
    setReleaseDateFormatted(rawGame, newGame);
    setAddedToWLUnix(rawGame, newGame);
    setAddedToWLFormatted(rawGame, newGame);

    return newGame;
}

/**
 * Creates a new Wishlist data structure.
 *  that is sorted based on user ranking priority.
 * @param rawWishlist contains raw wishlist data from Steam.
 * @returns A Wishlist based on rawWishlist parameter.
 */
export function constructWishlist(rawWishlist: RawWishlist): Wishlist {
    let newWishlist: Wishlist = [];

    for (const gameKey in rawWishlist) {
        newWishlist.push(constructWishlistGame(gameKey, rawWishlist[gameKey]));
    }

    return sortWishlist(newWishlist);
}
