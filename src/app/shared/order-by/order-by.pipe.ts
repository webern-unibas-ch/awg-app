/**
 ***********************************************
 *
 *               CREDITS
 *
 * This code is inspired, adapted or taken from:
 *
 * Ali Adravi
 * [Angular 2 Search and Sort with ngFor repeater with example]
 * (http://www.advancesharp.com/blog/1211/angular-2-search-and-sort-with-ngfor-repeater-with-example)
 * 16 Apr, 17
 *
 *
 ************************************************/

import { Pipe, PipeTransform } from '@angular/core';

/**
 * The order by pipe.
 *
 * It orders the elements of an input array by property id and direction.
 *
 * __Usage :__
 *   `*ngFor="let subject of searchResponse?.subjects | orderBy: {property: 'obj_id', direction: 1}"`
 */
@Pipe({
    name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
    /**
     * Transform method of the OrderByPipe.
     *
     * @param {Array<any>} array The input array with the data to be piped.
     * @param {*} [args] The optional arguments to be ordered by. Needs `property` and optional `direction`.
     */
    transform(array: Array<any>, args?: any): any {
        return array.sort((a, b) => {
            if (!args.property) {
                return;
            }
            if (!args.direction) {
                args.direction = 1;
            }
            if (a[args.property] < b[args.property]) {
                return -1 * args.direction;
            } else if (a[args.property] > b[args.property]) {
                return 1 * args.direction;
            } else {
                return 0;
            }
        });
    }
}
