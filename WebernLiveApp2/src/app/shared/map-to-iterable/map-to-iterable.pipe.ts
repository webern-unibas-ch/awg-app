import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mapToIterable'
})
export class MapToIterablePipe implements PipeTransform {
    transform(map: {}, args: any[] = null): any {
        if (!map)
            return null;
        let res = Object.keys(map)
            .map((key) => ({ 'objectKey': key, 'objectValues': map[key] }));
        return res;
    }
}
