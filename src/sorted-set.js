define(function () {
    /**
     * Do a binary search on a sorted array Return the index of the element, or
     * where it should be inserted if not found.
     */
    function binarySearch(haystack, needle, compareFn) {
        var min = 0;
        var max = haystack.length - 1;
        var index, delta;

        while (min <= max) {
            index = Math.floor((max - min) / 2) + min;
            delta = compareFn(needle, haystack[index]);

            if (delta === 0) {
                return index;
            } else if (delta < 0) {
                max = index - 1;
            } else {
                min = index + 1;
            }
        }

        return min;
    }

    function SortedSet(compareFn, elements) {
        var i;

        elements = elements || [];

        this._elements = [];
        this._compareFn = compareFn;
        for (i = 0; i < elements.length; i++) {
            this.insert(elements[i]);
        }
    }

    /**
     * Get an element by index. If no index is provided, return a sorted array
     * of all elements.
     */
    SortedSet.prototype.get = function (index) {
        var result;

        if (index === void undefined) {
            result = [].concat(this._elements);
        } else {
            result = this._elements[index];
        }
        
        return result;
    }

    /**
     * Get the index of an element in the set. Return -1 if it doesn't exist.
     */
    SortedSet.prototype.getIndex = function (element) {
        var index = binarySearch(this._elements, element, this._compareFn);

        return (this._elements[index] === element) ? index : -1;
    }

    /**
     * Insert an element into the set. Return the index where it was inserted
     * or -1 if it already exists.
     */
    SortedSet.prototype.insert = function (element) {
        var elements = this._elements;
        var index = binarySearch(elements, element, this._compareFn);
        var result = -1;
        
        if (elements[index] !== element) {
            elements.splice(index, 0, element);
            result = index;
        }

        return result;
    }

    /**
     * Remove an element from the set. Return the index where it was removed
     * or -1 if it doesn't exist.
     */
    SortedSet.prototype.remove = function (element) {
        var elements = this._elements;
        var index = this.getIndex(element);
        
        if (index >= 0) {
            elements.splice(index, 1);
        }

        return index;
    }

    return SortedSet;
});
