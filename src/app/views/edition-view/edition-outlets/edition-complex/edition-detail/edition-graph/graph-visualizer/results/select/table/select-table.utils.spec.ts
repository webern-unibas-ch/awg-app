import { DataFactory } from 'n3';
import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { SparqlSelectResult } from '../../../models/sparql-result.model';
import { DEFAULT_PREFIXES } from '../../../utils/prefix.utils';
import { SELECT_TABLE_UTILS, toTableCell, toTableRows } from './select-table.utils';

const { blankNode, literal, namedNode } = DataFactory;

const AWG = DEFAULT_PREFIXES['awg'];
const XSD = 'http://www.w3.org/2001/XMLSchema#';

describe('sparql-table.utils', () => {
    describe('SELECT_TABLE_UTILS', () => {
        it('... should reference all sparql table utils methods', () => {
            expectToEqual(SELECT_TABLE_UTILS, { toTableCell, toTableRows });
        });
    });

    describe('#toTableCell()', () => {
        it('... should have a method `toTableCell`', () => {
            expect(toTableCell).toBeDefined();
        });

        it('... should hold a uri cell with the compacted IRI as label', () => {
            expectToEqual(toTableCell(namedNode(`${AWG}M317_Sk1`), DEFAULT_PREFIXES), {
                type: 'uri',
                value: `${AWG}M317_Sk1`,
                label: 'awg:M317_Sk1',
            });
        });

        it('... should hold a uri cell with the full IRI as label if no prefix matches', () => {
            expectToEqual(toTableCell(namedNode('http://example.org/x'), DEFAULT_PREFIXES), {
                type: 'uri',
                value: 'http://example.org/x',
                label: 'http://example.org/x',
            });
        });

        it('... should hold a bnode cell with `_:id` as label', () => {
            expectToEqual(toTableCell(blankNode('b0'), DEFAULT_PREFIXES), {
                type: 'bnode',
                value: 'b0',
                label: '_:b0',
            });
        });

        it('... should hold a literal cell with the number as label for integer literals', () => {
            expectToEqual(toTableCell(literal('75', namedNode(`${XSD}integer`)), DEFAULT_PREFIXES), {
                type: 'literal',
                value: '75',
                label: 75,
            });
        });

        it('... should hold a literal cell with the unrounded value as label for other literals', () => {
            expectToEqual(toTableCell(literal('3.14159', namedNode(`${XSD}decimal`)), DEFAULT_PREFIXES), {
                type: 'literal',
                value: '3.14159',
                label: '3.14159',
            });
            expectToEqual(toTableCell(literal('Seitenzahl: 75', 'de'), DEFAULT_PREFIXES), {
                type: 'literal',
                value: 'Seitenzahl: 75',
                label: 'Seitenzahl: 75',
            });
        });

        it('... should not compact IRIs within literal values', () => {
            expectToBe(toTableCell(literal(`${AWG}Sketch`), DEFAULT_PREFIXES).label, `${AWG}Sketch`);
        });
    });

    describe('#toTableRows()', () => {
        const result: SparqlSelectResult = {
            kind: 'select',
            variables: ['s', 'label', 'page'],
            bindings: [
                { s: namedNode(`${AWG}a`), label: literal('A'), page: literal('75', namedNode(`${XSD}integer`)) },
                { s: blankNode('b1'), page: literal('76', namedNode(`${XSD}integer`)) },
            ],
            prefixes: DEFAULT_PREFIXES,
        };

        it('... should have a method `toTableRows`', () => {
            expect(toTableRows).toBeDefined();
        });

        it('... should hold one row per binding with one cell per bound variable', () => {
            expectToEqual(toTableRows(result), [
                {
                    s: { type: 'uri', value: `${AWG}a`, label: 'awg:a' },
                    label: { type: 'literal', value: 'A', label: 'A' },
                    page: { type: 'literal', value: '75', label: 75 },
                },
                {
                    s: { type: 'bnode', value: 'b1', label: '_:b1' },
                    page: { type: 'literal', value: '76', label: 76 },
                },
            ]);
        });

        it('... should hold no cell for unbound variables', () => {
            expectToBe(Object.hasOwn(toTableRows(result)[1], 'label'), false);
        });

        it('... should order the cells by the variables', () => {
            const reordered: SparqlSelectResult = { ...result, variables: ['page', 's', 'label'] };

            expectToEqual(Object.keys(toTableRows(reordered)[0]), ['page', 's', 'label']);
        });

        it('... should ignore bound values of variables that are not projected', () => {
            const projected: SparqlSelectResult = { ...result, variables: ['s'] };

            expectToEqual(
                toTableRows(projected).map(row => Object.keys(row)),
                [['s'], ['s']]
            );
        });

        it('... should hold frozen rows', () => {
            expectToBe(Object.isFrozen(toTableRows(result)[0]), true);
        });

        it('... should hold no rows for no bindings', () => {
            expectToEqual(toTableRows({ ...result, bindings: [] }), []);
        });
    });
});
