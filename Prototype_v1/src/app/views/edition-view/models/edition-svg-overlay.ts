enum EditionSvgOverlayTypes {
    measure = 'Takt',
    system = 'System',
    item = 'Anmerkung'
}

export class EditionSvgOverlay {
    type: EditionSvgOverlayTypes;
    id: string;
    typeLabel?: string[];

    constructor(type: EditionSvgOverlayTypes, id: string) {
        this.type = type;
        this.id = id;
        if (!this.typeLabel) {
            this.typeLabel = EditionSvgOverlayTypes[type];
        }
    }
}
