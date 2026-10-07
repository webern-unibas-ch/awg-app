/**
 * The SparqlTableCellType type.
 *
 * It represents the type of a table cell,
 * named as in the SPARQL 1.1 Query Results JSON Format.
 */
export type SparqlTableCellType = 'uri' | 'bnode' | 'literal';

/**
 * The SparqlTableCell interface.
 *
 * It represents a cell of the SPARQL results table (a bound value of a variable).
 */
export interface SparqlTableCell {
    /**
     * The type of the cell.
     */
    readonly type: SparqlTableCellType;

    /**
     * The value of the cell (IRI, blank node id or literal value).
     */
    readonly value: string;

    /**
     * The label of the cell to be displayed, searched and sorted
     * (compacted IRI, `_:id`, number for integer literals, otherwise the literal value).
     */
    readonly label: string | number;
}
