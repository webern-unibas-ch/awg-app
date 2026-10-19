import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { ABBR_UTILS, applyAbbreviations } from './abbr.utils';

describe('AbbrUtils (DONE)', () => {
    describe('ABBR_UTILS', () => {
        it('... should reference all abbr utils methods', () => {
            expectToEqual(ABBR_UTILS, { applyAbbreviations });
        });
    });

    describe('METHODS', () => {
        describe('#applyAbbreviations()', () => {
            it('... should have a method `applyAbbreviations`', () => {
                expect(ABBR_UTILS.applyAbbreviations).toBeDefined();
            });

            it('... should wrap matching abbreviations and preserve surrounding text', () => {
                const root = document.createElement('p');
                root.textContent = 'T. 9 enthält Klav. und Ges.';

                ABBR_UTILS.applyAbbreviations(root);

                const abbreviations = root.querySelectorAll('abbr');
                expect(abbreviations).toHaveLength(3);
                expectToBe(abbreviations[0].textContent, 'T.');
                expectToBe(abbreviations[0].title, 'Takt');
                expectToBe(abbreviations[1].textContent, 'Klav.');
                expectToBe(abbreviations[1].title, 'Klavier');
                expectToBe(abbreviations[2].textContent, 'Ges.');
                expectToBe(abbreviations[2].title, 'Gesang');
                expectToBe(root.textContent, 'T. 9 enthält Klav. und Ges.');
            });

            it('... should prefer the longest matching abbreviation', () => {
                const root = document.createElement('p');
                root.textContent = 'Klav. o. und Klav. u.';

                ABBR_UTILS.applyAbbreviations(root);

                const abbreviations = root.querySelectorAll('abbr');
                expect(abbreviations).toHaveLength(2);
                expectToBe(abbreviations[0].textContent, 'Klav. o.');
                expectToBe(abbreviations[0].title, 'Klavier oben');
                expectToBe(abbreviations[1].textContent, 'Klav. u.');
                expectToBe(abbreviations[1].title, 'Klavier unten');
            });

            it('... should not replace abbreviations that occur inside words', () => {
                const root = document.createElement('p');
                root.textContent = 'Klaviertaste and Gesang';

                ABBR_UTILS.applyAbbreviations(root);

                expect(root.querySelectorAll('abbr')).toHaveLength(0);
                expectToBe(root.textContent, 'Klaviertaste and Gesang');
            });

            it('... should wrap text inside existing markup without changing the markup or its attributes', () => {
                const root = document.createElement('p');
                root.innerHTML = '<strong data-label="Klav.">Klav. o.</strong> <a href="#">CH-Bps</a>';

                ABBR_UTILS.applyAbbreviations(root);

                expectToBe(root.querySelector('strong')?.getAttribute('data-label'), 'Klav.');
                expectToBe(root.querySelector<HTMLElement>('strong > abbr')?.title, 'Klavier oben');
                expectToBe(root.querySelector('a')?.getAttribute('href'), '#');
                expectToBe(root.querySelector<HTMLElement>('a > abbr')?.title, 'Paul Sacher Stiftung, Basel');
                expectToBe(root.textContent, 'Klav. o. CH-Bps');
            });

            it('... should not wrap text that is already inside an <abbr> element', () => {
                const root = document.createElement('p');
                root.innerHTML = '<abbr title="Custom title">Klav.</abbr> and Klav.';

                ABBR_UTILS.applyAbbreviations(root);

                expect(root.querySelectorAll('abbr')).toHaveLength(2);
                expectToBe(root.querySelector('abbr')?.getAttribute('title'), 'Custom title');
                expectToBe(root.querySelectorAll('abbr')[1].title, 'Klavier');
            });

            it('... should be safe to apply more than once', () => {
                const root = document.createElement('p');
                root.textContent = 'Klav. o. and Ges.';

                ABBR_UTILS.applyAbbreviations(root);
                const firstResult = root.innerHTML;

                ABBR_UTILS.applyAbbreviations(root);

                expectToBe(root.innerHTML, firstResult);
                expect(root.querySelectorAll('abbr')).toHaveLength(2);
            });

            it('... should leave text unchanged when there are no matches', () => {
                const root = document.createElement('p');
                root.textContent = 'No configured abbreviation here';

                ABBR_UTILS.applyAbbreviations(root);

                expectToBe(root.innerHTML, 'No configured abbreviation here');
            });

            it('... should handle an empty element', () => {
                const root = document.createElement('p');

                expect(() => ABBR_UTILS.applyAbbreviations(root)).not.toThrow();
                expectToBe(root.innerHTML, '');
            });
        });
    });
});
