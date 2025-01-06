import{a as L}from"./chunk-TZ33BDHS.js";import{a as _e,e as we}from"./chunk-HTXLBIK7.js";import{A as q,D as p,Fb as le,Gb as de,Hb as _,I as J,Ib as ce,Jb as he,K as r,Ka as ie,Kb as ge,La as se,Lb as ve,M as g,Na as H,Pb as pe,R as m,S as c,Sb as Se,Ta as oe,Tb as ue,U as l,V as a,Va as ne,W as ee,X as v,_b as U,a as W,b as j,bc as me,ca as te,cb as re,f as Z,h as y,i as Y,ib as ae,ic as fe,j as n,o as X,pb as f,qc as S,s as Q,t as K,y as P,z as A}from"./chunk-MY4WBR6X.js";var ye=`<div class="awg-edition-svg-sheet-footer mt-4">
    @if (UTILS.isNotEmptyObject(selectedTextcritics)) {
        <div class="card awg-edition-svg-sheet-footer-evaluation">
            <div class="card-body">
                <p (click)="toggleEvaluation()" (keydown)="toggleEvaluation()" tabindex="0" style="cursor: pointer">
                    @if (UTILS.isNotEmptyArray(selectedTextcritics.evaluations)) {
                        <span>
                            <fa-icon [icon]="showEvaluation ? faChevronDown : faChevronRight"></fa-icon>
                            &nbsp;
                        </span>
                    }

                    <span class="smallcaps"
                        ><awg-edition-tka-label
                            [id]="selectedTextcritics?.id"
                            [labelType]="'evaluation'"></awg-edition-tka-label
                        >:</span
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
                        (selectSvgSheetRequest)="selectSvgSheet($event)">
                    </awg-edition-tka-evaluations>
                }
            </div>
        </div>
        @if (showTkA) {
            <div class="card awg-edition-svg-sheet-footer-textcritics">
                <div class="card-body">
                    <p class="smallcaps">
                        <awg-edition-tka-label
                            [id]="selectedTextcritics?.id"
                            [labelType]="'commentary'"></awg-edition-tka-label
                        >:
                    </p>
                    <awg-edition-tka-table
                        [commentary]="selectedTextcriticalCommentary"
                        [isRowTable]="selectedTextcritics?.rowtable"
                        [isSketchId]="UTILS.isSketchId(selectedTextcritics?.id)"
                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                        (openModalRequest)="openModal($event)"
                        (selectSvgSheetRequest)="selectSvgSheet($event)">
                    </awg-edition-tka-table>
                </div>
            </div>
        }
    }
</div>
`;var Ce="";var C=class{constructor(){this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.faChevronRight=ae,this.faChevronDown=re,this.showEvaluation=!1,this.UTILS=p(f),this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleEvaluation(){this.showEvaluation=!this.showEvaluation}static{this.ctorParameters=()=>[]}static{this.propDecorators={selectedTextcriticalCommentary:[{type:l}],selectedTextcritics:[{type:l}],showTkA:[{type:l}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]}}};C=n([c({selector:"awg-edition-svg-sheet-footer",template:ye,changeDetection:g.OnPush,standalone:!1,styles:[Ce]})],C);var F=class{};F=n([v({imports:[S,L],declarations:[C],exports:[C]})],F);var be=`<h6 class="card-title">
    {{ navItemLabel }}:
    @if (navItemLabel === 'Werkeditionen') {
        <awg-disclaimer-workeditions></awg-disclaimer-workeditions>
    } @else if (!utils.isNotEmptyArray(svgSheets)) {
        <span>---</span>
    }
</h6>
@for (svgSheet of svgSheets; track svgSheet.id) {
    @if (svgSheet.content.length === 1) {
        <a
            class="btn btn-default w-100 awg-svg-sheet-nav-link card-text text-start"
            [ngClass]="{ active: isSelectedSvgSheet(svgSheet.id), 'text-muted': !isSelectedSvgSheet(svgSheet.id) }"
            (click)="selectSvgSheet({ complexId: '', sheetId: svgSheet.id })"
            (keyup.enter)="selectSvgSheet({ complexId: '', sheetId: svgSheet.id })"
            role="link"
            tabindex="0">
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
`;var xe=`a#dropDownSheetNav.btn{border:none!important}a#dropDownSheetNav.active,a#dropDownSheetNav:active{color:#149b9e!important}a#dropDownSheetNav:hover{color:#333!important}a#dropDownSheetNav>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var b=class{constructor(e){this.utils=e,this.selectSvgSheetRequest=new r}isSelectedSvgSheet(e,t){let i=e,s=this.selectedSvgSheet?.id;return t&&this.selectedSvgSheet?.content?.[0]?.partial&&(i+=t,s+=this.selectedSvgSheet.content[0].partial),i===s}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[{type:f}]}static{this.propDecorators={navItemLabel:[{type:l}],svgSheets:[{type:l}],selectedSvgSheet:[{type:l}],selectSvgSheetRequest:[{type:a}]}}};b=n([c({selector:"awg-edition-svg-sheet-nav-item",template:be,changeDetection:g.OnPush,standalone:!1,styles:[xe]})],b);var ke=`@if (svgSheetsData) {
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
`;var Re="";var x=class{constructor(){this.selectSvgSheetRequest=new r}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.propDecorators={svgSheetsData:[{type:l}],selectedSvgSheet:[{type:l}],selectSvgSheetRequest:[{type:a}]}}};x=n([c({selector:"awg-edition-svg-sheet-nav",template:ke,changeDetection:g.OnPush,standalone:!1,styles:[Re]})],x);var M=class{};M=n([v({imports:[S],declarations:[x,b],exports:[x,b]})],M);var Ee=`<div class="awg-edition-svg-sheet-viewer-nav">
    <div class="prev" (click)="browseSvgSheet(-1)" (keydown)="browseSvgSheet(-1)" tabindex="0">
        <span>&#10094;</span>
    </div>
    <div class="next" (click)="browseSvgSheet(1)" (keydown)="browseSvgSheet(1)" tabindex="0">
        <span>&#10095;</span>
    </div>
</div>
`;var Te=`.awg-edition-svg-sheet-viewer-nav>.prev,.awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}.awg-edition-svg-sheet-viewer-nav>.prev:hover,.awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}.awg-edition-svg-sheet-viewer-nav>.prev span,.awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#149b9e}.awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd;border-top-left-radius:5px;border-bottom-left-radius:5px}.awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd;border-top-right-radius:5px;border-bottom-right-radius:5px}
`;var k=class{constructor(){this.browseSvgSheetRequest=new r}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}static{this.propDecorators={browseSvgSheetRequest:[{type:a}]}}};k=n([c({selector:"awg-edition-svg-sheet-viewer-nav",template:Ee,changeDetection:g.OnPush,standalone:!1,styles:[Te]})],k);var Oe=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
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
                            <awg-edition-tka-label [id]="id" [labelType]="'commentary'"></awg-edition-tka-label
                        ></label>
                    </div>
                </div>
            }
        </div>
    </div>
</div>
`;var De="";var R=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new r,this.toggleTkkClassesHighlightRequest=new r,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let t=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,t),this.suppliedClasses.set(e,!t);let i=Array.from(this.suppliedClasses.values());i.every(s=>s===i[0])&&(this.allClassesVisible=i[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,t)=>{this.suppliedClasses.set(t,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){e!==void 0?this.tkkHighlightingVisible=e:this.tkkHighlightingVisible=!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,t){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:t})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],t=e.every(s=>s),i=e.every(s=>!s);(t||i)&&(this.allClassesVisible=e[0])}static{this.propDecorators={id:[{type:l}],suppliedClasses:[{type:l}],hasAvailableTkaOverlays:[{type:l}],toggleSuppliedClassesOpacityRequest:[{type:a}],toggleTkkClassesHighlightRequest:[{type:a}]}}};R=n([c({selector:"awg-edition-svg-sheet-viewer-switch",template:Oe,changeDetection:g.OnPush,standalone:!1,styles:[De]})],R);var Ie=`@if (selectedSvgSheet) {
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
`;var Ae=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7;border-radius:5px}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#149b9e}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;margin-top:0}
`;var E=class{constructor(){this.browseSvgSheetRequest=new r,this.selectLinkBoxRequest=new r,this.selectOverlaysRequest=new r,this.faCompressArrowsAlt=oe,this.hasAvailableTkaOverlays=!1,this.sliderConfig=new _e(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this._isRendered=!1,this._destroyed$=new y,this._resize$=new y,this._cdr=p(te),this._svgDrawingService=p(me),this.ref=this}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(K(150),A(this._destroyed$)).subscribe(()=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:t,isCurrentlyVisible:i}=e;this._svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,t,i)}onTkkClassesHighlightToggle(e){let t="tkk";this._svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,t).nodes().forEach(s=>{let[o,d]=this._getOverlayAndSelection(s.id,t),u=e?_.fill:_.transparent;this._svgDrawingService.updateTkkOverlayColor(o,d,u)})}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this._cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return Z(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this._svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this.svgSheetRootGroupSelection&&(this._createOverlays("link-box",this._createLinkBoxOverlay.bind(this)),this._createOverlays("tkk",this._createTkaOverlay.bind(this)),this.hasAvailableTkaOverlays=!!this._availableTkaOverlays&&this._availableTkaOverlays.length>0,this._getSuppliedClasses())}_createOverlays(e,t){let i=this._svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,e);i&&i.nodes().forEach(s=>{t(s,e)})}_createLinkBoxOverlay(e){let t=e.id,i=this._svgDrawingService.getD3SelectionById(this.svgSheetRootGroupSelection,t),s=i.select("path");s.style("fill",this._svgDrawingService.linkBoxFillColor),i.on("mouseover",()=>{let o=this._svgDrawingService.linkBoxHoverFillColor;this._svgDrawingService.fillD3SelectionWithColor(s,o),i.style("cursor","pointer")}).on("mouseout",()=>{let o=this._svgDrawingService.linkBoxFillColor;this._svgDrawingService.fillD3SelectionWithColor(s,o)}).on("click",()=>{this._onLinkBoxSelect(t)})}_createTkaOverlay(e,t){let i=e.id,s=e.getBBox();this._availableTkaOverlays.push(new ce(de.tka,i,!1));let o=this._svgDrawingService.createOverlayGroup(this.svgSheetRootGroupSelection,i,s,t),[d,u]=this._getOverlayAndSelection(i,t);o.on("mouseover",()=>{this._svgDrawingService.updateTkkOverlayColor(d,u,_.hover),u.style("cursor","pointer")}).on("mouseout",()=>{this._svgDrawingService.updateTkkOverlayColor(d,u,_.fill)}).on("click",()=>{d&&(d.isSelected=!d.isSelected),this._svgDrawingService.updateTkkOverlayColor(d,u,_.hover),this._selectedTkaOverlays=this._getSelectedOverlays(this._availableTkaOverlays),this._onOverlaySelect(this._selectedTkaOverlays)})}_getContainerDimensions(e){let t=this._svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:t.width,this._divHeight=this._divHeight?this._divHeight:t.height}_getOverlayById(e,t){return e.find(i=>i.id===t)}_getOverlayAndSelection(e,t){let i=this._getOverlayById(this._availableTkaOverlays,e),s=this._svgDrawingService.getOverlayGroupRectSelection(this.svgSheetRootGroupSelection,e,t);return[i,s]}_getSelectedOverlays(e){return e.filter(t=>t.isSelected)}_getSuppliedClasses(){this.suppliedClasses=this._svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let t=this.sliderConfig.stepSize;return((o,d)=>+(Math.round(+(o+"e"+d))+"e-"+d))(e,(o=>Math.floor(o)===o?0:o.toString().split(".")[1].length)(t))}_zoomHandler(e,t){let i=s=>{let o=s.transform,d=this._roundToScaleStepDecimalPrecision(o.k);e.attr("transform",o),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=d,this.sliderConfig.value=d),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=d+"x")};this._zoomBehaviour=we().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",i),t.call(this._zoomBehaviour)}static{this.ctorParameters=()=>[]}static{this.propDecorators={svgSheetContainerRef:[{type:m,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:m,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:m,args:["svgSheetRootGroup"]}],sliderInput:[{type:m,args:["sliderInput"]}],sliderInputLabel:[{type:m,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:l}],browseSvgSheetRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],onResize:[{type:ee,args:["window:resize"]}]}}};E=n([c({selector:"awg-edition-svg-sheet-viewer",template:Ie,standalone:!1,styles:[Ae]})],E);var G=class{};G=n([v({imports:[S,L],declarations:[E,k,R],exports:[E,k,R]})],G);var qe=`<div ngbAccordion #accoladeAcc [class.fullscreen]="isFullscreen">
    <div ngbAccordionItem="awg-accolade-view" [collapsed]="false">
        <div ngbAccordionHeader class="accordion-button awg-accordion-button-custom-header justify-content-between">
            <button ngbAccordionToggle class="btn btn-link text-start p-0">Edierte Notentexte</button>
            <div class="ms-auto">
                @if (!isFullscreen) {
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-info"
                        (click)="openModal('HINT_EDITION_SHEETS')">
                        Hinweise zur Nutzung
                    </button>
                }
                <awg-fullscreen-toggle
                    [fsElement]="accoladeAcc"
                    (toggleFullscreenRequest)="fullscreenToggle($event)"></awg-fullscreen-toggle>
            </div>
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
                                    [selectedTextcriticalCommentary]="selectedTextcriticalCommentary"
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
`;var Le=`:host{display:block;height:100%}.fullscreen{height:100vh;width:100vw;overflow-x:hidden;overflow-y:scroll;background-color:#fff}
`;var T=class{constructor(){this.browseSvgSheetRequest=new r,this.fullscreenToggleRequest=new r,this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectLinkBoxRequest=new r,this.selectOverlaysRequest=new r,this.selectSvgSheetRequest=new r}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}fullscreenToggle(e){e!==void 0&&this.fullscreenToggleRequest.emit(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.propDecorators={isFullscreen:[{type:l}],svgSheetsData:[{type:l}],selectedSvgSheet:[{type:l}],selectedTextcriticalCommentary:[{type:l}],selectedTextcritics:[{type:l}],showTkA:[{type:l}],browseSvgSheetRequest:[{type:a}],fullscreenToggleRequest:[{type:a}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]}}};T=n([c({selector:"awg-edition-accolade",template:qe,changeDetection:g.OnPush,standalone:!1,styles:[Le]})],T);var N=class{};N=n([v({imports:[S,F,M,G],declarations:[T],exports:[T]})],N);var Fe=`<div ngbAccordion>
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
`;var Me="";var O=class{constructor(){this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.faSquare=ne,this.folioLegends=[{color:"olivedrab",label:"aktuell ausgew\xE4hlt"},{color:"orange",label:"ausw\xE4hlbar"},{color:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.propDecorators={selectedConvolute:[{type:l}],selectedSvgSheet:[{type:l}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]}}};O=n([c({selector:"awg-edition-convolute",template:Fe,changeDetection:g.OnPush,standalone:!1,styles:[Me]})],O);var Ge=`<!-- embedded svg: Edition Folio Viewer -->
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
`;var $=class{constructor(){this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentReversedRotationAngle=180,this._contentSegmentStrokeWidth=2,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7}getFolioSvgData(e,t){let i=new he(e,t,this._contentSegmentOffsetCorrection);return new ge(i)}addViewBoxToSvgCanvas(e,t){e.attr("viewBox",t.viewBox).attr("width",t.svgWidth).attr("height",t.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,t,i){this.ref=i;let s=this._appendCanvasSheetGroup(e,t);this._addFolioSheetToSvgCanvas(s,t),this._addFolioSystemsToSvgCanvas(s,t),this._addFolioContentSegmentsToSvgCanvas(s,t)}_addFolioSheetToSvgCanvas(e,t){let{sheet:i}=t,{upperLeftCorner:s,lowerRightCorner:o,folioId:d}=i;this._appendSheetGroupTitle(e,d),this._appendSheetGroupRectangle(e,s,o)}_addFolioSystemsToSvgCanvas(e,t){t.systems.systemsLines.forEach((i,s)=>{let o=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:s+1,class:"systems-group"}),d=this._appendSvgElementWithAttrs(o,"g",{systemLineGroupId:s+1,class:"system-line-group"});this._appendSystemsGroupLabel(o,t,s),this._appendSystemsGroupLines(d,i)})}_addFolioContentSegmentsToSvgCanvas(e,t){t?.contentSegments?.forEach(i=>{if(!i)return;let s=this._appendContentSegmentGroup(e,i),o=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(o,i.segmentVertices),this._appendContentSegmentLinkLabel(o,i)})}_appendCanvasSheetGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:t.sheet.folioId,class:"sheet-group"})}_appendContentSegmentGroup(e,t){let i=this._appendContentSegmentGroupElement(e,t);return this._appendContentSegmentGroupTitle(i,t),i.on("click",()=>t.selectable?this.ref.selectSvgSheet({complexId:t.complexId,sheetId:t.sheetId}):this.ref.openModal(t.linkTo)),i}_appendContentSegmentGroupElement(e,t){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:t.segmentLabel,contentSegmentId:t.sheetId,class:"content-segment-group",stroke:t.selectable?this._fgColor:this._disabledColor,fill:t.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,t){return this._appendSvgElementWithAttrs(e,"title",{}).text(t.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,t){let i=this._appendContentSegmentLinkLabelTextElement(e,t.centeredXPosition,t.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(i,t),t.reversed&&i.attr("transform",`rotate(${this._contentSegmentReversedRotationAngle}, ${t.centeredXPosition}, ${t.centeredYPosition})`),i}_appendContentSegmentLinkLabelTextElement(e,t,i){let s={class:"content-segment-label",x:t,y:i};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,t){t.segmentLabelArray.forEach((i,s)=>{if(i!==""){let o={};s>0&&(o.x=t.centeredXPosition,o.y=t.centeredYPosition,o.dy="1.2em",o["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",o).text(i)}})}_appendContentSegmentLinkPolygon(e,t){let i={class:"content-segment-shape",points:t,fill:this._contentSegmentFillColor};return i["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"polygon",i)}_appendSheetGroupRectangle(e,t,i){let{x:s,y:o}=t,{x:d,y:u}=i,w={x:s,y:o,width:d-s,height:u-o,fill:this._sheetFillColor,stroke:this._bgColor};return w["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",w)}_appendSheetGroupTitle(e,t){this._appendSvgElementWithAttrs(e,"title",{}).text(`Bl. ${t}`)}_appendSystemsGroupLabel(e,t,i){let{x:s,y:o}=t.systems.systemsLabelPositions[i],d=i+1,u={class:"system-label",x:s,y:o,fill:this._bgColor};u["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",u).text(d)}_appendSystemsGroupLines(e,t){t.forEach(i=>{let{x:s,y:o}=i.START_POINT,{x:d,y:u}=i.END_POINT,w={class:"system-line",x1:s,y1:o,x2:d,y2:u,stroke:this._bgColor};w["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",w)})}_appendSvgElementWithAttrs(e,t,i){let s=e.append(t);return Object.keys(i).forEach(o=>{s.attr(o,i[o])}),s}};$=n([J({providedIn:"root"})],$);var D=class{constructor(){this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0},this._folioService=p($),this.ref=this}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,t)=>{let i=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(i);s.empty()||(s.selectAll("*").remove(),this._folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[t]),this._folioService.addFolioToSvgCanvas(s,e,this.ref),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let t=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${t}`}openModal(e){e&&this.openModalRequest.emit(e)}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let t=j(W({},this._folioSettings),{formatX:+e.format.width,formatY:+e.format.height,numberOfFolios:this.selectedConvolute.folios.length}),i=this._calculateViewBoxDimension(t,"X"),s=this._calculateViewBoxDimension(t,"Y");return this.viewBoxArray.push(new ve(i,s)),this._folioService.getFolioSvgData(t,e)}))}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(t,i,s)=>{let o=U(s[i]).attr("contentSegmentId");return this.isSelectedSvgSheet(o)})})}_calculateViewBoxDimension(e,t){let i=`format${t}`,s=`initialOffset${t}`;return(e[i]+2*e[s])*e.factor}_d3Select(e){return U(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={selectedConvolute:[{type:l}],selectedSvgSheet:[{type:l}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]}}};D=n([c({selector:"awg-edition-folio-viewer",template:Ge,changeDetection:g.OnPush,standalone:!1,styles:[Ne]})],D);var V=class{};V=n([v({imports:[S],declarations:[D],exports:[D]})],V);var B=class{};B=n([v({imports:[S,V],declarations:[O],exports:[O]})],B);var $e=`<!-- content: edition detail -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- loading spinner -->
    @if (isLoading$ | async) {
        <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <awg-alert-error [errorObject]="errorObject"></awg-alert-error>
        } @else {
            <div class="awg-sheets-view">
                <!-- accolade view -->
                <awg-edition-accolade
                    [isFullscreen]="isFullscreen"
                    [svgSheetsData]="svgSheetsData"
                    [selectedSvgSheet]="selectedSvgSheet"
                    [selectedTextcritics]="selectedTextcritics"
                    [selectedTextcriticalCommentary]="selectedTextcriticalCommentary"
                    [showTkA]="showTkA"
                    (browseSvgSheetRequest)="onBrowseSvgSheet($event)"
                    (fullscreenToggleRequest)="onFullscreenToggle($event)"
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
`;var Ve="";var I=class{constructor(){this.errorObject=null,this.isFullscreen=!1,this.showTkA=!1,this._isFirstPageLoad=!0,this._destroyed$=new y,this._editionDataService=p(pe),this._editionSheetsService=p(Se),this._editionStateService=p(ue),this._loadingService=p(fe),this._route=p(ie),this._router=p(se),this._utils=p(f)}get editionRouteConstants(){return le}get isLoading$(){return this._loadingService.getLoadingStatus()}ngOnInit(){this.getEditionSheetsData()}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}getEditionSheetsData(){this.errorObject=null,this.snapshotQueryParamsId=this._route.snapshot.queryParamMap.get("id"),X([this._route.paramMap,this._route.queryParamMap]).pipe(P(([,e])=>this._fetchEditionComplexData(e)),Q(e=>(this.errorObject=e,Y)),A(this._destroyed$)).subscribe()}onBrowseSvgSheet(e){let t=this._editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,this.svgSheetsData.sheets);if(!t)return;let i=this.svgSheetsData.sheets[t],s=this._editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,i);this.onSvgSheetSelect({complexId:"",sheetId:s})}onFullscreenToggle(e){this.isFullscreen=e}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let t=this.selectedTextcritics.linkBoxes.find(i=>i.svgGroupId===e);if(t){let i=t.linkTo;this.onSvgSheetSelect(i)}}onOverlaySelect(e){this.selectedTextcriticalCommentary=this._editionSheetsService.filterTextcriticalCommentaryForOverlays(this.selectedTextcritics.commentary,e),this.showTkA=this._utils.isNotEmptyArray(this.selectedTextcriticalCommentary.comments)}onReportFragmentNavigate(e){let t=this.editionRouteConstants.EDITION_REPORT.route,i={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,t,i)}onSvgSheetSelect(e){let t=this.editionRouteConstants.EDITION_SHEETS.route,i={queryParams:{id:e?.sheetId??""},queryParamsHandling:"merge"};this._navigateWithComplexId(e?.complexId,t,i)}_assignData(e){this.folioConvoluteData=e[0],this.svgSheetsData=e[1],this.textcriticsData=e[2]}_fetchEditionComplexData(e){return this._editionStateService.getSelectedEditionComplex().pipe(q(t=>this.editionComplex=t),P(t=>this._editionDataService.getEditionSheetsData(t)),q(t=>this._assignData(t)),q(()=>this._handleQueryParams(e)))}_getDefaultSheetId(){let e=this.svgSheetsData?.sheets,t=e?.textEditions?.[0]||e?.sketchEditions?.[0],i=t?.content?.[0]?.partial??"";return(t?.id||"")+i}_handleQueryParams(e){let t=e?.get("id");t&&this.svgSheetsData?this._selectSvgSheet(t):(t=this._isFirstPageLoad&&this.snapshotQueryParamsId?this.snapshotQueryParamsId:this._getDefaultSheetId(),t===""&&(this.selectedSvgSheet=void 0),this.onSvgSheetSelect({complexId:"",sheetId:t})),this._isFirstPageLoad=!1}_navigateWithComplexId(e,t,i){let s=e?`/edition/complex/${e}/`:this.editionComplex.baseRoute;this._router.navigate([s,t],i)}_selectSvgSheet(e){e&&(this.selectedSvgSheet=this._editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets,e),this.selectedConvolute=this._editionSheetsService.selectConvolute(this.folioConvoluteData.convolutes,this.svgSheetsData.sheets,this.selectedSvgSheet),this.selectedTextcritics=this._editionSheetsService.findTextcritics(this.textcriticsData.textcritics,this.selectedSvgSheet),this.onOverlaySelect([]),this._utils.isNotEmptyObject(this.selectedTextcritics)&&this._utils.isNotEmptyObject(this.selectedTextcritics.commentary)&&(this.selectedTextcriticalCommentary=this.selectedTextcritics.commentary))}static{this.propDecorators={modal:[{type:m,args:["modal",{static:!0}]}]}}};I=n([c({selector:"awg-edition-sheets",template:$e,standalone:!1,styles:[Ve]})],I);var dt=[{path:"",component:I,data:{title:"AWG Online Edition \u2013 Sheets"}}],Be=[I],z=class{};z=n([v({imports:[H.forChild(dt)],exports:[H]})],z);var ze=class{};ze=n([v({imports:[S,N,B,z],declarations:[Be]})],ze);export{ze as EditionSheetsModule};
