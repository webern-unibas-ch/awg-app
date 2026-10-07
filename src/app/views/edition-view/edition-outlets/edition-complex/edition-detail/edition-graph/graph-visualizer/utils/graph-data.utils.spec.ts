import type { Quad, Quad_Object, Quad_Predicate, Quad_Subject } from '@rdfjs/types';
import { DataFactory } from 'n3';
import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { GraphData } from '../models/graph-data.model';
import { extractLabels, GRAPH_DATA_UTILS, limitGraphData, toGraphData } from './graph-data.utils';
import { DEFAULT_PREFIXES } from './prefix.utils';
import { RDF_TYPE, RDFS_LABEL } from './term.utils';

const { blankNode, literal, namedNode, quad } = DataFactory;

const AWG = DEFAULT_PREFIXES['awg'];
const XSD = 'http://www.w3.org/2001/XMLSchema#';

const awg = (localName: string) => namedNode(`${AWG}${localName}`);
const q = (subject: Quad_Subject, predicate: Quad_Predicate, object: Quad_Object): Quad =>
    quad(subject, predicate, object) as Quad;

describe('graph-data.utils', () => {
    describe('GRAPH_DATA_UTILS', () => {
        it('... should reference all graph data utils methods', () => {
            expectToEqual(GRAPH_DATA_UTILS, { extractLabels, limitGraphData, toGraphData });
        });
    });

    describe('#extractLabels()', () => {
        it('... should have a method `extractLabels`', () => {
            expect(extractLabels).toBeDefined();
        });

        it('... should hold the rdfs:label literals of the subjects by term key', () => {
            const labels = extractLabels([
                q(awg('Sk1'), RDFS_LABEL, literal('Skizze 1')),
                q(blankNode('b0'), RDFS_LABEL, literal('Leer', 'de')),
                q(awg('Sk1'), awg('precedes'), awg('Sk2')),
            ]);

            expectToEqual(
                labels,
                new Map([
                    [`${AWG}Sk1`, 'Skizze 1'],
                    ['_:b0', 'Leer'],
                ])
            );
        });

        it('... should ignore rdfs:label statements with non-literal objects', () => {
            expectToBe(extractLabels([q(awg('Sk1'), RDFS_LABEL, awg('Label'))]).size, 0);
        });

        it('... should keep the last label of a subject', () => {
            const labels = extractLabels([
                q(awg('Sk1'), RDFS_LABEL, literal('first')),
                q(awg('Sk1'), RDFS_LABEL, literal('last')),
            ]);

            expectToBe(labels.get(`${AWG}Sk1`), 'last');
        });
    });

    describe('#toGraphData()', () => {
        it('... should have a method `toGraphData`', () => {
            expect(toGraphData).toBeDefined();
        });

        it('... should hold one node per distinct subject and object and one edge per quad', () => {
            const graph = toGraphData(
                [q(awg('Sk1'), awg('precedes'), awg('Sk2')), q(awg('Sk2'), awg('precedes'), awg('Sk3'))],
                DEFAULT_PREFIXES
            );

            expectToEqual(
                graph.nodes.map(node => node.id),
                [`${AWG}Sk1`, `${AWG}Sk2`, `${AWG}Sk3`]
            );
            expectToEqual(graph.edges, [
                { id: 'e0', source: `${AWG}Sk1`, target: `${AWG}Sk2`, label: 'awg:precedes' },
                { id: 'e1', source: `${AWG}Sk2`, target: `${AWG}Sk3`, label: 'awg:precedes' },
            ]);
            expectToBe(graph.tripleCount, 2);
        });

        it('... should hold the short name and the rdfs:label of a node', () => {
            const graph = toGraphData(
                [q(awg('Sk1'), RDFS_LABEL, literal('Skizze 1')), q(awg('Sk1'), awg('precedes'), awg('Sk2'))],
                DEFAULT_PREFIXES
            );
            const sk1 = graph.nodes.find(node => node.id === `${AWG}Sk1`);
            const sk2 = graph.nodes.find(node => node.id === `${AWG}Sk2`);

            expectToEqual(sk1, { id: `${AWG}Sk1`, shortName: 'awg:Sk1', label: 'Skizze 1', kind: 'resource' });
            expectToEqual(sk2, { id: `${AWG}Sk2`, shortName: 'awg:Sk2', label: 'awg:Sk2', kind: 'resource' });
        });

        it('... should label an edge with the rdfs:label of its predicate, if given', () => {
            const graph = toGraphData(
                [q(awg('precedes'), RDFS_LABEL, literal('geht voraus')), q(awg('Sk1'), awg('precedes'), awg('Sk2'))],
                DEFAULT_PREFIXES
            );

            expectToBe(graph.edges[1].label, 'geht voraus');
        });

        it('... should mark the subject of rdf:type as instance and the object as class', () => {
            const graph = toGraphData([q(awg('Sk1'), RDF_TYPE, awg('Sketch'))], DEFAULT_PREFIXES);

            expectToEqual(
                graph.nodes.map(node => node.kind),
                ['instance', 'class']
            );
            expectToBe(graph.edges[0].label, 'rdf:type');
        });

        it('... should hold blank nodes and literals with their kind and formatted short name', () => {
            const graph = toGraphData(
                [
                    q(blankNode('b0'), awg('page'), literal('3.14159', namedNode(`${XSD}decimal`))),
                    q(blankNode('b0'), RDF_TYPE, awg('Page')),
                ],
                DEFAULT_PREFIXES
            );

            expectToEqual(
                graph.nodes.map(node => [node.id, node.shortName, node.kind]),
                [
                    ['_:b0', '_:b0', 'blank'],
                    [`"3.14159"^^<${XSD}decimal>`, '3.14', 'literal'],
                    [`${AWG}Page`, 'awg:Page', 'class'],
                ]
            );
        });

        it('... should give the class kind precedence over the instance kind', () => {
            const graph = toGraphData(
                [q(awg('Sketch'), RDF_TYPE, awg('Class')), q(awg('Sk1'), RDF_TYPE, awg('Sketch'))],
                DEFAULT_PREFIXES
            );

            expectToBe(graph.nodes.find(node => node.id === `${AWG}Sketch`)?.kind, 'class');
        });

        it('... should keep literals with the same value, but different datatypes apart', () => {
            const graph = toGraphData(
                [q(awg('a'), awg('p'), literal('5')), q(awg('a'), awg('q'), literal('5', namedNode(`${XSD}integer`)))],
                DEFAULT_PREFIXES
            );

            expectToBe(graph.nodes.length, 3);
        });

        it('... should hold an empty graph for no quads', () => {
            expectToEqual(toGraphData([], DEFAULT_PREFIXES), { nodes: [], edges: [], tripleCount: 0 });
        });
    });

    describe('#limitGraphData()', () => {
        const graph: GraphData = toGraphData(
            [
                q(awg('Sk1'), awg('precedes'), awg('Sk2')),
                q(awg('Sk2'), awg('precedes'), awg('Sk3')),
                q(awg('Sk3'), awg('precedes'), awg('Sk4')),
            ],
            DEFAULT_PREFIXES
        );

        it('... should have a method `limitGraphData`', () => {
            expect(limitGraphData).toBeDefined();
        });

        it('... should hold the first edges and only their nodes', () => {
            const limited = limitGraphData(graph, 2);

            expectToEqual(
                limited.edges.map(edge => edge.id),
                ['e0', 'e1']
            );
            expectToEqual(
                limited.nodes.map(node => node.shortName),
                ['awg:Sk1', 'awg:Sk2', 'awg:Sk3']
            );
        });

        it('... should keep the triple count of the original graph', () => {
            expectToBe(limitGraphData(graph, 1).tripleCount, 3);
        });

        it('... should hold the original graph if the limit is not exceeded', () => {
            expectToBe(limitGraphData(graph, 3), graph);
            expectToBe(limitGraphData(graph, 100), graph);
        });

        it('... should hold no edges and nodes for a limit of 0 or less', () => {
            expectToEqual(limitGraphData(graph, 0), { nodes: [], edges: [], tripleCount: 3 });
            expectToEqual(limitGraphData(graph, -1), { nodes: [], edges: [], tripleCount: 3 });
        });
    });
});
