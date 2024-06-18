import mongoose from 'mongoose';
import { DBMaybeWishlist, wishlistDBType } from './dbTypes';
import { WishlistModel } from './model/Wishlist';
import { BoolTuple, isValidString } from '../wishlists/mainWishlist';
/**
 * Tries to fetch wishlist data from database.
 * @param userIdentifier is the discordID or steam64/custom name identifier
 *  for a user.
 * @returns A tuple of a boolean denoting outcome,
 *  and either a Wishlist,
 *  or a string explaining what caused the fetch to fail.
 */
export async function dbGetWishlist(
    userIdentifier: string
): Promise<DBMaybeWishlist> {
    /* Extra save check incase discord handles user inputs as anything other 
    than a string. */
    const inputString = userIdentifier.toString();
    if (!isValidString(inputString))
        return [false, "The input you've written is invalid."];

    const response = await WishlistModel.findOne({
        discordIdentifier: inputString,
    })
        .then((data) => {
            //console.log(data);
            if (data === null) return [false, 'User does not exists in DB'];
            else return [true, data];
        })
        .catch((err) => {
            console.log(
                'A DB fetch attempt failed from user input: ' + inputString
            );
            return [false, 'Failed to get wishlist data from DB'];
        });
    return response as DBMaybeWishlist;
}
