import { Injectable } from '@angular/core';

import { Textcritics } from '@awg-views/edition-view/models';

@Injectable({
    providedIn: 'root'
})
export class EditionService {
    constructor() {}

    /********************************
     *
     * get comments for selected item
     *
     * returns array with textcritics<Textcritics[]>
     *
     *
     ********************************/
    getTextcritics(textcritics: Textcritics[], overlay: { type: string; id: string }): Textcritics[] {
        return textcritics.filter((textcritic, filterIndex) => {
            return this.filterTextcritics(textcritic, overlay, filterIndex);
        });
    }

    /*
             * private function to filter out needed textcritics
             */
    private filterTextcritics(textcritics, overlay, filterIndex): boolean {
        // shortcuts & trimmed values
        const measure = textcritics.measure.replace('[', '').replace(']', '');
        const system = textcritics.system.replace('[', '').replace(']', '');

        switch (overlay.type) {
            case 'measure':
                return measure === overlay.id;
            case 'system':
                return system === overlay.id;
            case 'item':
                return filterIndex === +overlay.id;
        }
    }
}
