// All exported types used by various parts of the project.

// RAW STEAM DATA TYPES
// Steam game ID which is a number in string form.
export type RawWishlistGameID = string;

// Fields are predefined by Steam.
export type RawWishlistGame = {
    name: string; // Game title.
    priority: number; // User/default priority list ordering.
    review_desc: string; // E.g. 'Mostly Positive'
    release_date: string | number; // Unix time in string OR number form
    release_string: string; // E.g. '4 Aug, 2022'
    // Unix time of when user added to WL in string (OR possibly number) form.
    added: string | number;
    // E.g. [ 'Co-op', 'Management', 'Cooking', 'Roguelite', 'Building' ]
    tags: Array<string>;

    // Unused extra properties that comes with the Steam wishlist data.
    // Generic to avoid writing in all possible properties (and types, since Steam is inconsistent with datatypes).
    [k: string]:
        | number
        | string
        | Array<string | number | object>
        | boolean
        | undefined;
};

// Each entry represents a game.
export type RawWishlist = Record<RawWishlistGameID, RawWishlistGame>;
export type MaybeRawWLTuple = [true, RawWishlist] | [false, string];

// WISHLIST TYPES
// For constructed Wishlists.
export type WishlistGame = {
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
export type Wishlist = Array<WishlistGame>;

export type OutcomeTuple = [true, string] | [false, string];
export type MaybeWishlistTuple = [true, Wishlist] | [false, string];

// Choice record for wishlist to markdown custom function.
export type StringifyWLChoices = {
    showTags?: boolean;
    showReviewGrade?: boolean;
    showReleaseDateFormatted?: boolean;
    showAddedToWLFormatted?: boolean;
};

// DATABASE TYPES
export type DBWishlistChunk = {
    discordIdentifier: string;
    givenIdentifier: string;
    unixFetchedAt: number;
    wishlistData: Wishlist;
};
export type DBMaybeWishlistChunkTuple =
    | [true, DBWishlistChunk]
    | [false, string];
