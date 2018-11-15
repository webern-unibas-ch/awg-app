import { FolioFormatOptions } from './folio-format-options.model';

export class ViewBox {
    viewBoxWidth: string;
    viewBoxHeight: string;
    viewBox: string;

    constructor(options: FolioFormatOptions) {
        const width = (options.formatX + 2 * options.initialOffsetX) * options.factor;
        const height = (options.formatY + 2 * options.initialOffsetY) * options.factor;
        this.viewBoxWidth = '100%';
        this.viewBoxHeight = '100%';
        this.viewBox = '0 0 ' + width + ' ' + height;
    }
}
