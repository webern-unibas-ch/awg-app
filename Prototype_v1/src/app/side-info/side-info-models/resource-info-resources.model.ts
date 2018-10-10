import { SubjectItemJson } from '@awg-shared/api-objects';

export class ResourceInfoResource {
    // resource: SubjectItemJson;
    arrayIndex: number;
    displayIndex: number;
    id: string;
    title: string;
    subtitle: string;

    constructor(resource: SubjectItemJson, index: number) {
        // this.resource = resource;
        this.id = resource.obj_id;
        this.title = resource.value[0];
        this.subtitle = resource.icontitle;
        this.arrayIndex = index;
        this.displayIndex = this.arrayIndex + 1;
    }

    public getResourceInfo() {
        return `Hello, resource with id ${this.id} at index ${this.arrayIndex}`;
    }
}

export class CurrentResource extends ResourceInfoResource {}

export class NextResource extends ResourceInfoResource {}

export class PreviousResource extends ResourceInfoResource {}
