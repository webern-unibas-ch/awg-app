export class ViewBox {
    viewBoxWidth: number;
    viewBoxHeight: number;
    viewBox: string;

    constructor(width: number, height: number) {
        this.viewBoxWidth = width;
        this.viewBoxHeight = height;
        this.viewBox = '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight;
    }
}
