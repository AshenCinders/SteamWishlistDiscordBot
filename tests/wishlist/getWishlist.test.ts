import {
    fetchFromSteam,
    isValidSteam64,
    isValidSteamUniqueID,
    newWishlistRecord,
    steamIdentifierToURL,
} from '../../src/wishlists/getWishlistData';

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

