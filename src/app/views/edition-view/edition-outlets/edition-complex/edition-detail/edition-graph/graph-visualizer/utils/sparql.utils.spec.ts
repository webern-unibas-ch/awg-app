import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { getQueryType, SPARQL_UTILS, stripCommentsAndLiterals, stripNonCode } from './sparql.utils';

describe('SparqlUtils (DONE)', () => {
    describe('SPARQL_UTILS', () => {
        it('... should reference all sparql utils methods', () => {
            expectToEqual(SPARQL_UTILS, { getQueryType, stripCommentsAndLiterals, stripNonCode });
        });
    });

    describe('METHODS', () => {
        describe('#stripNonCode()', () => {
            it('... should have a method `stripNonCode`', () => {
                expect(stripNonCode).toBeDefined();
            });

            it('... should replace IRIs with a space', () => {
                expectToBe(stripNonCode('?s <http://example.org/p> ?o'), '?s   ?o');
            });

            it('... should replace double- and single-quoted string literals with a space', () => {
                expectToBe(stripNonCode(`?s rdfs:label "a:b" , 'c:d'`), '?s rdfs:label   ,  ');
            });

            it('... should treat escaped quotes as part of the string literal', () => {
                expectToBe(stripNonCode(String.raw`"say \"x:y\"" ex:p`), '  ex:p');
            });

            it('... should replace comments up to the end of the line with a space', () => {
                expectToBe(stripNonCode('?s ?p ?o # select dc:title\n?x'), '?s ?p ?o  \n?x');
            });

            it('... should not start a comment with a `#` within an IRI or a string', () => {
                expectToBe(stripNonCode('<http://example.org/onto#x> "#tag" ex:p'), '    ex:p');
            });

            it('... should keep code without IRIs, strings and comments', () => {
                expectToBe(stripNonCode('SELECT ?s WHERE { ?s a awg:Sketch }'), 'SELECT ?s WHERE { ?s a awg:Sketch }');
            });
        });

        describe('#stripCommentsAndLiterals()', () => {
            it('... should have a method `stripCommentsAndLiterals`', () => {
                expect(stripCommentsAndLiterals).toBeDefined();
            });

            it('... should keep IRIs', () => {
                expectToBe(stripCommentsAndLiterals('?s <http://example.org/p> ?o'), '?s <http://example.org/p> ?o');
            });

            it('... should replace double- and single-quoted string literals with a space', () => {
                expectToBe(stripCommentsAndLiterals(`?s rdfs:label "a:b" , 'c:d'`), '?s rdfs:label   ,  ');
            });

            it('... should replace comments up to the end of the line with a space', () => {
                expectToBe(stripCommentsAndLiterals('# PREFIX ex: <http://example.org/>\nSELECT ?s'), ' \nSELECT ?s');
            });

            it('... should not start a comment with a `#` within an IRI or a string', () => {
                expectToBe(
                    stripCommentsAndLiterals('<http://example.org/onto#x> "#tag" ex:p'),
                    '<http://example.org/onto#x>   ex:p'
                );
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

            it('... should hold `update` for INSERT and DELETE', () => {
                expectToBe(getQueryType('INSERT DATA { <http://a> <http://b> <http://c> }'), 'update');
                expectToBe(getQueryType('DELETE WHERE { ?s ?p ?o }'), 'update');
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

            it('... should hold null if no query form keyword is found', () => {
                expectToBe(getQueryType('WHERE { ?s ?p ?o }'), null);
                expectToBe(getQueryType(''), null);
            });
        });
    });
});
