import { Injectable } from '@angular/core';

import { Textcritics } from '@awg-views/edition-view/models';

@Injectable()
export class EditionService {

    constructor( ) { }

    /********************************
     *
     * get comments for selected item
     *
     * returns array with comments<Textcritics[]>
     *     and selectedItem<string>
     *
     ********************************/
    getTextcritics(textcritics: Textcritics[], type: string, typeId: string): [Textcritics[], string] {
        let comments: Textcritics[] = [];
        let selectedId: string = '';
        switch (type) {
            case 'measure':
                selectedId = 'm' + typeId;
                comments = this.getCommentsValues(textcritics, type, typeId);
                break;
            case 'system':
                selectedId = 's' + typeId;
                comments = this.getCommentsValues(textcritics, type, typeId);
                break;
            case 'item':
                selectedId = typeId;
                comments.push(textcritics[typeId]);
                break;
        }
        return [comments, selectedId];
    }

            /*
             * private function to prepare values
             */
            private getCommentsValues(textcritics: Textcritics[], type: string, typeId: string): Textcritics[] {
                const comments: Textcritics[] = [];
                textcritics.forEach((textcritic) => {
                    // trim existing values
                    const tkaValue: string = textcritic[type] ? textcritic[type].replace('[', '').replace(']', '') : null;
                    // check if value matches id
                    if (tkaValue === typeId) {
                        comments.push(textcritic);
                    }
                });
                return comments;
            }

}
