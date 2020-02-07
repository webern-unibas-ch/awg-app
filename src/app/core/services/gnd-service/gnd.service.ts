import { Injectable } from '@angular/core';

import { StorageType, StorageService } from '@awg-core/services/storage-service';

@Injectable({
    providedIn: 'root'
})
export class GndService {
    readonly gndKey = 'gnd';

    constructor(private storageService: StorageService) {}

    writeGndToSessionStorage(value: string): void {
        const dnbReg = /href="(https?:\/\/d-nb.info\/gnd\/(\w{5,10}))"/i; // regexp for links
        let linkRegArr: RegExpExecArray;

        let gndItem: string;

        const valueHasGnd = (checkValue: string): boolean => {
            // check for dnbLink in value
            if (dnbReg.exec(checkValue)) {
                linkRegArr = dnbReg.exec(checkValue);
                return !!linkRegArr;
            }
            return false;
        };

        if (valueHasGnd(value)) {
            // split utf8str with gnd value into array and take last argument (pop)
            gndItem = linkRegArr.pop();
            this.storageService.setStorageKey(StorageType.sessionStorage, this.gndKey, gndItem);
        } else {
            this.removeGndFromSessionStorage();
        }
    }

    removeGndFromSessionStorage(): void {
        this.storageService.removeStorageKey(StorageType.sessionStorage, this.gndKey);
    }
}
