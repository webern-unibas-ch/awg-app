/**
 * **********************************************
 *
 *               CREDITS
 *
 * This code is inspired, adapted or taken from:
 *
 * [**https://github.com/VadimDez/ngx-order-pipe**](https://github.com/VadimDez/ngx-order-pipe/blob/master/src/app/order-pipe/ngx-order.pipe.ts) Build v2.2.0 on 12/11/2021, 14:45 MEZ
 *
 *
 ************************************************/

import { Pipe, PipeTransform } from '@angular/core';

/**
 * The OrderBy pipe.
 *
 * It declares a pipe that can be used in ngFor loops
 * to order a given collection by a given field.
 */
@Pipe({
    name: 'orderBy',
    pure: false,
})
export class OrderByPipe implements PipeTransform {
    /**
     * Check if a value is a string
     *
     * @param value
     */
    static isString(value: any): boolean {
        return typeof value === 'string' || value instanceof String;
    }

    /**
     * Sorts values ignoring the case
     *
     * @param a
     * @param b
     */
    static caseInsensitiveSort(a: any, b: any) {
        if (OrderByPipe.isString(a) && OrderByPipe.isString(b)) {
            return a.localeCompare(b);
        }
        return OrderByPipe.defaultCompare(a, b);
    }

    /**
     * Default compare method
     *
     * @param a
     * @param b
     *
     * @returns {number}
     */
    static defaultCompare(a: any, b: any): number {
        if (a && a instanceof Date) {
            a = a.getTime();
        }
        if (b && b instanceof Date) {
            b = b.getTime();
        }

        if (a === b) {
            return 0;
        }
        if (a == null) {
            return 1;
        }
        if (b == null) {
            return -1;
        }
        return a > b ? 1 : -1;
    }

    /**
     * Parse expression, split into items
     *
     * @param expression
     *
     * @returns {string[]}
     */
    static parseExpression(expression: string): string[] {
        expression = expression.replace(/\[(\w+)\]/g, '.$1');
        expression = expression.replace(/^\./, '');
        return expression.split('.');
    }

    /**
     * Get value by expression
     *
     * @param object
     * @param expression
     *
     * @returns {any}
     */
    static getValue(object: any, expression: string[]): any {
        for (const key of expression) {
            if (object && key in object) {
                object = object[key];
                if (typeof object === 'function') {
                    object = object();
                }
            } else {
                return undefined;
            }
        }
        return object;
    }

    /**
     * Set value by expression
     *
     * @param object
     * @param value
     * @param expression
     */
    static setValue(object: any, value: any, expression: string[]): void {
        let i;
        for (i = 0; i < expression.length - 1; i++) {
            object = object[expression[i]];
        }

        object[expression[i]] = value;
    }

    transform(
        value: any | any[],
        expression?: any,
        reverse?: boolean,
        isCaseInsensitive: boolean = false,
        comparator?: Function
    ): any {
        if (!value) {
            return value;
        }

        if (Array.isArray(expression)) {
            return this._multiExpressionTransform(value, expression.slice(), reverse, isCaseInsensitive, comparator);
        }

        if (Array.isArray(value)) {
            return this._sortArray(value.slice(), expression, reverse, isCaseInsensitive, comparator);
        }

        if (typeof value === 'object') {
            return this._transformObject(Object.assign({}, value), expression, reverse, isCaseInsensitive);
        }

        return value;
    }

    /**
     * Sorts an array and returns the sorted array.
     *
     * @param array The array to sort.
     * @param expression An optional string or array of strings representing the properties to sort by.
     * @param reverse Whether to sort in reverse order.
     * @param isCaseInsensitive Whether to perform a case-insensitive sort.
     * @param comparator An optional function to use for comparison.
     *
     * @returns {T[]} The sorted array.
     */
    private _sortArray<T>(
        array: T[],
        expression?: any,
        reverse?: boolean,
        isCaseInsensitive?: boolean,
        comparator?: Function
    ): T[] {
        const isDeepLink = expression && expression.indexOf('.') !== -1;

        if (isDeepLink) {
            expression = OrderByPipe.parseExpression(expression);
        }

        const compareFn =
            comparator ?? (isCaseInsensitive ? OrderByPipe.caseInsensitiveSort : OrderByPipe.defaultCompare);

        const sortedArray: any[] = array.slice().sort((a: any, b: any): number => {
            if (!expression) {
                return compareFn(a, b);
            }

            if (!isDeepLink) {
                if (a && b) {
                    return compareFn(a[expression], b[expression]);
                }
                return compareFn(a, b);
            }

            return compareFn(OrderByPipe.getValue(a, expression), OrderByPipe.getValue(b, expression));
        });

        if (reverse) {
            sortedArray.reverse();
        }

        return sortedArray;
    }

    /**
     * Transform Object
     *
     * @param value
     * @param expression
     * @param reverse
     * @param isCaseInsensitive
     *
     * @returns {any[]}
     */
    private _transformObject(
        value: any | any[],
        expression?: any,
        reverse?: boolean,
        isCaseInsensitive?: boolean
    ): any {
        const parsedExpression = OrderByPipe.parseExpression(expression);
        let lastPredicate = parsedExpression.pop();
        let oldValue = OrderByPipe.getValue(value, parsedExpression);

        if (!Array.isArray(oldValue)) {
            parsedExpression.push(lastPredicate);
            lastPredicate = null;
            oldValue = OrderByPipe.getValue(value, parsedExpression);
        }

        if (!oldValue) {
            return value;
        }

        const newValue = this.transform(oldValue, lastPredicate, reverse, isCaseInsensitive);

        OrderByPipe.setValue(value, newValue, parsedExpression);

        return value;
    }

    /**
     * Apply multiple expressions
     *
     * @param value
     * @param {any[]} expressions
     * @param {boolean} reverse
     * @param {boolean} isCaseInsensitive
     * @param {Function} comparator
     * @returns {any}
     */
    private _multiExpressionTransform(
        value: any,
        expressions: any[],
        reverse: boolean,
        isCaseInsensitive: boolean,
        comparator?: Function
    ): any {
        return [...expressions]
            .reverse()
            .reduce(
                (result: any, expression: any) =>
                    this.transform(result, expression, reverse, isCaseInsensitive, comparator),
                value
            );
    }
}
