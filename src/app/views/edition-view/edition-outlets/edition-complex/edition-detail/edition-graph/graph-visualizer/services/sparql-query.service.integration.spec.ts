import { TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';
import { createRealRdfstore, RDFSTORE_INTEGRATION_TIMEOUT_MS, setGlobalRdfstore } from '@testing/rdfstore-helper';

import { GraphList, GraphQuery } from '@awg-views/edition-view/models/graph.model';

import { RdfStoreGlobal } from '../rdf-store/rdf-store.model';
import { DEFAULT_PREFIXES } from '../utils/prefix.utils';
import { SparqlQueryService } from './sparql-query.service';

import graphDataOp25 from 'assets/data/edition/series/1/section/5/op25/graph.json';

describe(
    'SparqlQueryService (integration with rdfstore and the op. 25 graph data) (DONE)',
    { timeout: RDFSTORE_INTEGRATION_TIMEOUT_MS },
    () => {
        let service: SparqlQueryService;

        let realRdfstore: RdfStoreGlobal;
        let turtle: string;
        let queryList: GraphQuery[];

        beforeAll(() => {
            realRdfstore = createRealRdfstore();

            const graph = (graphDataOp25 as GraphList).graph[0];
            turtle = graph.rdfData.triples;
            queryList = graph.rdfData.queryList;
        });

        beforeEach(() => {
            setGlobalRdfstore(realRdfstore);

            TestBed.configureTestingModule({});
            service = TestBed.inject(SparqlQueryService);
        });

        afterEach(() => {
            setGlobalRdfstore(undefined);
        });

        describe('#parseTurtle()', () => {
            it('... should parse the turtle data with its prefixes', async () => {
                const { quadCount, prefixes } = await service.parseTurtle(turtle);

                expect(quadCount).toBeGreaterThan(0);
                expectToBe(prefixes['awg'], DEFAULT_PREFIXES['awg']);
            });
        });

        describe('#run()', () => {
            it('... should run all queries of the query list with a result of their type', async () => {
                for (const query of queryList) {
                    const { result } = await service.run(query.queryString, turtle);

                    expect(result.kind, query.queryLabel).toBe(query.queryType);
                    if (result.kind === 'construct') {
                        expect(result.quads.length, query.queryLabel).toBeGreaterThan(0);
                    } else if (result.kind === 'select') {
                        expect(result.bindings.length, query.queryLabel).toBeGreaterThan(0);
                    }
                }
            });

            it('... should run a query without prefix declarations', async () => {
                const query = 'CONSTRUCT WHERE { ?s rdf:type ?o }';

                const run = await service.run(query, turtle);

                expect(run.query).toMatch(/^PREFIX rdf: <http:\/\/www\.w3\.org\/1999\/02\/22-rdf-syntax-ns#>\n/);
                expectToBe(run.result.kind, 'construct');
                expect(run.result.kind === 'construct' && run.result.quads.length).toBeGreaterThan(0);
            });

            it('... should measure the duration of the run', async () => {
                const run = await service.run(queryList[0].queryString, turtle);

                expect(run.durationMs).toBeGreaterThan(0);
            });
        });
    }
);
