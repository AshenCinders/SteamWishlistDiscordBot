// Miscellaneous helper functions.

/**
 * Gets the current unix time (seconds).
 * @returns unix time as a number.
 */
export function unixNow(): number {
    return Math.floor(Date.now() / 1000);
}

/**
 * Rough check to avoid parsing long/empty strings.
 * @param str to be checked.
 * @returns true if 0 < length < 51, else false.
 */
export function isValidString(str: any): str is string {
    return typeof str !== 'string'
        ? false
        : str.length > 50
          ? false
          : str.length < 1
            ? false
            : true;
}

/**
 * If a newline character exists at the end of input string str,
 *  it will then get removed.
 * Function does not require input str to have a newline at the end.
 * @param str is any string.
 * @returns str without a newline character at the end.
 */
export function delLastNewline(str: string): string {
    // \n counts as 1 char.
    if (/\n$/.test(str)) return str.slice(0, -1);
    else return str;
}

/**
 * Converts an array of strings to a single string.
 * @param inputArr an array with all elements as strings.
 * @returns a string with all elements in a single string separated by commas.
 */
export function stringArrayToString(inputArr: Array<string>): string {
    let listStr = '';
    for (let i = 0; i < inputArr.length; i++) {
        listStr += inputArr[i].toString() + ', ';
    }
    // Remove last comma and space.
    listStr = listStr.slice(0, -2);

    return listStr;
}
