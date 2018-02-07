export class SvgView {
    viewBox: string;
    viewHeight: number;
    viewRatio: number;
    viewWidth: number;

    constructor(viewWidth: number, viewHeight: number, viewRatio?: number) {
        this.viewHeight = viewHeight;
        this.viewWidth = viewWidth;
        this.viewRatio = (viewRatio) ? viewRatio : 1;   // ratio 1:1 by default
        this.viewBox = SvgView.getViewBox(this.viewWidth, this.viewHeight, this.viewRatio);
    }

    private static getViewBox(viewWidth: number, viewHeight: number, viewRatio: number): string {
        return '0 0 ' + +(viewWidth * viewRatio) + ' ' + +(viewHeight * viewRatio);
    }
}
