import {
    isEligibleToRefetch,
    fetchNewWishlist,
} from '../../src/wishlists/mainWishlist';
import { unixNow } from '../../src/lib/miscHelpers';
import * as getDataModule from '../../src/wishlists/getWishlistData';
import { rawWishlistData2 } from '../mockData/rawWishlistData';
import { Wishlist } from '../../src/projectTypes';

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

describe('outward-facing withlist generator from identifier', () => {
    const getDataMock = jest
        .spyOn(getDataModule, 'newRawWishlist')
        .mockImplementation(async (userInput: string) => {
            return [false, 'init mock'];
        });

    test('handles case when first input check fails', async () => {
        // Mock is unused by this first test, but is left in for safety.
        getDataMock.mockImplementation(async (userInput: string) => {
            return [false, 'should be unreachable'];
        });

        const result = await fetchNewWishlist('');
        expect(result[0]).toBe(false);
        expect(result[1]).toBe("The input you've written is invalid.");
    });

    test('handles case when fetch fails for any reason', async () => {
        getDataMock.mockImplementation(async (userInput: string) => {
            return [false, 'fetch failed'];
        });

        const result = await fetchNewWishlist('testString');
        expect(result[0]).toBe(false);
        expect(result[1]).toBe('fetch failed');
    });

    test('handles case when fetch succeeds which returns wishlist', async () => {
        getDataMock.mockImplementation(async (userInput: string) => {
            return [true, rawWishlistData2];
        });

        const result = (await fetchNewWishlist('testString')) as [
            true,
            Wishlist,
        ];
        expect(result[0]).toBe(true);
        // Returned wishlist contains 2 elements.
        expect(result[1].length).toBe(2);
        expect(result[1][0].appid).toBe(610370);
        expect(result[1][1].appid).toBe(632000);
    });
});

// toMarkdown function(s) are currently not unit tested.
