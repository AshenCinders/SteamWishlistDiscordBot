export type wishlistGameDBType = {
    appid: Number;
    priority: Number;
    name: String;
    tags: Array<String>;
    reviewGrade: String;
    releaseDateUnix: Number;
    releaseDateFormatted: String;
    addedToWLUnix: Number;
    addedToWLFormatted: String;
};

export type wishlistDBType = {
    discordIdentifier: String;
    givenIdentifier: String;
    unixFetchedAt: Number;
    wishlistData: Array<wishlistGameDBType>;
};

export type DBMaybeWishlist = [true, wishlistDBType] | [false, string];
