import {
    fetchFromSteam,
    isValidSteam64,
    isValidSteamUniqueID,
    newWishlistRecord,
    steamIdentifierToURL,
} from '../../src/wishlists/getWishlistData';
import { rawWishlistData2 } from '../mockData/rawWishlistData1';

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
        expect(isValidSteamUniqueID('AValidName')).toBe(true);
        expect(isValidSteamUniqueID('')).toBe(false);
        expect(
            isValidSteamUniqueID(
                'toLongggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'
            )
        ).toBe(false);

        // Edge cases
        expect(isValidSteamUniqueID('aa')).toBe(false);
        expect(isValidSteamUniqueID('aaa')).toBe(true);
        expect(isValidSteamUniqueID('32charactersaaaaaaaaaaaaaaaaaaaa')).toBe(
            true
        );
        expect(isValidSteamUniqueID('33charactersaaaaaaaaaaaaaaaaaaaaa')).toBe(
            false
        );
    });

    test('correctly validates allowed characters', () => {
        expect(isValidSteamUniqueID('~-validCHARS257_.')).toBe(true);
        expect(isValidSteamUniqueID('     ')).toBe(false);
        expect(isValidSteamUniqueID("@this*is'not+allowed")).toBe(false);
        expect(isValidSteamUniqueID('another!one?')).toBe(false);
    });
});

// End of input validation functions.

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

        expect((await fetchFromSteam('teststring'))[0]).toBe(false);
    });

    test('correctly for invalid nonexistent user URL', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: 2 }),
        } as unknown as Response);

        expect((await fetchFromSteam('teststring'))[0]).toBe(false);
    });

    test('correctly for misc error', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([]),
        } as unknown as Response);

        expect((await fetchFromSteam('teststring'))[0]).toBe(false);
    });

    // Valid responses
    test('correctly for invalid data from Steam', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(rawWishlistData2),
        } as unknown as Response);

        expect((await fetchFromSteam('teststring'))[0]).toBe(true);
    });
});

