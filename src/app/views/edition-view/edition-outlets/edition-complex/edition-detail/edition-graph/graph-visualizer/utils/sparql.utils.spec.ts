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

                expectToBe(maskNonCode(`?s ${iri} ?o`), `?s ${blank(iri)} ?o`);
            });

            it('... should keep IRIs if requested', () => {
                expectToBe(
                    maskNonCode('?s <http://example.org/p> ?o', { keepIris: true }),
                    '?s <http://example.org/p> ?o'
                );
            });

            it('... should replace double- and single-quoted string literals with the same number of spaces', () => {
                expectToBe(
                    maskNonCode(`?s rdfs:label "a:b" , 'c:d'`),
                    `?s rdfs:label ${blank('"a:b"')} , ${blank("'c:d'")}`
                );
            });

            it('... should treat escaped quotes as part of the string literal', () => {
                const literal = String.raw`"say \"x:y\""`;

                expectToBe(maskNonCode(`${literal} ex:p`), `${blank(literal)} ex:p`);
            });

            it('... should replace comments up to the end of the line with the same number of spaces', () => {
                const comment = '# select dc:title';

                expectToBe(maskNonCode(`?s ?p ?o ${comment}\n?x`), `?s ?p ?o ${blank(comment)}\n?x`);
            });

            it('... should not start a comment with a `#` within an IRI or a string', () => {
                const iri = '<http://example.org/onto#x>';

                expectToBe(maskNonCode(`${iri} "#tag" ex:p`), `${blank(iri)} ${blank('"#tag"')} ex:p`);
                expectToBe(maskNonCode(`${iri} "#tag" ex:p`, { keepIris: true }), `${iri} ${blank('"#tag"')} ex:p`);
            });

            it('... should keep code without IRIs, strings and comments', () => {
                expectToBe(maskNonCode('SELECT ?s WHERE { ?s a awg:Sketch }'), 'SELECT ?s WHERE { ?s a awg:Sketch }');
            });
        });

        describe('#toSelectQuery()', () => {
            it('... should have a method `toSelectQuery`', () => {
                expect(toSelectQuery).toBeDefined();
            });

            it('... should convert the short form of a CONSTRUCT query', () => {
                expectToBe(toSelectQuery('CONSTRUCT\nWHERE { ?s ?p ?o }'), 'SELECT *\nWHERE { ?s ?p ?o }');
            });

            it('... should convert a CONSTRUCT query case-insensitively', () => {
                expectToBe(toSelectQuery('construct where { ?s ?p ?o }'), 'SELECT * where { ?s ?p ?o }');
            });

            it('... should drop an explicit construct template', () => {
                expectToBe(toSelectQuery('CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }'), 'SELECT * WHERE { ?s ?p ?o }');
                expectToBe(toSelectQuery('CONSTRUCT { ?s ?p ?o } { ?s ?p ?o }'), 'SELECT * { ?s ?p ?o }');
            });

            it('... should keep prefix declarations, IRIs, strings and comments', () => {
                const query =
                    'PREFIX ex: <http://example.org/construct/>\n# construct all\nCONSTRUCT WHERE { ?s ex:p "construct" }';

                expectToBe(
                    toSelectQuery(query),
                    'PREFIX ex: <http://example.org/construct/>\n# construct all\nSELECT * WHERE { ?s ex:p "construct" }'
                );
            });

            it('... should hold null for queries that are no CONSTRUCT queries or have an unclosed template', () => {
                expect(toSelectQuery('SELECT * WHERE { ?s ?p ?o }')).toBeNull();
                expect(toSelectQuery('CONSTRUCT { ?s ?p ?o WHERE { ?s ?p ?o }')).toBeNull();
            });
        });

        describe('#toConstructQuery()', () => {
            it('... should have a method `toConstructQuery`', () => {
                expect(toConstructQuery).toBeDefined();
            });

            it('... should convert a SELECT query into the short form of a CONSTRUCT query', () => {
                expectToBe(toConstructQuery('SELECT *\nWHERE { ?s ?p ?o }'), 'CONSTRUCT\nWHERE { ?s ?p ?o }');
                expectToBe(
                    toConstructQuery('SELECT DISTINCT ?s ?o WHERE { ?s ?p ?o } ORDER BY ?s LIMIT 10'),
                    'CONSTRUCT WHERE { ?s ?p ?o } ORDER BY ?s LIMIT 10'
                );
            });

            it('... should convert a SELECT query case-insensitively', () => {
                expectToBe(toConstructQuery('select * where { ?s ?p ?o }'), 'CONSTRUCT where { ?s ?p ?o }');
            });

            it('... should drop expressions of the projection and keep solution modifiers', () => {
                expectToBe(
                    toConstructQuery('SELECT ?c (COUNT(?c) AS ?n)\nWHERE { ?s a ?c } GROUP BY ?c ORDER BY ?n LIMIT 10'),
                    'CONSTRUCT\nWHERE { ?s a ?c } GROUP BY ?c ORDER BY ?n LIMIT 10'
                );
            });

            it('... should add the WHERE keyword if missing', () => {
                expectToBe(toConstructQuery('SELECT *{ ?s ?p ?o }'), 'CONSTRUCT WHERE { ?s ?p ?o }');
            });

            it('... should keep a dataset clause', () => {
                expectToBe(
                    toConstructQuery('SELECT * FROM <http://example.org/g> WHERE { ?s ?p ?o }'),
                    'CONSTRUCT FROM <http://example.org/g> WHERE { ?s ?p ?o }'
                );
            });

            it.each([
                { desc: 'no SELECT query', query: 'CONSTRUCT WHERE { ?s ?p ?o }' },
                { desc: 'a query without pattern', query: 'SELECT *' },
                { desc: 'FILTER', query: 'SELECT * WHERE { ?s ?p ?o FILTER(?o > 1) }' },
                { desc: 'OPTIONAL', query: 'SELECT * WHERE { ?s ?p ?o OPTIONAL { ?o ?q ?r } }' },
                { desc: 'a nested group', query: 'SELECT * WHERE { { ?s ?p ?o } }' },
                { desc: 'a property path', query: 'SELECT * WHERE { ?s ex:a/ex:b ?o }' },
            ])('... should hold null for $desc', ({ query }) => {
                expect(toConstructQuery(query)).toBeNull();
            });
        });

        describe('#getQueryType()', () => {
            it('... should have a method `getQueryType`', () => {
                expect(getQueryType).toBeDefined();
            });

            it('... should hold the type of the query forms (case-insensitive)', () => {
                expectToBe(getQueryType('SELECT * WHERE { ?s ?p ?o }'), 'select');
                expectToBe(getQueryType('construct where { ?s ?p ?o }'), 'construct');
                expectToBe(getQueryType('ASK { ?s ?p ?o }'), 'ask');
                expectToBe(getQueryType('DESCRIBE <http://example.org/x>'), 'describe');
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
                expectToBe(getQueryType(query), 'update');
            });

            it('... should hold the first query form keyword', () => {
                expectToBe(getQueryType('SELECT (COUNT(?s) AS ?n) WHERE { ?s ?p ?o }'), 'select');
            });

            it('... should ignore keywords in prefix IRIs, strings and comments', () => {
                const query = [
                    '# select all sketches',
                    'PREFIX ex: <http://example.org/select/>',
                    'CONSTRUCT { ?s ?p "describe" } WHERE { ?s ?p ?o }',
                ].join('\n');

                expectToBe(getQueryType(query), 'construct');
            });

            it('... should ignore keywords in prefix declarations, prefixed names and variables', () => {
                const query = [
                    'PREFIX add: <http://example.org/add#>',
                    'SELECT ?load ?copy WHERE { ?load ex:clear ?copy . ?s ex:my-drop ?o }',
                ].join('\n');

                expectToBe(getQueryType(query), 'select');
            });

            it('... should hold null if no query form keyword is found', () => {
                expectToBe(getQueryType('WHERE { ?s ?p ?o }'), null);
                expectToBe(getQueryType(''), null);
            });
        });
    });
});
