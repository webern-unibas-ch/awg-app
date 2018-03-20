import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Sheet, SvgView, SvgOverlay } from '../../models';

declare var Snap: any;

@Component({
    selector: 'awg-edition-detail-svg-panel',
    templateUrl: './edition-detail-svg-panel.component.html',
    styleUrls: ['./edition-detail-svg-panel.component.css']
})
export class EditionDetailSvgPanelComponent implements OnInit, OnChanges {
    @Input() overlays: SvgOverlay[];
    @Input() selectedSheet: Sheet;
    @Input() selectedTextcriticId: string;
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectTextcriticRequest: EventEmitter<any> = new EventEmitter();

    svgCanvas: any;
    svgOverlayItems: any;
    svgPath: string;
    svgView: SvgView;

    // init sheets
    // TODO: other solution possible?
    sheet2: string ='Aa:SkI/2';
    sheet3: string ='Aa:SkI/3';
    sheet4: string ='Aa:SkI/4';
    sheet5: string ='Aa:SkI/5';

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedSheet']) {
            this.loadSvg();
        }
    }

    loadSvg() {
        // define svg view
        this.svgView = new SvgView(1000, 508, 1);

        // clear old svgCanvas
        if (this.svgCanvas) this.svgCanvas.clear();

        // snap outer svg tag into svgCanvas
        this.svgCanvas = Snap('#svg-canvas');

        // declare viewbox for outer svg tag
        this.svgCanvas.attr({
            viewBox: this.svgView.viewBox
        });

        // get path to svg file
        this.svgPath = this.selectedSheet.path.svg;

        // snap load file from svgPath (async) ...
        Snap.load(this.svgPath, (svg) => {

            // ... then select svg root element from loaded file &
            // declare its width & height according to outer viewBox
            svg.select('svg').attr({
                width: this.svgView.viewWidth,
                height: this.svgView.viewHeight
            });

            // ... then add loaded svg to DOM tree (svgCanvas)
            this.svgCanvas.append(svg);

            // create overlays
            this.createOverlays();
        });
    }

    // Create svg
    createOverlays() {
        this.svgOverlayItems = {};
        if (this.overlays) {
            this.overlays.forEach((overlay) => {
                this.svgOverlayItems[overlay.id] = this.createOverlayItem(overlay);
            });
        }
    }

    createOverlayItem(ov: SvgOverlay) {
        let overlayItem = this.svgCanvas.rect(ov.svg.x, ov.svg.y, ov.svg.width, ov.svg.height, ov.svg.rx, ov.svg.ry);

        overlayItem.addClass('svg-' + ov.type);

        if (ov.type === 'linkbox') {
            overlayItem.click( () => {
                this.selectSheet(ov.pos);
            });
        } else {
            overlayItem.click( () => {
                this.selectTextcritic(ov.type, ov.pos);
            });
        }
        return overlayItem;
    }

    isSelectedTextcritic(id: string) {
        return id === this.selectedTextcriticId;
    };

    isSelectedSheet(id: string) {
        return id === this.selectedSheet.id;
    }

    selectTextcritic(field: string, id: string) {
        this.selectTextcriticRequest.emit({field, id});
    }

    selectSheet(id: string) {
        this.selectSheetRequest.emit(id);
    }

}
