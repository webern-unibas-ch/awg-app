import type { Literal } from '@rdfjs/types';
import { DataFactory } from 'n3';

import { PrefixMap, RdfTerm } from '../models/rdf.model';
import { PREFIX_UTILS } from './prefix.utils';

/**
 * String constant: XSD.
 *
 * It keeps the namespace of the XML Schema datatypes.
 */
const XSD = 'http://www.w3.org/2001/XMLSchema#';

/**
 * String constant: XSD_STRING.
 *
 * It keeps the IRI of the default datatype of plain literals.
 */
const XSD_STRING = `${XSD}string`;

/**
 * Set constant: XSD_NUMERIC_DATATYPES.
 *
 * It keeps the IRIs of the numeric XML Schema datatypes.
 */
const XSD_NUMERIC_DATATYPES: ReadonlySet<string> = new Set(
    [
        'byte',
        'decimal',
        'double',
        'float',
        'int',
        'integer',
        'long',
        'negativeInteger',
        'nonNegativeInteger',
        'nonPositiveInteger',
        'positiveInteger',
        'short',
        'unsignedByte',
        'unsignedInt',
        'unsignedLong',
        'unsignedShort',
    ].map(datatype => `${XSD}${datatype}`)
);

/**
 * Regex constant: NUMERIC_REGEX.
 *
 * It keeps a regex for decimal numbers (with optional sign and exponent).
 */
const NUMERIC_REGEX = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

/**
 * Object constant: RDF_TYPE.
 *
 * It keeps the named node of `rdf:type`.
 */
export const RDF_TYPE = DataFactory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');

/**
 * Object constant: RDFS_LABEL.
 *
 * It keeps the named node of `rdfs:label`.
 */
export const RDFS_LABEL = DataFactory.namedNode('http://www.w3.org/2000/01/rdf-schema#label');

/**
 * Private utils method: _literalKey.
 *
 * It creates the key of a given literal in N-Triples-like notation.
 *
 * @param {Literal} literal The given literal.
 * @returns {string} The key of the literal.
 */
function _literalKey(literal: Literal): string {
    const value = JSON.stringify(literal.value);

    if (literal.language) {
        return `${value}@${literal.language}`;
    }
    if (literal.datatype.value === XSD_STRING) {
        return value;
    }
    return `${value}^^<${literal.datatype.value}>`;
}

/**
 * Utils method: formatLiteral.
 *
 * It formats the value of a given literal for display:
 * values of numeric datatypes are formatted (decimal numbers are rounded
 * to two decimals, safe integers are normalized), other values are kept
 * (also strings that look like numbers, e.g. `"007"`, and numbers that cannot
 * be represented exactly, i.e. integers beyond the safe-integer range and non-finite numbers).
 *
 * @param {Literal} literal The given literal.
 * @returns {string} The formatted value.
 */
export function formatLiteral(literal: Literal): string {
    const { value } = literal;

    if (!XSD_NUMERIC_DATATYPES.has(literal.datatype.value) || !NUMERIC_REGEX.test(value)) {
        return value;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue) || (Number.isInteger(numberValue) && !Number.isSafeInteger(numberValue))) {
        return value;
    }

    return Number.isInteger(numberValue) ? String(numberValue) : numberValue.toFixed(2);
}

/**
 * Utils method: termKey.
 *
 * It creates a unique key of a given RDF term
 * (IRI, `_:id` for blank nodes, N-Triples-like notation for literals).
 *
 * @param {RdfTerm} term The given term.
 * @returns {string} The key of the term.
 */
export function termKey(term: RdfTerm): string {
    switch (term.termType) {
        case 'NamedNode':
            return term.value;
        case 'BlankNode':
            return `_:${term.value}`;
        case 'Literal':
            return _literalKey(term);
    }
}

/**
 * Utils method: termShortName.
 *
 * It creates the short display name of a given RDF term
 * (compacted IRI, `_:id` for blank nodes, formatted value for literals, see {@link formatLiteral}).
 *
 * @param {RdfTerm} term The given term.
 * @param {PrefixMap} prefixes The prefixes to compact IRIs.
 * @returns {string} The short name of the term.
 */
export function termShortName(term: RdfTerm, prefixes: PrefixMap): string {
    switch (term.termType) {
        case 'NamedNode':
            return PREFIX_UTILS.compactIri(term.value, prefixes);
        case 'BlankNode':
            return `_:${term.value}`;
        case 'Literal':
            return formatLiteral(term);
    }
}

/**
 * Utils constants: TERM_UTILS.
 *
 * It keeps a namespace reference to the term utils methods.
 */
export const TERM_UTILS = {
    formatLiteral,
    termKey,
    termShortName,
} as const;
