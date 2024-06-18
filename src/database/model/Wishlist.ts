import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const wishlistGameSchema = new Schema({
    appid: Number,
    priority: Number,
    name: String,
    tags: [String],
    reviewGrade: String,
    releaseDateUnix: Number,
    releaseDateFormatted: String,
    addedToWLUnix: Number,
    addedToWLFormatted: String,
});

const wishlistSchema = new Schema({
    discordIdentifier: String,
    givenIdentifier: String,
    unixFetchedAt: Number,
    wishlistData: [wishlistGameSchema],
});

export const WishlistModel = model('Wishlist', wishlistSchema);
