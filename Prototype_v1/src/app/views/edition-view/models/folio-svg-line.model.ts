import { FolioSvgPoint } from './folio-svg-point.model';

export class FolioSvgLine {
    startPoint: FolioSvgPoint;
    endPoint: FolioSvgPoint;

    constructor(point1: FolioSvgPoint, point2: FolioSvgPoint) {
        this.startPoint = point1;
        this.endPoint = point2;
    }
}
