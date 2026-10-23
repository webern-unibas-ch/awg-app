import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import {
    addMissingPrefixes,
    compactIri,
    DEFAULT_PREFIXES,
    extractSparqlPrefixes,
    findUsedPrefixes,
    mergePrefixes,
    PREFIX_UTILS,
} from './prefix.utils';

const AWG = 'https://edition.anton-webern.ch/webern-onto#';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDFS = 'http://www.w3.org/2000/01/rdf-schema#';

describe('PrefixUtils (DONE)', () => {
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

    describe('PREFIX_UTILS', () => {
        it('... should reference all prefix utils methods', () => {
            expectToEqual(PREFIX_UTILS, {
                addMissingPrefixes,
                compactIri,
                extractSparqlPrefixes,
                findUsedPrefixes,
                mergePrefixes,
            });
        });
    });

    describe('METHODS', () => {
        describe('#mergePrefixes()', () => {
            it('... should have a method `mergePrefixes`', () => {
                expect(mergePrefixes).toBeDefined();
            });

            it('... should merge the given prefix maps with later maps overriding earlier ones', () => {
                const mergedPrefixes = mergePrefixes(
                    { a: 'http://a/', b: 'http://b/' },
                    { b: 'http://other-b/', c: 'http://c/' }
                );

                expectToEqual(mergedPrefixes, {
                    a: 'http://a/',
                    b: 'http://other-b/',
                    c: 'http://c/',
                });
            });

            it('... should ignore null and undefined maps', () => {
                const mergedPrefixes = mergePrefixes(null, { a: 'http://a/' }, undefined);

                expectToEqual(mergedPrefixes, { a: 'http://a/' });
            });

            it('... should return a frozen map', () => {
                expectToBe(Object.isFrozen(mergePrefixes({ a: 'http://a/' })), true);
            });
        });

        describe('#compactIri()', () => {
            it('... should have a method `compactIri`', () => {
                expect(compactIri).toBeDefined();
            });

            describe('... should compact an IRI with a matching namespace', () => {
                it.each([
                    { desc: 'awg:Sketch', iri: `${AWG}Sketch`, expected: 'awg:Sketch' },
                    { desc: 'rdfs:label', iri: `${RDFS}label`, expected: 'rdfs:label' },
                ])('... $desc', ({ iri, expected }) => {
                    const compactedIri = compactIri(iri, DEFAULT_PREFIXES);

                    expectToBe(compactedIri, expected);
                });
            });

            it('... should keep an IRI without a matching namespace', () => {
                const compactedIri = compactIri('http://example.org/x', DEFAULT_PREFIXES);

                expectToBe(compactedIri, 'http://example.org/x');
            });

            it('... should only match namespaces at the start of the IRI', () => {
                const compactedIri = compactIri(`http://example.org/?ref=${AWG}x`, DEFAULT_PREFIXES);

                expectToBe(compactedIri, `http://example.org/?ref=${AWG}x`);
            });

            it('... should use the longest matching namespace', () => {
                const prefixes = { ex: 'http://example.org/', exs: 'http://example.org/sub/' };

                const compactedSubIri = compactIri('http://example.org/sub/x', prefixes);
                const compactedIri = compactIri('http://example.org/x', prefixes);

                expectToBe(compactedSubIri, 'exs:x');
                expectToBe(compactedIri, 'ex:x');
            });

            it('... should ignore empty namespaces', () => {
                const compactedIri = compactIri('http://example.org/x', { empty: '' });

                expectToBe(compactedIri, 'http://example.org/x');
            });
        });

        describe('#extractSparqlPrefixes()', () => {
            it('... should have a method `extractSparqlPrefixes`', () => {
                expect(extractSparqlPrefixes).toBeDefined();
            });

            it('... should extract the declared prefixes (case-insensitive keyword)', () => {
                const query = `PREFIX awg: <${AWG}>\nprefix rdfs:<${RDFS}>\nSELECT * WHERE { ?s ?p ?o }`;

                const extractedSparqlPrefixes = extractSparqlPrefixes(query);

                expectToEqual(extractedSparqlPrefixes, { awg: AWG, rdfs: RDFS });
            });

            it('... should extract the empty prefix', () => {
                const extractedSparqlPrefixes = extractSparqlPrefixes('PREFIX : <http://example.org/>');

                expectToEqual(extractedSparqlPrefixes, { '': 'http://example.org/' });
            });

            it('... should return an empty map without declarations', () => {
                const extractedSparqlPrefixes = extractSparqlPrefixes('SELECT * WHERE { ?s ?p ?o }');

                expectToEqual(extractedSparqlPrefixes, {});
            });

            it('... should ignore commented-out declarations', () => {
                const query = `# PREFIX ex: <http://example.org/>\nPREFIX awg: <${AWG}>\nSELECT * WHERE { ?s ?p ?o }`;

                const extractedSparqlPrefixes = extractSparqlPrefixes(query);

                expectToEqual(extractedSparqlPrefixes, { awg: AWG });
            });

            it('... should ignore declarations within string literals', () => {
                const query = `SELECT * WHERE { ?s ?p "PREFIX ex: <http://example.org/>" , 'PREFIX ex2: <http://example.org/2>' }`;

                const extractedSparqlPrefixes = extractSparqlPrefixes(query);

                expectToEqual(extractedSparqlPrefixes, {});
            });

            it('... should extract declarations with a `#` in the namespace IRI', () => {
                const extractedSparqlPrefixes = extractSparqlPrefixes(`PREFIX awg: <${AWG}>`);

                expectToEqual(extractedSparqlPrefixes, { awg: AWG });
            });
        });

        describe('#findUsedPrefixes()', () => {
            it('... should have a method `findUsedPrefixes`', () => {
                expect(findUsedPrefixes).toBeDefined();
            });

            it('... should find the prefixes used in template and where clause', () => {
                const query = 'CONSTRUCT { ?s dc:title ?t } WHERE { ?s a awg:Sketch ; rdfs:label ?t . }';

                const foundUsedPrefixes = findUsedPrefixes(query);

                expectToEqual(foundUsedPrefixes, ['dc', 'awg', 'rdfs']);
            });

            it('... should find each prefix only once', () => {
                const foundUsedPrefixes = findUsedPrefixes('SELECT * WHERE { ?s awg:a ?o . ?o awg:b ?x }');

                expectToEqual(foundUsedPrefixes, ['awg']);
            });

            it('... should ignore prefix declarations', () => {
                const query = `PREFIX owl: <http://www.w3.org/2002/07/owl#>\nSELECT * WHERE { ?s rdf:type ?o }`;

                const foundUsedPrefixes = findUsedPrefixes(query);

                expectToEqual(foundUsedPrefixes, ['rdf']);
            });

            it('... should ignore IRIs, string literals and comments', () => {
                const query = [
                    'SELECT * WHERE {',
                    '  ?s <http://example.org/p> "foo:bar" . # dc:comment',
                    "  ?s rdfs:label 'x:y' .",
                    '}',
                ].join('\n');

                const foundUsedPrefixes = findUsedPrefixes(query);

                expectToEqual(foundUsedPrefixes, ['rdfs']);
            });

            it('... should ignore variables', () => {
                const foundUsedPrefixes = findUsedPrefixes('SELECT ?x WHERE { ?x ?p $o }');

                expectToEqual(foundUsedPrefixes, []);
            });
        });

        describe('#addMissingPrefixes()', () => {
            it('... should have a method `addMissingPrefixes`', () => {
                expect(addMissingPrefixes).toBeDefined();
            });

            it('... should prepend the declaration of a used prefix that is only declared in a comment', () => {
                const query = `# PREFIX awg: <http://example.org/old#>\nSELECT * WHERE { ?s a awg:Sketch }`;

                const result = addMissingPrefixes(query, DEFAULT_PREFIXES);

                expectToBe(result.query, `PREFIX awg: <${AWG}>\n${query}`);
                expectToEqual(result.unknownPrefixes, []);
            });

            it('... should prepend the declarations of used, but undeclared known prefixes', () => {
                const query = `PREFIX awg: <${AWG}>\nSELECT * WHERE { ?s rdf:type awg:Sketch ; rdfs:label ?l }`;

                const result = addMissingPrefixes(query, DEFAULT_PREFIXES);

                expectToBe(result.query, `PREFIX rdf: <${RDF}>\nPREFIX rdfs: <${RDFS}>\n${query}`);
                expectToEqual(result.unknownPrefixes, []);
            });

            it('... should keep a query with all prefixes declared', () => {
                const query = `PREFIX awg: <${AWG}>\nSELECT * WHERE { ?s a awg:Sketch }`;

                const prefixed = addMissingPrefixes(query, DEFAULT_PREFIXES);

                expectToBe(prefixed.query, query);
            });

            it('... should report used prefixes that are unknown', () => {
                const query = 'SELECT * WHERE { ?s foo:bar ?o ; rdf:type ?t }';

                const result = addMissingPrefixes(query, DEFAULT_PREFIXES);

                expectToBe(result.query, `PREFIX rdf: <${RDF}>\n${query}`);
                expectToEqual(result.unknownPrefixes, ['foo']);
            });

            it('... should prefer the given prefixes over nothing (e.g. from the turtle data)', () => {
                const query = 'SELECT * WHERE { ?s ex:p ?o }';

                const prefixed = addMissingPrefixes(query, { ex: 'http://example.org/' });

                expectToBe(prefixed.query, `PREFIX ex: <http://example.org/>\n${query}`);
            });
        });
    });
});
