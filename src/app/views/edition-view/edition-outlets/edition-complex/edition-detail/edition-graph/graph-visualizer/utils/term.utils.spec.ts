import { DataFactory } from 'n3';
import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { DEFAULT_PREFIXES } from './prefix.utils';
import { formatLiteral, RDF_TYPE, RDFS_LABEL, TERM_UTILS, termKey, termShortName } from './term.utils';

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
            expectToEqual(TERM_UTILS, { formatLiteral, termKey, termShortName });
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
                expectToBe(termShortName(literal('3.14159'), DEFAULT_PREFIXES), '3.14159');
            });

            it('... should not compact IRIs within literal values', () => {
                expectToBe(termShortName(literal(`${AWG}Sketch`), DEFAULT_PREFIXES), `${AWG}Sketch`);
            });
        });

        describe('#formatLiteral()', () => {
            const integer = (value: string) => literal(value, namedNode(`${XSD}integer`));
            const decimal = (value: string) => literal(value, namedNode(`${XSD}decimal`));
            const double = (value: string) => literal(value, namedNode(`${XSD}double`));

            it('... should have a method `formatLiteral`', () => {
                expect(formatLiteral).toBeDefined();
            });

            it('... should keep integers', () => {
                expectToBe(formatLiteral(integer('75')), '75');
                expectToBe(formatLiteral(integer('-3')), '-3');
            });

            it('... should normalize integers', () => {
                expectToBe(formatLiteral(integer('007')), '7');
                expectToBe(formatLiteral(literal('42', namedNode(`${XSD}nonNegativeInteger`))), '42');
            });

            it('... should round decimal numbers to two decimals', () => {
                expectToBe(formatLiteral(decimal('3.14159')), '3.14');
                expectToBe(formatLiteral(decimal('.5')), '0.50');
                expectToBe(formatLiteral(literal('1.125', namedNode(`${XSD}float`))), '1.13');
            });

            it('... should normalize integral decimal notations', () => {
                expectToBe(formatLiteral(decimal('2.0')), '2');
                expectToBe(formatLiteral(double('1e3')), '1000');
            });

            it('... should keep the lexical value of integers beyond the safe-integer range', () => {
                expectToBe(formatLiteral(integer('9007199254740993')), '9007199254740993');
                expectToBe(formatLiteral(integer('-9007199254740993')), '-9007199254740993');
                expectToBe(formatLiteral(double('1e21')), '1e21');
            });

            it('... should keep the lexical value of numbers that are not finite as JavaScript numbers', () => {
                expectToBe(formatLiteral(double('1e400')), '1e400');
                expectToBe(formatLiteral(double('-1e400')), '-1e400');
                expectToBe(formatLiteral(double('INF')), 'INF');
                expectToBe(formatLiteral(double('NaN')), 'NaN');
            });

            it('... should keep invalid lexical values of numeric datatypes', () => {
                expectToBe(formatLiteral(integer('Seitenzahl: 75')), 'Seitenzahl: 75');
                expectToBe(formatLiteral(integer('')), '');
                expectToBe(formatLiteral(integer(' ')), ' ');
                expectToBe(formatLiteral(integer('0x1F')), '0x1F');
            });

            it('... should keep values of plain literals that look like numbers', () => {
                expectToBe(formatLiteral(literal('007')), '007');
                expectToBe(formatLiteral(literal('1.125')), '1.125');
                expectToBe(formatLiteral(literal('1e3')), '1e3');
                expectToBe(formatLiteral(literal('19340716')), '19340716');
            });

            it('... should keep values of language literals and other datatypes that look like numbers', () => {
                expectToBe(formatLiteral(literal('1.0', 'de')), '1.0');
                expectToBe(formatLiteral(literal('1.0', namedNode(`${XSD}token`))), '1.0');
                expectToBe(formatLiteral(literal('1934', namedNode(`${XSD}gYear`))), '1934');
            });
        });
    });
});
