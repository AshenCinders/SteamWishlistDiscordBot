import {
    isValidString,
    delLastNewline,
    stringArrayToString,
} from '../../src/lib/miscHelpers';

describe('string checker gives correct boolean', () => {
    test('when passes checker', () => {
        expect(isValidString('asdfv')).toBeTruthy;
        expect(isValidString('this is a pretty long string which passed'))
            .toBeTruthy;
        expect(isValidString(' @  ¤  spaces   are  ok 3  ')).toBeTruthy;

        // Edge cases
        expect(isValidString('a')).toBeTruthy;
        expect(
            isValidString('12345678901234567890123456789012345678901234567890')
        ).toBeTruthy;
    });

    test('when fails checker', () => {
        expect(
            isValidString(
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
            )
        ).toBeFalsy;

        // Input is not a string
        expect(isValidString(42)).toBeFalsy;
        expect(isValidString(['teststring in array'])).toBeFalsy;
        expect(isValidString({})).toBeFalsy;
        expect(isValidString(true)).toBeFalsy;
        expect(isValidString(undefined)).toBeFalsy;

        // Edge cases
        expect(isValidString('')).toBeFalsy;
        expect(
            isValidString('a12345678901234567890123456789012345678901234567890')
        ).toBeFalsy;
    });
});

describe('delete last newline on string', () => {
    test('when newline is last', () => {
        expect(delLastNewline('teststring\n')).toBe('teststring');
        expect(delLastNewline('remove just one\n\n')).toBe('remove just one\n');
        expect(delLastNewline('\n')).toBe('');
        expect(delLastNewline('@£$€{{$\n')).toBe('@£$€{{$');
    });

    test('not when newline does not exist', () => {
        expect(delLastNewline('')).toBe('');
        expect(delLastNewline('teststring')).toBe('teststring');
        expect(delLastNewline('**some markdown**')).toBe('**some markdown**');
    });
});

describe('convert array of strings to single string with commas', () => {
    test('normal inputs', () => {
        const testArr1 = [
            'This',
            'is',
            'a',
            'normal',
            'sentence',
            'that',
            'is',
            'tokenized',
            'where',
            'each',
            'word',
            'will',
            'be',
            'separated',
            'by',
            'a',
            'comma',
        ];
        const expectString1 =
            'This, is, a, normal, sentence, that, is, tokenized, where, each, word, will, be, separated, by, a, comma';
        expect(stringArrayToString(testArr1)).toBe(expectString1);
    });

    test('empty arr does not throw error', () => {
        expect(stringArrayToString([])).toBe('');
    });
});
