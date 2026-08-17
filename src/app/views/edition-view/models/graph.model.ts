/**
 * The GraphRDFData class.
 *
 * It is used in the context of the edition view
 * to store the RDF data for a single graph
 * from a graph json file.
 */
export class GraphRDFData {
    /**
     * The predefined query list for a graph.
     */
    queryList: GraphSparqlQuery[] = [];

    /**
     * The predefined triples for a graph.
     */
    triples = '';
}

/**
 * The Graph class.
 *
 * It is used in the context of the edition view
 * to store the data for a single graph
 * from a graph json file.
 */
export class Graph {
    /**
     * The id of a graph.
     */
    id = '';

    /**
     * The title of a graph.
     */
    title = '';

    /**
     * The description of a graph
     * with additional information.
     */
    description: string[] = [];

    /**
     * The RDF data for a graph.
     */
    rdfData: GraphRDFData = new GraphRDFData();

    /**
     * An optional staticImage of a graph.
     */
    staticImage?: string;
}

/**
 * The GraphSparqlQueryType type.
 *
 * It is used in the context of the edition view
 * to store the type of a graph query
 * from a graph json file.
 */
export type GraphSparqlQueryType = 'select' | 'construct' | 'ask' | 'count' | 'describe' | 'update' | null;

/**
 * The GraphSparqlQuery class.
 *
 * It is used in the context of the edition view
 * to store the data for a graph query
 * from a graph json file.
 */
export class GraphSparqlQuery {
    /**
     * The type of a query.
     */
    queryType: GraphSparqlQueryType = null;

    /**
     * The label of a query.
     */
    queryLabel = '';

    /**
     * The string of the query itself.
     */
    queryString = '';
}

/**
 * The GraphList class.
 *
 * It is used in the context of the edition view
 * to store the data for a graph list
 * from a graph json file.
 */
export class GraphList {
    /**
     * The array of graphs from a graph list.
     */
    graph: Graph[] = [];
}
