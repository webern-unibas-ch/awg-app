import { SubjectItemJson } from '@awg-shared/api-objects';

export class ResourceInfoSearchResults {
    query: string;
    size: number;
    subjects: SubjectItemJson[];
}
