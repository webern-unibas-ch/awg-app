import { IncomingItemJson } from '@awg-shared/api-objects';

/**
 * The ResourceDetailIncomingLink class.
 *
 * It is used in the context of the resource detail view
 * to store the data for a resource detail incoming link.
 */
export class ResourceDetailIncomingLink {
    /**
     * The id of the incoming link.
     */
    id: string;

    /**
     * The value of the incoming link.
     */
    value: string;

    /**
     * The resource type of the incoming link.
     */
    restype: {
        /**
         * The id of the resource type of the incoming link.
         */
        id: string;

        /**
         * The label of the resource type of the incoming link.
         */
        label: string;

        /**
         * The icon (url) of the resource type of the incoming link.
         */
        icon: string;
    };

    /**
     * Constructor of the ResourceDetailIncomingLink class.
     *
     * It initializes the class with values from a given IncomingItemJson.
     *
     * @param {IncomingItemJson} incoming The given IncomingItemJson.
     */
    constructor(incoming: IncomingItemJson) {
        this.id = incoming.ext_res_id.id;
        this.value = incoming.value;
        this.restype = {
            id: incoming.resinfo.restype_id,
            label: incoming.resinfo.restype_label,
            icon: incoming.resinfo.restype_iconsrc,
        };
    }
}
