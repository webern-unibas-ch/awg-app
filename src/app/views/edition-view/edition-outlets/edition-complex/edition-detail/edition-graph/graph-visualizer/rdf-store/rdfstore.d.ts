/**
 * Module declaration for rdfstore (the package has no type declarations).
 *
 * It types the part of the rdfstore API that the RdfStoreService uses.
 */
declare module 'rdfstore' {
    export const create: import('./rdf-store.model').RdfStoreModule['create'];
}
