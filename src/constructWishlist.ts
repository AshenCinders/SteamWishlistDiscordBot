export type WLGameRec = {
    appid: string;
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
        appid: '',
        priority: 0,
        name: '',
        tags: [],
        reviewGrade: '',
        releaseDateUnix: 0,
        releaseDateFormatted: '',
        addedToWLUnix: 0,
    };
}
