import { IncomingItemJson } from '../../../shared/api-objects';

export class ResourceDetailIncomingLinks {
    id: string;
    value: string;
    restype: {
        id: string;
        label: string;
        icon: string;
    };

    constructor(incoming: IncomingItemJson) {
        this.id = incoming.ext_res_id.id;
        this.value = incoming.value;
        this.restype = {
            id: incoming.resinfo.restype_id,
            label: incoming.resinfo.restype_label,
            icon: incoming.resinfo.restype_iconsrc
        }
    };
}
