import { ContextJson } from '@awg-shared/api-objects';

export class ResourceDetailImage {
    fullSize: string;
    reductSize: string;
    guielement: string;
    label: string;
    origname: string;
    res_id: string;

    constructor(context: ContextJson, index: number) {
        const img_size = context.locations[index];
        // find proper image solution [3] = reduction 3
        const preview = img_size[3] ? img_size[3] : img_size[0];

        this.res_id = context.res_id[index];
        this.guielement = context.resclass_name;
        this.label = context.firstprop[index];
        this.origname = preview.origname;
        this.reductSize = preview.path;
        this.fullSize = img_size[img_size.length - 1].path;
    }
}
