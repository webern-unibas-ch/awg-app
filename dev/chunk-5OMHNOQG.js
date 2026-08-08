import{a as Ce,e as we}from"./chunk-OWEW2MD4.js";import{b as A}from"./chunk-GANPMFSJ.js";import{a as _e}from"./chunk-EOLR4ULI.js";import"./chunk-J6YE2MWP.js";import{d as Se,e as ue,f as fe}from"./chunk-7HH4BDZ7.js";import{g as W}from"./chunk-3F66QUQP.js";import{a as u}from"./chunk-GYSG6DRK.js";import{g as ce,m as I,n as C,o as m}from"./chunk-R5RUZ35P.js";import{L as he,P as ge,S as pe,T as ve,U as me,b as se}from"./chunk-4CUGHTIE.js";import{c as ie,i as B}from"./chunk-QMT6T66A.js";import"./chunk-MX52JLEQ.js";import{g as oe,q as re,r as ne,u as ae,w as le,x as de}from"./chunk-L4L6LNTA.js";import"./chunk-ACTUYJ3V.js";import{K as Y,Ua as l,W as X,Wa as n,Xa as p,Ya as ee,Za as v,a as $,b as j,da as a,g as Z,k as P,ka as g,kb as _,mb as te,na as Q,o as r,oa as K,va as J,xa as h}from"./chunk-2KO4WDDZ.js";var ye=`<h6 class="card-title">
    {{ facetItemLabel }}:
    @if (facetItemLabel === 'Werkeditionen') {
        <awg-disclaimer-workeditions />
    } @else if (UTILS.isEmptyArray(svgSheets)) {
        <span>---</span>
    }
</h6>
@for (svgSheet of svgSheets; track svgSheet.id) {
    @if (svgSheet.content.length === 1) {
        @let sheetIds = { complexId: '', sheetId: svgSheet.id };

        <a
            class="btn btn-default w-100 awg-svg-sheet-facet-link card-text text-start"
            [class.active]="isSelectedSvgSheet(svgSheet.id)"
            [class.text-muted]="!isSelectedSvgSheet(svgSheet.id)"
            (click)="selectSvgSheet(sheetIds)"
            (keyup.enter)="selectSvgSheet(sheetIds)"
            role="link"
            tabindex="0">
            {{ svgSheet.label }}
        </a>
    }
    @if (svgSheet.content.length > 1) {
        <div class="awg-svg-sheet-facet-link-dropdown" ngbDropdown>
            <a
                class="btn card-text"
                [class.active]="isSelectedSvgSheet(svgSheet.id)"
                [class.text-muted]="!isSelectedSvgSheet(svgSheet.id)"
                id="dropDownSheetFacet"
                ngbDropdownToggle>
                <span
                    >{{ svgSheet.label }} <span class="badge bg-secondary">{{ svgSheet.content.length }}</span></span
                >
            </a>
            <div ngbDropdownMenu aria-labelledby="dropDownSheetFacet">
                @for (svgSheetContent of svgSheet.content; track svgSheetContent.svg; let i = $index) {
                    @let sheetWithPartialIds = { complexId: '', sheetId: svgSheet.id + svgSheetContent.partial };

                    <div>
                        <a
                            class="dropdown-item"
                            [class.active]="isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial)"
                            [class.text-muted]="!isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial)"
                            (click)="selectSvgSheet(sheetWithPartialIds)"
                            (keyup.enter)="selectSvgSheet(sheetWithPartialIds)"
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
`;var be=`a#dropDownSheetFacet.btn{border:none!important}a#dropDownSheetFacet.active,a#dropDownSheetFacet:active{color:#0f777a!important}a#dropDownSheetFacet:hover{color:#333!important}a#dropDownSheetFacet>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var w=class{constructor(){this._navigationService=a(C),this.UTILS=u}isSelectedSvgSheet(e,t){let i=e,s=this.selectedSvgSheet?.id;return t&&this.selectedSvgSheet?.content?.[0]?.partial&&(i+=t,s+=this.selectedSvgSheet.content[0].partial),i===s}selectSvgSheet(e){e?.sheetId&&this._navigationService.navigateToSvgSheet(e)}static{this.propDecorators={facetItemLabel:[{type:n}],svgSheets:[{type:n}],selectedSvgSheet:[{type:n}]}}};w=r([l({selector:"awg-edition-svg-sheet-facet-item",template:ye,changeDetection:h.OnPush,standalone:!1,styles:[be]})],w);var xe=`@if (svgSheetsData) {
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
                    [selectedSvgSheet]="selectedSvgSheet" />
                <hr />
                <awg-edition-svg-sheet-facet-item
                    [facetItemLabel]="'Texteditionen'"
                    [svgSheets]="svgSheetsData.sheets.textEditions"
                    [selectedSvgSheet]="selectedSvgSheet" />
                <hr />
                <awg-edition-svg-sheet-facet-item
                    [facetItemLabel]="'Skizzeneditionen'"
                    [svgSheets]="svgSheetsData.sheets.sketchEditions"
                    [selectedSvgSheet]="selectedSvgSheet" />
            </div>
        }
    </div>
}
`;var ke="";var y=class{constructor(){this.isMinimized=!1,this.toggleSheetFacetRequest=new g,this.faAnglesLeft=le,this.faListUl=de}toggleSheetFacet(){this.toggleSheetFacetRequest.emit(!this.isMinimized)}static{this.propDecorators={isMinimized:[{type:n}],svgSheetsData:[{type:n}],selectedSvgSheet:[{type:n}],toggleSheetFacetRequest:[{type:p}]}}};y=r([l({selector:"awg-edition-svg-sheet-facet",template:xe,changeDetection:h.OnPush,standalone:!1,styles:[ke]})],y);var F=class{};F=r([v({imports:[m],declarations:[y,w],exports:[y,w]})],F);var Ee=`<div class="awg-edition-svg-sheet-footer mt-4">
    @if (!UTILS.isEmptyObject(selectedTextcritics)) {
        <div class="card awg-edition-svg-sheet-footer-evaluation">
            <div class="card-body">
                <p (click)="toggleEvaluation()" (keydown)="toggleEvaluation()" tabindex="0" style="cursor: pointer">
                    @if (!UTILS.isEmptyArray(selectedTextcritics.evaluations)) {
                        <span>
                            <fa-icon [icon]="showEvaluation ? faChevronDown : faChevronRight" />
                            &nbsp;
                        </span>
                    }

                    <span class="smallcaps"
                        ><awg-edition-tka-label [id]="selectedTextcritics?.id" [labelType]="'evaluation'" />:</span
                    >

                    @if (UTILS.isEmptyArray(selectedTextcritics.evaluations)) {
                        <span>&nbsp;---</span>
                    }
                </p>
                @if (showEvaluation && !UTILS.isEmptyArray(selectedTextcritics.evaluations)) {
                    <awg-edition-tka-evaluations [evaluations]="selectedTextcritics.evaluations" />
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
                        [id]="selectedTextcritics?.id"
                        [isRowtable]="selectedTextcritics?.rowtable" />
                </div>
            </div>
        }
    }
</div>
`;var Le="";var b=class{constructor(){this.UTILS=u,this.faChevronRight=oe,this.faChevronDown=re,this.showEvaluation=!1}toggleEvaluation(){this.showEvaluation=!this.showEvaluation}static{this.propDecorators={selectedTextcriticalCommentary:[{type:n}],selectedTextcritics:[{type:n}],showTkA:[{type:n}]}}};b=r([l({selector:"awg-edition-svg-sheet-footer",template:Ee,changeDetection:h.OnPush,standalone:!1,styles:[Le]})],b);var D=class{};D=r([v({imports:[m,A],declarations:[b],exports:[b]})],D);var Te=`<div class="awg-edition-svg-sheet-viewer-nav">
    <div class="prev" (click)="browseSvgSheet(-1)" (keydown)="browseSvgSheet(-1)" tabindex="0">
        <span>&#10094;</span>
    </div>
    <div class="next" (click)="browseSvgSheet(1)" (keydown)="browseSvgSheet(1)" tabindex="0">
        <span>&#10095;</span>
    </div>
</div>
`;var Re=`.awg-edition-svg-sheet-viewer-nav>.prev,.awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}.awg-edition-svg-sheet-viewer-nav>.prev:hover,.awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}.awg-edition-svg-sheet-viewer-nav>.prev span,.awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#0f777a}.awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd;border-top-left-radius:5px;border-bottom-left-radius:5px}.awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd;border-top-right-radius:5px;border-bottom-right-radius:5px}
`;var x=class{constructor(){this.browseSvgSheetRequest=new g}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}static{this.propDecorators={browseSvgSheetRequest:[{type:p}]}}};x=r([l({selector:"awg-edition-svg-sheet-viewer-nav",template:Te,changeDetection:h.OnPush,standalone:!1,styles:[Re]})],x);var Oe=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
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
`;var Ie="";var k=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new g,this.toggleTkkClassesHighlightRequest=new g,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let t=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,t),this.suppliedClasses.set(e,!t);let i=Array.from(this.suppliedClasses.values());i.every(s=>s===i[0])&&(this.allClassesVisible=i[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,t)=>{this.suppliedClasses.set(t,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){this.tkkHighlightingVisible=e??!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,t){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:t})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],t=e.every(Boolean),i=!e.some(Boolean);(t||i)&&(this.allClassesVisible=e[0])}static{this.propDecorators={id:[{type:n}],suppliedClasses:[{type:n}],hasAvailableTkkOverlays:[{type:n}],toggleSuppliedClassesOpacityRequest:[{type:p}],toggleTkkClassesHighlightRequest:[{type:p}]}}};k=r([l({selector:"awg-edition-svg-sheet-viewer-switch",template:Oe,changeDetection:h.OnPush,standalone:!1,styles:[Ie]})],k);var Ae=`@if (selectedSvgSheet) {
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
`;var Fe=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7;border-radius:5px}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#0f777a}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#0f777a;border:1.8px solid #0f777a;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#0f777a;border:1.8px solid #0f777a;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#0f777a;border:1.8px solid #0f777a;border-radius:10px;cursor:pointer;margin-top:0}
`;var E=class{constructor(){this._cdr=a(te),this._svgDrawingService=a(ue),this._svgOverlayService=a(fe),this.browseSvgSheetRequest=new g,this.selectLinkBoxRequest=new g,this.selectOverlaysRequest=new g,this.faCompressArrowsAlt=ne,this.hasAvailableTkkOverlays=!1,this.sliderConfig=new Ce(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._isRendered=!1,this._destroyed$=new P,this._resize$=new P}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(Y(150),X(this._destroyed$)).subscribe(()=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:t,isCurrentlyVisible:i}=e;this._svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,t,i)}onTkkClassesHighlightToggle(e){this._svgOverlayService.toggleTkkOverlayHighlights(this.svgSheetRootGroupSelection,ge.tkk,e)}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._svgOverlayService.clearSvgOverlays(),this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this._getSuppliedClasses(),this._cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return Z(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this._svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this._svgOverlayService.createSvgOverlays(this.svgSheetRootGroupSelection,e=>this._onLinkBoxSelect(e),e=>this._onTkkOverlaySelect(e)),this.hasAvailableTkkOverlays=this._svgOverlayService.hasAvailableTkkOverlays}_getContainerDimensions(e){let t=this._svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:t.width,this._divHeight=this._divHeight?this._divHeight:t.height}_getSuppliedClasses(){this.suppliedClasses=this._svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onTkkOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let t=this.sliderConfig.stepSize;return((o,d)=>+(Math.round(+(o+"e"+d))+"e-"+d))(e,(o=>Math.floor(o)===o?0:o.toString().split(".")[1].length)(t))}_zoomHandler(e,t){let i=s=>{let o=s.transform,d=this._roundToScaleStepDecimalPrecision(o.k);e.attr("transform",o),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=d,this.sliderConfig.value=d),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=d+"x")};this._zoomBehaviour=we().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",i),t.call(this._zoomBehaviour)}static{this.propDecorators={svgSheetContainerRef:[{type:_,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:_,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:_,args:["svgSheetRootGroup"]}],sliderInput:[{type:_,args:["sliderInput"]}],sliderInputLabel:[{type:_,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:n}],browseSvgSheetRequest:[{type:p}],selectLinkBoxRequest:[{type:p}],selectOverlaysRequest:[{type:p}],onResize:[{type:ee,args:["window:resize"]}]}}};E=r([l({selector:"awg-edition-svg-sheet-viewer",template:Ae,changeDetection:h.OnPush,standalone:!1,styles:[Fe]})],E);var M=class{};M=r([v({imports:[m,A],declarations:[E,x,k],exports:[E,x,k]})],M);var De=`<div ngbAccordion #accoladeAcc [class.fullscreen]="isFullscreen()">
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
                            [class]="isSheetFacetMinimized ? 'col-auto' : 'col-12 col-lg-4 col-xl-3'">
                            <!-- svg sheet facet -->
                            <awg-edition-svg-sheet-facet
                                [svgSheetsData]="svgSheetsData"
                                [isMinimized]="isSheetFacetMinimized"
                                [selectedSvgSheet]="selectedSvgSheet"
                                (toggleSheetFacetRequest)="toggleSheetFacet($event)" />
                        </div>

                        <div
                            class="awg-svg-sheet-viewer-container"
                            [class]="isSheetFacetMinimized ? 'col' : 'col-12 col-lg-8 col-xl-9'">
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
                                    [showTkA]="showTkA" />
                            }
                        </div>
                    </div>
                </ng-template>
            </div>
        </div>
    </div>
</div>
`;var Me=`:host{display:block;height:100%}.fullscreen{height:100vh;width:100vw;overflow-x:hidden;overflow-y:scroll;background-color:#fff}
`;var L=class{constructor(){this._modalService=a(I),this.browseSvgSheetRequest=new g,this.selectLinkBoxRequest=new g,this.selectOverlaysRequest=new g,this.toggleSheetFacetRequest=new g,this.isFullscreen=a(ce).isFullscreen}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}openModal(e){e&&this._modalService.openTextModal(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}toggleSheetFacet(e){e!==void 0&&this.toggleSheetFacetRequest.emit(e)}static{this.propDecorators={isSheetFacetMinimized:[{type:n}],svgSheetsData:[{type:n}],selectedSvgSheet:[{type:n}],selectedTextcriticalCommentary:[{type:n}],selectedTextcritics:[{type:n}],showTkA:[{type:n}],browseSvgSheetRequest:[{type:p}],selectLinkBoxRequest:[{type:p}],selectOverlaysRequest:[{type:p}],toggleSheetFacetRequest:[{type:p}]}}};L=r([l({selector:"awg-edition-accolade",template:De,changeDetection:h.OnPush,standalone:!1,styles:[Me]})],L);var G=class{};G=r([v({imports:[m,F,D,M],declarations:[L],exports:[L]})],G);var Ge=`<div ngbAccordion>
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
                            <a [routerLink]="['../report']" [fragment]="'source_' + selectedConvolute.convoluteId">{{
                                selectedConvolute.convoluteLabel
                            }}</a>
                        </p>
                    </div>

                    <!-- viewer for convolute folios -->
                    <awg-edition-folio-viewer
                        [selectedConvolute]="selectedConvolute"
                        [selectedSvgSheet]="selectedSvgSheet" />

                    <!-- convolute legend -->
                    <div class="awg-convolute-legend col-12">
                        Legende:&nbsp;
                        @for (legend of folioLegends; track legend.colorClass) {
                            <span [class]="legend.colorClass">
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
`;var ze="";var T=class{constructor(){this.faSquare=ae,this.folioLegends=[{colorClass:"olivedrab",label:"aktuell ausgew\xE4hlt"},{colorClass:"orange",label:"ausw\xE4hlbar"},{colorClass:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}static{this.propDecorators={selectedConvolute:[{type:n}],selectedSvgSheet:[{type:n}]}}};T=r([l({selector:"awg-edition-convolute",template:Ge,changeDetection:h.OnPush,standalone:!1,styles:[ze]})],T);var Ve=`<!-- embedded svg: Edition Folio Viewer -->
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
`;var Ne=`.svgGrid{margin-bottom:2em}.svgRow{padding-top:1em;width:inherit;text-align:center;box-shadow:5px 5px 6px #ccc;border:1px solid #eeeeee}.svgCol{display:inline-block}
`;var z=class{constructor(){this._modalService=a(I),this._navigationService=a(C),this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentStrokeWidth=2,this._defaultNumberOfSystems=18,this._reversedRotationAngle=180,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7}getFolioSvgData(e,t){let i=new pe(e,t,this._contentSegmentOffsetCorrection);return new ve(i)}addViewBoxToSvgCanvas(e,t){e.attr("viewBox",t.viewBox).attr("width",t.svgWidth).attr("height",t.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,t){let i=this._appendCanvasSheetGroup(e,t.sheet.folioId);this._addFolioSheetToSvgCanvas(i,t),this._addFolioSystemsToSvgCanvas(i,t),this._addFolioContentSegmentsToSvgCanvas(i,t)}_addFolioSheetToSvgCanvas(e,t){let{sheet:i}=t,{folioId:s,sheetRectangle:o,trademarkRectangle:d}=i;this._appendSheetGroupSheetTitle(e,s),this._appendSheetGroupSheetRectangle(e,o),d&&this._appendSheetGroupTrademark(e,d,s,t.systems.systemsReversed)}_addFolioSystemsToSvgCanvas(e,t){t.systems.systemsLines.forEach((i,s)=>{let o=t.systems.systemsReversed?t.systems.systemsLines.length-s:s+1,d=t.systems.systemsLabelPositions[s],S=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:o,class:"systems-group"}),f=this._appendSvgElementWithAttrs(S,"g",{systemLineGroupId:o,class:"system-line-group"});this._appendSystemsGroupLabel(S,d,o),this._appendSystemsGroupLines(f,i)})}_addFolioContentSegmentsToSvgCanvas(e,t){t?.contentSegments?.forEach(i=>{if(!i)return;let s=this._appendContentSegmentGroup(e,i),o=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(o,i.segmentVertices,t.systems.systemsLines.length),this._appendContentSegmentLinkLabel(o,i)})}_appendCanvasSheetGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:t,class:"sheet-group"})}_appendContentSegmentGroup(e,t){let i=this._appendContentSegmentGroupElement(e,t);return this._appendContentSegmentGroupTitle(i,t),i.on("click",()=>t.selectable?this._navigationService.navigateToSvgSheet({complexId:t.complexId,sheetId:t.sheetId}):this._modalService.openTextModal(t.linkTo)),i}_appendContentSegmentGroupElement(e,t){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:t.segmentLabel,contentSegmentId:t.sheetId,class:"content-segment-group",stroke:t.selectable?this._fgColor:this._disabledColor,fill:t.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,t){return this._appendSvgElementWithAttrs(e,"title",{}).text(t.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,t){let i=this._appendContentSegmentLinkLabelTextElement(e,t.centeredXPosition,t.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(i,t),t.segmentReversed&&i.attr("transform",`rotate(${this._reversedRotationAngle}, ${t.centeredXPosition}, ${t.centeredYPosition})`),i}_appendContentSegmentLinkLabelTextElement(e,t,i){let s={class:"content-segment-label",x:t,y:i};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,t){t.segmentLabelArray.forEach((i,s)=>{if(i!==""){let o={};s>0&&(o.x=t.centeredXPosition,o.y=t.centeredYPosition,o.dy="1.2em",o["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",o).text(i)}})}_appendContentSegmentLinkPolygon(e,t,i=this._defaultNumberOfSystems){let s=this._contentSegmentStrokeWidth*(this._defaultNumberOfSystems/i),o={class:"content-segment-shape",points:t,fill:this._contentSegmentFillColor};return o["stroke-width"]=s,this._appendSvgElementWithAttrs(e,"polygon",o)}_appendSheetGroupSheetRectangle(e,t){let{x:i,y:s}=t.UPPER_LEFT_CORNER,{x:o,y:d}=t.LOWER_RIGHT_CORNER,S={x:i,y:s,width:o-i,height:d-s,fill:this._sheetFillColor,stroke:this._bgColor};return S["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",S)}_appendSheetGroupSheetTitle(e,t){this._appendSvgElementWithAttrs(e,"title",{class:"sheet-group-title"}).text(`Bl. ${t}`)}_appendSheetGroupTrademark(e,t,i,s){let o=this._appendSheetGroupTrademarkGroup(e,i);this._appendSheetGroupTrademarkRectangle(o,t),this._appendSheetGroupTrademarkSymbol(o,t,s),this._appendSheetGroupTrademarkTitle(o)}_appendSheetGroupTrademarkGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{trademarkGroupId:t,class:"trademark-group"})}_appendSheetGroupTrademarkRectangle(e,t){let{x:i,y:s}=t.UPPER_LEFT_CORNER,{x:o,y:d}=t.LOWER_RIGHT_CORNER,S={class:"trademark-rectangle",x:i,y:s,width:o-i,height:d-s,fill:this._sheetFillColor,stroke:this._bgColor};return S["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",S)}_appendSheetGroupTrademarkSymbol(e,t,i){let{x:s,y:o}=t.UPPER_LEFT_CORNER,{x:d,y:S}=t.LOWER_RIGHT_CORNER,f=(s+d)/2,Ue=(o+S)/2,He="M 10 39 Q 12 36 14 39 T 18 39 Q 20 36 22 39 T 26 39 Q 28 36 30 39 T 34 39 M 10 43 T 34 43 M 14 31 L 15 30 L 17 30 L 15 26 L 17 23 L 22 23 L 18 31 L 14 31 M 20 31 L 21 30 L 23 30 L 21 26 L 22 23 L 27 23 L 24 31 L 20 31 M 14 17 L 18 15 L 21 14 L 22 15 L 21 17 L 18 17 L 14 19 M 13 15 L 14 17 L 14 19 L 13 19 L 13 19 L 12 19 L 13 18 L 12 18 L 13 17 L 12 17 L 13 15 M 17 23 L 20 20 L 21 17 L 22 15 L 25 15 L 27 23 M 26 24 L 30 20 L 30 17 L 29 18 L 28 18 L 28 17 L 30 15 L 31 17 L 31 21 L 26 25 M 25 15 L 27 14 L 26 13 L 27 12 L 26 11 L 27 10 L 26 9 L 27 8 L 26 7 L 25 8 L 24 7 L 23 8 L 22 7 L 21 8 L 20 7 L 19 8 L 18 9 L 19 9 L 21 10 L 18 11 L 20 12 L 18 13 L 21 14 L 22 15",U=`translate(${f-10}, ${Ue-10}) scale(0.5)`;i&&(U+=` rotate(${this._reversedRotationAngle}, 20, 20)`);let H={class:"trademark-symbol",d:He,fill:this._disabledColor,stroke:this._disabledColor,transform:U};return H["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"path",H)}_appendSheetGroupTrademarkTitle(e){this._appendSvgElementWithAttrs(e,"title",{class:"trademark-title"}).text("Firmenzeichen")}_appendSystemsGroupLabel(e,t,i){let s={class:"system-label",x:t.x,y:t.y,fill:this._bgColor};s["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",s).text(i)}_appendSystemsGroupLines(e,t){t.forEach(i=>{let{x:s,y:o}=i.START_POINT,{x:d,y:S}=i.END_POINT,f={class:"system-line",x1:s,y1:o,x2:d,y2:S,stroke:this._bgColor};f["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",f)})}_appendSvgElementWithAttrs(e,t,i){let s=e.append(t);return Object.keys(i).forEach(o=>{s.attr(o,i[o])}),s}};z=r([J({providedIn:"root"})],z);var R=class{constructor(){this._folioService=a(z),this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0}}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,t)=>{let i=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(i);s.empty()||(s.selectAll("*").remove(),this._folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[t]),this._folioService.addFolioToSvgCanvas(s,e),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let t=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${t}`}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let t=j($({},this._folioSettings),{formatX:+e.dimensions.width,formatY:+e.dimensions.height,numberOfFolios:this.selectedConvolute.folios.length}),i=this._calculateViewBoxDimension(t,"X"),s=this._calculateViewBoxDimension(t,"Y");return this.viewBoxArray.push(new me(i,s)),this._folioService.getFolioSvgData(t,e)}))}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(t,i,s)=>{let o=W(s[i]).attr("contentSegmentId");return this.isSelectedSvgSheet(o)})})}_calculateViewBoxDimension(e,t){let i=`format${t}`,s=`initialOffset${t}`;return(e[i]+2*e[s])*e.factor}_d3Select(e){return W(e)}static{this.propDecorators={selectedConvolute:[{type:n}],selectedSvgSheet:[{type:n}]}}};R=r([l({selector:"awg-edition-folio-viewer",template:Ve,changeDetection:h.OnPush,standalone:!1,styles:[Ne]})],R);var V=class{};V=r([v({imports:[m],declarations:[R],exports:[R]})],V);var N=class{};N=r([v({imports:[m,V],declarations:[T],exports:[T]})],N);var qe=`<!-- content: edition detail -->
<div>
    @if (viewData(); as view) {
        @if (view.error; as errorObject) {
            <awg-alert-error [errorObject]="errorObject" />
        } @else if (isFirstPageLoad() || view.isLoading) {
            <awg-twelve-tone-spinner />
        } @else {
            <div class="awg-edition-sheets-view">
                <!-- accolade view -->
                <awg-edition-accolade
                    [isSheetFacetMinimized]="isSheetFacetMinimized"
                    [svgSheetsData]="view.data.svgSheetsData"
                    [selectedSvgSheet]="selectedSvgSheet"
                    [selectedTextcritics]="selectedTextcritics"
                    [selectedTextcriticalCommentary]="selectedTextcriticalCommentary"
                    [showTkA]="showTkA"
                    (browseSvgSheetRequest)="onBrowseSvgSheet($event)"
                    (selectLinkBoxRequest)="onLinkBoxSelect($event)"
                    (selectOverlaysRequest)="onOverlaySelect($event)"
                    (toggleSheetFacetRequest)="onToggleSheetFacet($event)" />

                <!-- convolute view -->
                @if (selectedConvolute && selectedSvgSheet) {
                    <awg-edition-convolute
                        [selectedConvolute]="selectedConvolute"
                        [selectedSvgSheet]="selectedSvgSheet" />
                }
            </div>
        }
    }
</div>
`;var Pe="";var O=class{constructor(){this._editionSheetsService=a(Se),this._navigationService=a(C),this._route=a(ie),this._queryParams=se(this._route.queryParamMap,{initialValue:this._route.snapshot.queryParamMap}),this.isSheetFacetMinimized=!1,this.showTkA=!1,this.selectedEditionComplex=a(he).selectedEditionComplex,this.viewData=a(_e).sheetsViewData,this.isFirstPageLoad=Q(!0),K(()=>{let e=this._queryParams(),t=this.viewData().data.svgSheetsData;!this.selectedEditionComplex()||!t?.sheets||this._handleQueryParams(e,t)})}onBrowseSvgSheet(e){let t=this.viewData().data.svgSheetsData.sheets,i=this._editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,t);if(!i)return;let s=t[i],o=this._editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,s);this.onSvgSheetSelect({complexId:"",sheetId:o})}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let t=this.selectedTextcritics.linkBoxes.find(i=>i.svgGroupId===e);if(t){let i=t.linkTo;this.onSvgSheetSelect(i)}}onOverlaySelect(e){this.selectedTextcriticalCommentary=this._editionSheetsService.filterTextcriticalCommentaryForOverlays(this.selectedTextcritics.commentary,e),this.showTkA=!u.isEmptyArray(this.selectedTextcriticalCommentary.comments)}onSvgSheetSelect(e){e?.sheetId&&this._navigationService.navigateToSvgSheet(e)}onToggleSheetFacet(e){this.isSheetFacetMinimized=e}_getDefaultSheetId(e){let t=e?.sheets,i=t?.textEditions?.[0]||t?.sketchEditions?.[0],s=i?.content?.[0]?.partial??"";return(i?.id||"")+s}_handleQueryParams(e,t){let i=e?.get("id");if(i&&t)this._selectSvgSheet(i);else{let s=this._getDefaultSheetId(t);s===""&&(this.selectedSvgSheet=void 0),this.onSvgSheetSelect({complexId:"",sheetId:s})}this.isFirstPageLoad()&&this.isFirstPageLoad.set(!1)}_selectSvgSheet(e){if(!e)return;let t=this.viewData(),i=t.data.svgSheetsData.sheets,s=t.data.folioConvoluteData.convolutes,o=t.data.textcriticsData.textcritics;this.selectedSvgSheet=this._editionSheetsService.selectSvgSheetById(i,e),this.selectedConvolute=this._editionSheetsService.selectConvolute(s,i,this.selectedSvgSheet),this.selectedTextcritics=this._editionSheetsService.findTextcritics(o,this.selectedSvgSheet),this.onOverlaySelect([]),u.isEmptyObject(this.selectedTextcritics?.commentary)||(this.selectedTextcriticalCommentary=this.selectedTextcritics.commentary)}static{this.ctorParameters=()=>[]}};O=r([l({selector:"awg-edition-sheets",template:qe,standalone:!1,styles:[Pe]})],O);var gt=[{path:"",component:O,data:{title:"AWG Online Edition \u2013 Sheets"}}],Be=[O],q=class{};q=r([v({imports:[B.forChild(gt)],exports:[B]})],q);var We=class{};We=r([v({imports:[m,G,N,q],declarations:[Be]})],We);export{We as EditionSheetsModule};
