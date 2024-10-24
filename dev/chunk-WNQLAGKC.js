import{a as $}from"./chunk-AIXDF7NX.js";import{a as k2,e as _2}from"./chunk-UOR73CDY.js";import{f as M}from"./chunk-FLY6MUYS.js";import"./chunk-GOKSFJPJ.js";import{b as S2,c as u2,d as x,e as z2,f as C2,g as L2,h as M2,m as x2,o as w2,p as y2,w as e2,z as b2}from"./chunk-5F46XBGR.js";import{A as Y,B as P,C as H,Ca as l,I as f,L as n2,N as a,Oa as f2,Pa as h2,Ra as J,S as v,T as d,V as r,W as n,Y as r2,Ya as m2,Z as h,_a as p2,a as c2,b as t2,ea as d2,f as s2,gb as g2,h as R,k as i2,mb as v2,p as l2,rb as m,t as o2,u as a2}from"./chunk-W2TAS6DV.js";var N2=`<div class="awg-edition-svg-sheet-footer mt-4">
    @if (utils.isNotEmptyObject(selectedTextcritics)) {
        <div class="awg-edition-svg-sheet-footer-evaluation">
            <p (click)="toggleTextcritics()" (keydown)="toggleTextcritics()" tabindex="0" style="cursor: pointer">
                @if (utils.isNotEmptyArray(selectedTextcritics.description)) {
                    <span>
                        <fa-icon [icon]="showTextcritics ? faChevronDown : faChevronRight"></fa-icon>
                        &nbsp;
                    </span>
                }

                <span class="smallcaps"
                    ><awg-edition-tka-label
                        [id]="selectedTextcritics?.id"
                        [labelType]="'evaluation'"></awg-edition-tka-label
                    >:</span
                >

                @if (!utils.isNotEmptyArray(selectedTextcritics.description)) {
                    <span>&nbsp;---</span>
                }
            </p>
            @if (showTextcritics && utils.isNotEmptyArray(selectedTextcritics.description)) {
                <awg-edition-tka-description
                    [textcriticalDescriptions]="selectedTextcritics.description"
                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                    (openModalRequest)="openModal($event)"
                    (selectSvgSheetRequest)="selectSvgSheet($event)">
                </awg-edition-tka-description>
            }
        </div>
        @if (showTkA) {
            <div class="awg-edition-svg-sheet-footer-textcritics">
                <p class="smallcaps">
                    <awg-edition-tka-label
                        [id]="selectedTextcritics?.id"
                        [labelType]="'comment'"></awg-edition-tka-label
                    >:
                </p>
                <awg-edition-tka-table
                    [textcriticalCommentBlocks]="selectedTextcriticalCommentBlocks"
                    [isRowTable]="selectedTextcritics?.rowtable"
                    [isSketchId]="utils.isSketchId(selectedTextcritics?.id)"
                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                    (openModalRequest)="openModal($event)"
                    (selectSvgSheetRequest)="selectSvgSheet($event)">
                </awg-edition-tka-table>
            </div>
        }
    }
</div>
`;var R2="";var S,A=(S=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.faChevronRight=v2,this.faChevronDown=g2,this.showTextcritics=!1,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleTextcritics(){this.showTextcritics=!this.showTextcritics}},S.ctorParameters=()=>[{type:M}],S.propDecorators={selectedTextcriticalCommentBlocks:[{type:r}],selectedTextcritics:[{type:r}],showTkA:[{type:r}],navigateToReportFragmentRequest:[{type:n}],openModalRequest:[{type:n}],selectSvgSheetRequest:[{type:n}]},S);A=l([d({selector:"awg-edition-svg-sheet-footer",template:N2,changeDetection:f.OnPush,styles:[R2]})],A);var V=class{};V=l([h({imports:[m,$],declarations:[A],exports:[A]})],V);var A2=`<h6 class="card-title">
    {{ navItemLabel }}:
    @if (navItemLabel === 'Werkeditionen') {
        <span class="text-danger"
            >&nbsp;<fa-icon
                [icon]="faCalendarXmark"
                [ngbPopover]="disclaimerWorkEditions"
                popoverTitle="Disclaimer"
                placement="end"
                triggers="mouseenter:mouseleave"></fa-icon>
        </span>
    } @else if (!utils.isNotEmptyArray(svgSheets)) {
        <span>---</span>
    }
</h6>
@for (svgSheet of svgSheets; track svgSheet.id) {
    @if (svgSheet.content.length === 1) {
        <a
            class="btn btn-default w-100 awg-svg-sheet-nav-link card-text text-start"
            [ngClass]="{ active: isSelectedSvgSheet(svgSheet.id), 'text-muted': !isSelectedSvgSheet(svgSheet.id) }"
            (click)="selectSvgSheet({ complexId: '', sheetId: svgSheet.id })">
            {{ svgSheet.label }}
        </a>
    }
    @if (svgSheet.content.length > 1) {
        <div class="awg-svg-sheet-nav-link-dropdown" ngbDropdown>
            <a
                class="btn card-text"
                id="dropDownSheetNav"
                ngbDropdownToggle
                [ngClass]="{ active: isSelectedSvgSheet(svgSheet.id), 'text-muted': !isSelectedSvgSheet(svgSheet.id) }">
                <span
                    >{{ svgSheet.label }} <span class="badge bg-secondary">{{ svgSheet.content.length }}</span></span
                >
            </a>
            <div ngbDropdownMenu aria-labelledby="dropdownSheetNav">
                @for (svgSheetContent of svgSheet.content; track svgSheetContent.svg; let i = $index) {
                    <div>
                        <a
                            class="dropdown-item"
                            [ngClass]="{
                                active: isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial),
                                'text-muted': !isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial),
                            }"
                            (click)="selectSvgSheet({ complexId: '', sheetId: svgSheet.id + svgSheetContent.partial })"
                            >{{ svgSheet.label }}
                            <span class="text-muted">[{{ i + 1 }}/{{ svgSheet.content.length }}]</span></a
                        >
                    </div>
                }
            </div>
        </div>
    }
}
`;var E2=`a#dropDownSheetNav.btn{border:none!important}a#dropDownSheetNav.active,a#dropDownSheetNav:active{color:#149b9e!important}a#dropDownSheetNav:hover{color:#333!important}a#dropDownSheetNav>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var T2={prefix:"far",iconName:"calendar-xmark",icon:[448,512,["calendar-times"],"f273","M128 0c13.3 0 24 10.7 24 24l0 40 144 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 40 0c35.3 0 64 28.7 64 64l0 16 0 48 0 256c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 192l0-48 0-16C0 92.7 28.7 64 64 64l40 0 0-40c0-13.3 10.7-24 24-24zM400 192L48 192l0 256c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-256zm-95 89l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"]};var u,E=(u=class{constructor(e){this.utils=e,this.selectSvgSheetRequest=new a,this.disclaimerWorkEditions="Werkeditionen sind aus rechtlichen Gr\xFCnden fr\xFChestens ab 2049 online verf\xFCgbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.",this.faCalendarXmark=T2}isSelectedSvgSheet(e,c){let t=e,s=this.selectedSvgSheet?.id;return c&&this.selectedSvgSheet?.content?.[0]?.partial&&(t+=c,s+=this.selectedSvgSheet.content[0].partial),t===s}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},u.ctorParameters=()=>[{type:M}],u.propDecorators={navItemLabel:[{type:r}],svgSheets:[{type:r}],selectedSvgSheet:[{type:r}],selectSvgSheetRequest:[{type:n}]},u);E=l([d({selector:"awg-edition-svg-sheet-nav-item",template:A2,changeDetection:f.OnPush,styles:[E2]})],E);var O2=`@if (svgSheetsData) {
    <div class="card awg-svg-sheet-nav">
        <div class="card-body">
            <awg-edition-svg-sheet-nav-item
                [navItemLabel]="'Werkeditionen'"
                [svgSheets]="svgSheetsData.sheets.workEditions"
                [selectedSvgSheet]="selectedSvgSheet"
                (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-edition-svg-sheet-nav-item>
            <hr />
            <awg-edition-svg-sheet-nav-item
                [navItemLabel]="'Texteditionen'"
                [svgSheets]="svgSheetsData.sheets.textEditions"
                [selectedSvgSheet]="selectedSvgSheet"
                (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-edition-svg-sheet-nav-item>
            <hr />
            <awg-edition-svg-sheet-nav-item
                [navItemLabel]="'Skizzeneditionen'"
                [svgSheets]="svgSheetsData.sheets.sketchEditions"
                [selectedSvgSheet]="selectedSvgSheet"
                (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-edition-svg-sheet-nav-item>
        </div>
    </div>
}
`;var q2="";var w,T=(w=class{constructor(){this.selectSvgSheetRequest=new a}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},w.propDecorators={svgSheetsData:[{type:r}],selectedSvgSheet:[{type:r}],selectSvgSheetRequest:[{type:n}]},w);T=l([d({selector:"awg-edition-svg-sheet-nav",template:O2,changeDetection:f.OnPush,styles:[q2]})],T);var W=class{};W=l([h({imports:[m],declarations:[T,E],exports:[T,E]})],W);var D2=`<div class="awg-edition-svg-sheet-viewer-nav">
    <div class="prev" (click)="browseSvgSheet(-1)" (keydown)="browseSvgSheet(-1)" tabindex="0">
        <span>&#10094;</span>
    </div>
    <div class="next" (click)="browseSvgSheet(1)" (keydown)="browseSvgSheet(1)" tabindex="0">
        <span>&#10095;</span>
    </div>
</div>
`;var F2=`.awg-edition-svg-sheet-viewer-nav>.prev,.awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}.awg-edition-svg-sheet-viewer-nav>.prev:hover,.awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}.awg-edition-svg-sheet-viewer-nav>.prev span,.awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#149b9e}.awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd}.awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd}
`;var y,O=(y=class{constructor(){this.browseSvgSheetRequest=new a}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}},y.propDecorators={browseSvgSheetRequest:[{type:n}]},y);O=l([d({selector:"awg-edition-svg-sheet-viewer-nav",template:D2,changeDetection:f.OnPush,styles:[F2]})],O);var I2=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
    <div class="card-header">
        <span class="mx-2">Editorische Erg\xE4nzungen</span>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-4">
                <div class="form-check form-switch">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        [checked]="allClassesVisible"
                        value=""
                        id="all-supplied-classes"
                        (click)="toggleAllClassesOpacity()"
                        (keypress)="toggleAllClassesOpacity()" />
                    <label class="form-check-label" for="all-supplied-classes">
                        Alle {{ allClassesVisible ? 'aus' : 'ein' }}blenden
                    </label>
                </div>
            </div>
            @for (suppliedClass of suppliedClasses | keyvalue; track suppliedClass.key; let i = $index) {
                <div class="col-12 col-sm-4">
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            [checked]="suppliedClass.value"
                            value=""
                            [id]="suppliedClass.key"
                            (click)="toggleSingleSuppliedClassOpacity(suppliedClass.key)"
                            (keypress)="toggleSingleSuppliedClassOpacity(suppliedClass.key)" />
                        <label class="form-check-label" [for]="suppliedClass.key">{{ suppliedClass.key }}</label>
                    </div>
                </div>
                <!-- Add a new row after every third item -->
                @if ((i + 2) % 3 === 0) {
                    <div class="w-100"></div>
                }
            }
            @if (hasAvailableTkaOverlays) {
                <div class="col-4">
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            [checked]="tkkHighlightingVisible"
                            value=""
                            id="tkk"
                            (click)="toggleTkkClassesHighlight()"
                            (keypress)="toggleTkkClassesHighlight()" />
                        <label class="form-check-label" for="tkk">
                            <awg-edition-tka-label [id]="id" [labelType]="'comment'"></awg-edition-tka-label
                        ></label>
                    </div>
                </div>
            }
        </div>
    </div>
</div>
`;var G2="";var b,q=(b=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new a,this.toggleTkkClassesHighlightRequest=new a,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let c=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,c),this.suppliedClasses.set(e,!c);let t=Array.from(this.suppliedClasses.values());t.every(s=>s===t[0])&&(this.allClassesVisible=t[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,c)=>{this.suppliedClasses.set(c,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){e!==void 0?this.tkkHighlightingVisible=e:this.tkkHighlightingVisible=!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,c){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:c})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],c=e.every(s=>s),t=e.every(s=>!s);(c||t)&&(this.allClassesVisible=e[0])}},b.propDecorators={id:[{type:r}],suppliedClasses:[{type:r}],hasAvailableTkaOverlays:[{type:r}],toggleSuppliedClassesOpacityRequest:[{type:n}],toggleTkkClassesHighlightRequest:[{type:n}]},b);q=l([d({selector:"awg-edition-svg-sheet-viewer-switch",template:I2,changeDetection:f.OnPush,styles:[G2]})],q);var B2=`@if (selectedSvgSheet) {
    <div id="awg-edition-svg-container">
        <div class="awg-edition-svg-sheet-viewer">
            <div class="awg-edition-svg-icon-bar">
                <!-- Slider -->
                <div class="input-group input-group-sm awg-edition-svg-zoom-slider-container float-start mx-2r my-2">
                    <span #sliderInputLabel class="input-group-text" id="slider-label">{{ sliderConfig.value }}x</span>
                    <input
                        type="range"
                        #sliderInput
                        class="awg-edition-svg-zoom-slider"
                        id="awg-edition-svg-zoom-slider"
                        name="zoomSlider"
                        aria-label="Zoom slider"
                        aria-describedby="slider-label"
                        [min]="sliderConfig.min"
                        [max]="sliderConfig.max"
                        [step]="sliderConfig.stepSize"
                        [(ngModel)]="sliderConfig.value"
                        (ngModelChange)="onZoomChange($event)" />
                    <button class="btn btn-sm btn-outline-info" type="submit" title="Reset zoom" (click)="resetZoom()">
                        <fa-icon [icon]="faCompressArrowsAlt"></fa-icon>
                    </button>
                </div>
            </div>
            <div #svgSheetContainer class="awg-edition-svg-sheet-container px-2r">
                <svg #svgSheetElement id="awg-edition-svg-sheet">
                    <g #svgSheetRootGroup id="awg-edition-svg-sheet-root-group"></g>
                </svg>

                <awg-license></awg-license>

                @if (hasAvailableTkaOverlays || suppliedClasses.size > 0) {
                    <awg-edition-svg-sheet-viewer-switch
                        [id]="selectedSvgSheet.id"
                        [suppliedClasses]="suppliedClasses"
                        [hasAvailableTkaOverlays]="hasAvailableTkaOverlays"
                        (toggleSuppliedClassesOpacityRequest)="onSuppliedClassesOpacityToggle($event)"
                        (toggleTkkClassesHighlightRequest)="
                            onTkkClassesHighlightToggle($event)
                        "></awg-edition-svg-sheet-viewer-switch>
                }
            </div>

            <!-- Next and previous buttons -->
            <awg-edition-svg-sheet-viewer-nav
                (browseSvgSheetRequest)="browseSvgSheet($event)"></awg-edition-svg-sheet-viewer-nav>
        </div>
    </div>
}
`;var P2=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#149b9e}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;margin-top:0}
`;var z,D=(z=class{constructor(e,c){this.cdr=e,this.svgDrawingService=c,this.browseSvgSheetRequest=new a,this.selectLinkBoxRequest=new a,this.selectOverlaysRequest=new a,this.faCompressArrowsAlt=m2,this.hasAvailableTkaOverlays=!1,this.sliderConfig=new k2(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this._isRendered=!1,this._resize$=new R,this._destroyed$=new R,this.ref=this}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(a2(150),P(this._destroyed$)).subscribe(e=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:c,isCurrentlyVisible:t}=e;this.svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,c,t)}onTkkClassesHighlightToggle(e){let c="tkk";this.svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,c).nodes().forEach(s=>{let[i,o]=this._getOverlayAndSelection(s.id,c),p=e?x.fill:x.transparent;this.svgDrawingService.updateTkkOverlayColor(i,o,p)})}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this.cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return s2(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this.svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this.svgSheetRootGroupSelection&&(this._createOverlays("link-box",this._createLinkBoxOverlay.bind(this)),this._createOverlays("tkk",this._createTkaOverlay.bind(this)),this.hasAvailableTkaOverlays=!!this._availableTkaOverlays&&this._availableTkaOverlays.length>0,this._getSuppliedClasses())}_createOverlays(e,c){let t=this.svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,e);t&&t.nodes().forEach(s=>{c(s,e)})}_createLinkBoxOverlay(e,c){let t=e.id,s=this.svgDrawingService.getD3SelectionById(this.svgSheetRootGroupSelection,t),i=s.select("path");i.style("fill",this.svgDrawingService.linkBoxFillColor),s.on("mouseover",()=>{let o=this.svgDrawingService.linkBoxHoverFillColor;this.svgDrawingService.fillD3SelectionWithColor(i,o),s.style("cursor","pointer")}).on("mouseout",()=>{let o=this.svgDrawingService.linkBoxFillColor;this.svgDrawingService.fillD3SelectionWithColor(i,o)}).on("click",()=>{this._onLinkBoxSelect(t)})}_createTkaOverlay(e,c){let t=e.id,s=e.getBBox();this._availableTkaOverlays.push(new z2(u2.tka,t,!1));let i=this.svgDrawingService.createOverlayGroup(this.svgSheetRootGroupSelection,t,s,c),[o,p]=this._getOverlayAndSelection(t,c);i.on("mouseover",()=>{this.svgDrawingService.updateTkkOverlayColor(o,p,x.hover),p.style("cursor","pointer")}).on("mouseout",()=>{this.svgDrawingService.updateTkkOverlayColor(o,p,x.fill)}).on("click",()=>{o&&(o.isSelected=!o.isSelected),this.svgDrawingService.updateTkkOverlayColor(o,p,x.hover),this._selectedTkaOverlays=this._getSelectedOverlays(this._availableTkaOverlays),this._onOverlaySelect(this._selectedTkaOverlays)})}_getContainerDimensions(e){let c=this.svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:c.width,this._divHeight=this._divHeight?this._divHeight:c.height}_getOverlayById(e,c){return e.find(t=>t.id===c)}_getOverlayAndSelection(e,c){let t=this._getOverlayById(this._availableTkaOverlays,e),s=this.svgDrawingService.getOverlayGroupRectSelection(this.svgSheetRootGroupSelection,e,c);return[t,s]}_getSelectedOverlays(e){return e.filter(c=>c.isSelected)}_getSuppliedClasses(){this.suppliedClasses=this.svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let c=this.sliderConfig.stepSize;return((i,o)=>+(Math.round(+(i+"e"+o))+"e-"+o))(e,(i=>Math.floor(i)===i?0:i.toString().split(".")[1].length)(c))}_zoomHandler(e,c){let t=s=>{let i=s.transform,o=this._roundToScaleStepDecimalPrecision(i.k);e.attr("transform",i),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=o,this.sliderConfig.value=o),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=o+"x")};this._zoomBehaviour=_2().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",t),c.call(this._zoomBehaviour)}},z.ctorParameters=()=>[{type:d2},{type:b2}],z.propDecorators={svgSheetContainerRef:[{type:v,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:v,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:v,args:["svgSheetRootGroup"]}],sliderInput:[{type:v,args:["sliderInput"]}],sliderInputLabel:[{type:v,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:r}],browseSvgSheetRequest:[{type:n}],selectLinkBoxRequest:[{type:n}],selectOverlaysRequest:[{type:n}],onResize:[{type:r2,args:["window:resize"]}]},z);D=l([d({selector:"awg-edition-svg-sheet-viewer",template:B2,styles:[P2]})],D);var U=class{};U=l([h({imports:[m,$],declarations:[D,O,q],exports:[D,O,q]})],U);var H2=`<div ngbAccordion>
    <div ngbAccordionItem="awg-accolade-view" [collapsed]="false">
        <div ngbAccordionHeader class="accordion-button awg-accordion-button-custom-header justify-content-between">
            <button ngbAccordionToggle class="btn btn-link text-start p-0">Edierte Notentexte</button>
            <button type="button" class="btn btn-sm btn-outline-info" (click)="openModal('HINT_EDITION_SHEETS')">
                Hinweise zur Nutzung
            </button>
        </div>
        <div ngbAccordionCollapse>
            <div ngbAccordionBody>
                <ng-template>
                    <div class="row">
                        <div class="order-2 order-lg-1 col-12 col-lg-4 col-xl-3">
                            <!-- svg sheet navigation -->
                            <awg-edition-svg-sheet-nav
                                [svgSheetsData]="svgSheetsData"
                                [selectedSvgSheet]="selectedSvgSheet"
                                (selectSvgSheetRequest)="selectSvgSheet($event)">
                            </awg-edition-svg-sheet-nav>
                        </div>
                        <div class="order-1 order-lg-2 col-12 col-lg-8 col-xl-9">
                            <!-- svg sheet -->
                            @if (selectedSvgSheet) {
                                <awg-edition-svg-sheet-viewer
                                    [selectedSvgSheet]="selectedSvgSheet"
                                    (browseSvgSheetRequest)="browseSvgSheet($event)"
                                    (selectLinkBoxRequest)="selectLinkBox($event)"
                                    (selectOverlaysRequest)="selectOverlays($event)">
                                </awg-edition-svg-sheet-viewer>
                            }

                            <!-- table for TkA -->
                            @if (selectedSvgSheet && selectedTextcritics) {
                                <awg-edition-svg-sheet-footer
                                    [selectedTextcritics]="selectedTextcritics"
                                    [selectedTextcriticalCommentBlocks]="selectedTextcriticalCommentBlocks"
                                    [showTkA]="showTkA"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-edition-svg-sheet-footer>
                            }
                        </div>
                    </div>
                </ng-template>
            </div>
        </div>
    </div>
</div>
`;var $2="";var k,F=(k=class{constructor(){this.browseSvgSheetRequest=new a,this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectLinkBoxRequest=new a,this.selectOverlaysRequest=new a,this.selectSvgSheetRequest=new a}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},k.propDecorators={svgSheetsData:[{type:r}],selectedSvgSheet:[{type:r}],selectedTextcriticalCommentBlocks:[{type:r}],selectedTextcritics:[{type:r}],showTkA:[{type:r}],browseSvgSheetRequest:[{type:n}],navigateToReportFragmentRequest:[{type:n}],openModalRequest:[{type:n}],selectLinkBoxRequest:[{type:n}],selectOverlaysRequest:[{type:n}],selectSvgSheetRequest:[{type:n}]},k);F=l([d({selector:"awg-edition-accolade",template:H2,changeDetection:f.OnPush,styles:[$2]})],F);var j=class{};j=l([h({imports:[m,V,W,U],declarations:[F],exports:[F]})],j);var V2=`<div ngbAccordion>
    <div ngbAccordionItem="awg-convolute-view" [collapsed]="false">
        <div ngbAccordionHeader>
            <button ngbAccordionButton>Konvolut\xFCbersicht</button>
        </div>
        <div ngbAccordionCollapse>
            <div ngbAccordionBody>
                <ng-template>
                    <!-- convolute label -->
                    <div class="awg-convolute-label">
                        <p>
                            <a [routerLink]="['../report']" fragment="source{{ selectedConvolute.convoluteId }}">{{
                                selectedConvolute.convoluteLabel
                            }}</a>
                        </p>
                    </div>

                    <!-- viewer for convolute folios -->
                    <awg-edition-folio-viewer
                        [selectedConvolute]="selectedConvolute"
                        [selectedSvgSheet]="selectedSvgSheet"
                        (openModalRequest)="openModal($event)"
                        (selectSvgSheetRequest)="selectSvgSheet($event)">
                    </awg-edition-folio-viewer>

                    <!-- convolute legend -->
                    <div class="awg-convolute-legend col-12">
                        Legende:&nbsp;
                        @for (legend of folioLegends; track legend) {
                            <span class="{{ legend.color }}">
                                <fa-icon [icon]="faSquare"></fa-icon>
                                {{ legend.label }}
                            </span>
                        }
                    </div>
                </ng-template>
            </div>
        </div>
    </div>
</div>
`;var W2="";var _,I=(_=class{constructor(){this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.faSquare=p2,this.folioLegends=[{color:"olivedrab",label:"aktuell ausgew\xE4hlt"},{color:"orange",label:"ausw\xE4hlbar"},{color:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},_.propDecorators={selectedConvolute:[{type:r}],selectedSvgSheet:[{type:r}],openModalRequest:[{type:n}],selectSvgSheetRequest:[{type:n}]},_);I=l([d({selector:"awg-edition-convolute",template:V2,changeDetection:f.OnPush,styles:[W2]})],I);var U2=`<!-- embedded svg: Edition Folio Viewer -->
@if (folioSvgDataArray) {
    <div class="container-fluid svgGrid">
        <div class="row svgRow">
            @for (folioSvgData of folioSvgDataArray; track folioSvgData.sheet?.folioId) {
                <div class="col-sm-6 col-lg-{{ 12 / folioSvgDataArray?.length }} svgCol">
                    <span class="text-muted">[{{ folioSvgData.sheet?.folioId }}]</span>
                    <svg id="folio-{{ selectedSvgSheet?.id }}-{{ folioSvgData.sheet?.folioId }}"></svg>
                </div>
            }
        </div>
    </div>
}
`;var j2=`.svgGrid{margin-bottom:2em}.svgRow{padding-top:1em;width:inherit;text-align:center;box-shadow:5px 5px 6px #ccc;border:1px solid #eeeeee}.svgCol{display:inline-block}
`;var X=class{constructor(){this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentReversedRotationAngle=180,this._contentSegmentStrokeWidth=2,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7,this._appendSvgElementWithAttrs=(e,c,t)=>{let s=e.append(c);return Object.keys(t).forEach(i=>{s.attr(i,t[i])}),s}}getFolioSvgData(e,c){let t=new C2(e,c,this._contentSegmentOffsetCorrection);return new L2(t)}addViewBoxToSvgCanvas(e,c){e.attr("viewBox",c.viewBox).attr("width",c.svgWidth).attr("height",c.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,c,t){this.ref=t;let s=this._appendCanvasSheetGroup(e,c);this._addFolioSheetToSvgCanvas(s,c),this._addFolioSystemsToSvgCanvas(s,c),this._addFolioContentSegmentsToSvgCanvas(s,c)}_addFolioSheetToSvgCanvas(e,c){let{sheet:t}=c,{upperLeftCorner:s,lowerRightCorner:i,folioId:o}=t;this._appendSheetGroupTitle(e,o),this._appendSheetGroupRectangle(e,s,i)}_addFolioSystemsToSvgCanvas(e,c){c.systems.systemsLines.forEach((t,s)=>{let i=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:s+1,class:"systems-group"}),o=this._appendSvgElementWithAttrs(i,"g",{systemLineGroupId:s+1,class:"system-line-group"});this._appendSystemsGroupLabel(i,c,s),this._appendSystemsGroupLines(o,t)})}_addFolioContentSegmentsToSvgCanvas(e,c){c?.contentSegments?.forEach(t=>{if(!t)return;let s=this._appendContentSegmentGroup(e,t),i=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(i,t.segmentVertices),this._appendContentSegmentLinkLabel(i,t)})}_appendCanvasSheetGroup(e,c){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:c.sheet.folioId,class:"sheet-group"})}_appendContentSegmentGroup(e,c){let t=this._appendContentSegmentGroupElement(e,c);return this._appendContentSegmentGroupTitle(t,c),t.on("click",()=>c.selectable?this.ref.selectSvgSheet({complexId:c.complexId,sheetId:c.sheetId}):this.ref.openModal(c.linkTo)),t}_appendContentSegmentGroupElement(e,c){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:c.segmentLabel,contentSegmentId:c.sheetId,class:"content-segment-group",stroke:c.selectable?this._fgColor:this._disabledColor,fill:c.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,c){return this._appendSvgElementWithAttrs(e,"title",{}).text(c.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,c){let t=this._appendContentSegmentLinkLabelTextElement(e,c.centeredXPosition,c.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(t,c),c.reversed&&t.attr("transform",`rotate(${this._contentSegmentReversedRotationAngle}, ${c.centeredXPosition}, ${c.centeredYPosition})`),t}_appendContentSegmentLinkLabelTextElement(e,c,t){let s={class:"content-segment-label",x:c,y:t};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,c){c.segmentLabelArray.forEach((t,s)=>{if(t!==""){let i={};s>0&&(i.x=c.centeredXPosition,i.y=c.centeredYPosition,i.dy="1.2em",i["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",i).text(t)}})}_appendContentSegmentLinkPolygon(e,c){let t={class:"content-segment-shape",points:c,fill:this._contentSegmentFillColor};return t["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"polygon",t)}_appendSheetGroupRectangle(e,c,t){let{x:s,y:i}=c,{x:o,y:p}=t,N={x:s,y:i,width:o-s,height:p-i,fill:this._sheetFillColor,stroke:this._bgColor};return N["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",N)}_appendSheetGroupTitle(e,c){this._appendSvgElementWithAttrs(e,"title",{}).text(`Bl. ${c}`)}_appendSystemsGroupLabel(e,c,t){let{x:s,y:i}=c.systems.systemsLabelPositions[t],o=t+1,p={class:"system-label",x:s,y:i,fill:this._bgColor};p["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",p).text(o)}_appendSystemsGroupLines(e,c){c.forEach(t=>{let{x:s,y:i}=t.START_POINT,{x:o,y:p}=t.END_POINT,N={class:"system-line",x1:s,y1:i,x2:o,y2:p,stroke:this._bgColor};N["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",N)})}};X=l([n2({providedIn:"root"})],X);var C,G=(C=class{constructor(e){this.folioService=e,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0},this.ref=this}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,c)=>{let t=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(t);s.empty()||(s.selectAll("*").remove(),this.folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[c]),this.folioService.addFolioToSvgCanvas(s,e,this.ref),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let c=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${c}`}openModal(e){e&&this.openModalRequest.emit(e)}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let c=t2(c2({},this._folioSettings),{formatX:+e.format.width,formatY:+e.format.height,numberOfFolios:this.selectedConvolute.folios.length}),t=this._calculateViewBoxDimension(c,"X"),s=this._calculateViewBoxDimension(c,"Y");return this.viewBoxArray.push(new M2(t,s)),this.folioService.getFolioSvgData(c,e)}))}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(c,t,s)=>{let i=e2(s[t]).attr("contentSegmentId");return this.isSelectedSvgSheet(i)})})}_calculateViewBoxDimension(e,c){let t=`format${c}`,s=`initialOffset${c}`;return(e[t]+2*e[s])*e.factor}_d3Select(e){return e2(e)}},C.ctorParameters=()=>[{type:X}],C.propDecorators={selectedConvolute:[{type:r}],selectedSvgSheet:[{type:r}],openModalRequest:[{type:n}],selectSvgSheetRequest:[{type:n}]},C);G=l([d({selector:"awg-edition-folio-viewer",template:U2,changeDetection:f.OnPush,styles:[j2]})],G);var Z=class{};Z=l([h({imports:[m],declarations:[G],exports:[G]})],Z);var K=class{};K=l([h({imports:[m,Z],declarations:[I],exports:[I]})],K);var X2=`<!-- content: edition detail -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- loading spinner -->
    @if (isLoading) {
        <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <awg-error-alert [errorObject]="errorObject"></awg-error-alert>
        } @else {
            <div class="awg-sheets-view">
                <!-- accolade view -->
                <awg-edition-accolade
                    [svgSheetsData]="svgSheetsData"
                    [selectedSvgSheet]="selectedSvgSheet"
                    [selectedTextcritics]="selectedTextcritics"
                    [selectedTextcriticalCommentBlocks]="selectedTextcriticalCommentBlocks"
                    [showTkA]="showTkA"
                    (browseSvgSheetRequest)="onBrowseSvgSheet($event)"
                    (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                    (openModalRequest)="modal.open($event)"
                    (selectLinkBoxRequest)="onLinkBoxSelect($event)"
                    (selectOverlaysRequest)="onOverlaySelect($event)"
                    (selectSvgSheetRequest)="onSvgSheetSelect($event)">
                </awg-edition-accolade>

                <!-- convolute view -->
                @if (selectedConvolute && selectedSvgSheet) {
                    <awg-edition-convolute
                        [selectedConvolute]="selectedConvolute"
                        [selectedSvgSheet]="selectedSvgSheet"
                        (openModalRequest)="modal.open($event)"
                        (selectSvgSheetRequest)="onSvgSheetSelect($event)">
                    </awg-edition-convolute>
                }
            </div>
        }
    }
</div>
`;var Z2="";var L,B=(L=class{constructor(e,c,t,s,i,o){this.editionDataService=e,this.editionSheetsService=c,this.editionStateService=t,this.utils=s,this.route=i,this.router=o,this.errorObject=null,this.isLoading=!0,this.showTkA=!1,this._destroyed$=new R,this._isFirstPageLoad=!0}get editionRouteConstants(){return S2}ngOnInit(){this.getEditionSheetsData()}getEditionSheetsData(){this.errorObject=null,this.snapshotQueryParamsId=this.route.snapshot.queryParamMap.get("id"),l2([this.route.paramMap,this.route.queryParamMap]).pipe(Y(([e,c])=>this._fetchEditionComplexData(c)),o2(e=>(this.errorObject=e,this.isLoading=!1,i2)),P(this._destroyed$)).subscribe({next:()=>{this.isLoading=!1},error:e=>{this.errorObject=e,this.isLoading=!1}})}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let c=this.selectedTextcritics.linkBoxes.find(t=>t.svgGroupId===e);if(c){let t=c.linkTo;this.onSvgSheetSelect(t)}}onReportFragmentNavigate(e){let c=this.editionRouteConstants.EDITION_REPORT.route,t={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,c,t)}onOverlaySelect(e){this.selectedTextcriticalCommentBlocks=this.editionSheetsService.getTextcriticalCommentsForOverlays(this.selectedTextcritics.comments,e),this.showTkA=this.utils.isNotEmptyArray(this.selectedTextcriticalCommentBlocks)}onBrowseSvgSheet(e){let c=this.editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,this.svgSheetsData.sheets);if(!c)return;let t=this.svgSheetsData.sheets[c],s=this.editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,t);this.onSvgSheetSelect({complexId:"",sheetId:s})}onSvgSheetSelect(e){let c=this.editionRouteConstants.EDITION_SHEETS.route,t={queryParams:{id:e?.sheetId??""},queryParamsHandling:"merge"};this._navigateWithComplexId(e?.complexId,c,t)}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}_assignData(e){this.folioConvoluteData=e[0],this.svgSheetsData=e[1],this.textcriticsData=e[2]}_fetchEditionComplexData(e){return this.isLoading=!0,this.editionStateService.getSelectedEditionComplex().pipe(H(c=>this.editionComplex=c),Y(c=>this.editionDataService.getEditionSheetsData(c)),H(c=>this._assignData(c)),H(()=>this._handleQueryParams(e)))}_getDefaultSheetId(){let e=this.svgSheetsData?.sheets?.sketchEditions?.[0],c=e?.content?.length>1?e.content[0]?.partial:"";return(e?.id||"")+c}_handleQueryParams(e){let c=e?.get("id");c&&this.svgSheetsData?this._selectSvgSheet(c):(c=this._isFirstPageLoad&&this.snapshotQueryParamsId?this.snapshotQueryParamsId:this._getDefaultSheetId(),c===""&&(this.selectedSvgSheet=void 0),this.onSvgSheetSelect({complexId:"",sheetId:c})),this._isFirstPageLoad=!1,this.isLoading=!1}_navigateWithComplexId(e,c,t){let s=e?`/edition/complex/${e}/`:this.editionComplex.baseRoute;this.router.navigate([s,c],t)}_selectSvgSheet(e){e&&(this.selectedSvgSheet=this.editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets,e),this.selectedConvolute=this.editionSheetsService.selectConvolute(this.folioConvoluteData.convolutes,this.svgSheetsData.sheets,this.selectedSvgSheet),this.selectedTextcritics=this.editionSheetsService.findTextcritics(this.textcriticsData.textcritics,this.selectedSvgSheet),this.onOverlaySelect([]),this.utils.isNotEmptyObject(this.selectedTextcritics)&&this.utils.isNotEmptyArray(this.selectedTextcritics.comments)&&(this.selectedTextcriticalCommentBlocks=this.selectedTextcritics.comments))}},L.ctorParameters=()=>[{type:x2},{type:w2},{type:y2},{type:M},{type:f2},{type:h2}],L.propDecorators={modal:[{type:v,args:["modal",{static:!0}]}]},L);B=l([d({selector:"awg-edition-sheets",template:X2,styles:[Z2]})],B);var u1=[{path:"",component:B,data:{title:"AWG Online Edition \u2013 Sheets"}}],K2=[B],Q=class{};Q=l([h({imports:[J.forChild(u1)],exports:[J]})],Q);var Q2=class{};Q2=l([h({imports:[m,j,K,Q],declarations:[K2]})],Q2);export{Q2 as EditionSheetsModule};
