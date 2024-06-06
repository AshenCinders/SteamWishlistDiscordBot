import { WishlistArr } from './constructWishlist';

// Quicksort with ordering based on priority property of each element.

function quicksort<T>(
    arr: Array<T>,
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
            if (arr[i] <= localPivot) {
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

    if (lowIndex < highIndex) {
        const dividingIndex = divideUsingPivot();
        quicksort(arr, lowIndex, dividingIndex - 1);
        quicksort(arr, dividingIndex + 1, highIndex);
    }
}
