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
    getTextcritics(textcritics: Textcritics[], event: {field: string, id: string}): Textcritics[] {
        return textcritics.filter((textcritic, filterIndex) => {
            return this.filterTextcritics(textcritic, event, filterIndex);
        });
    }

            /*
             * private function to filter out needed textcritics
             */
            private filterTextcritics(textcritics, event, filterIndex): boolean {
                // shortcuts & trimmed values
                const measure = textcritics.measure.replace('[', '').replace(']', '');
                const system = textcritics.system.replace('[', '').replace(']', '');

                switch (event.field) {
                    case 'measure':
                        return measure === event.id;
                    case 'system':
                        return system === event.id;
                    case 'item':
                        return filterIndex === +event.id;
                }
            }

}
