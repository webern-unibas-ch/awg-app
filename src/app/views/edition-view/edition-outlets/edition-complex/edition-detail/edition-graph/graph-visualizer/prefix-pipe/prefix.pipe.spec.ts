import { expectToBe } from '@testing/expect-helper';

import { PrefixForm } from '../models';
import { PrefixPipe } from './prefix.pipe';

describe('PrefixPipe', () => {
    it('create an instance', () => {
        const pipe = new PrefixPipe();
        expect(pipe).toBeTruthy();
    });

    describe('#transform()', () => {
        it('... should have a method `transform`', () => {
            const pipe = new PrefixPipe();
            expect(pipe.transform).toBeDefined();
        });

        it('... should transform the short form of a known default RDF prefix into its long form', () => {
            const pipe = new PrefixPipe();
            const shortForm = 'rdf';
            const longForm = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

            const transformedValue = pipe.transform(shortForm, PrefixForm.LONG);

            expectToBe(transformedValue, longForm);
        });

        it('... should transform the long form of a known default RDF prefix into its short form', () => {
            const pipe = new PrefixPipe();
            const shortForm = 'rdf:';
            const longForm = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

            const transformedValue = pipe.transform(longForm, PrefixForm.SHORT);

            expectToBe(transformedValue, shortForm);
        });

        it('... should not transform a short value that is not in the list of default RDF prefixes', () => {
            const pipe = new PrefixPipe();
            const shortForm = 'bibo';

            const transformedValue = pipe.transform(shortForm, PrefixForm.LONG);

            expectToBe(transformedValue, shortForm);
        });

        it('... should not transform a long value that is not in the list of default RDF prefixes', () => {
            const pipe = new PrefixPipe();
            const longForm = 'http://purl.org/ontology/bibo/';

            const transformedValue = pipe.transform(longForm, PrefixForm.SHORT);

            expectToBe(transformedValue, longForm);
        });

        it('... should throw an error if the prefixForm is not equal to PrefixForm.SHORT or PrefixForm.LONG', () => {
            const pipe = new PrefixPipe();
            const shortForm = 'rdf:';

            expect(() => pipe.transform(shortForm, undefined)).toThrowError(
                `The prefixForm must be ${PrefixForm.SHORT} or ${PrefixForm.LONG}, but was: undefined.`
            );
        });
    });
});
