import { TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { Literal, Quad, Term } from '@rdfjs/types';
import { DataFactory, Parser } from 'n3';

import { expectToBe, expectToEqual } from '@testing/expect-helper';
import { createRealRdfstore, RDFSTORE_INTEGRATION_TIMEOUT_MS, setGlobalRdfstore } from '@testing/rdfstore-helper';

import { RdfStoreGlobal } from './rdf-store.model';
import { RdfStoreService } from './rdf-store.service';

const { literal, namedNode } = DataFactory;

const EX = 'http://example.org/';
const XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';

const PREFIXES = [
    `PREFIX ex: <${EX}>`,
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
].join('\n');

/**
 * Constant: TURTLE.
 *
 * It keeps a small turtle dataset with all term types the adapter has to convert:
 * named nodes, a blank node, a language literal, an integer literal and a plain literal.
 */
const TURTLE = `
@prefix ex: <${EX}> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

ex:a a ex:Class ;
    rdfs:label "A"@de ;
    ex:count 5 ;
    ex:knows _:b .

_:b a ex:Class ;
    ex:name "B" .

ex:c a ex:Other .
`;

/**
 * Helper function: termKey.
 *
 * It creates a comparable key of a term; blank nodes are neutralized,
 * because the n3 parser and rdfstore assign different blank node ids.
 */
const termKey = (term: Term): string =>
    term.termType === 'BlankNode' ? '_:' : `${term.termType}|${JSON.stringify(term)}`;

/**
 * Helper function: quadKeys.
 *
 * It creates the sorted comparable keys of the given quads.
 */
const quadKeys = (quads: readonly Quad[]): string[] =>
    quads.map(quad => [quad.subject, quad.predicate, quad.object].map(termKey).join(' ')).sort();

describe(
    'RdfStoreService (integration: contract with the rdfstore engine) (DONE)',
    { timeout: RDFSTORE_INTEGRATION_TIMEOUT_MS },
    () => {
        let service: RdfStoreService;

        let realRdfstore: RdfStoreGlobal;

        beforeAll(() => {
            realRdfstore = createRealRdfstore();
        });

        beforeEach(() => {
            setGlobalRdfstore(realRdfstore);

            TestBed.configureTestingModule({});
            service = TestBed.inject(RdfStoreService);
        });

        afterEach(() => {
            setGlobalRdfstore(undefined);
        });

        describe('#construct()', () => {
            it('... should construct the same quads as parsed by n3 from the turtle data', async () => {
                const expectedQuads = new Parser().parse(TURTLE);

                const quads = await service.construct(TURTLE, 'CONSTRUCT WHERE { ?s ?p ?o }');

                expectToEqual(quadKeys(quads), quadKeys(expectedQuads));
            });

            it('... should keep the identity of a blank node across quads', async () => {
                const query = `${PREFIXES}\nCONSTRUCT WHERE { ex:a ex:knows ?b . ?b ex:name ?n }`;

                const quads = await service.construct(TURTLE, query);

                const knowsQuad = quads.find(quad => quad.predicate.value === `${EX}knows`);
                const nameQuad = quads.find(quad => quad.predicate.value === `${EX}name`);
                expectToBe(knowsQuad?.object.termType, 'BlankNode');
                expectToBe(knowsQuad?.object.equals(nameQuad?.subject ?? null), true);
            });
        });

        describe('#select()', () => {
            it('... should hold the variables and omit unbound variables (OPTIONAL)', async () => {
                const query = `${PREFIXES}\nSELECT ?s ?label WHERE { ?s a ex:Class OPTIONAL { ?s rdfs:label ?label } }`;

                const { variables, bindings } = await service.select(TURTLE, query);

                expectToEqual(variables, ['s', 'label']);
                expectToBe(bindings.length, 2);

                const namedBinding = bindings.find(binding => binding['s'].termType === 'NamedNode');
                const blankBinding = bindings.find(binding => binding['s'].termType === 'BlankNode');
                expectToBe(namedBinding?.['s'].equals(namedNode(`${EX}a`)), true);
                expectToBe(namedBinding?.['label'].equals(literal('A', 'de')), true);
                expectToEqual(Object.keys(blankBinding ?? {}), ['s']);
            });

            it('... should convert typed and plain literals', async () => {
                const query = `${PREFIXES}\nSELECT ?count ?name WHERE { ex:a ex:count ?count ; ex:knows ?b . ?b ex:name ?name }`;

                const { bindings } = await service.select(TURTLE, query);

                expectToBe(bindings[0]['count'].equals(literal('5', namedNode(XSD_INTEGER))), true);
                expectToBe(bindings[0]['name'].equals(literal('B')), true);
            });

            it('... should count grouped results as integer literals (COUNT with GROUP BY)', async () => {
                const query = `${PREFIXES}\nSELECT ?class (COUNT(?s) AS ?count) WHERE { ?s a ?class } GROUP BY ?class`;

                const { variables, bindings } = await service.select(TURTLE, query);

                expectToEqual(variables, ['class', 'count']);
                const counts = Object.fromEntries(
                    bindings.map(binding => [binding['class'].value, binding['count'] as Literal])
                );
                expectToBe(counts[`${EX}Class`].value, '2');
                expectToBe(counts[`${EX}Other`].value, '1');
                expectToBe(counts[`${EX}Class`].datatype.value, XSD_INTEGER);
            });

            it('... should reject COUNT without GROUP BY (not supported by rdfstore)', async () => {
                await expect(service.select(TURTLE, 'SELECT (COUNT(?s) AS ?n) WHERE { ?s ?p ?o }')).rejects.toThrow(
                    '[RdfStoreService] Unknown filter expression type'
                );
            });
        });
    }
);
