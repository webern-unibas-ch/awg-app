import{a as ke,e as Ee}from"./chunk-4RPXFLXR.js";import{a as Re}from"./chunk-5P5U7A4G.js";import{a as I}from"./chunk-F5BKVLD6.js";import{a as _}from"./chunk-FRZFNUKS.js";import{a as ae,i as ve,m as S}from"./chunk-SZ6QTUJO.js";import{$ as pe,Aa as be,Ba as xe,J as le,U as de,V as he,Y as ce,_ as ge,ca as Se,ea as me,fa as ue,ga as fe,ha as _e,la as Ce,pa as ye,qa as we,xa as B}from"./chunk-KVOJL3ZT.js";import{c as ne,e as re,i as P}from"./chunk-CP3FWJPD.js";import"./chunk-TWKUN5EV.js";import"./chunk-7YSBWCTR.js";import"./chunk-BFBPMFLO.js";import"./chunk-D4YXZXFT.js";import{Aa as ie,Ca as p,I as X,K,Nb as u,Qb as oe,V as $,W as J,X as O,a as H,b as j,ea as d,g as Z,k as V,la as ee,n as Y,na as r,o as n,ra as te,sb as h,ub as l,v as Q,vb as a,xb as se,yb as v}from"./chunk-SL5PEVTS.js";var Te=`<h6 class="card-title">
    {{ facetItemLabel }}:
    @if (facetItemLabel === 'Werkeditionen') {
        <awg-disclaimer-workeditions />
    } @else if (!UTILS.isNotEmptyArray(svgSheets)) {
        <span>---</span>
    }
</h6>
@for (svgSheet of svgSheets; track svgSheet.id) {
    @if (svgSheet.content.length === 1) {
        <a
            class="btn btn-default w-100 awg-svg-sheet-facet-link card-text text-start"
            [ngClass]="{ active: isSelectedSvgSheet(svgSheet.id), 'text-muted': !isSelectedSvgSheet(svgSheet.id) }"
            (click)="selectSvgSheet({ complexId: '', sheetId: svgSheet.id })"
            (keyup.enter)="selectSvgSheet({ complexId: '', sheetId: svgSheet.id })"
            role="link"
            tabindex="0">
            {{ svgSheet.label }}
        </a>
    }
    @if (svgSheet.content.length > 1) {
        <div class="awg-svg-sheet-facet-link-dropdown" ngbDropdown>
            <a
                class="btn card-text"
                id="dropDownSheetFacet"
                ngbDropdownToggle
                [ngClass]="{ active: isSelectedSvgSheet(svgSheet.id), 'text-muted': !isSelectedSvgSheet(svgSheet.id) }">
                <span
                    >{{ svgSheet.label }} <span class="badge bg-secondary">{{ svgSheet.content.length }}</span></span
                >
            </a>
            <div ngbDropdownMenu aria-labelledby="dropDownSheetFacet">
                @for (svgSheetContent of svgSheet.content; track svgSheetContent.svg; let i = $index) {
                    <div>
                        <a
                            class="dropdown-item"
                            [ngClass]="{
                                active: isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial),
                                'text-muted': !isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial),
                            }"
                            (click)="selectSvgSheet({ complexId: '', sheetId: svgSheet.id + svgSheetContent.partial })"
                            (keyup.enter)="
                                selectSvgSheet({ complexId: '', sheetId: svgSheet.id + svgSheetContent.partial })
                            "
                            role="link"
                            tabindex="0"
                            >{{ svgSheet.label }}
                            <span class="text-muted">[{{ i + 1 }}/{{ svgSheet.content.length }}]</span></a
                        >
                    </div>
                }
            </div>
        </div>
    }
}
`;var Le=`a#dropDownSheetFacet.btn{border:none!important}a#dropDownSheetFacet.active,a#dropDownSheetFacet:active{color:#0f777a!important}a#dropDownSheetFacet:hover{color:#333!important}a#dropDownSheetFacet>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var C=class{constructor(){this.selectSvgSheetRequest=new r,this.UTILS=d(_)}isSelectedSvgSheet(e,t){let i=e,s=this.selectedSvgSheet?.id;return t&&this.selectedSvgSheet?.content?.[0]?.partial&&(i+=t,s+=this.selectedSvgSheet.content[0].partial),i===s}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.propDecorators={facetItemLabel:[{type:l}],svgSheets:[{type:l}],selectedSvgSheet:[{type:l}],selectSvgSheetRequest:[{type:a}]}}};C=n([h({selector:"awg-edition-svg-sheet-facet-item",template:Te,changeDetection:p.OnPush,standalone:!1,styles:[Le]})],C);var Oe=`@if (svgSheetsData) {
    <div class="card awg-svg-sheet-facet">
        <button
            type="button"
            class="btn btn-sm border rounded m-2"
            [title]="isMinimized ? 'Maximize' : 'Minimize'"
            (click)="toggleSheetFacet()">
            <fa-icon [icon]="isMinimized ? faListUl : faAnglesLeft" />
        </button>
        @if (!isMinimized) {
            <div class="card-body">
                <awg-edition-svg-sheet-facet-item
                    [facetItemLabel]="'Werkeditionen'"
                    [svgSheets]="svgSheetsData.sheets.workEditions"
                    [selectedSvgSheet]="selectedSvgSheet"
                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                <hr />
                <awg-edition-svg-sheet-facet-item
                    [facetItemLabel]="'Texteditionen'"
                    [svgSheets]="svgSheetsData.sheets.textEditions"
                    [selectedSvgSheet]="selectedSvgSheet"
                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                <hr />
                <awg-edition-svg-sheet-facet-item
                    [facetItemLabel]="'Skizzeneditionen'"
                    [svgSheets]="svgSheetsData.sheets.sketchEditions"
                    [selectedSvgSheet]="selectedSvgSheet"
                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
            </div>
        }
    </div>
}
`;var Ie="";var y=class{constructor(){this.isMinimized=!1,this.selectSvgSheetRequest=new r,this.toggleSheetFacetRequest=new r,this.faAnglesLeft=ge,this.faListUl=pe}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleSheetFacet(){this.toggleSheetFacetRequest.emit(!this.isMinimized)}static{this.propDecorators={isMinimized:[{type:l}],svgSheetsData:[{type:l}],selectedSvgSheet:[{type:l}],selectSvgSheetRequest:[{type:a}],toggleSheetFacetRequest:[{type:a}]}}};y=n([h({selector:"awg-edition-svg-sheet-facet",template:Oe,changeDetection:p.OnPush,standalone:!1,styles:[Ie]})],y);var F=class{};F=n([v({imports:[S],declarations:[y,C],exports:[y,C]})],F);var Fe=`<div class="awg-edition-svg-sheet-footer mt-4">
    @if (UTILS.isNotEmptyObject(selectedTextcritics)) {
        <div class="card awg-edition-svg-sheet-footer-evaluation">
            <div class="card-body">
                <p (click)="toggleEvaluation()" (keydown)="toggleEvaluation()" tabindex="0" style="cursor: pointer">
                    @if (UTILS.isNotEmptyArray(selectedTextcritics.evaluations)) {
                        <span>
                            <fa-icon [icon]="showEvaluation ? faChevronDown : faChevronRight" />
                            &nbsp;
                        </span>
                    }

                    <span class="smallcaps"
                        ><awg-edition-tka-label [id]="selectedTextcritics?.id" [labelType]="'evaluation'" />:</span
                    >

                    @if (!UTILS.isNotEmptyArray(selectedTextcritics.evaluations)) {
                        <span>&nbsp;---</span>
                    }
                </p>
                @if (showEvaluation && UTILS.isNotEmptyArray(selectedTextcritics.evaluations)) {
                    <awg-edition-tka-evaluations
                        [evaluations]="selectedTextcritics.evaluations"
                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                        (openModalRequest)="openModal($event)"
                        (selectSvgSheetRequest)="selectSvgSheet($event)" />
                }
            </div>
        </div>
        @if (showTkA) {
            <div class="card awg-edition-svg-sheet-footer-textcritics">
                <div class="card-body">
                    <p class="smallcaps">
                        <awg-edition-tka-label [id]="selectedTextcritics?.id" [labelType]="'commentary'" />:
                    </p>
                    <awg-edition-tka-table
                        [commentary]="selectedTextcriticalCommentary"
                        [isRowTable]="selectedTextcritics?.rowtable"
                        [isSketchId]="UTILS.isSketchId(selectedTextcritics?.id)"
                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                        (openModalRequest)="openModal($event)"
                        (selectSvgSheetRequest)="selectSvgSheet($event)" />
                </div>
            </div>
        }
    }
</div>
`;var Ae="";var w=class{constructor(){this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.faChevronRight=le,this.faChevronDown=de,this.showEvaluation=!1,this.UTILS=d(_),this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleEvaluation(){this.showEvaluation=!this.showEvaluation}static{this.ctorParameters=()=>[]}static{this.propDecorators={selectedTextcriticalCommentary:[{type:l}],selectedTextcritics:[{type:l}],showTkA:[{type:l}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]}}};w=n([h({selector:"awg-edition-svg-sheet-footer",template:Fe,changeDetection:p.OnPush,standalone:!1,styles:[Ae]})],w);var A=class{};A=n([v({imports:[S,I],declarations:[w],exports:[w]})],A);var De=`<div class="awg-edition-svg-sheet-viewer-nav">
    <div class="prev" (click)="browseSvgSheet(-1)" (keydown)="browseSvgSheet(-1)" tabindex="0">
        <span>&#10094;</span>
    </div>
    <div class="next" (click)="browseSvgSheet(1)" (keydown)="browseSvgSheet(1)" tabindex="0">
        <span>&#10095;</span>
    </div>
</div>
`;var Me=`.awg-edition-svg-sheet-viewer-nav>.prev,.awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}.awg-edition-svg-sheet-viewer-nav>.prev:hover,.awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}.awg-edition-svg-sheet-viewer-nav>.prev span,.awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#0f777a}.awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd;border-top-left-radius:5px;border-bottom-left-radius:5px}.awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd;border-top-right-radius:5px;border-bottom-right-radius:5px}
`;var b=class{constructor(){this.browseSvgSheetRequest=new r}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}static{this.propDecorators={browseSvgSheetRequest:[{type:a}]}}};b=n([h({selector:"awg-edition-svg-sheet-viewer-nav",template:De,changeDetection:p.OnPush,standalone:!1,styles:[Me]})],b);var qe=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
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
            @if (hasAvailableTkkOverlays) {
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
                            <awg-edition-tka-label [id]="id" [labelType]="'commentary'"
                        /></label>
                    </div>
                </div>
            }
        </div>
    </div>
</div>
`;var Ge="";var x=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new r,this.toggleTkkClassesHighlightRequest=new r,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let t=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,t),this.suppliedClasses.set(e,!t);let i=Array.from(this.suppliedClasses.values());i.every(s=>s===i[0])&&(this.allClassesVisible=i[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,t)=>{this.suppliedClasses.set(t,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){this.tkkHighlightingVisible=e??!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,t){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:t})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],t=e.every(Boolean),i=!e.some(Boolean);(t||i)&&(this.allClassesVisible=e[0])}static{this.propDecorators={id:[{type:l}],suppliedClasses:[{type:l}],hasAvailableTkkOverlays:[{type:l}],toggleSuppliedClassesOpacityRequest:[{type:a}],toggleTkkClassesHighlightRequest:[{type:a}]}}};x=n([h({selector:"awg-edition-svg-sheet-viewer-switch",template:qe,changeDetection:p.OnPush,standalone:!1,styles:[Ge]})],x);var Ne=`@if (selectedSvgSheet) {
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
                        <fa-icon [icon]="faCompressArrowsAlt" />
                    </button>
                </div>
            </div>
            <div #svgSheetContainer class="awg-edition-svg-sheet-container px-2r">
                <svg #svgSheetElement id="awg-edition-svg-sheet">
                    <g #svgSheetRootGroup id="awg-edition-svg-sheet-root-group" />
                </svg>

                <awg-license />

                @if (hasAvailableTkkOverlays || suppliedClasses.size > 0) {
                    <awg-edition-svg-sheet-viewer-switch
                        [id]="selectedSvgSheet.id"
                        [suppliedClasses]="suppliedClasses"
                        [hasAvailableTkkOverlays]="hasAvailableTkkOverlays"
                        (toggleSuppliedClassesOpacityRequest)="onSuppliedClassesOpacityToggle($event)"
                        (toggleTkkClassesHighlightRequest)="onTkkClassesHighlightToggle($event)" />
                }
            </div>

            <!-- Next and previous buttons -->
            <awg-edition-svg-sheet-viewer-nav (browseSvgSheetRequest)="browseSvgSheet($event)" />
        </div>
    </div>
}
`;var ze=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7;border-radius:5px}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#0f777a}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#0f777a;border:1.8px solid #0f777a;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#0f777a;border:1.8px solid #0f777a;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#0f777a;border:1.8px solid #0f777a;border-radius:10px;cursor:pointer;margin-top:0}
`;var R=class{constructor(){this.browseSvgSheetRequest=new r,this.selectLinkBoxRequest=new r,this.selectOverlaysRequest=new r,this.faCompressArrowsAlt=he,this.hasAvailableTkkOverlays=!1,this.sliderConfig=new ke(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._isRendered=!1,this._destroyed$=new V,this._resize$=new V,this._cdr=d(oe),this._svgDrawingService=d(be),this._svgOverlayService=d(xe),this.ref=this}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(K(150),J(this._destroyed$)).subscribe(()=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:t,isCurrentlyVisible:i}=e;this._svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,t,i)}onTkkClassesHighlightToggle(e){this._svgOverlayService.toggleTkkOverlayHighlights(this.svgSheetRootGroupSelection,me.tkk,e)}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._svgOverlayService.clearSvgOverlays(),this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this._getSuppliedClasses(),this._cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return Z(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this._svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this._svgOverlayService.createSvgOverlays(this.svgSheetRootGroupSelection,e=>this._onLinkBoxSelect(e),e=>this._onTkkOverlaySelect(e)),this.hasAvailableTkkOverlays=this._svgOverlayService.hasAvailableTkkOverlays}_getContainerDimensions(e){let t=this._svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:t.width,this._divHeight=this._divHeight?this._divHeight:t.height}_getSuppliedClasses(){this.suppliedClasses=this._svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onTkkOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let t=this.sliderConfig.stepSize;return((o,c)=>+(Math.round(+(o+"e"+c))+"e-"+c))(e,(o=>Math.floor(o)===o?0:o.toString().split(".")[1].length)(t))}_zoomHandler(e,t){let i=s=>{let o=s.transform,c=this._roundToScaleStepDecimalPrecision(o.k);e.attr("transform",o),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=c,this.sliderConfig.value=c),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=c+"x")};this._zoomBehaviour=Ee().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",i),t.call(this._zoomBehaviour)}static{this.ctorParameters=()=>[]}static{this.propDecorators={svgSheetContainerRef:[{type:u,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:u,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:u,args:["svgSheetRootGroup"]}],sliderInput:[{type:u,args:["sliderInput"]}],sliderInputLabel:[{type:u,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:l}],browseSvgSheetRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],onResize:[{type:se,args:["window:resize"]}]}}};R=n([h({selector:"awg-edition-svg-sheet-viewer",template:Ne,changeDetection:p.OnPush,standalone:!1,styles:[ze]})],R);var D=class{};D=n([v({imports:[S,I],declarations:[R,b,x],exports:[R,b,x]})],D);var Ve=`<div ngbAccordion #accoladeAcc [class.fullscreen]="isFullscreen()">
    <div ngbAccordionItem="awg-accolade-view" [collapsed]="false">
        <div ngbAccordionHeader class="accordion-button awg-accordion-button-custom-header justify-content-between">
            <button ngbAccordionToggle class="btn btn-link text-start p-0">Edierte Notentexte</button>
            <div class="ms-auto">
                @if (!isFullscreen()) {
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-info"
                        (click)="openModal('HINT_EDITION_SHEETS')">
                        Hinweise zur Nutzung
                    </button>
                }
                <awg-fullscreen-toggle [fsElement]="accoladeAcc" />
            </div>
        </div>
        <div ngbAccordionCollapse>
            <div ngbAccordionBody>
                <ng-template>
                    <div class="row">
                        <div
                            class="awg-svg-sheet-facet-container mb-4"
                            [ngClass]="{
                                'col-auto': isSheetFacetMinimized,
                                'col-12 col-lg-4 col-xl-3': !isSheetFacetMinimized,
                            }">
                            <!-- svg sheet facet -->
                            <awg-edition-svg-sheet-facet
                                [svgSheetsData]="svgSheetsData"
                                [isMinimized]="isSheetFacetMinimized"
                                [selectedSvgSheet]="selectedSvgSheet"
                                (selectSvgSheetRequest)="selectSvgSheet($event)"
                                (toggleSheetFacetRequest)="toggleSheetFacet($event)" />
                        </div>

                        <div
                            class="awg-svg-sheet-viewer-container"
                            [ngClass]="{
                                col: isSheetFacetMinimized,
                                'col-12 col-lg-8 col-xl-9': !isSheetFacetMinimized,
                            }">
                            <!-- svg sheet -->
                            @if (selectedSvgSheet) {
                                <awg-edition-svg-sheet-viewer
                                    [selectedSvgSheet]="selectedSvgSheet"
                                    (browseSvgSheetRequest)="browseSvgSheet($event)"
                                    (selectLinkBoxRequest)="selectLinkBox($event)"
                                    (selectOverlaysRequest)="selectOverlays($event)" />
                            }

                            <!-- table for TkA -->
                            @if (selectedSvgSheet && selectedTextcritics) {
                                <awg-edition-svg-sheet-footer
                                    [selectedTextcritics]="selectedTextcritics"
                                    [selectedTextcriticalCommentary]="selectedTextcriticalCommentary"
                                    [showTkA]="showTkA"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                        </div>
                    </div>
                </ng-template>
            </div>
        </div>
    </div>
</div>
`;var $e=`:host{display:block;height:100%}.fullscreen{height:100vh;width:100vw;overflow-x:hidden;overflow-y:scroll;background-color:#fff}
`;var k=class{constructor(){this._fullscreenService=d(ve),this.browseSvgSheetRequest=new r,this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectLinkBoxRequest=new r,this.selectOverlaysRequest=new r,this.selectSvgSheetRequest=new r,this.toggleSheetFacetRequest=new r,this.isFullscreen=this._fullscreenService.isFullscreen}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleSheetFacet(e){e!==void 0&&this.toggleSheetFacetRequest.emit(e)}static{this.propDecorators={isSheetFacetMinimized:[{type:l}],svgSheetsData:[{type:l}],selectedSvgSheet:[{type:l}],selectedTextcriticalCommentary:[{type:l}],selectedTextcritics:[{type:l}],showTkA:[{type:l}],browseSvgSheetRequest:[{type:a}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],selectSvgSheetRequest:[{type:a}],toggleSheetFacetRequest:[{type:a}]}}};k=n([h({selector:"awg-edition-accolade",template:Ve,changeDetection:p.OnPush,standalone:!1,styles:[$e]})],k);var M=class{};M=n([v({imports:[S,F,A,D],declarations:[k],exports:[k]})],M);var Pe=`<div ngbAccordion>
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
                        (selectSvgSheetRequest)="selectSvgSheet($event)" />

                    <!-- convolute legend -->
                    <div class="awg-convolute-legend col-12">
                        Legende:&nbsp;
                        @for (legend of folioLegends; track legend) {
                            <span class="{{ legend.color }}">
                                <fa-icon [icon]="faSquare" />
                                {{ legend.label }}
                            </span>
                        }
                    </div>
                </ng-template>
            </div>
        </div>
    </div>
</div>
`;var Be="";var E=class{constructor(){this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.faSquare=ce,this.folioLegends=[{color:"olivedrab",label:"aktuell ausgew\xE4hlt"},{color:"orange",label:"ausw\xE4hlbar"},{color:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.propDecorators={selectedConvolute:[{type:l}],selectedSvgSheet:[{type:l}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]}}};E=n([h({selector:"awg-edition-convolute",template:Pe,changeDetection:p.OnPush,standalone:!1,styles:[Be]})],E);var Ue=`<!-- embedded svg: Edition Folio Viewer -->
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
`;var We=`.svgGrid{margin-bottom:2em}.svgRow{padding-top:1em;width:inherit;text-align:center;box-shadow:5px 5px 6px #ccc;border:1px solid #eeeeee}.svgCol{display:inline-block}
`;var q=class{constructor(){this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentStrokeWidth=2,this._defaultNumberOfSystems=18,this._reversedRotationAngle=180,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7}getFolioSvgData(e,t){let i=new ue(e,t,this._contentSegmentOffsetCorrection);return new fe(i)}addViewBoxToSvgCanvas(e,t){e.attr("viewBox",t.viewBox).attr("width",t.svgWidth).attr("height",t.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,t,i){this.ref=i;let s=this._appendCanvasSheetGroup(e,t.sheet.folioId);this._addFolioSheetToSvgCanvas(s,t),this._addFolioSystemsToSvgCanvas(s,t),this._addFolioContentSegmentsToSvgCanvas(s,t)}_addFolioSheetToSvgCanvas(e,t){let{sheet:i}=t,{folioId:s,sheetRectangle:o,trademarkRectangle:c}=i;this._appendSheetGroupSheetTitle(e,s),this._appendSheetGroupSheetRectangle(e,o),c&&this._appendSheetGroupTrademark(e,c,s,t.systems.systemsReversed)}_addFolioSystemsToSvgCanvas(e,t){t.systems.systemsLines.forEach((i,s)=>{let o=t.systems.systemsReversed?t.systems.systemsLines.length-s:s+1,c=t.systems.systemsLabelPositions[s],m=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:o,class:"systems-group"}),f=this._appendSvgElementWithAttrs(m,"g",{systemLineGroupId:o,class:"system-line-group"});this._appendSystemsGroupLabel(m,c,o),this._appendSystemsGroupLines(f,i)})}_addFolioContentSegmentsToSvgCanvas(e,t){t?.contentSegments?.forEach(i=>{if(!i)return;let s=this._appendContentSegmentGroup(e,i),o=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(o,i.segmentVertices,t.systems.systemsLines.length),this._appendContentSegmentLinkLabel(o,i)})}_appendCanvasSheetGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:t,class:"sheet-group"})}_appendContentSegmentGroup(e,t){let i=this._appendContentSegmentGroupElement(e,t);return this._appendContentSegmentGroupTitle(i,t),i.on("click",()=>t.selectable?this.ref.selectSvgSheet({complexId:t.complexId,sheetId:t.sheetId}):this.ref.openModal(t.linkTo)),i}_appendContentSegmentGroupElement(e,t){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:t.segmentLabel,contentSegmentId:t.sheetId,class:"content-segment-group",stroke:t.selectable?this._fgColor:this._disabledColor,fill:t.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,t){return this._appendSvgElementWithAttrs(e,"title",{}).text(t.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,t){let i=this._appendContentSegmentLinkLabelTextElement(e,t.centeredXPosition,t.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(i,t),t.segmentReversed&&i.attr("transform",`rotate(${this._reversedRotationAngle}, ${t.centeredXPosition}, ${t.centeredYPosition})`),i}_appendContentSegmentLinkLabelTextElement(e,t,i){let s={class:"content-segment-label",x:t,y:i};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,t){t.segmentLabelArray.forEach((i,s)=>{if(i!==""){let o={};s>0&&(o.x=t.centeredXPosition,o.y=t.centeredYPosition,o.dy="1.2em",o["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",o).text(i)}})}_appendContentSegmentLinkPolygon(e,t,i=this._defaultNumberOfSystems){let s=this._contentSegmentStrokeWidth*(this._defaultNumberOfSystems/i),o={class:"content-segment-shape",points:t,fill:this._contentSegmentFillColor};return o["stroke-width"]=s,this._appendSvgElementWithAttrs(e,"polygon",o)}_appendSheetGroupSheetRectangle(e,t){let{x:i,y:s}=t.UPPER_LEFT_CORNER,{x:o,y:c}=t.LOWER_RIGHT_CORNER,m={x:i,y:s,width:o-i,height:c-s,fill:this._sheetFillColor,stroke:this._bgColor};return m["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",m)}_appendSheetGroupSheetTitle(e,t){this._appendSvgElementWithAttrs(e,"title",{class:"sheet-group-title"}).text(`Bl. ${t}`)}_appendSheetGroupTrademark(e,t,i,s){let o=this._appendSheetGroupTrademarkGroup(e,i);this._appendSheetGroupTrademarkRectangle(o,t),this._appendSheetGroupTrademarkSymbol(o,t,s),this._appendSheetGroupTrademarkTitle(o)}_appendSheetGroupTrademarkGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{trademarkGroupId:t,class:"trademark-group"})}_appendSheetGroupTrademarkRectangle(e,t){let{x:i,y:s}=t.UPPER_LEFT_CORNER,{x:o,y:c}=t.LOWER_RIGHT_CORNER,m={class:"trademark-rectangle",x:i,y:s,width:o-i,height:c-s,fill:this._sheetFillColor,stroke:this._bgColor};return m["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",m)}_appendSheetGroupTrademarkSymbol(e,t,i){let{x:s,y:o}=t.UPPER_LEFT_CORNER,{x:c,y:m}=t.LOWER_RIGHT_CORNER,f=(s+c)/2,Qe=(o+m)/2,Xe="M 10 39 Q 12 36 14 39 T 18 39 Q 20 36 22 39 T 26 39 Q 28 36 30 39 T 34 39 M 10 43 T 34 43 M 14 31 L 15 30 L 17 30 L 15 26 L 17 23 L 22 23 L 18 31 L 14 31 M 20 31 L 21 30 L 23 30 L 21 26 L 22 23 L 27 23 L 24 31 L 20 31 M 14 17 L 18 15 L 21 14 L 22 15 L 21 17 L 18 17 L 14 19 M 13 15 L 14 17 L 14 19 L 13 19 L 13 19 L 12 19 L 13 18 L 12 18 L 13 17 L 12 17 L 13 15 M 17 23 L 20 20 L 21 17 L 22 15 L 25 15 L 27 23 M 26 24 L 30 20 L 30 17 L 29 18 L 28 18 L 28 17 L 30 15 L 31 17 L 31 21 L 26 25 M 25 15 L 27 14 L 26 13 L 27 12 L 26 11 L 27 10 L 26 9 L 27 8 L 26 7 L 25 8 L 24 7 L 23 8 L 22 7 L 21 8 L 20 7 L 19 8 L 18 9 L 19 9 L 21 10 L 18 11 L 20 12 L 18 13 L 21 14 L 22 15",U=`translate(${f-10}, ${Qe-10}) scale(0.5)`;i&&(U+=` rotate(${this._reversedRotationAngle}, 20, 20)`);let W={class:"trademark-symbol",d:Xe,fill:this._disabledColor,stroke:this._disabledColor,transform:U};return W["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"path",W)}_appendSheetGroupTrademarkTitle(e){this._appendSvgElementWithAttrs(e,"title",{class:"trademark-title"}).text("Firmenzeichen")}_appendSystemsGroupLabel(e,t,i){let s={class:"system-label",x:t.x,y:t.y,fill:this._bgColor};s["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",s).text(i)}_appendSystemsGroupLines(e,t){t.forEach(i=>{let{x:s,y:o}=i.START_POINT,{x:c,y:m}=i.END_POINT,f={class:"system-line",x1:s,y1:o,x2:c,y2:m,stroke:this._bgColor};f["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",f)})}_appendSvgElementWithAttrs(e,t,i){let s=e.append(t);return Object.keys(i).forEach(o=>{s.attr(o,i[o])}),s}};q=n([ie({providedIn:"root"})],q);var T=class{constructor(){this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0},this._folioService=d(q),this.ref=this}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,t)=>{let i=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(i);s.empty()||(s.selectAll("*").remove(),this._folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[t]),this._folioService.addFolioToSvgCanvas(s,e,this.ref),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let t=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${t}`}openModal(e){e&&this.openModalRequest.emit(e)}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let t=j(H({},this._folioSettings),{formatX:+e.dimensions.width,formatY:+e.dimensions.height,numberOfFolios:this.selectedConvolute.folios.length}),i=this._calculateViewBoxDimension(t,"X"),s=this._calculateViewBoxDimension(t,"Y");return this.viewBoxArray.push(new _e(i,s)),this._folioService.getFolioSvgData(t,e)}))}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(t,i,s)=>{let o=B(s[i]).attr("contentSegmentId");return this.isSelectedSvgSheet(o)})})}_calculateViewBoxDimension(e,t){let i=`format${t}`,s=`initialOffset${t}`;return(e[i]+2*e[s])*e.factor}_d3Select(e){return B(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={selectedConvolute:[{type:l}],selectedSvgSheet:[{type:l}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]}}};T=n([h({selector:"awg-edition-folio-viewer",template:Ue,changeDetection:p.OnPush,standalone:!1,styles:[We]})],T);var G=class{};G=n([v({imports:[S],declarations:[T],exports:[T]})],G);var N=class{};N=n([v({imports:[S,G],declarations:[E],exports:[E]})],N);var He=`<!-- content: edition detail -->
<div>
    <!-- modal -->
    <awg-modal #modal />

    <!-- loading spinner -->
    @if (isLoading() && isFirstPageLoad()) {
        <awg-twelve-tone-spinner />
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <awg-alert-error [errorObject]="errorObject" />
        } @else {
            <div class="awg-sheets-view">
                <!-- accolade view -->
                <awg-edition-accolade
                    [isSheetFacetMinimized]="isSheetFacetMinimized"
                    [svgSheetsData]="svgSheetsData"
                    [selectedSvgSheet]="selectedSvgSheet"
                    [selectedTextcritics]="selectedTextcritics"
                    [selectedTextcriticalCommentary]="selectedTextcriticalCommentary"
                    [showTkA]="showTkA"
                    (browseSvgSheetRequest)="onBrowseSvgSheet($event)"
                    (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                    (openModalRequest)="modal.open($event)"
                    (selectLinkBoxRequest)="onLinkBoxSelect($event)"
                    (selectOverlaysRequest)="onOverlaySelect($event)"
                    (selectSvgSheetRequest)="onSvgSheetSelect($event)"
                    (toggleSheetFacetRequest)="onToggleSheetFacet($event)" />

                <!-- convolute view -->
                @if (selectedConvolute && selectedSvgSheet) {
                    <awg-edition-convolute
                        [selectedConvolute]="selectedConvolute"
                        [selectedSvgSheet]="selectedSvgSheet"
                        (openModalRequest)="modal.open($event)"
                        (selectSvgSheetRequest)="onSvgSheetSelect($event)" />
                }
            </div>
        }
    }
</div>
`;var je="";var L=class{constructor(){this._destroyRef=d(ee),this._editionDataService=d(Ce),this._editionSheetsService=d(ye),this._editionStateService=d(we),this._loadingService=d(Re),this._route=d(ne),this._router=d(re),this._utils=d(_),this.errorObject=null,this.isSheetFacetMinimized=!1,this.showTkA=!1,this.isFirstPageLoad=te(!0),this.isLoading=this._loadingService.isLoading}get editionRouteConstants(){return Se}ngOnInit(){this.getEditionSheetsData()}getEditionSheetsData(){this.errorObject=null,this.snapshotQueryParamsId=this._route.snapshot.queryParamMap.get("id"),Q([this._route.paramMap,this._route.queryParamMap]).pipe($(([,e])=>this._fetchEditionComplexData(e)),X(e=>(this.errorObject=e,Y)),ae(this._destroyRef)).subscribe()}onBrowseSvgSheet(e){let t=this._editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,this.svgSheetsData.sheets);if(!t)return;let i=this.svgSheetsData.sheets[t],s=this._editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,i);this.onSvgSheetSelect({complexId:"",sheetId:s})}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let t=this.selectedTextcritics.linkBoxes.find(i=>i.svgGroupId===e);if(t){let i=t.linkTo;this.onSvgSheetSelect(i)}}onOverlaySelect(e){this.selectedTextcriticalCommentary=this._editionSheetsService.filterTextcriticalCommentaryForOverlays(this.selectedTextcritics.commentary,e),this.showTkA=this._utils.isNotEmptyArray(this.selectedTextcriticalCommentary.comments)}onReportFragmentNavigate(e){let t=this.editionRouteConstants.EDITION_REPORT.route,i={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,t,i)}onSvgSheetSelect(e){let t=this.editionRouteConstants.EDITION_SHEETS.route,i={queryParams:{id:e?.sheetId??""},queryParamsHandling:"merge"};this._navigateWithComplexId(e?.complexId,t,i)}onToggleSheetFacet(e){this.isSheetFacetMinimized=e}_assignData(e){this.folioConvoluteData=e[0],this.svgSheetsData=e[1],this.textcriticsData=e[2]}_fetchEditionComplexData(e){return this._editionStateService.getSelectedEditionComplex().pipe(O(t=>this.editionComplex=t),$(t=>this._editionDataService.getEditionSheetsData(t)),O(t=>this._assignData(t)),O(()=>this._handleQueryParams(e)))}_getDefaultSheetId(){let e=this.svgSheetsData?.sheets,t=e?.textEditions?.[0]||e?.sketchEditions?.[0],i=t?.content?.[0]?.partial??"";return(t?.id||"")+i}_handleQueryParams(e){let t=e?.get("id");t&&this.svgSheetsData?this._selectSvgSheet(t):(t=this.isFirstPageLoad()&&this.snapshotQueryParamsId?this.snapshotQueryParamsId:this._getDefaultSheetId(),t===""&&(this.selectedSvgSheet=void 0),this.onSvgSheetSelect({complexId:"",sheetId:t})),this.isFirstPageLoad.set(!1)}_navigateWithComplexId(e,t,i){let s=e?`/edition/complex/${e}`:this.editionComplex.baseRoute;this._router.navigate([s,t],i)}_selectSvgSheet(e){e&&(this.selectedSvgSheet=this._editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets,e),this.selectedConvolute=this._editionSheetsService.selectConvolute(this.folioConvoluteData.convolutes,this.svgSheetsData.sheets,this.selectedSvgSheet),this.selectedTextcritics=this._editionSheetsService.findTextcritics(this.textcriticsData.textcritics,this.selectedSvgSheet),this.onOverlaySelect([]),this._utils.isNotEmptyObject(this.selectedTextcritics)&&this._utils.isNotEmptyObject(this.selectedTextcritics.commentary)&&(this.selectedTextcriticalCommentary=this.selectedTextcritics.commentary))}static{this.propDecorators={modal:[{type:u,args:["modal",{static:!0}]}]}}};L=n([h({selector:"awg-edition-sheets",template:He,standalone:!1,styles:[je]})],L);var ft=[{path:"",component:L,data:{title:"AWG Online Edition \u2013 Sheets"}}],Ze=[L],z=class{};z=n([v({imports:[P.forChild(ft)],exports:[P]})],z);var Ye=class{};Ye=n([v({imports:[S,M,N,z],declarations:[Ze]})],Ye);export{Ye as EditionSheetsModule};
