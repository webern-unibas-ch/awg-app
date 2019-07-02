import { ContextJson } from '@awg-shared/api-objects';

/**
 * The ResourceDetailImage class.
 *
 * It is used in the context of the resource detail view
 * to store the data for a resource detail image.
 */
export class ResourceDetailImage {
    /**
     * The full size of the image.
     */
    fullSize: string;

    /**
     * The reduced size of the image.
     */
    reductSize: string;

    /**
     * The guielement of the image.
     */
    guielement: string;

    /**
     * The label of the image.
     */
    label: string;

    /**
     * The original name of the image.
     */
    origname: string;

    /**
     * The resource id of the image.
     */
    resId: string;

    /**
     * Constructor of the ResourceDetailImage class.
     *
     * It initializes the class with values from a given ContextJson
     * and an index position.
     *
     * @param {ContextJson} context The given ContextJson.
     * @param {number} index The given index position.
     */
    constructor(context: ContextJson, index: number) {
        const imgSize = context.locations[index];
        // find proper image solution [3] = reduction 3
        const preview = imgSize[3] ? imgSize[3] : imgSize[0];

        this.resId = context.res_id[index];
        this.guielement = context.resclass_name;
        this.label = context.firstprop[index];
        this.origname = preview.origname;
        this.reductSize = preview.path;
        this.fullSize = imgSize[imgSize.length - 1].path;
    }
}
