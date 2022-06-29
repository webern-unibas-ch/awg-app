import { Prefix } from '../models';

/**
 * Object constant with a set of default prefixes.
 *
 * It provides default prefixes used in the GraphVisualizer.
 */
export const DEFAULT_PREFIXES: Prefix[] = [
    new Prefix('awg', 'https://edition.anton-webern.ch/webern-onto#'),
    new Prefix('dbo', 'http://dbpedia.org/ontology/'),
    new Prefix('dbp', 'http://dbpedia.org/property/'),
    new Prefix('dbpedia', 'http://dbpedia.org/resource/'),
    new Prefix('dc', 'http://purl.org/dc/elements/1.1/'),
    new Prefix('dcterms', 'http://purl.org/dc/terms/'),
    new Prefix('foaf', 'http://xmlns.com/foaf/0.1/'),
    new Prefix('mo', 'http://purl.org/ontology/mo/'),
    new Prefix('owl', 'http://www.w3.org/2002/07/owl#'),
    new Prefix('prov', 'http://www.w3.org/ns/prov#'),
    new Prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    new Prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#'),
    new Prefix('skos', 'http://www.w3.org/2004/02/skos/core#'),
    new Prefix('xsd', 'http://www.w3.org/2001/XMLSchema#'),
];
