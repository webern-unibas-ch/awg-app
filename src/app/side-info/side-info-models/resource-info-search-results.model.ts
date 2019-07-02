import { SubjectItemJson } from '@awg-shared/api-objects';

/**
 * The ResourceInfoSearchResults class.
 *
 * It is used in the context of the resource info
 * to store the data of a search result.
 */
export class ResourceInfoSearchResults {
    /**
     * The query of a search result.
     */
    query: string;

    /**
     * The size of a search result.
     */
    size: number;

    /**
     * The search result subjects.
     */
    subjects: SubjectItemJson[];
}
