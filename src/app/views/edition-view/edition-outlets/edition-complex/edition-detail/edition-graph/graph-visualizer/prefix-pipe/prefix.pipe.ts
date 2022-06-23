import { Pipe, PipeTransform } from '@angular/core';

import { Prefix, PrefixForm } from '../models';

/**
 * The prefix pipe.
 *
 * It shortens or expands a given value to be used as an RDF prefix.
 */
@Pipe({ name: 'prefix', pure: false })
export class PrefixPipe implements PipeTransform {
    /**
     * Public variable: prefixes.
     *
     * It keeps an array of default prefixes.
     */
    prefixes: Prefix[] = [
        new Prefix('awg', 'https://edition.anton-webern.ch/webern-onto#'),
        new Prefix('dc', 'http://purl.org/dc/elements/1.1/'),
        new Prefix('owl', 'http://www.w3.org/2002/07/owl#'),
        new Prefix('prov', 'http://www.w3.org/ns/prov#'),
        new Prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
        new Prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#'),
        new Prefix('xsd', 'http://www.w3.org/2001/XMLSchema#'),
    ];

    /**
     * Transform method of the PrefixPipe.
     *
     * @param {*} value The given value to be piped.
     * @param {PrefixForm} prefixForm The requested form of the prefix (short or long).
     */
    transform(value: any, prefixForm: PrefixForm): any {
        let val = value;
        const transformedValue = this._switchPrefixForm(val, prefixForm);

        if (transformedValue) {
            val = transformedValue;
        }

        return val;
    }

    /**
     * Private method: _switchPrefixForm.
     *
     * It shortens or expands a given value
     * depending on the requested prefix form.
     *
     * @param {PrefixForm} prefixForm The requested form of the prefix (short or long).
     * @param {*} oldValue The given value to be piped.
     */
    private _switchPrefixForm(oldValue: any, prefixForm: PrefixForm): any {
        let newValue;

        switch (prefixForm) {
            case PrefixForm.short: {
                this.prefixes.forEach((p: Prefix) => {
                    if (oldValue.indexOf(p.prefixIri) !== -1) {
                        newValue = oldValue.replace(p.prefixIri, p.prefixName + ':');
                    }
                });
                break;
            }
            case PrefixForm.long: {
                this.prefixes.forEach((p: Prefix) => {
                    if (oldValue.indexOf(p.prefixName) !== -1) {
                        newValue = oldValue.replace(p.prefixName + ':', p.prefixIri);
                    }
                });
                break;
            }
        }

        return newValue;
    }
}
