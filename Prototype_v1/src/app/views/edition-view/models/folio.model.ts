export class Folio {
    folio: string;
    systems: string;
    format: FolioFormat;
    items: [ FolioItems ];
}


export class FolioFormat {
    height: number;
    width: number;
}

export class FolioItems {
    sigle: string;
    measure: string;
    numberOfSections?: number;
    sections?: [ FolioSection ];
}

export class FolioSection {
    startSystem: number;
    endSystem: number;
    position?: number;
}
