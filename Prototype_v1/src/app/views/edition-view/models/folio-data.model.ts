export class FolioData {
    folio: string;
    systems: string;
    format: FolioDataFormat;
    items: [ FolioDataItems ];
}


export class FolioDataFormat {
    height: number;
    width: number;
}

export class FolioDataItems {
    sigle: string;
    measure: string;
    numberOfSections?: number;
    sections?: [ FolioDataSection ];
}

export class FolioDataSection {
    startSystem: number;
    endSystem: number;
    position?: number;
}
