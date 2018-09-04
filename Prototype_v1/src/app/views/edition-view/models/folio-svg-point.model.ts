export class FolioSvgPoint {
    x: number;
    y: number;
    add: (addX: number, addY: number) => FolioSvgPoint;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.add = (addX: number, addY: number) => {
            this.x += addX;
            this.y += addY;
            return this;
        };
    }
}
