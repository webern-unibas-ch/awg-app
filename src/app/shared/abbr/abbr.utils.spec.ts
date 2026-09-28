import { describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { ABBR_UTILS } from './abbr.utils';

describe('AbbrUtils (DONE)', () => {
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
                expect(abbreviations[0].textContent).toBe('T.');
                expect(abbreviations[0].title).toBe('Takt');
                expect(abbreviations[1].textContent).toBe('Klav.');
                expect(abbreviations[1].title).toBe('Klavier');
                expect(abbreviations[2].textContent).toBe('Ges.');
                expect(abbreviations[2].title).toBe('Gesang');
                expect(root.textContent).toBe('T. 9 enthält Klav. und Ges.');
            });

            it('... should prefer the longest matching abbreviation', () => {
                const root = document.createElement('p');
                root.textContent = 'Klav. o. und Klav. u.';

                ABBR_UTILS.applyAbbreviations(root);

                const abbreviations = root.querySelectorAll('abbr');
                expect(abbreviations).toHaveLength(2);
                expect(abbreviations[0].textContent).toBe('Klav. o.');
                expect(abbreviations[0].title).toBe('Klavier oben');
                expect(abbreviations[1].textContent).toBe('Klav. u.');
                expect(abbreviations[1].title).toBe('Klavier unten');
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
                expect(root.querySelector('abbr')?.getAttribute('title')).toBe('Custom title');
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
