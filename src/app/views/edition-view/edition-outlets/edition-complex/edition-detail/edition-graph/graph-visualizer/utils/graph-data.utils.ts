import type { Quad } from '@rdfjs/types';

import { GraphData, GraphEdge, GraphNode, GraphNodeKind } from '../models/graph-data.model';
import { PrefixMap, RdfTerm } from '../models/rdf.model';
import { RDF_TYPE, RDFS_LABEL, TERM_UTILS } from './term.utils';

/**
 * The GraphNodeDraft interface.
 *
 * It represents a graph node while the graph is built
 * (with flags that determine its kind at the end).
 */
interface GraphNodeDraft {
    readonly term: RdfTerm;
    readonly id: string;
    isClass: boolean;
    isInstance: boolean;
}

/**
 * Private utils method: _toNodeKind.
 *
 * It determines the kind of a graph node from its draft.
 *
 * @param {GraphNodeDraft} draft The given draft.
 * @returns {GraphNodeKind} The kind of the node.
 */
function _toNodeKind(draft: GraphNodeDraft): GraphNodeKind {
    if (draft.isClass) {
        return 'class';
    }
    if (draft.term.termType === 'BlankNode') {
        return 'blank';
    }
    if (draft.term.termType === 'Literal') {
        return 'literal';
    }
    return draft.isInstance ? 'instance' : 'resource';
}

/**
 * Utils method: extractLabels.
 *
 * It extracts the `rdfs:label` of the subjects of the given quads,
 * keyed by the term key of the subject (the last label wins).
 *
 * @param {readonly Quad[]} quads The given quads.
 * @returns {Map<string, string>} The labels by term key.
 */
export function extractLabels(quads: readonly Quad[]): Map<string, string> {
    const labels = new Map<string, string>();

    quads.forEach(quad => {
        if (quad.predicate.equals(RDFS_LABEL) && quad.object.termType === 'Literal') {
            labels.set(TERM_UTILS.termKey(quad.subject as RdfTerm), quad.object.value);
        }
    });

    return labels;
}

/**
 * Utils method: toGraphData.
 *
 * It converts the given quads into the graph view model:
 * - one node per distinct subject or object (by term key),
 * - one edge per quad (from subject to object, labeled by the predicate),
 * - the kind of a node from its term type and `rdf:type` statements
 *   (precedence: class, blank, literal, instance, resource).
 *
 * @param {readonly Quad[]} quads The given quads.
 * @param {PrefixMap} prefixes The prefixes to compact IRIs.
 * @returns {GraphData} The graph data.
 */
export function toGraphData(quads: readonly Quad[], prefixes: PrefixMap): GraphData {
    const labels = extractLabels(quads);
    const drafts = new Map<string, GraphNodeDraft>();

    const getOrCreateDraft = (term: RdfTerm): GraphNodeDraft => {
        const id = TERM_UTILS.termKey(term);
        let draft = drafts.get(id);
        if (!draft) {
            draft = { term, id, isClass: false, isInstance: false };
            drafts.set(id, draft);
        }
        return draft;
    };

    const edges: GraphEdge[] = quads.map((quad, index) => {
        const subject = getOrCreateDraft(quad.subject as RdfTerm);
        const object = getOrCreateDraft(quad.object as RdfTerm);

        if (quad.predicate.equals(RDF_TYPE)) {
            subject.isInstance = true;
            object.isClass = true;
        }

        const predicate = quad.predicate as RdfTerm;
        const predicateKey = TERM_UTILS.termKey(predicate);

        return {
            id: `e${index}`,
            source: subject.id,
            target: object.id,
            label: labels.get(predicateKey) ?? TERM_UTILS.termShortName(predicate, prefixes),
        };
    });

    const nodes: GraphNode[] = Array.from(drafts.values(), draft => {
        const shortName = TERM_UTILS.termShortName(draft.term, prefixes);
        return {
            id: draft.id,
            shortName,
            label: labels.get(draft.id) ?? shortName,
            kind: _toNodeKind(draft),
        };
    });

    return { nodes, edges, tripleCount: quads.length };
}

/**
 * Utils method: limitGraphData.
 *
 * It limits the given graph data to its first edges
 * and the nodes connected by them (in their original order).
 * The triple count of the original graph is kept.
 *
 * @param {GraphData} graph The given graph data.
 * @param {number} limit The maximum number of edges.
 * @returns {GraphData} The limited graph data.
 */
export function limitGraphData(graph: GraphData, limit: number): GraphData {
    if (limit >= graph.edges.length) {
        return graph;
    }

    const edges = graph.edges.slice(0, Math.max(limit, 0));
    const nodeIds = new Set(edges.flatMap(edge => [edge.source, edge.target]));
    const nodes = graph.nodes.filter(node => nodeIds.has(node.id));

    return { nodes, edges, tripleCount: graph.tripleCount };
}

/**
 * Utils constants: GRAPH_DATA_UTILS.
 *
 * It keeps a namespace reference to the graph data utils methods.
 */
export const GRAPH_DATA_UTILS = {
    extractLabels,
    limitGraphData,
    toGraphData,
} as const;
