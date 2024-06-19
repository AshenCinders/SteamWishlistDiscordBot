// Miscellaneous helper functions.

/**
 * Gets the current unix time (seconds).
 * @returns unix time as a number.
 */
export function unixNow(): number {
    return Math.floor(Date.now() / 1000);
}
