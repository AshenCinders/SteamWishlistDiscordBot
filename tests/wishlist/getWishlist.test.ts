import {
    fetchWishlistFromSteam,
    isValidSteam64,
    isValidSteamCustomID,
    newRawWishlist,
    steamIdentifierToURL,
} from '../../src/wishlists/getWishlistData';
import { rawWishlistData2 } from '../mockData/rawWishlistData';

// Input validation functions for raw data fetch fuctions.

describe('steam64 validator', () => {
    test('correctly validates string length', () => {
        expect(isValidSteam64('123456789012345678')).toBe(false);
        expect(isValidSteam64('12345678901234567')).toBe(true);
        expect(isValidSteam64('1234567890123456')).toBe(false);

        expect(isValidSteam64('123')).toBe(false);
        expect(
            isValidSteam64(
                '111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
            )
        ).toBe(false);
    });

    test('correctly validates that only numbers are allowed', () => {
        expect(isValidSteam64('11112222333344445')).toBe(true);
        expect(isValidSteam64('1111a2222333be444')).toBe(false);
        expect(isValidSteam64('nonsenseData')).toBe(false);
        expect(isValidSteam64('!1112.223?334444!')).toBe(false);
        expect(isValidSteam64(' 1112222333344445')).toBe(false);
    });
});

describe('steam uniqueid from custom URL checker validator', () => {
    test('correctly validates string length', () => {
        expect(isValidSteamCustomID('AValidName')).toBe(true);
        expect(isValidSteamCustomID('')).toBe(false);
        expect(
            isValidSteamCustomID(
                'toLongggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'
            )
        ).toBe(false);

        // Edge cases
        expect(isValidSteamCustomID('aa')).toBe(false);
        expect(isValidSteamCustomID('aaa')).toBe(true);
        expect(isValidSteamCustomID('32charactersaaaaaaaaaaaaaaaaaaaa')).toBe(
            true
        );
        expect(isValidSteamCustomID('33charactersaaaaaaaaaaaaaaaaaaaaa')).toBe(
            false
        );
    });

    test('correctly validates allowed characters', () => {
        expect(isValidSteamCustomID('~-validCHARS257_.')).toBe(true);
        expect(isValidSteamCustomID('     ')).toBe(false);
        expect(isValidSteamCustomID("@this*is'not+allowed")).toBe(false);
        expect(isValidSteamCustomID('another!one?')).toBe(false);
    });
});

// End of input validation functions.

describe('steam id to URL function formats URL based on input ID', () => {
    test('correctly for Steam64s', () => {
        expect(steamIdentifierToURL('76561111111111111', true)).toBe(
            'https://store.steampowered.com/wishlist/profiles/76561111111111111/wishlistdata/'
        );
    });

    test('correctly for custom names', () => {
        expect(steamIdentifierToURL('ACustomNameFromCustomUrl', false)).toBe(
            'https://store.steampowered.com/wishlist/id/ACustomNameFromCustomUrl/wishlistdata/'
        );
    });
});

// Does not validate actual URLs, only possible responses from Steam.
describe('steam data fetch function handling invalid and valid responses', () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(
        jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ data: 'empty' }),
            })
        ) as jest.Mock
    );

    // Begin tests
    test('correctly for ok === false', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve(rawWishlistData2),
        } as unknown as Response);

        expect((await fetchWishlistFromSteam('teststring'))[0]).toBe(false);
    });

    test('correctly for invalid nonexistent user URL', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: 2 }),
        } as unknown as Response);

        expect((await fetchWishlistFromSteam('teststring'))[0]).toBe(false);
    });

    test('correctly for misc error', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([]),
        } as unknown as Response);

        expect((await fetchWishlistFromSteam('teststring'))[0]).toBe(false);
    });

    // Valid responses
    test('correctly for invalid data from Steam', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(rawWishlistData2),
        } as unknown as Response);

        expect((await fetchWishlistFromSteam('teststring'))[0]).toBe(true);
    });
});

describe('steam identifier to wishlist data function is', () => {
    // If steam fetch function gets called, always return valid for these tests.
    jest.spyOn(global, 'fetch').mockImplementation(
        jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(rawWishlistData2),
            })
        ) as jest.Mock
    );

    test('correct for Steam64Ids', async () => {
        expect((await newRawWishlist('76561111111111111'))[0]).toBe(true);
        expect((await newRawWishlist('12345678901234567'))[0]).toBe(true);
    });

    test('correct for names in custom-URLs', async () => {
        expect((await newRawWishlist('Nivq'))[0]).toBe(true);
        expect((await newRawWishlist('ThisCouldBeAValidName56'))[0]).toBe(true);
    });

    test('correct for other invalid user identifiers', async () => {
        expect((await newRawWishlist(''))[0]).toBe(false);
        expect((await newRawWishlist('ab'))[0]).toBe(false);
        expect(
            (
                await newRawWishlist(
                    'loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooongname'
                )
            )[0]
        ).toBe(false);
        expect((await newRawWishlist('some^^disallowedSymbols{¤'))[0]).toBe(
            false
        );
    });
});
