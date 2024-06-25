import { isEligibleToRefetch } from '../../src/wishlists/mainWishlist';
import { unixNow } from '../../src/lib/miscHelpers';

describe('eligible to refetch wishlist data checker', () => {
    test('works for expected situations', () => {
        // Unix now is used as placeholder to avoid
        // hardcoding time-dependent test input.

        // Has not passed 10 min yet.
        expect(isEligibleToRefetch(unixNow() - 25)).toBeFalsy();
        expect(isEligibleToRefetch(unixNow() - 532)).toBeFalsy();
        // More than 10 min has passed.
        expect(isEligibleToRefetch(unixNow() - 605)).toBeTruthy();
        expect(isEligibleToRefetch(unixNow() - 2424563)).toBeTruthy();
        expect(isEligibleToRefetch(unixNow() - 31555)).toBeTruthy();
    });
});

// toMarkdown function(s) are currently not unit tested.

// TODO see if can mock getnewwishlist
