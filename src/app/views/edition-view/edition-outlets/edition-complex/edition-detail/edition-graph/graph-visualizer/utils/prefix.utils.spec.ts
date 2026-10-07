import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import {
    addMissingPrefixes,
    compactIri,
    DEFAULT_PREFIXES,
    expandQName,
    extractSparqlPrefixes,
    findUsedPrefixes,
    getQueryType,
    mergePrefixes,
} from './prefix.utils';

const AWG = 'https://edition.anton-webern.ch/webern-onto#';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDFS = 'http://www.w3.org/2000/01/rdf-schema#';

describe('prefix.utils', () => {
    describe('DEFAULT_PREFIXES', () => {
        it('... should hold the awg, rdf and rdfs namespaces', () => {
            expectToBe(DEFAULT_PREFIXES['awg'], AWG);
            expectToBe(DEFAULT_PREFIXES['rdf'], RDF);
            expectToBe(DEFAULT_PREFIXES['rdfs'], RDFS);
        });

        it('... should be frozen', () => {
            expectToBe(Object.isFrozen(DEFAULT_PREFIXES), true);
        });
    });

    describe('#mergePrefixes()', () => {
        it('... should have a method `mergePrefixes`', () => {
            expect(mergePrefixes).toBeDefined();
        });

        it('... should merge the given prefix maps with later maps overriding earlier ones', () => {
            expectToEqual(mergePrefixes({ a: 'http://a/', b: 'http://b/' }, { b: 'http://other-b/', c: 'http://c/' }), {
                a: 'http://a/',
                b: 'http://other-b/',
                c: 'http://c/',
            });
        });

        it('... should ignore null and undefined maps', () => {
            expectToEqual(mergePrefixes(null, { a: 'http://a/' }, undefined), { a: 'http://a/' });
        });

        it('... should hold a frozen map', () => {
            expectToBe(Object.isFrozen(mergePrefixes({ a: 'http://a/' })), true);
        });
    });

    describe('#compactIri()', () => {
        it('... should have a method `compactIri`', () => {
            expect(compactIri).toBeDefined();
        });

        it('... should compact an IRI with a matching namespace', () => {
            expectToBe(compactIri(`${AWG}Sketch`, DEFAULT_PREFIXES), 'awg:Sketch');
            expectToBe(compactIri(`${RDFS}label`, DEFAULT_PREFIXES), 'rdfs:label');
        });

        it('... should keep an IRI without a matching namespace', () => {
            expectToBe(compactIri('http://example.org/x', DEFAULT_PREFIXES), 'http://example.org/x');
        });

        it('... should only match namespaces at the start of the IRI', () => {
            expectToBe(
                compactIri(`http://example.org/?ref=${AWG}x`, DEFAULT_PREFIXES),
                `http://example.org/?ref=${AWG}x`
            );
        });

        it('... should use the longest matching namespace', () => {
            const prefixes = { ex: 'http://example.org/', exs: 'http://example.org/sub/' };

            expectToBe(compactIri('http://example.org/sub/x', prefixes), 'exs:x');
            expectToBe(compactIri('http://example.org/x', prefixes), 'ex:x');
        });

        it('... should ignore empty namespaces', () => {
            expectToBe(compactIri('http://example.org/x', { empty: '' }), 'http://example.org/x');
        });
    });

    describe('#expandQName()', () => {
        it('... should have a method `expandQName`', () => {
            expect(expandQName).toBeDefined();
        });

        it('... should expand a prefixed name with a known prefix', () => {
            expectToBe(expandQName('rdfs:label', DEFAULT_PREFIXES), `${RDFS}label`);
            expectToBe(expandQName('rdf:type', DEFAULT_PREFIXES), `${RDF}type`);
        });

        it('... should keep a prefixed name with an unknown prefix', () => {
            expectToBe(expandQName('foo:bar', DEFAULT_PREFIXES), 'foo:bar');
        });

        it('... should keep full IRIs and names without colon', () => {
            expectToBe(expandQName('http://example.org/x', DEFAULT_PREFIXES), 'http://example.org/x');
            expectToBe(expandQName('label', DEFAULT_PREFIXES), 'label');
        });

        it('... should not match inherited object properties as prefixes', () => {
            expectToBe(expandQName('constructor:x', DEFAULT_PREFIXES), 'constructor:x');
        });
    });

    describe('#extractSparqlPrefixes()', () => {
        it('... should have a method `extractSparqlPrefixes`', () => {
            expect(extractSparqlPrefixes).toBeDefined();
        });

        it('... should extract the declared prefixes (case-insensitive keyword)', () => {
            const query = `PREFIX awg: <${AWG}>\nprefix rdfs:<${RDFS}>\nSELECT * WHERE { ?s ?p ?o }`;

            expectToEqual(extractSparqlPrefixes(query), { awg: AWG, rdfs: RDFS });
        });

        it('... should extract the empty prefix', () => {
            expectToEqual(extractSparqlPrefixes('PREFIX : <http://example.org/>'), { '': 'http://example.org/' });
        });

        it('... should hold an empty map without declarations', () => {
            expectToEqual(extractSparqlPrefixes('SELECT * WHERE { ?s ?p ?o }'), {});
        });
    });

    describe('#findUsedPrefixes()', () => {
        it('... should have a method `findUsedPrefixes`', () => {
            expect(findUsedPrefixes).toBeDefined();
        });

        it('... should find the prefixes used in template and where clause', () => {
            const query = 'CONSTRUCT { ?s dc:title ?t } WHERE { ?s a awg:Sketch ; rdfs:label ?t . }';

            expectToEqual(findUsedPrefixes(query), ['dc', 'awg', 'rdfs']);
        });

        it('... should find each prefix only once', () => {
            expectToEqual(findUsedPrefixes('SELECT * WHERE { ?s awg:a ?o . ?o awg:b ?x }'), ['awg']);
        });

        it('... should ignore prefix declarations', () => {
            const query = `PREFIX owl: <http://www.w3.org/2002/07/owl#>\nSELECT * WHERE { ?s rdf:type ?o }`;

            expectToEqual(findUsedPrefixes(query), ['rdf']);
        });

        it('... should ignore IRIs, string literals and comments', () => {
            const query = [
                'SELECT * WHERE {',
                '  ?s <http://example.org/p> "foo:bar" . # dc:comment',
                "  ?s rdfs:label 'x:y' .",
                '}',
            ].join('\n');

            expectToEqual(findUsedPrefixes(query), ['rdfs']);
        });

        it('... should ignore variables', () => {
            expectToEqual(findUsedPrefixes('SELECT ?x WHERE { ?x ?p $o }'), []);
        });
    });

    describe('#addMissingPrefixes()', () => {
        it('... should have a method `addMissingPrefixes`', () => {
            expect(addMissingPrefixes).toBeDefined();
        });

        it('... should prepend the declarations of used, but undeclared known prefixes', () => {
            const query = `PREFIX awg: <${AWG}>\nSELECT * WHERE { ?s rdf:type awg:Sketch ; rdfs:label ?l }`;

            const result = addMissingPrefixes(query, DEFAULT_PREFIXES);

            expectToBe(result.query, `PREFIX rdf: <${RDF}>\nPREFIX rdfs: <${RDFS}>\n${query}`);
            expectToEqual(result.unknownPrefixes, []);
        });

        it('... should keep a query with all prefixes declared', () => {
            const query = `PREFIX awg: <${AWG}>\nSELECT * WHERE { ?s a awg:Sketch }`;

            expectToBe(addMissingPrefixes(query, DEFAULT_PREFIXES).query, query);
        });

        it('... should report used prefixes that are unknown', () => {
            const query = 'SELECT * WHERE { ?s foo:bar ?o ; rdf:type ?t }';

            const result = addMissingPrefixes(query, DEFAULT_PREFIXES);

            expectToBe(result.query, `PREFIX rdf: <${RDF}>\n${query}`);
            expectToEqual(result.unknownPrefixes, ['foo']);
        });

        it('... should prefer the given prefixes over nothing (e.g. from the turtle data)', () => {
            const query = 'SELECT * WHERE { ?s ex:p ?o }';

            expectToBe(
                addMissingPrefixes(query, { ex: 'http://example.org/' }).query,
                `PREFIX ex: <http://example.org/>\n${query}`
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
