import { Pipe, PipeTransform } from '@angular/core';

import { Prefix, PrefixForm } from '@awg-views/edition-view/edition-outlets/edition-graph/graph-visualizer/models';

@Pipe({ name: 'prefix', pure: false })
export class PrefixPipe implements PipeTransform {
    prefixes: Prefix[] = [
        new Prefix('dc', 'http://purl.org/dc/elements/1.1/'),
        new Prefix('owl', 'http://www.w3.org/2002/07/owl#'),
        new Prefix('prov', 'http://www.w3.org/ns/prov#'),
        new Prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
        new Prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#'),
        new Prefix('xsd', 'http://www.w3.org/2001/XMLSchema#')
    ];

    transform(prefixForm: PrefixForm, value: any): any {
        let val = value;
        const transformedValue = this.switchPrefixForm(prefixForm, val);

        if (transformedValue) {
            val = transformedValue;
        }

        return val;
    }

    private switchPrefixForm(prefixForm: PrefixForm, oldValue: any): any {
        let newValue;

        // Loop over prefixes
        this.prefixes.map((p: Prefix) => {
            switch (prefixForm) {
                case PrefixForm.short: {
                    if (oldValue.indexOf(p.prefixIri) !== -1) {
                        newValue = oldValue.replace(p.prefixIri, p.prefixName + ':');
                    }
                    break;
                }
                case PrefixForm.long: {
                    if (oldValue.indexOf(p.prefixName) !== -1) {
                        newValue = oldValue.replace(p.prefixName + ':', p.prefixIri);
                    }
                    break;
                }
            }
        });
        return newValue;
    }
}
