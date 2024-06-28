import {
    constructWishlist,
    wishlistGameTemplate,
    setAddedToWLUnix,
    setAddedToWLFormatted,
    setReleaseDateUnix,
} from '../../src/wishlists/constructWishlist';
import {
    rawWishlistGame1,
    rawWishlistGame2,
    rawWishlistData1,
} from '../mockData/rawWishlistData';

describe('Edge cases and misc for Wishlist construction helpers', () => {
    const firstNewWLElem = wishlistGameTemplate();
    const secondNewWLElem = wishlistGameTemplate();

    test('element template has all required properties', () => {
        expect(firstNewWLElem).toHaveProperty('appid');
        expect(firstNewWLElem).toHaveProperty('priority');
        expect(firstNewWLElem).toHaveProperty('name');
        expect(firstNewWLElem).toHaveProperty('tags');
        expect(firstNewWLElem).toHaveProperty('reviewGrade');
        expect(firstNewWLElem).toHaveProperty('releaseDateUnix');
        expect(firstNewWLElem).toHaveProperty('releaseDateFormatted');
        expect(firstNewWLElem).toHaveProperty('addedToWLUnix');
        expect(firstNewWLElem).toHaveProperty('addedToWLFormatted');
    });

    test('releaseDateUnix setter handles both number and string from Steam', () => {
        setReleaseDateUnix(rawWishlistGame1, firstNewWLElem);
        expect(firstNewWLElem.releaseDateUnix).toBe(1604599094);

        setReleaseDateUnix(rawWishlistGame2, secondNewWLElem);
        expect(secondNewWLElem.releaseDateUnix).toBe(1691074826);
    });

    test('addedToWLUnix setter handles both number and string from Steam', () => {
        setAddedToWLUnix(rawWishlistGame1, firstNewWLElem);
        expect(firstNewWLElem.addedToWLUnix).toBe(1698487770);

        setAddedToWLUnix(rawWishlistGame2, secondNewWLElem);
        expect(secondNewWLElem.addedToWLUnix).toBe(1675486529);
    });

    test('addedToWLFormatted setter does correct formatting', () => {
        setAddedToWLFormatted(rawWishlistGame1, firstNewWLElem);
        expect(firstNewWLElem.addedToWLFormatted).toBe('2023-10-28');

        // Expect to have added 0s when a number <10.
        setAddedToWLFormatted(rawWishlistGame2, secondNewWLElem);
        expect(secondNewWLElem.addedToWLFormatted).toBe('2023-02-04');
    });
});

describe('Constructing a Wishlist from raw Steam data', () => {
    const newWishlst = constructWishlist(rawWishlistData1);
    const cpc = newWishlst[0];
    const tekken = newWishlst[3];
    const satisfactory = newWishlst[4];

    test('length of created wishlist are correct', () => {
        expect(newWishlst.length).toBe(6);
    });

    test('new wishlist has correct properties', () => {
        expect(cpc.appid).toBe(2178590);
        expect(tekken.priority).toBe(133);
        expect(satisfactory.name).toBe('Satisfactory');
        expect(tekken.reviewGrade).toBe('Mostly Positive');
        expect(satisfactory.releaseDateUnix).toBe(1591635600);
        expect(satisfactory.releaseDateFormatted).toBe('8 Jun, 2020');
        expect(cpc.addedToWLUnix).toBe(1701393560);
        expect(cpc.addedToWLFormatted).toBe('2023-12-01');
    });

    test('all tags are correct', () => {
        const gameTags = newWishlst[2].tags;
        expect(gameTags).toContain('Strategy');
        expect(gameTags).toContain('Simulation');
        expect(gameTags).toContain('Management');
        expect(gameTags).toContain('Base Building');
        expect(gameTags).toContain('Sandbox');
    });
});
