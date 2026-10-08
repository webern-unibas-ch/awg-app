import type { Quad } from '@rdfjs/types';

import { ResultGraph, ResultGraphEdge, ResultGraphNode, ResultNodeKind } from '../../models/result-graph.model';
import { PrefixMap, RdfTerm } from '../../models/rdf.model';
import { RDF_TYPE, RDFS_LABEL, TERM_UTILS } from '../../utils/term.utils';

/**
 * The ResultGraphNodeDraft interface.
 *
 * It represents a graph node while the graph is built
 * (with flags that determine its kind at the end).
 */
interface ResultGraphNodeDraft {
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
 * @param {ResultGraphNodeDraft} draft The given draft.
 * @returns {ResultNodeKind} The kind of the node.
 */
function _toNodeKind(draft: ResultGraphNodeDraft): ResultNodeKind {
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
 * Utils method: toResultGraph.
 *
 * It converts the given quads into the graph view model:
 * - one node per distinct subject or object (by term key),
 * - one edge per quad (from subject to object, labeled by the predicate),
 * - the kind of a node from its term type and `rdf:type` statements
 *   (precedence: class, blank, literal, instance, resource).
 *
 * @param {readonly Quad[]} quads The given quads.
 * @param {PrefixMap} prefixes The prefixes to compact IRIs.
 * @returns {ResultGraph} The graph data.
 */
export function toResultGraph(quads: readonly Quad[], prefixes: PrefixMap): ResultGraph {
    const labels = extractLabels(quads);
    const drafts = new Map<string, ResultGraphNodeDraft>();

    const getOrCreateDraft = (term: RdfTerm): ResultGraphNodeDraft => {
        const id = TERM_UTILS.termKey(term);
        let draft = drafts.get(id);
        if (!draft) {
            draft = { term, id, isClass: false, isInstance: false };
            drafts.set(id, draft);
        }
        return draft;
    };

    const edges: ResultGraphEdge[] = quads.map((quad, index) => {
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

    const nodes: ResultGraphNode[] = Array.from(drafts.values(), draft => {
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
 * Utils method: limitResultGraph.
 *
 * It limits the given graph data to its first edges
 * and the nodes connected by them (in their original order).
 * The triple count of the original graph is kept.
 *
 * @param {ResultGraph} graph The given graph data.
 * @param {number} limit The maximum number of edges.
 * @returns {ResultGraph} The limited graph data.
 */
export function limitResultGraph(graph: ResultGraph, limit: number): ResultGraph {
    if (limit >= graph.edges.length) {
        return graph;
    }

    const edges = graph.edges.slice(0, Math.max(limit, 0));
    const nodeIds = new Set(edges.flatMap(edge => [edge.source, edge.target]));
    const nodes = graph.nodes.filter(node => nodeIds.has(node.id));

    return { nodes, edges, tripleCount: graph.tripleCount };
}

/**
 * Utils constants: RESULT_GRAPH_UTILS.
 *
 * It keeps a namespace reference to the graph data utils methods.
 */
export const RESULT_GRAPH_UTILS = {
    extractLabels,
    limitResultGraph,
    toResultGraph,
} as const;
