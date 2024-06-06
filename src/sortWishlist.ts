import { WLGameRec, WishlistArr } from './constructWishlist';

/**
 * Generic function for sorting an array in-place.
 * @param arr is the array containing generic elements.
 * @param lowIndex is the lowest index of the array.
 *  It is safe to assume that it is 0 at initial function call.
 * @param highIndex is length - 1. Both low and high index
 *  can be changed if only a part of an array is to be sorted.
 * @param sortCond is an optional higher-order boolean function
 *  determining sort ordering. Should the argument be left out,
 *  the following default function will be used:
 * \<T>(array: Array\<T>, index: number, pivot: T): boolean => {
 *     return array[index] <= pivot;
 * }
 */
export function quicksort<T>(
    arr: Array<T>,
    lowIndex: number,
    highIndex: number,
    sortCond?: (array: Array<T>, index: number, pivot: T) => boolean
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
    // If sortCond argument is left out, replace with a default.
    if (sortCond === undefined) {
        sortCond = <T>(array: Array<T>, index: number, pivot: T): boolean => {
            return array[index] <= pivot;
        };
    }
    // Unless base case is hit, keep subdividing.
    if (lowIndex < highIndex) {
        const dividingIndex = divideUsingPivot();
        quicksort(arr, lowIndex, dividingIndex - 1, sortCond);
        quicksort(arr, dividingIndex + 1, highIndex, sortCond);
    }
}

/**
 * Takes a wishlist array and sorts it in-place based on the priority property.
 * @param wlArr is of type WishlistArr
 */
export function sortWishlistArray(wlArr: WishlistArr): void {
    // TODO filter out priority=0 and append after sort

    const condByPriority = (
        array: WishlistArr,
        index: number,
        pivot: WLGameRec
    ): boolean => {
        return array[index].priority <= pivot.priority;
    };

    quicksort(wlArr, 0, wlArr.length - 1, condByPriority);
}
