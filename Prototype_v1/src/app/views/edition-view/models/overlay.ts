export class Overlay {
    type: OverlayTypes;
    id: string;
    _typeLabel?: string[];

    constructor(type: OverlayTypes, id: string) {
        this.type = type;
        this.id = id;
        console.log('type:', Object.values(OverlayTypes).filter(value => typeof value === 'string') as string[]);
        if (!this._typeLabel) {this._typeLabel = this.type[this.type]; }
    }

    //TODO: continue
        /*
    private getTypeLabel(): string {
        return this.type.toString();
        switch(this.type) {
            case 'measure':
                return 'Takt';
            case 'system':
                return 'System';
            case 'item':
                return 'Anmerkung';
        }
    }
        */
}


enum OverlayTypes {
    measure = 'Takt',
    system = 'System',
    item = 'Anmerkung',
}

