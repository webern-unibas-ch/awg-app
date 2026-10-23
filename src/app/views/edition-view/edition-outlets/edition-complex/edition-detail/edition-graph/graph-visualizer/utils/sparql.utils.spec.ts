import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { getQueryType, maskNonCode, SPARQL_UTILS, toConstructQuery, toSelectQuery } from './sparql.utils';

/**
 * Helper function: blank.
 *
 * It creates as many spaces as the given text has characters.
 */
const blank = (text: string): string => ' '.repeat(text.length);

describe('SparqlUtils (DONE)', () => {
    describe('SPARQL_UTILS', () => {
        it('... should reference all sparql utils methods', () => {
            expectToEqual(SPARQL_UTILS, { getQueryType, maskNonCode, toConstructQuery, toSelectQuery });
        });
    });

    describe('METHODS', () => {
        describe('#maskNonCode()', () => {
            it('... should have a method `maskNonCode`', () => {
                expect(maskNonCode).toBeDefined();
            });

            it('... should replace IRIs with the same number of spaces', () => {
                const iri = '<http://example.org/p>';

                const maskedCode = maskNonCode(`?s ${iri} ?o`);

                expectToBe(maskedCode, `?s ${blank(iri)} ?o`);
            });

            it('... should keep IRIs if requested', () => {
                const maskedCode = maskNonCode('?s <http://example.org/p> ?o', { keepIris: true });

                expectToBe(maskedCode, '?s <http://example.org/p> ?o');
            });

            it('... should replace double- and single-quoted string literals with the same number of spaces', () => {
                const maskedCode = maskNonCode(`?s rdfs:label "a:b" , 'c:d'`);

                expectToBe(maskedCode, `?s rdfs:label ${blank('"a:b"')} , ${blank("'c:d'")}`);
            });

            it('... should treat escaped quotes as part of the string literal', () => {
                const literal = String.raw`"say \"x:y\""`;

                const maskedCode = maskNonCode(`${literal} ex:p`);

                expectToBe(maskedCode, `${blank(literal)} ex:p`);
            });

            it('... should replace comments up to the end of the line with the same number of spaces', () => {
                const comment = '# select dc:title';

                const maskedCode = maskNonCode(`?s ?p ?o ${comment}\n?x`);

                expectToBe(maskedCode, `?s ?p ?o ${blank(comment)}\n?x`);
            });

            it('... should not start a comment with a `#` within an IRI or a string', () => {
                const iri = '<http://example.org/onto#x>';

                const maskedCode = maskNonCode(`${iri} "#tag" ex:p`);
                const maskedCodeWithIris = maskNonCode(`${iri} "#tag" ex:p`, { keepIris: true });

                expectToBe(maskedCode, `${blank(iri)} ${blank('"#tag"')} ex:p`);
                expectToBe(maskedCodeWithIris, `${iri} ${blank('"#tag"')} ex:p`);
            });

            it('... should keep code without IRIs, strings and comments', () => {
                const maskedCode = maskNonCode('SELECT ?s WHERE { ?s a awg:Sketch }');

                expectToBe(maskedCode, 'SELECT ?s WHERE { ?s a awg:Sketch }');
            });
        });

        describe('#toSelectQuery()', () => {
            it('... should have a method `toSelectQuery`', () => {
                expect(toSelectQuery).toBeDefined();
            });

            it('... should convert the short form of a CONSTRUCT query', () => {
                const selectQuery = toSelectQuery('CONSTRUCT\nWHERE { ?s ?p ?o }');

                expectToBe(selectQuery, 'SELECT *\nWHERE { ?s ?p ?o }');
            });

            it('... should convert a CONSTRUCT query case-insensitively', () => {
                const selectQuery = toSelectQuery('construct where { ?s ?p ?o }');

                expectToBe(selectQuery, 'SELECT * where { ?s ?p ?o }');
            });

            describe('... should drop an explicit construct template', () => {
                it.each([
                    {
                        desc: 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }',
                        query: 'CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }',
                        expected: 'SELECT * WHERE { ?s ?p ?o }',
                    },
                    {
                        desc: 'CONSTRUCT { ?s ?p ?o } { ?s ?p ?o }',
                        query: 'CONSTRUCT { ?s ?p ?o } { ?s ?p ?o }',
                        expected: 'SELECT * { ?s ?p ?o }',
                    },
                ])('... $desc', ({ query, expected }) => {
                    const selectQuery = toSelectQuery(query);

                    expectToBe(selectQuery, expected);
                });
            });

            it('... should keep prefix declarations, IRIs, strings and comments', () => {
                const query =
                    'PREFIX ex: <http://example.org/construct/>\n# construct all\nCONSTRUCT WHERE { ?s ex:p "construct" }';

                const selectQuery = toSelectQuery(query);

                expectToBe(
                    selectQuery,
                    'PREFIX ex: <http://example.org/construct/>\n# construct all\nSELECT * WHERE { ?s ex:p "construct" }'
                );
            });

            describe('... should return null for queries that are no CONSTRUCT queries or have an unclosed template', () => {
                it.each([
                    { desc: 'SELECT * WHERE { ?s ?p ?o }', query: 'SELECT * WHERE { ?s ?p ?o }' },
                    {
                        desc: 'CONSTRUCT { ?s ?p ?o WHERE { ?s ?p ?o }',
                        query: 'CONSTRUCT { ?s ?p ?o WHERE { ?s ?p ?o }',
                    },
                ])('... $desc', ({ query }) => {
                    const selectQuery = toSelectQuery(query);

                    expect(selectQuery).toBeNull();
                });
            });
        });

        describe('#toConstructQuery()', () => {
            it('... should have a method `toConstructQuery`', () => {
                expect(toConstructQuery).toBeDefined();
            });

            describe('... should convert a SELECT query into the short form of a CONSTRUCT query', () => {
                it.each([
                    {
                        desc: 'SELECT *\\nWHERE { ?s ?p ?o }',
                        query: 'SELECT *\nWHERE { ?s ?p ?o }',
                        expected: 'CONSTRUCT\nWHERE { ?s ?p ?o }',
                    },
                    {
                        desc: 'SELECT DISTINCT ?s ?o WHERE { ?s ?p ?o } ORDER BY ?s LIMIT 10',
                        query: 'SELECT DISTINCT ?s ?o WHERE { ?s ?p ?o } ORDER BY ?s LIMIT 10',
                        expected: 'CONSTRUCT WHERE { ?s ?p ?o } ORDER BY ?s LIMIT 10',
                    },
                ])('... $desc', ({ query, expected }) => {
                    const constructQuery = toConstructQuery(query);

                    expectToBe(constructQuery, expected);
                });
            });

            it('... should convert a SELECT query case-insensitively', () => {
                const constructQuery = toConstructQuery('select * where { ?s ?p ?o }');

                expectToBe(constructQuery, 'CONSTRUCT where { ?s ?p ?o }');
            });

            it('... should drop expressions of the projection and keep solution modifiers', () => {
                const constructQuery = toConstructQuery(
                    'SELECT ?c (COUNT(?c) AS ?n)\nWHERE { ?s a ?c } GROUP BY ?c ORDER BY ?n LIMIT 10'
                );

                expectToBe(constructQuery, 'CONSTRUCT\nWHERE { ?s a ?c } GROUP BY ?c ORDER BY ?n LIMIT 10');
            });

            it('... should add the WHERE keyword if missing', () => {
                const constructQuery = toConstructQuery('SELECT *{ ?s ?p ?o }');

                expectToBe(constructQuery, 'CONSTRUCT WHERE { ?s ?p ?o }');
            });

            it('... should keep a dataset clause', () => {
                const constructQuery = toConstructQuery('SELECT * FROM <http://example.org/g> WHERE { ?s ?p ?o }');

                expectToBe(constructQuery, 'CONSTRUCT FROM <http://example.org/g> WHERE { ?s ?p ?o }');
            });

            it.each([
                { desc: 'no SELECT query', query: 'CONSTRUCT WHERE { ?s ?p ?o }' },
                { desc: 'a query without pattern', query: 'SELECT *' },
                { desc: 'FILTER', query: 'SELECT * WHERE { ?s ?p ?o FILTER(?o > 1) }' },
                { desc: 'OPTIONAL', query: 'SELECT * WHERE { ?s ?p ?o OPTIONAL { ?o ?q ?r } }' },
                { desc: 'a nested group', query: 'SELECT * WHERE { { ?s ?p ?o } }' },
                { desc: 'a property path', query: 'SELECT * WHERE { ?s ex:a/ex:b ?o }' },
            ])('... should hold null for $desc', ({ query }) => {
                const constructQuery = toConstructQuery(query);

                expect(constructQuery).toBeNull();
            });
        });

        describe('#getQueryType()', () => {
            it('... should have a method `getQueryType`', () => {
                expect(getQueryType).toBeDefined();
            });

            describe('... should return the type of the query forms (case-insensitive)', () => {
                it.each([
                    { desc: 'SELECT * WHERE { ?s ?p ?o }', query: 'SELECT * WHERE { ?s ?p ?o }', expected: 'select' },
                    {
                        desc: 'construct where { ?s ?p ?o }',
                        query: 'construct where { ?s ?p ?o }',
                        expected: 'construct',
                    },
                    { desc: 'ASK { ?s ?p ?o }', query: 'ASK { ?s ?p ?o }', expected: 'ask' },
                    {
                        desc: 'DESCRIBE <http://example.org/x>',
                        query: 'DESCRIBE <http://example.org/x>',
                        expected: 'describe',
                    },
                ])('... $desc', ({ query, expected }) => {
                    const queryType = getQueryType(query);

                    expectToBe(queryType, expected);
                });
            });

            it.each([
                'INSERT DATA { <http://a> <http://b> <http://c> }',
                'DELETE WHERE { ?s ?p ?o }',
                'LOAD <http://example.org/data.ttl>',
                'CLEAR ALL',
                'CREATE GRAPH <http://example.org/g>',
                'DROP SILENT GRAPH <http://example.org/g>',
                'COPY DEFAULT TO <http://example.org/g>',
                'MOVE <http://example.org/a> TO <http://example.org/b>',
                'add default to graph <http://example.org/g>',
            ])('... should hold `update` for the update operation `%s`', query => {
                const queryType = getQueryType(query);

                expectToBe(queryType, 'update');
            });

            it('... should return the first query form keyword', () => {
                const queryType = getQueryType('SELECT (COUNT(?s) AS ?n) WHERE { ?s ?p ?o }');

                expectToBe(queryType, 'select');
            });

            it('... should ignore keywords in prefix IRIs, strings and comments', () => {
                const query = [
                    '# select all sketches',
                    'PREFIX ex: <http://example.org/select/>',
                    'CONSTRUCT { ?s ?p "describe" } WHERE { ?s ?p ?o }',
                ].join('\n');

                const queryType = getQueryType(query);

                expectToBe(queryType, 'construct');
            });

            it('... should ignore keywords in prefix declarations, prefixed names and variables', () => {
                const query = [
                    'PREFIX add: <http://example.org/add#>',
                    'SELECT ?load ?copy WHERE { ?load ex:clear ?copy . ?s ex:my-drop ?o }',
                ].join('\n');

                const queryType = getQueryType(query);

                expectToBe(queryType, 'select');
            });

            describe('... should return null if no query form keyword is found', () => {
                it.each([
                    { desc: 'WHERE { ?s ?p ?o }', query: 'WHERE { ?s ?p ?o }' },
                    { desc: '', query: '' },
                ])('... $desc', ({ query }) => {
                    const queryType = getQueryType(query);

                    expectToBe(queryType, null);
                });
            });
        });
    });
});
