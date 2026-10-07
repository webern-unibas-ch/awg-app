import { PrefixMap } from '../models/rdf.model';
import { SPARQL_UTILS } from './sparql.utils';

/**
 * Object constant: DEFAULT_PREFIXES.
 *
 * It keeps the default prefixes of the graph visualizer.
 */
export const DEFAULT_PREFIXES: PrefixMap = Object.freeze({
    awg: 'https://edition.anton-webern.ch/webern-onto#',
    dbo: 'http://dbpedia.org/ontology/',
    dbp: 'http://dbpedia.org/property/',
    dbpedia: 'http://dbpedia.org/resource/',
    dc: 'http://purl.org/dc/elements/1.1/',
    dcterms: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    mo: 'http://purl.org/ontology/mo/',
    owl: 'http://www.w3.org/2002/07/owl#',
    prov: 'http://www.w3.org/ns/prov#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
});

/**
 * Regex constant: PREFIX_DECLARATION_REGEX.
 *
 * It keeps a regex for the prefix declarations of a SPARQL query (`PREFIX awg: <…>`).
 */
const PREFIX_DECLARATION_REGEX = /PREFIX\s+([A-Za-z][\w.-]*)?:\s*<([^>]*)>/gi;

/**
 * Regex constant: QNAME_PREFIX_REGEX.
 *
 * It keeps a regex for the prefix of a prefixed name (`awg:` in `awg:Sketch`),
 * not preceded by a word character or a variable sign.
 */
const QNAME_PREFIX_REGEX = /(?:^|[^\w?$.:-])([A-Za-z][\w-]*(?:\.[\w-]+)*):/g;

/**
 * Utils method: mergePrefixes.
 *
 * It merges the given prefix maps; later maps override earlier ones.
 *
 * @param {...(PrefixMap | null | undefined)} prefixMaps The given prefix maps.
 * @returns {PrefixMap} The merged prefix map.
 */
export function mergePrefixes(...prefixMaps: (PrefixMap | null | undefined)[]): PrefixMap {
    return Object.freeze(Object.assign({}, ...prefixMaps.filter(Boolean)));
}

/**
 * Utils method: compactIri.
 *
 * It compacts a given IRI to a prefixed name (e.g. `awg:Sketch`)
 * using the longest matching namespace of the given prefixes.
 * IRIs without a matching namespace are returned unchanged.
 *
 * @param {string} iri The given IRI.
 * @param {PrefixMap} prefixes The given prefixes.
 * @returns {string} The compacted IRI.
 */
export function compactIri(iri: string, prefixes: PrefixMap): string {
    let bestPrefix: string | undefined;
    let bestNamespace = '';

    for (const [prefix, namespace] of Object.entries(prefixes)) {
        if (namespace && namespace.length > bestNamespace.length && iri.startsWith(namespace)) {
            bestPrefix = prefix;
            bestNamespace = namespace;
        }
    }

    return bestPrefix === undefined ? iri : `${bestPrefix}:${iri.slice(bestNamespace.length)}`;
}

/**
 * Utils method: expandQName.
 *
 * It expands a given prefixed name (e.g. `rdfs:label`) to a full IRI.
 * Names with an unknown prefix (or full IRIs) are returned unchanged.
 *
 * @param {string} qname The given prefixed name.
 * @param {PrefixMap} prefixes The given prefixes.
 * @returns {string} The expanded IRI.
 */
export function expandQName(qname: string, prefixes: PrefixMap): string {
    const colonIndex = qname.indexOf(':');
    if (colonIndex === -1) {
        return qname;
    }

    const prefix = qname.slice(0, colonIndex);
    if (!Object.hasOwn(prefixes, prefix)) {
        return qname;
    }

    return prefixes[prefix] + qname.slice(colonIndex + 1);
}

/**
 * Utils method: extractSparqlPrefixes.
 *
 * It extracts the prefix declarations of a given SPARQL query.
 *
 * @param {string} query The given SPARQL query.
 * @returns {PrefixMap} The declared prefixes.
 */
export function extractSparqlPrefixes(query: string): PrefixMap {
    const prefixes: Record<string, string> = {};

    for (const [, prefix = '', namespace] of query.matchAll(PREFIX_DECLARATION_REGEX)) {
        prefixes[prefix] = namespace;
    }

    return Object.freeze(prefixes);
}

/**
 * Utils method: findUsedPrefixes.
 *
 * It finds the prefixes of the prefixed names used in a given SPARQL query,
 * ignoring prefix declarations, IRIs, string literals and comments.
 *
 * @param {string} query The given SPARQL query.
 * @returns {string[]} The used prefixes (unique, in order of appearance).
 */
export function findUsedPrefixes(query: string): string[] {
    const code = SPARQL_UTILS.stripNonCode(query).replaceAll(/PREFIX\s+[A-Za-z][\w.-]*:/gi, ' ');
    const prefixes = Array.from(code.matchAll(QNAME_PREFIX_REGEX), match => match[1]);

    return Array.from(new Set(prefixes));
}

/**
 * Utils method: addMissingPrefixes.
 *
 * It prepends the declarations of all prefixes that are used,
 * but not declared in a given SPARQL query, if they are known.
 *
 * @param {string} query The given SPARQL query.
 * @param {PrefixMap} prefixes The known prefixes.
 * @returns {{ query: string; unknownPrefixes: string[] }} The completed query and the used prefixes that are unknown.
 */
export function addMissingPrefixes(query: string, prefixes: PrefixMap): { query: string; unknownPrefixes: string[] } {
    const declaredPrefixes = extractSparqlPrefixes(query);
    const missingPrefixes = findUsedPrefixes(query).filter(prefix => !Object.hasOwn(declaredPrefixes, prefix));

    const knownPrefixes = missingPrefixes.filter(prefix => Object.hasOwn(prefixes, prefix));
    const unknownPrefixes = missingPrefixes.filter(prefix => !Object.hasOwn(prefixes, prefix));

    const declarations = knownPrefixes.map(prefix => `PREFIX ${prefix}: <${prefixes[prefix]}>\n`).join('');

    return { query: declarations + query, unknownPrefixes };
}

/**
 * Utils constants: PREFIX_UTILS.
 *
 * It keeps a namespace reference to the prefix utils methods.
 */
export const PREFIX_UTILS = {
    addMissingPrefixes,
    compactIri,
    expandQName,
    extractSparqlPrefixes,
    findUsedPrefixes,
    mergePrefixes,
} as const;
