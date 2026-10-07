import { TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { Literal } from '@rdfjs/types';
import { Parser } from 'n3';

import { expectToBe, expectToEqual } from '@testing/expect-helper';
import { createRealRdfstore, setGlobalRdfstore } from '@testing/rdfstore-helper';

import { GraphList, GraphSparqlQuery } from '@awg-views/edition-view/models/graph.model';

import { RdfStoreGlobal } from './rdf-store.model';
import { RdfStoreService } from './rdf-store.service';

import graphDataOp25 from 'assets/data/edition/series/1/section/5/op25/graph.json';

const XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';

describe('RdfStoreService (integration with rdfstore and the op. 25 graph data)', () => {
    let service: RdfStoreService;

    let realRdfstore: RdfStoreGlobal;
    let turtle: string;
    let queryList: GraphSparqlQuery[];

    beforeAll(() => {
        realRdfstore = createRealRdfstore();

        const graph = (graphDataOp25 as GraphList).graph[0];
        turtle = graph.rdfData.triples;
        queryList = graph.rdfData.queryList;
    });

    beforeEach(() => {
        setGlobalRdfstore(realRdfstore);

        TestBed.configureTestingModule({});
        service = TestBed.inject(RdfStoreService);
    });

    afterEach(() => {
        setGlobalRdfstore(undefined);
    });

    it('... should have loaded the turtle data and the query list of op. 25', () => {
        expect(turtle.length).toBeGreaterThan(0);
        expect(queryList.length).toBeGreaterThan(0);
    });

    describe('#construct()', () => {
        it('... should construct all triples of the turtle data', async () => {
            const expectedQuadCount = new Parser().parse(turtle).length;

            const quads = await service.construct(turtle, 'CONSTRUCT WHERE { ?s ?p ?o }');

            expectToBe(quads.length, expectedQuadCount);
        });

        it('... should execute all construct queries of the query list', async () => {
            for (const query of queryList.filter(q => q.queryType === 'construct')) {
                const quads = await service.construct(turtle, query.queryString);

                expect(quads.length, query.queryLabel).toBeGreaterThan(0);
                quads.forEach(quad => {
                    expect(['NamedNode', 'BlankNode']).toContain(quad.subject.termType);
                    expectToBe(quad.predicate.termType, 'NamedNode');
                });
            }
        });
    });

    describe('#select()', () => {
        it('... should execute all select queries of the query list', async () => {
            for (const query of queryList.filter(q => q.queryType === 'select')) {
                const { variables, bindings } = await service.select(turtle, query.queryString);

                expect(variables.length, query.queryLabel).toBeGreaterThan(0);
                bindings.forEach(binding => {
                    Object.entries(binding).forEach(([variable, term]) => {
                        expect(variables).toContain(variable);
                        expect(['NamedNode', 'BlankNode', 'Literal']).toContain(term.termType);
                    });
                });
            }
        });

        it('... should count grouped results (COUNT with GROUP BY)', async () => {
            const query = [
                'SELECT ?resource_class (COUNT(?resource_class) AS ?count)',
                'WHERE { ?resource a ?resource_class . }',
                'GROUP BY ?resource_class',
                'ORDER BY ?count',
            ].join('\n');

            const { variables, bindings } = await service.select(turtle, query);

            expectToEqual(variables, ['resource_class', 'count']);
            expect(bindings.length).toBeGreaterThan(0);
            bindings.forEach(binding => {
                expectToBe(binding['resource_class'].termType, 'NamedNode');

                const count = binding['count'] as Literal;
                expectToBe(count.termType, 'Literal');
                expectToBe(count.datatype.value, XSD_INTEGER);
                expect(Number(count.value)).toBeGreaterThan(0);
            });
        });

        it('... should reject COUNT without GROUP BY (not supported by rdfstore)', async () => {
            const query = 'SELECT (COUNT(?s) AS ?n) WHERE { ?s ?p ?o }';

            await expect(service.select(turtle, query)).rejects.toThrow(
                '[RdfStoreService] Unknown filter expression type'
            );
        });
    });
});
