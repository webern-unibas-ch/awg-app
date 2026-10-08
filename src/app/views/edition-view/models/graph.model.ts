/**
 * The GraphQueryType type.
 *
 * It is used in the context of the edition view
 * to store the type of a graph query
 * from a graph json file.
 */
export type GraphQueryType = 'select' | 'construct' | 'ask' | 'describe' | 'update' | null;

/**
 * The GraphQuery class.
 *
 * It is used in the context of the edition view
 * to store the data for a graph query
 * from a graph json file.
 */
export class GraphQuery {
    /**
     * The type of a query.
     */
    queryType: GraphQueryType = null;

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
 * The GraphRdfData class.
 *
 * It is used in the context of the edition view
 * to store the RDF data for a single graph
 * from a graph json file.
 */
export class GraphRdfData {
    /**
     * The predefined query list for a graph.
     */
    queryList: GraphQuery[] = [];

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
    rdfData: GraphRdfData = new GraphRdfData();

    /**
     * An optional staticImage of a graph.
     */
    staticImage?: string;
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
