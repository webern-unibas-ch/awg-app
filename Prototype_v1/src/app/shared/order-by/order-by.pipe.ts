/************************************************
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

@Pipe({
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
    transform(array: Array<any>, args?: any): any {
        return array.sort(function(a, b) {
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
