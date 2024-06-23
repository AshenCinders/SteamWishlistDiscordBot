import { quicksort, sortWishlist } from '../../src/lib/sortArray';
import { testWishlist1 } from '../mockData/wishlist1';

describe('Generic quicksort', () => {
    const testArr = [
        50, 86, 12, 16, 43, 73, 160, 19, 49, 179, 182, 170, 167, 154, 48, 123,
        122, 77, 24, -8, 110, 98, 4, 15, 2, 56, 9, 138, 163, 37, 127, 164, 51,
        35, 106, 131, 54, 97, 188, 17, 159, 89, 28, -124, 20, 126, 52, 107, 144,
        118, 47, 41, 166, 60, 162, 150, 40, 79, 94, 112, 72, 7, 141, 65, 39,
        125, 130, 78, 84, 92, 103, 157, 75, 0, 114, 183, 149, 45, 87, 194, 158,
        175, -23, 137, 187, 59, 76, 69, 38, 82, 32, 81, 42, 6, 113, 147, 70,
        199, 3, 176,
    ];
    const sortedArr = [
        -124, -23, -8, 0, 2, 3, 4, 6, 7, 9, 12, 15, 16, 17, 19, 20, 24, 28, 32,
        35, 37, 38, 39, 40, 41, 42, 43, 45, 47, 48, 49, 50, 51, 52, 54, 56, 59,
        60, 65, 69, 70, 72, 73, 75, 76, 77, 78, 79, 81, 82, 84, 86, 87, 89, 92,
        94, 97, 98, 103, 106, 107, 110, 112, 113, 114, 118, 122, 123, 125, 126,
        127, 130, 131, 137, 138, 141, 144, 147, 149, 150, 154, 157, 158, 159,
        160, 162, 163, 164, 166, 167, 170, 175, 176, 179, 182, 183, 187, 188,
        194, 199,
    ];

    test('sort number array ascending order by default', () => {
        quicksort(testArr);
        expect(testArr).toStrictEqual(sortedArr);
    });

    test('sort wishlist by priority', () => {
        const newWishlist = sortWishlist(testWishlist1);

        expect(newWishlist[0].appid).toBe(669270);
        expect(newWishlist[1].appid).toBe(16900);
        expect(newWishlist[2].appid).toBe(1245620);

        const appidWithPrioZero = [newWishlist[3].appid, newWishlist[4].appid];
        expect(appidWithPrioZero).toContain(1533420);
        expect(appidWithPrioZero).toContain(1586800);
    });
});
