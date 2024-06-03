import { newWishlistRecord } from '../src/getWishlist';

// Note that 'a' passes as a valid custom steam URL-name.
const a = newWishlistRecord('nonsensedata');
console.log(a, 'first log');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function b() {
    await sleep(2000);
    console.log(a, 'second log');
}
b();
// a gets value false upon failed steam fetch
// as an account with that custom URL does not exist.
