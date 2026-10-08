import { DataFactory } from 'n3';
import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { DEFAULT_PREFIXES } from './prefix.utils';
import { formatLiteralValue, RDF_TYPE, RDFS_LABEL, TERM_UTILS, termKey, termShortName } from './term.utils';

const { blankNode, literal, namedNode } = DataFactory;

const AWG = 'https://edition.anton-webern.ch/webern-onto#';
const XSD = 'http://www.w3.org/2001/XMLSchema#';

describe('TermUtils (DONE)', () => {
    describe('constants', () => {
        it('... should have `RDF_TYPE` as named node', () => {
            expectToBe(RDF_TYPE.termType, 'NamedNode');
            expectToBe(RDF_TYPE.value, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
        });

        it('... should have `RDFS_LABEL` as named node', () => {
            expectToBe(RDFS_LABEL.termType, 'NamedNode');
            expectToBe(RDFS_LABEL.value, 'http://www.w3.org/2000/01/rdf-schema#label');
        });
    });

    describe('TERM_UTILS', () => {
        it('... should reference all term utils methods', () => {
            expectToEqual(TERM_UTILS, { formatLiteralValue, termKey, termShortName });
        });
    });

    describe('METHODS', () => {
        describe('#termKey()', () => {
            it('... should have a method `termKey`', () => {
                expect(termKey).toBeDefined();
            });

            it('... should hold the IRI for named nodes', () => {
                expectToBe(termKey(namedNode(`${AWG}Sketch`)), `${AWG}Sketch`);
            });

            it('... should hold `_:id` for blank nodes', () => {
                expectToBe(termKey(blankNode('b0')), '_:b0');
            });

            it('... should hold the quoted value for plain literals', () => {
                expectToBe(termKey(literal('Skizze')), '"Skizze"');
            });

            it('... should hold the quoted value with language tag for language literals', () => {
                expectToBe(termKey(literal('Skizze', 'de')), '"Skizze"@de');
            });

            it('... should hold the quoted value with datatype for typed literals', () => {
                expectToBe(termKey(literal('75', namedNode(`${XSD}integer`))), `"75"^^<${XSD}integer>`);
            });

            it('... should escape quotes in literal values', () => {
                expectToBe(termKey(literal('a "b"')), '"a \\"b\\""');
            });

            it('... should hold distinct keys for terms with the same value', () => {
                const keys = new Set([
                    termKey(namedNode('x')),
                    termKey(blankNode('x')),
                    termKey(literal('x')),
                    termKey(literal('x', 'de')),
                    termKey(literal('x', namedNode(`${XSD}token`))),
                ]);

                expectToBe(keys.size, 5);
            });
        });

        describe('#termShortName()', () => {
            it('... should have a method `termShortName`', () => {
                expect(termShortName).toBeDefined();
            });

            it('... should hold the compacted IRI for named nodes', () => {
                expectToBe(termShortName(namedNode(`${AWG}M317_Sk1`), DEFAULT_PREFIXES), 'awg:M317_Sk1');
                expectToBe(termShortName(namedNode('http://example.org/x'), DEFAULT_PREFIXES), 'http://example.org/x');
            });

            it('... should hold `_:id` for blank nodes', () => {
                expectToBe(termShortName(blankNode('b1'), DEFAULT_PREFIXES), '_:b1');
            });

            it('... should hold the formatted value for literals', () => {
                expectToBe(termShortName(literal('Seitenzahl: 75'), DEFAULT_PREFIXES), 'Seitenzahl: 75');
                expectToBe(termShortName(literal('3.14159', namedNode(`${XSD}decimal`)), DEFAULT_PREFIXES), '3.14');
            });

            it('... should not compact IRIs within literal values', () => {
                expectToBe(termShortName(literal(`${AWG}Sketch`), DEFAULT_PREFIXES), `${AWG}Sketch`);
            });
        });

        describe('#formatLiteralValue()', () => {
            it('... should have a method `formatLiteralValue`', () => {
                expect(formatLiteralValue).toBeDefined();
            });

            it('... should keep integers', () => {
                expectToBe(formatLiteralValue('75'), '75');
                expectToBe(formatLiteralValue('-3'), '-3');
            });

            it('... should round decimal numbers to two decimals', () => {
                expectToBe(formatLiteralValue('3.14159'), '3.14');
                expectToBe(formatLiteralValue('.5'), '0.50');
            });

            it('... should normalize integral decimal notations', () => {
                expectToBe(formatLiteralValue('2.0'), '2');
                expectToBe(formatLiteralValue('1e3'), '1000');
            });

            it('... should keep the lexical value of integers beyond the safe-integer range', () => {
                expectToBe(formatLiteralValue('9007199254740993'), '9007199254740993');
                expectToBe(formatLiteralValue('-9007199254740993'), '-9007199254740993');
                expectToBe(formatLiteralValue('1e21'), '1e21');
            });

            it('... should keep the lexical value of numbers that are not finite as JavaScript numbers', () => {
                expectToBe(formatLiteralValue('1e400'), '1e400');
                expectToBe(formatLiteralValue('-1e400'), '-1e400');
            });

            it('... should keep non-numeric values (also empty and whitespace)', () => {
                expectToBe(formatLiteralValue('Seitenzahl: 75'), 'Seitenzahl: 75');
                expectToBe(formatLiteralValue(''), '');
                expectToBe(formatLiteralValue(' '), ' ');
                expectToBe(formatLiteralValue('0x1F'), '0x1F');
                expectToBe(formatLiteralValue('19340716'), '19340716');
            });
        });
    });
});
