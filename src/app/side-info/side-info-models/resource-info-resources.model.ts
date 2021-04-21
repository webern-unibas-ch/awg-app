import { SubjectItemJson } from '@awg-shared/api-objects';

/**
 * The ResourceInfoResource class.
 *
 * It is used in the context of the resource info
 * to store the data of a resource.
 */
export class ResourceInfoResource {
    // Resource: SubjectItemJson;

    /**
     * The array index position of a resource
     * in the search result list.
     */
    arrayIndex: number;

    /**
     * The display index position of a resource (arrayIndex +1).
     */
    displayIndex: number;

    /**
     * The id of a resource.
     */
    id: string;

    /**
     * The title of a resource.
     */
    title: string;

    /**
     * The subtitle of a resource.
     */
    subtitle: string;

    /**
     * Constructor of the SearchInfo class.
     *
     * It initializes the class with values
     * from a given SubjectItemJson and
     * index position in a search result list.
     *
     * @param {SubjectItemJson} resource The given SubjectItemJson.
     * @param {number} index The given index position.
     */
    constructor(resource: SubjectItemJson, index: number) {
        // This.resource = resource;
        this.id = resource.obj_id;
        this.title = resource.value[0];
        this.subtitle = resource.icontitle;
        this.arrayIndex = index;
        this.displayIndex = this.arrayIndex + 1;
    }
}

/**
 * The CurrentResource class.
 *
 * It is used in the context of the resource info
 * to store the data of the current resource.
 *
 * It extends ResourceInfoResource class.
 */
export class CurrentResource extends ResourceInfoResource {}

/**
 * The NextResource class.
 *
 * It is used in the context of the resource info
 * to store the data of the next resource.
 *
 * It extends ResourceInfoResource class.
 */
export class NextResource extends ResourceInfoResource {}

/**
 * The PreviousResource class.
 *
 * It is used in the context of the resource info
 * to store the data of the previous resource.
 *
 * It extends ResourceInfoResource class.
 */
export class PreviousResource extends ResourceInfoResource {}
