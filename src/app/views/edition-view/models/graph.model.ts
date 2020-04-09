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
    id: string;

    /**
     * The title of a graph.
     */
    title: string;

    /**
     * The description of a graph
     * with additional information.
     */
    description: string[];

    /**
     * The RDF data for a graph.
     */
    rdfData: GraphRDFData;

    /**
     * A staticImage of a graph.
     */
    staticImage: string;
}

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
    queryList: GraphQuery[];

    /**
     * The predefined triples for a graph.
     */
    triples: string;
}

/**
 * The GraphQuery class.
 *
 * It is used in the context of the edition view
 * to store the data for a graph query
 * from a graph json file.
 */
export class GraphQuery {
    /**
     * The label of a query.
     */
    queryLabel: string;

    /**
     * The string of the query itself.
     */
    queryString: string;
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
    graph: Graph[];
}
