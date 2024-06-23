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
