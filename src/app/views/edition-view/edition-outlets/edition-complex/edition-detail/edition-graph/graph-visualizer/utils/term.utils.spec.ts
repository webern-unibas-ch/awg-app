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

            it('... should return the IRI for named nodes', () => {
                const key = termKey(namedNode(`${AWG}Sketch`));

                expectToBe(key, `${AWG}Sketch`);
            });

            it('... should return `_:id` for blank nodes', () => {
                const key = termKey(blankNode('b0'));

                expectToBe(key, '_:b0');
            });

            it('... should return the quoted value for plain literals', () => {
                const key = termKey(literal('Skizze'));

                expectToBe(key, '"Skizze"');
            });

            it('... should return the quoted value with language tag for language literals', () => {
                const key = termKey(literal('Skizze', 'de'));

                expectToBe(key, '"Skizze"@de');
            });

            it('... should return the quoted value with datatype for typed literals', () => {
                const key = termKey(literal('75', namedNode(`${XSD}integer`)));

                expectToBe(key, `"75"^^<${XSD}integer>`);
            });

            it('... should escape quotes in literal values', () => {
                const key = termKey(literal('a "b"'));

                expectToBe(key, '"a \\"b\\""');
            });

            it('... should return distinct keys for terms with the same value', () => {
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

            describe('... should return the compacted IRI for named nodes', () => {
                it.each([
                    { desc: 'namedNode(awg:M317_Sk1)', term: namedNode(`${AWG}M317_Sk1`), expected: 'awg:M317_Sk1' },
                    {
                        desc: "namedNode('http://example.org/x')",
                        term: namedNode('http://example.org/x'),
                        expected: 'http://example.org/x',
                    },
                ])('... $desc', ({ term, expected }) => {
                    const shortName = termShortName(term, DEFAULT_PREFIXES);

                    expectToBe(shortName, expected);
                });
            });

            it('... should return `_:id` for blank nodes', () => {
                const shortName = termShortName(blankNode('b1'), DEFAULT_PREFIXES);

                expectToBe(shortName, '_:b1');
            });

            describe('... should return the formatted value for literals', () => {
                it.each([
                    { desc: "literal('Seitenzahl: 75')", term: literal('Seitenzahl: 75'), expected: 'Seitenzahl: 75' },
                    {
                        desc: "literal('3.14159', namedNode(xsd:decimal))",
                        term: literal('3.14159', namedNode(`${XSD}decimal`)),
                        expected: '3.14',
                    },
                    { desc: "literal('3.14159')", term: literal('3.14159'), expected: '3.14159' },
                ])('... $desc', ({ term, expected }) => {
                    const shortName = termShortName(term, DEFAULT_PREFIXES);

                    expectToBe(shortName, expected);
                });
            });

            it('... should not compact IRIs within literal values', () => {
                const shortName = termShortName(literal(`${AWG}Sketch`), DEFAULT_PREFIXES);

                expectToBe(shortName, `${AWG}Sketch`);
            });
        });

        describe('#formatLiteral()', () => {
            const integer = (value: string) => literal(value, namedNode(`${XSD}integer`));
            const decimal = (value: string) => literal(value, namedNode(`${XSD}decimal`));
            const double = (value: string) => literal(value, namedNode(`${XSD}double`));

            it('... should have a method `formatLiteral`', () => {
                expect(formatLiteral).toBeDefined();
            });

            describe('... should keep integers', () => {
                it.each([
                    { desc: "integer('75')", input: integer('75'), expected: '75' },
                    { desc: "integer('-3')", input: integer('-3'), expected: '-3' },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should normalize integers', () => {
                it.each([
                    { desc: "integer('007')", input: integer('007'), expected: '7' },
                    {
                        desc: "literal('42', namedNode(xsd:nonNegativeInteger))",
                        input: literal('42', namedNode(`${XSD}nonNegativeInteger`)),
                        expected: '42',
                    },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should round decimal numbers to two decimals', () => {
                it.each([
                    { desc: "decimal('3.14159')", input: decimal('3.14159'), expected: '3.14' },
                    { desc: "decimal('.5')", input: decimal('.5'), expected: '0.50' },
                    {
                        desc: "literal('1.125', namedNode(xsd:float))",
                        input: literal('1.125', namedNode(`${XSD}float`)),
                        expected: '1.13',
                    },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should normalize integral decimal notations', () => {
                it.each([
                    { desc: "decimal('2.0')", input: decimal('2.0'), expected: '2' },
                    { desc: "double('1e3')", input: double('1e3'), expected: '1000' },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should keep the lexical value of integers beyond the safe-integer range', () => {
                it.each([
                    {
                        desc: "integer('9007199254740993')",
                        input: integer('9007199254740993'),
                        expected: '9007199254740993',
                    },
                    {
                        desc: "integer('-9007199254740993')",
                        input: integer('-9007199254740993'),
                        expected: '-9007199254740993',
                    },
                    { desc: "double('1e21')", input: double('1e21'), expected: '1e21' },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should keep the lexical value of numbers that are not finite as JavaScript numbers', () => {
                it.each([
                    { desc: "double('1e400')", input: double('1e400'), expected: '1e400' },
                    { desc: "double('-1e400')", input: double('-1e400'), expected: '-1e400' },
                    { desc: "double('INF')", input: double('INF'), expected: 'INF' },
                    { desc: "double('NaN')", input: double('NaN'), expected: 'NaN' },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should keep invalid lexical values of numeric datatypes', () => {
                it.each([
                    {
                        desc: "integer('Seitenzahl: 75')",
                        input: integer('Seitenzahl: 75'),
                        expected: 'Seitenzahl: 75',
                    },
                    { desc: "integer('')", input: integer(''), expected: '' },
                    { desc: "integer(' ')", input: integer(' '), expected: ' ' },
                    { desc: "integer('0x1F')", input: integer('0x1F'), expected: '0x1F' },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should keep values of plain literals that look like numbers', () => {
                it.each([
                    { desc: "literal('007')", input: literal('007'), expected: '007' },
                    { desc: "literal('1.125')", input: literal('1.125'), expected: '1.125' },
                    { desc: "literal('1e3')", input: literal('1e3'), expected: '1e3' },
                    { desc: "literal('19340716')", input: literal('19340716'), expected: '19340716' },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });

            describe('... should keep values of language literals and other datatypes that look like numbers', () => {
                it.each([
                    { desc: "literal('1.0', 'de')", input: literal('1.0', 'de'), expected: '1.0' },
                    {
                        desc: "literal('1.0', namedNode(xsd:token))",
                        input: literal('1.0', namedNode(`${XSD}token`)),
                        expected: '1.0',
                    },
                    {
                        desc: "literal('1934', namedNode(xsd:gYear))",
                        input: literal('1934', namedNode(`${XSD}gYear`)),
                        expected: '1934',
                    },
                ])('... $desc', ({ input, expected }) => {
                    const formatted = formatLiteral(input);

                    expectToBe(formatted, expected);
                });
            });
        });
    });
});
