// All exported types used by functions for wislists.
// Excluding DB specific types.

export type SteamWLRecGameID = string; // Steam game ID which is a number in string form.
// Fields are predefined by Steam.
export type SteamWLRecGameData = {
    name: string; // Game title.
    priority: number; // User/default priority list ordering.
    review_desc: string; // E.g. 'Mostly Positive'
    release_date: string | number; // Unix time in string OR number form
    // Yes Steam is inconsistent if it returns number or string on release_date property.
    release_string: string; // E.g. '4 Aug, 2022'
    added: string | number; // Unix time of when user added to WL in string
    // (OR possibly number) form.
    tags: Array<string>; // E.g. [ 'Co-op', 'Management', 'Cooking', 'Roguelite', 'Building' ]

    // Unused extra properties
    // Generic to avoid writing in all possible (and inconsistent with types) properties.
    [k: string]:
        | number
        | string
        | Array<string | number | object>
        | boolean
        | undefined;
};
// Each entry represents a game.
export type SteamWLRecord = Record<SteamWLRecGameID, SteamWLRecGameData>;
export type RawMaybeWishlist = [true, SteamWLRecord] | [false, string];

// For constructed Wishlists.
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

export type BoolTuple = [true, string] | [false, string];
export type MaybeWishlist = [true, Wishlist] | [false, string];

// Choice record for wishlist to markdown function.
export type StringifyWLChoices = {
    showTags?: boolean;
    showReviewGrade?: boolean;
    showReleaseDateFormatted?: boolean;
    showAddedToWLFormatted?: boolean;
};
