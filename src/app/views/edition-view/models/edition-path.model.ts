import { EditionConstants } from './edition-constants';

export class EditionPath {
    intro: string;
    detail: string;
    report: string;
    root: string;

    constructor(compositionId: string) {
        const delimiter = '/';

        this.root = EditionConstants.editionPath + compositionId;
        this.intro = this.root + delimiter + EditionConstants.editionIntro;
        this.detail = this.root + delimiter + EditionConstants.editionDetail;
        this.report = this.root + delimiter + EditionConstants.editionReport;
    }
}
