import { TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';
import { createRealRdfstore, RDFSTORE_INTEGRATION_TIMEOUT_MS, setGlobalRdfstore } from '@testing/rdfstore-helper';

import { GraphList } from '@awg-views/edition-view/models/graph.model';

import { RdfStoreGlobal } from '../../../rdf-store/rdf-store.model';
import { SparqlQueryService } from '../../../services/sparql-query.service';
import { toTableRows } from './select-table.utils';

import graphDataOp25 from 'assets/data/edition/series/1/section/5/op25/graph.json';

describe(
    'SelectTableUtils (integration with the op. 25 graph data)',
    { timeout: RDFSTORE_INTEGRATION_TIMEOUT_MS },
    () => {
        let service: SparqlQueryService;

        let realRdfstore: RdfStoreGlobal;
        let turtle: string;

        beforeAll(() => {
            realRdfstore = createRealRdfstore();
            turtle = (graphDataOp25 as GraphList).graph[0].rdfData.triples;
        });

        beforeEach(() => {
            setGlobalRdfstore(realRdfstore);

            TestBed.configureTestingModule({});
            service = TestBed.inject(SparqlQueryService);
        });

        afterEach(() => {
            setGlobalRdfstore(undefined);
        });

        it('... should convert the bindings of a select query into table rows', async () => {
            const query = [
                'SELECT ?resource ?class (COUNT(?resource) AS ?count)',
                'WHERE { ?resource a ?class . }',
                'GROUP BY ?resource ?class',
            ].join('\n');

            const { result } = await service.run(query, turtle);
            if (result.kind !== 'select') {
                throw new Error(`Expected a select result, but got: ${result.kind}`);
            }

            const rows = toTableRows(result);

            expectToBe(rows.length, result.bindings.length);
            expect(rows.length).toBeGreaterThan(0);
            rows.forEach(row => {
                Object.keys(row).forEach(variable => expect(result.variables).toContain(variable));

                expectToBe(row['resource'].type, 'uri');
                expect(row['resource'].label).toMatch(/^awg:/);
                expectToBe(row['class'].type, 'uri');
                expectToBe(row['count'].type, 'literal');
                expectToBe(typeof row['count'].label, 'number');
            });
        });
    }
);
