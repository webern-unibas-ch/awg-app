import { Pipe, PipeTransform } from '@angular/core';

import { DEFAULT_PREFIXES } from '../data';
import { Prefix, PrefixForm } from '../models';

/**
 * The Prefix pipe.
 *
 * It turns a short form of an RDF prefix into a long form and vice versa.
 */
@Pipe({ name: 'prefix', pure: false })
export class PrefixPipe implements PipeTransform {
    /**
     * Public variable: defaultPrefixes.
     *
     * It keeps an array of default prefixes.
     */
    defaultPrefixes: Prefix[] = DEFAULT_PREFIXES;

    /**
     * Transform method of the PrefixPipe.
     *
     * @param {*} value The given value to be piped.
     * @param {PrefixForm} prefixForm The requested form of the prefix (short or long).
     *
     * @returns {*} The transformed value.
     */
    transform(value: any, prefixForm: PrefixForm): any {
        let transformedValue: any;

        switch (prefixForm) {
            case PrefixForm.SHORT: {
                this.defaultPrefixes.forEach((p: Prefix) => {
                    if (value.indexOf(p.prefixIri) !== -1) {
                        transformedValue = value.replace(p.prefixIri, p.prefixName + ':');
                    }
                });
                break;
            }
            case PrefixForm.LONG: {
                this.defaultPrefixes.forEach((p: Prefix) => {
                    if (value.indexOf(p.prefixName) !== -1) {
                        transformedValue = value.replace(p.prefixName + ':', p.prefixIri);
                    }
                });
                break;
            }
            default:
                // This branch should not be reached
                const exhaustiveCheck: never = prefixForm;
                throw new Error(
                    `The prefixForm must be ${PrefixForm.SHORT} or ${PrefixForm.LONG}, but was: ${exhaustiveCheck}.`
                );
        }
        // If the value was not transformed, return the original value
        return transformedValue || value;
    }
}
