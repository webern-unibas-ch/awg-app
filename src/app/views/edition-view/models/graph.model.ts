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
     * The preset query for a graph.
     */
    query: string;

    /**
     * The preset triples for a graph.
     */
    triples: string;
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
