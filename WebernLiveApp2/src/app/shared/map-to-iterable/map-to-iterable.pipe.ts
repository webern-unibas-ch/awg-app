import { Pipe, PipeTransform } from '@angular/core';

/**
 * Map to Iterable Pipe
 *
 * Credits to:
 *      http://stackoverflow.com/questions/31490713/iterate-over-typescript-dictionary-in-angular-2
 *      http://stackoverflow.com/a/37479557
 *
 * It accepts Objects and [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 *
 * Usage:
 *
 *  <div *ngFor=" let keyValuePair of someObject | mapToIterable">
 *    key {{keyValuePair.objectKey}} and its values {{keyValuePair.objectValues}}
 *  </div>
 *
 */

@Pipe({
    name: 'mapToIterable'
})
export class MapToIterablePipe implements PipeTransform {
    transform(map: {}, args: any[] = null): any {
        if (!map)
            return null;
        let res = Object.keys(map)
            .map((key) => ({ 'mappedKey': key, 'mappedValues': map[key] }));
        return res;
    }
}
