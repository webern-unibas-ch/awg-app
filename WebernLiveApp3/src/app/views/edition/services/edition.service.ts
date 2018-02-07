import { Injectable } from '@angular/core';

import { Textcritics } from '../models';
import { DialogService } from '../../../core/dialog';

@Injectable()
export class EditionService {

    constructor(
        private dialogService: DialogService
    ) { }


    /********************************
     *
     * open edition dialog
     *
     * calls DialogService with identifier
     *
     ********************************/
    public openEditionDialog(identifier: string): void {
        this.dialogService.openEditionDialog(identifier);
    }


    /********************************
     *
     * get comments for selected item
     *
     * returns array with comments<Textcritics[]>
     *     and selectedItem<string>
     *
     ********************************/
    public getCommentsForItem(item: Textcritics[], type: string, typeId: string): [Textcritics[], string] {
        let comments = [];
        let selectedId: string = '';
        switch (type) {
            case 'measure':
                selectedId = 'm' + typeId;
                comments = this.getCommentsValues(item, type, typeId);
                break;
            case 'system':
                selectedId = 's' + typeId;
                comments = this.getCommentsValues(item, type, typeId);
                break;
            case 'item':
                selectedId = 'i' + typeId;
                comments.push(item[typeId]);
                break;
        }
        return [comments, selectedId];
    }

            /*
             * private function to prepare values
             */
            private getCommentsValues(item: Textcritics[], type: string, typeId: string): Textcritics[] {
                let arr = [];
                item.forEach((comment) => {
                    // trim existing values
                    let tkaValue: string = comment[type] ? comment[type].replace("[", "").replace("]", "") : null;
                    // check if value matches id
                    if (tkaValue == typeId) {
                        arr.push(comment);
                    }
                });
                return arr;
            }

}
