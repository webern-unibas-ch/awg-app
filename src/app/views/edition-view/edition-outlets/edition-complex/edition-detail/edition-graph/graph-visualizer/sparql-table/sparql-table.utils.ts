import { TableRows } from '@awg-shared/table/table.model';

import { PrefixMap, RdfTerm } from '../models/rdf.model';
import { SparqlSelectResult } from '../models/sparql-result.model';
import { TERM_UTILS } from '../utils/term.utils';
import { SparqlTableCell } from './sparql-table.model';

/**
 * Utils method: toTableCell.
 *
 * It converts a given RDF term into a cell of the SPARQL results table:
 * IRIs and blank nodes are labeled by their short name, integer literals by their number
 * (to sort them numerically), other literals by their value.
 *
 * @param {RdfTerm} term The given term.
 * @param {PrefixMap} prefixes The prefixes to compact IRIs.
 * @returns {SparqlTableCell} The table cell.
 */
export function toTableCell(term: RdfTerm, prefixes: PrefixMap): SparqlTableCell {
    switch (term.termType) {
        case 'NamedNode':
            return { type: 'uri', value: term.value, label: TERM_UTILS.termShortName(term, prefixes) };
        case 'BlankNode':
            return { type: 'bnode', value: term.value, label: TERM_UTILS.termShortName(term, prefixes) };
        case 'Literal':
            return {
                type: 'literal',
                value: term.value,
                label: TERM_UTILS.isIntegerLiteral(term) ? Number(term.value) : term.value,
            };
    }
}

/**
 * Utils method: toTableRows.
 *
 * It converts the bindings of a given SELECT result into rows of the SPARQL results table,
 * with one cell per bound variable. Unbound variables get no cell.
 *
 * @param {SparqlSelectResult} result The given SELECT result.
 * @returns {TableRows[]} The table rows.
 */
export function toTableRows(result: SparqlSelectResult): TableRows[] {
    return result.bindings.map(binding =>
        Object.freeze(
            Object.fromEntries(
                result.variables
                    .filter(variable => Object.hasOwn(binding, variable))
                    .map(variable => [variable, toTableCell(binding[variable], result.prefixes)])
            )
        )
    );
}

/**
 * Utils constants: SPARQL_TABLE_UTILS.
 *
 * It keeps a namespace reference to the SPARQL table utils methods.
 */
export const SPARQL_TABLE_UTILS = {
    toTableCell,
    toTableRows,
} as const;
