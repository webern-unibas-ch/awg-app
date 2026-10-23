import { Source, TextSource } from './source.model';

/**
 * The SourceList class.
 *
 * It is used in the context of the edition view
 * to store the data for a source list
 * from a sourcelist json file.
 */
export class SourceList {
    /**
     * The array of sources from a source list.
     */
    sources: Source[] = [];

    /**
     * The array of text sources from a source list.
     */
    textSources?: TextSource[];
}
