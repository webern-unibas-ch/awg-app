import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { GraphQuery } from '@awg-views/edition-view/models/graph.model';

import { emptyResult, findQuery, GRAPH_QUERY_UTILS, initialQuery, isRunnableQueryType } from './graph-query.utils';
import { DEFAULT_PREFIXES } from './prefix.utils';

describe('graph-query.utils', () => {
    let expectedQueryList: GraphQuery[];

    beforeEach(() => {
        expectedQueryList = [
            {
                queryType: 'construct',
                queryLabel: 'Test Query 1',
                queryString:
                    'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test ?has ?success . }',
            },
            {
                queryType: 'construct',
                queryLabel: 'Test Query 2',
                queryString:
                    'PREFIX example: <https://example.com/onto#> \n\n CONSTRUCT WHERE { ?test2 ?has ?success2 . }',
            },
            {
                queryType: 'select',
                queryLabel: 'Test Query 3',
                queryString:
                    'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test3 ?has ?success3 . }',
            },
        ];
    });

    describe('GRAPH_QUERY_UTILS', () => {
        it('... should reference all graph query utils methods', () => {
            expectToEqual(GRAPH_QUERY_UTILS, {
                emptyResult,
                findQuery,
                initialQuery,
                isRunnableQueryType,
            });
        });
    });

    describe('#initialQuery()', () => {
        it('... should have a method `initialQuery`', () => {
            expect(initialQuery).toBeDefined();
        });

        it('... should hold the first query of the given query list with its derived query type', () => {
            const queryList: GraphQuery[] = [{ ...expectedQueryList[2], queryType: null }, expectedQueryList[0]];

            expectToEqual(initialQuery(queryList), expectedQueryList[2]);
        });

        it('... should hold a copy of the first query without changing the original query', () => {
            const queryList: GraphQuery[] = [{ ...expectedQueryList[2], queryType: 'construct' }];

            const query = initialQuery(queryList);

            expect(query).not.toBe(queryList[0]);
            expectToBe(query.queryType, 'select');
            expectToBe(queryList[0].queryType, 'construct');
        });

        it('... should hold an empty query for an empty query list', () => {
            expectToEqual(initialQuery([]), new GraphQuery());
        });
    });

    describe('#findQuery()', () => {
        it('... should have a method `findQuery`', () => {
            expect(findQuery).toBeDefined();
        });

        it('... should hold the query from the query list if queryLabel and queryType are known', () => {
            const changedQuery = { ...expectedQueryList[1], queryString: 'CONSTRUCT {}' };

            expectToBe(findQuery(expectedQueryList, changedQuery), expectedQueryList[1]);
        });

        it('... should hold the first query of the query list if no query is given', () => {
            expectToBe(findQuery(expectedQueryList), expectedQueryList[0]);
        });

        describe('... should hold the given query as is, if', () => {
            it('... only queryLabel is known but not queryType', () => {
                const changedQuery: GraphQuery = {
                    ...expectedQueryList[1],
                    queryType: 'select',
                    queryString: expectedQueryList[2].queryString,
                };

                expectToBe(findQuery(expectedQueryList, changedQuery), changedQuery);
            });

            it('... only queryType is known but not queryLabel', () => {
                const changedQuery: GraphQuery = { ...expectedQueryList[1], queryLabel: 'select all tests' };

                expectToBe(findQuery(expectedQueryList, changedQuery), changedQuery);
            });

            it('... given query is not in queryList', () => {
                const changedQuery: GraphQuery = {
                    queryType: 'select',
                    queryLabel: 'Test Query 4',
                    queryString:
                        'PREFIX example: <https://example.com/onto#> \n\n SELECT * WHERE { ?test4 ?has ?success4 . }',
                };

                expectToBe(findQuery(expectedQueryList, changedQuery), changedQuery);
            });
        });
    });

    describe('#isRunnableQueryType()', () => {
        it('... should have a method `isRunnableQueryType`', () => {
            expect(isRunnableQueryType).toBeDefined();
        });

        it('... should hold true for construct and select queries', () => {
            expectToBe(isRunnableQueryType('construct'), true);
            expectToBe(isRunnableQueryType('select'), true);
        });

        it('... should hold false for other query types', () => {
            expectToBe(isRunnableQueryType('ask'), false);
            expectToBe(isRunnableQueryType('update'), false);
            expectToBe(isRunnableQueryType(null), false);
        });
    });

    describe('#emptyResult()', () => {
        it('... should have a method `emptyResult`', () => {
            expect(emptyResult).toBeDefined();
        });

        it('... should hold an empty construct result for construct queries', () => {
            expectToEqual(emptyResult('construct'), { kind: 'construct', quads: [], prefixes: DEFAULT_PREFIXES });
        });

        it('... should hold an empty select result for select queries', () => {
            expectToEqual(emptyResult('select'), {
                kind: 'select',
                variables: [],
                bindings: [],
                prefixes: DEFAULT_PREFIXES,
            });
        });

        it('... should hold an unsupported result for other query types', () => {
            expectToEqual(emptyResult('ask'), { kind: 'unsupported', queryType: 'ask' });
            expectToEqual(emptyResult(null), { kind: 'unsupported', queryType: null });
        });
    });
});
