import { SubjectItemJson } from '../../shared/api-objects';

export class ResourceInfoSearchResults {
    query: string;
    size: number;
    subjects: SubjectItemJson[];
}
