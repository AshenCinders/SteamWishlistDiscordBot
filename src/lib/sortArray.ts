import { WLGameRec, Wishlist } from '../wishlists/typesWishlist';

// Abstracted function for performance.
// Use quicksort for as interface to sort.
function quicksortInternal<T>(
    arr: Array<T>,
    sortCond: (array: Array<T>, index: number, pivot: T) => boolean,
    lowIndex: number,
    highIndex: number
): void {
    function swap(indexA: number, indexB: number): void {
        const temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    }

    function divideUsingPivot() {
        const localPivot = arr[highIndex];
        let lastIndexLowSide = lowIndex - 1;

        // Go through all elements except last, which is the pivot.
        for (let i = lowIndex; i < highIndex; i++) {
            if (sortCond!(arr, i, localPivot)) {
                // Swap the first element after the low side
                // with the element that is being checked.
                lastIndexLowSide++;
                swap(lastIndexLowSide, i);
            }
        }
        // After division, swap pivot to be between low and high side.
        swap(lastIndexLowSide + 1, highIndex);
        // Return index for next iteration's pivot.
        return lastIndexLowSide + 1;
    }

    // Unless base case is hit, keep subdividing.
    if (lowIndex < highIndex) {
        const dividingIndex = divideUsingPivot();
        quicksortInternal(arr, sortCond, lowIndex, dividingIndex - 1);
        quicksortInternal(arr, sortCond, dividingIndex + 1, highIndex);
    }
}

/**
 * Generic function for sorting an array in-place.
 * @param arr is the array containing generic elements.
 * @param sortCond (optional) is a higher-order boolean function
 *  determining sort ordering. Should the argument be left out,
 *  the following default function will be used:
 * \<T>(array: Array\<T>, index: number, pivot: T): boolean => {
 *     return array[index] <= pivot;
 * }
 * @param lowIndex (optional) is the lowest index for the part of the array
 *  to be sorted. Omit when sorting full array.
 * @param highIndex (optional) is the highest index for the part of the array
 *  to be sorted. Omit when sorting full array.
 */
export function quicksort<T>(
    arr: Array<T>,
    sortCond?: (array: Array<T>, index: number, pivot: T) => boolean,
    lowIndex?: number,
    highIndex?: number
): void {
    // If sortCond argument is left out, replace with a default.
    if (sortCond === undefined) {
        sortCond = <T>(array: Array<T>, index: number, pivot: T): boolean => {
            return array[index] <= pivot;
        };
    }
    // If high or low index arguments have been omitted, set defaults.
    if (lowIndex === undefined) lowIndex = 0;
    if (highIndex === undefined) highIndex = arr.length - 1;

    quicksortInternal(arr, sortCond, lowIndex, highIndex);
}

/**
 * Takes a Wishlist and returns a sorted Wishlist based on the priority property.
 * @param wishlist is a wishlist to be sorted.
 */
export function sortWishlist(wishlist: Wishlist): Wishlist {
    const prioZero = wishlist.filter(({ priority }) => {
        return priority === 0;
    });
    const prioNonZero = wishlist.filter(({ priority }) => {
        return priority !== 0;
    });

    const condByPriority = (
        array: Wishlist,
        index: number,
        pivot: WLGameRec
    ): boolean => {
        return array[index].priority <= pivot.priority;
    };

    quicksort(prioNonZero, condByPriority);
    return [...prioNonZero, ...prioZero];
}
