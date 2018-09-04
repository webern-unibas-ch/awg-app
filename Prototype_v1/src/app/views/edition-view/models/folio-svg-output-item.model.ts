import { FolioSvgLine } from './folio-svg-line.model';
import { FolioSvgPoint } from './folio-svg-point.model';

export class FolioSvgOutputItem {
    sigle: string;
    measure: string;
    upperLeftCorner: FolioSvgPoint;
    width: number;
    height: number;
    lineArray: FolioSvgLine[];
}
