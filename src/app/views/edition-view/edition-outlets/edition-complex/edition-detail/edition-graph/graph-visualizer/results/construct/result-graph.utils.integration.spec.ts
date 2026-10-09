import type { Quad } from '@rdfjs/types';
import { Parser } from 'n3';
import { beforeAll, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { GraphList } from '@awg-views/edition-view/models/graph.model';

import { RdfTerm } from '@awg-graph/graph-visualizer/models/rdf.model';
import { ResultGraph } from '@awg-graph/graph-visualizer/models/result-graph.model';
import { DEFAULT_PREFIXES } from '@awg-graph/graph-visualizer/utils/prefix.utils';
import { RDF_TYPE, RDFS_LABEL, TERM_UTILS } from '@awg-graph/graph-visualizer/utils/term.utils';

import { toResultGraph } from './result-graph.utils';

import graphDataOp25 from 'assets/data/edition/series/1/section/5/op25/graph.json';

describe('ResultGraphUtils (integration with the op. 25 graph data) (DONE)', () => {
    let quads: Quad[];
    let graph: ResultGraph;

    beforeAll(() => {
        quads = new Parser().parse((graphDataOp25 as GraphList).graph[0].rdfData.triples) as Quad[];
        graph = toResultGraph(quads, DEFAULT_PREFIXES);
    });

    it('... should hold one edge per triple', () => {
        expect(quads.length).toBeGreaterThan(0);
        expectToBe(graph.edges.length, quads.length);
        expectToBe(graph.tripleCount, quads.length);
    });

    it('... should hold one node per distinct subject and object', () => {
        const termKeys = new Set(
            quads.flatMap(quad => [quad.subject, quad.object].map(term => TERM_UTILS.termKey(term as RdfTerm)))
        );

        expectToBe(graph.nodes.length, termKeys.size);
        expectToBe(new Set(graph.nodes.map(node => node.id)).size, graph.nodes.length);
    });

    it('... should connect only existing nodes', () => {
        const nodeIds = new Set(graph.nodes.map(node => node.id));

        graph.edges.forEach(edge => {
            expectToBe(nodeIds.has(edge.source), true);
            expectToBe(nodeIds.has(edge.target), true);
        });
    });

    it('... should mark all objects of rdf:type as classes', () => {
        const nodeKinds = new Map(graph.nodes.map(node => [node.id, node.kind]));

        quads
            .filter(quad => quad.predicate.equals(RDF_TYPE))
            .forEach(quad => {
                expectToBe(nodeKinds.get(TERM_UTILS.termKey(quad.object as RdfTerm)), 'class');
            });
    });

    it('... should label nodes with their rdfs:label', () => {
        const nodeLabels = new Map(graph.nodes.map(node => [node.id, node.label]));
        const labelQuads = quads.filter(quad => quad.predicate.equals(RDFS_LABEL));

        expect(labelQuads.length).toBeGreaterThan(0);
        labelQuads.forEach(quad => {
            expect(nodeLabels.get(TERM_UTILS.termKey(quad.subject as RdfTerm))).toBeDefined();
        });
    });

    it('... should compact the IRIs of the awg namespace', () => {
        graph.nodes
            .filter(node => node.id.startsWith(DEFAULT_PREFIXES['awg']))
            .forEach(node => {
                expect(node.shortName).toMatch(/^awg:/);
            });
    });
});
