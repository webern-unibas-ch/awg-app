import{a as W}from"./chunk-LSYJ5SVR.js";import{a as De,e as Ie}from"./chunk-XN73RPYA.js";import{$b as te,C as v,G as h,Gb as _e,Hb as we,Ib as b,J as de,Jb as ye,Ka as ge,Kb as Ce,L as n,La as ve,Lb as be,Mb as ke,Na as ee,Q as m,R as c,Rb as xe,T as l,Ta as pe,Tb as Re,U as a,Ub as Ee,V as ce,Va as Se,W as g,Ya as ue,a as ie,b as se,ba as he,cc as Te,db as me,f as oe,h as I,i as re,jb as fe,jc as Oe,n as ne,qb as C,r as ae,rc as p,s as le,x as J,y as z,ya as r,z as P}from"./chunk-DYNJZCQK.js";var Ae=`<div class="awg-edition-svg-sheet-footer mt-4">
    @if (UTILS.isNotEmptyObject(selectedTextcritics)) {
        <div class="card awg-edition-svg-sheet-footer-evaluation">
            <div class="card-body">
                <p (click)="toggleEvaluation()" (keydown)="toggleEvaluation()" tabindex="0" style="cursor: pointer">
                    @if (UTILS.isNotEmptyArray(selectedTextcritics.description)) {
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

                    @if (!UTILS.isNotEmptyArray(selectedTextcritics.description)) {
                        <span>&nbsp;---</span>
                    }
                </p>
                @if (showEvaluation && UTILS.isNotEmptyArray(selectedTextcritics.description)) {
                    <awg-edition-tka-description
                        [textcriticalDescriptions]="selectedTextcritics.description"
                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                        (openModalRequest)="openModal($event)"
                        (selectSvgSheetRequest)="selectSvgSheet($event)">
                    </awg-edition-tka-description>
                }
            </div>
        </div>
        @if (showTkA) {
            <div class="card awg-edition-svg-sheet-footer-textcritics">
                <div class="card-body">
                    <p class="smallcaps">
                        <awg-edition-tka-label
                            [id]="selectedTextcritics?.id"
                            [labelType]="'comment'"></awg-edition-tka-label
                        >:
                    </p>
                    <awg-edition-tka-table
                        [textcriticalCommentBlocks]="selectedTextcriticalCommentBlocks"
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
`;var qe="";var f,A=(f=class{constructor(){this.navigateToReportFragmentRequest=new n,this.openModalRequest=new n,this.selectSvgSheetRequest=new n,this.faChevronRight=fe,this.faChevronDown=me,this.showEvaluation=!1,this.UTILS=v(C),this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleEvaluation(){this.showEvaluation=!this.showEvaluation}},f.ctorParameters=()=>[],f.propDecorators={selectedTextcriticalCommentBlocks:[{type:l}],selectedTextcritics:[{type:l}],showTkA:[{type:l}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},f);A=r([c({selector:"awg-edition-svg-sheet-footer",template:Ae,changeDetection:h.OnPush,styles:[qe]})],A);var H=class{};H=r([g({imports:[p,W],declarations:[A],exports:[A]})],H);var Le=`<h6 class="card-title">
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
`;var Me=`a#dropDownSheetNav.btn{border:none!important}a#dropDownSheetNav.active,a#dropDownSheetNav:active{color:#149b9e!important}a#dropDownSheetNav:hover{color:#333!important}a#dropDownSheetNav>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var _,q=(_=class{constructor(e){this.utils=e,this.selectSvgSheetRequest=new n,this.disclaimerWorkEditions="Werkeditionen sind aus rechtlichen Gr\xFCnden fr\xFChestens ab 2049 online verf\xFCgbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.",this.faCalendarXmark=ue}isSelectedSvgSheet(e,t){let i=e,s=this.selectedSvgSheet?.id;return t&&this.selectedSvgSheet?.content?.[0]?.partial&&(i+=t,s+=this.selectedSvgSheet.content[0].partial),i===s}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},_.ctorParameters=()=>[{type:C}],_.propDecorators={navItemLabel:[{type:l}],svgSheets:[{type:l}],selectedSvgSheet:[{type:l}],selectSvgSheetRequest:[{type:a}]},_);q=r([c({selector:"awg-edition-svg-sheet-nav-item",template:Le,changeDetection:h.OnPush,styles:[Me]})],q);var Ge=`@if (svgSheetsData) {
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
`;var Fe="";var k,L=(k=class{constructor(){this.selectSvgSheetRequest=new n}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},k.propDecorators={svgSheetsData:[{type:l}],selectedSvgSheet:[{type:l}],selectSvgSheetRequest:[{type:a}]},k);L=r([c({selector:"awg-edition-svg-sheet-nav",template:Ge,changeDetection:h.OnPush,styles:[Fe]})],L);var U=class{};U=r([g({imports:[p],declarations:[L,q],exports:[L,q]})],U);var Ne=`<div class="awg-edition-svg-sheet-viewer-nav">
    <div class="prev" (click)="browseSvgSheet(-1)" (keydown)="browseSvgSheet(-1)" tabindex="0">
        <span>&#10094;</span>
    </div>
    <div class="next" (click)="browseSvgSheet(1)" (keydown)="browseSvgSheet(1)" tabindex="0">
        <span>&#10095;</span>
    </div>
</div>
`;var Be=`.awg-edition-svg-sheet-viewer-nav>.prev,.awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}.awg-edition-svg-sheet-viewer-nav>.prev:hover,.awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}.awg-edition-svg-sheet-viewer-nav>.prev span,.awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#149b9e}.awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd;border-top-left-radius:5px;border-bottom-left-radius:5px}.awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd;border-top-right-radius:5px;border-bottom-right-radius:5px}
`;var x,M=(x=class{constructor(){this.browseSvgSheetRequest=new n}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}},x.propDecorators={browseSvgSheetRequest:[{type:a}]},x);M=r([c({selector:"awg-edition-svg-sheet-viewer-nav",template:Ne,changeDetection:h.OnPush,styles:[Be]})],M);var $e=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
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
`;var Ve="";var R,G=(R=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new n,this.toggleTkkClassesHighlightRequest=new n,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let t=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,t),this.suppliedClasses.set(e,!t);let i=Array.from(this.suppliedClasses.values());i.every(s=>s===i[0])&&(this.allClassesVisible=i[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,t)=>{this.suppliedClasses.set(t,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){e!==void 0?this.tkkHighlightingVisible=e:this.tkkHighlightingVisible=!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,t){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:t})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],t=e.every(s=>s),i=e.every(s=>!s);(t||i)&&(this.allClassesVisible=e[0])}},R.propDecorators={id:[{type:l}],suppliedClasses:[{type:l}],hasAvailableTkaOverlays:[{type:l}],toggleSuppliedClassesOpacityRequest:[{type:a}],toggleTkkClassesHighlightRequest:[{type:a}]},R);G=r([c({selector:"awg-edition-svg-sheet-viewer-switch",template:$e,changeDetection:h.OnPush,styles:[Ve]})],G);var ze=`@if (selectedSvgSheet) {
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
`;var Pe=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7;border-radius:5px}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#149b9e}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;margin-top:0}
`;var w,F=(w=class{constructor(){this.browseSvgSheetRequest=new n,this.selectLinkBoxRequest=new n,this.selectOverlaysRequest=new n,this.faCompressArrowsAlt=pe,this.hasAvailableTkaOverlays=!1,this.sliderConfig=new De(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this._isRendered=!1,this._destroyed$=new I,this._resize$=new I,this._cdr=v(he),this._svgDrawingService=v(Te),this.ref=this}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(le(150),z(this._destroyed$)).subscribe(e=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:t,isCurrentlyVisible:i}=e;this._svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,t,i)}onTkkClassesHighlightToggle(e){let t="tkk";this._svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,t).nodes().forEach(s=>{let[o,d]=this._getOverlayAndSelection(s.id,t),S=e?b.fill:b.transparent;this._svgDrawingService.updateTkkOverlayColor(o,d,S)})}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this._cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return oe(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this._svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this.svgSheetRootGroupSelection&&(this._createOverlays("link-box",this._createLinkBoxOverlay.bind(this)),this._createOverlays("tkk",this._createTkaOverlay.bind(this)),this.hasAvailableTkaOverlays=!!this._availableTkaOverlays&&this._availableTkaOverlays.length>0,this._getSuppliedClasses())}_createOverlays(e,t){let i=this._svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,e);i&&i.nodes().forEach(s=>{t(s,e)})}_createLinkBoxOverlay(e,t){let i=e.id,s=this._svgDrawingService.getD3SelectionById(this.svgSheetRootGroupSelection,i),o=s.select("path");o.style("fill",this._svgDrawingService.linkBoxFillColor),s.on("mouseover",()=>{let d=this._svgDrawingService.linkBoxHoverFillColor;this._svgDrawingService.fillD3SelectionWithColor(o,d),s.style("cursor","pointer")}).on("mouseout",()=>{let d=this._svgDrawingService.linkBoxFillColor;this._svgDrawingService.fillD3SelectionWithColor(o,d)}).on("click",()=>{this._onLinkBoxSelect(i)})}_createTkaOverlay(e,t){let i=e.id,s=e.getBBox();this._availableTkaOverlays.push(new ye(we.tka,i,!1));let o=this._svgDrawingService.createOverlayGroup(this.svgSheetRootGroupSelection,i,s,t),[d,S]=this._getOverlayAndSelection(i,t);o.on("mouseover",()=>{this._svgDrawingService.updateTkkOverlayColor(d,S,b.hover),S.style("cursor","pointer")}).on("mouseout",()=>{this._svgDrawingService.updateTkkOverlayColor(d,S,b.fill)}).on("click",()=>{d&&(d.isSelected=!d.isSelected),this._svgDrawingService.updateTkkOverlayColor(d,S,b.hover),this._selectedTkaOverlays=this._getSelectedOverlays(this._availableTkaOverlays),this._onOverlaySelect(this._selectedTkaOverlays)})}_getContainerDimensions(e){let t=this._svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:t.width,this._divHeight=this._divHeight?this._divHeight:t.height}_getOverlayById(e,t){return e.find(i=>i.id===t)}_getOverlayAndSelection(e,t){let i=this._getOverlayById(this._availableTkaOverlays,e),s=this._svgDrawingService.getOverlayGroupRectSelection(this.svgSheetRootGroupSelection,e,t);return[i,s]}_getSelectedOverlays(e){return e.filter(t=>t.isSelected)}_getSuppliedClasses(){this.suppliedClasses=this._svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let t=this.sliderConfig.stepSize;return((o,d)=>+(Math.round(+(o+"e"+d))+"e-"+d))(e,(o=>Math.floor(o)===o?0:o.toString().split(".")[1].length)(t))}_zoomHandler(e,t){let i=s=>{let o=s.transform,d=this._roundToScaleStepDecimalPrecision(o.k);e.attr("transform",o),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=d,this.sliderConfig.value=d),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=d+"x")};this._zoomBehaviour=Ie().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",i),t.call(this._zoomBehaviour)}},w.ctorParameters=()=>[],w.propDecorators={svgSheetContainerRef:[{type:m,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:m,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:m,args:["svgSheetRootGroup"]}],sliderInput:[{type:m,args:["sliderInput"]}],sliderInputLabel:[{type:m,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:l}],browseSvgSheetRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],onResize:[{type:ce,args:["window:resize"]}]},w);F=r([c({selector:"awg-edition-svg-sheet-viewer",template:ze,styles:[Pe]})],F);var j=class{};j=r([g({imports:[p,W],declarations:[F,M,G],exports:[F,M,G]})],j);var We=`<div ngbAccordion #accoladeAcc [class.fullscreen]="isFullscreen">
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
`;var He=`:host{display:block;height:100%}.fullscreen{height:100vh;width:100vw;overflow-x:hidden;overflow-y:scroll;background-color:#fff}
`;var E,N=(E=class{constructor(){this.browseSvgSheetRequest=new n,this.fullscreenToggleRequest=new n,this.navigateToReportFragmentRequest=new n,this.openModalRequest=new n,this.selectLinkBoxRequest=new n,this.selectOverlaysRequest=new n,this.selectSvgSheetRequest=new n}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}fullscreenToggle(e){e!==void 0&&this.fullscreenToggleRequest.emit(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},E.propDecorators={isFullscreen:[{type:l}],svgSheetsData:[{type:l}],selectedSvgSheet:[{type:l}],selectedTextcriticalCommentBlocks:[{type:l}],selectedTextcritics:[{type:l}],showTkA:[{type:l}],browseSvgSheetRequest:[{type:a}],fullscreenToggleRequest:[{type:a}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},E);N=r([c({selector:"awg-edition-accolade",template:We,changeDetection:h.OnPush,styles:[He]})],N);var Z=class{};Z=r([g({imports:[p,H,U,j],declarations:[N],exports:[N]})],Z);var Ue=`<div ngbAccordion>
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
`;var je="";var T,B=(T=class{constructor(){this.openModalRequest=new n,this.selectSvgSheetRequest=new n,this.faSquare=Se,this.folioLegends=[{color:"olivedrab",label:"aktuell ausgew\xE4hlt"},{color:"orange",label:"ausw\xE4hlbar"},{color:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},T.propDecorators={selectedConvolute:[{type:l}],selectedSvgSheet:[{type:l}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},T);B=r([c({selector:"awg-edition-convolute",template:Ue,changeDetection:h.OnPush,styles:[je]})],B);var Ze=`<!-- embedded svg: Edition Folio Viewer -->
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
`;var Xe=`.svgGrid{margin-bottom:2em}.svgRow{padding-top:1em;width:inherit;text-align:center;box-shadow:5px 5px 6px #ccc;border:1px solid #eeeeee}.svgCol{display:inline-block}
`;var X=class{constructor(){this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentReversedRotationAngle=180,this._contentSegmentStrokeWidth=2,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7}getFolioSvgData(e,t){let i=new Ce(e,t,this._contentSegmentOffsetCorrection);return new be(i)}addViewBoxToSvgCanvas(e,t){e.attr("viewBox",t.viewBox).attr("width",t.svgWidth).attr("height",t.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,t,i){this.ref=i;let s=this._appendCanvasSheetGroup(e,t);this._addFolioSheetToSvgCanvas(s,t),this._addFolioSystemsToSvgCanvas(s,t),this._addFolioContentSegmentsToSvgCanvas(s,t)}_addFolioSheetToSvgCanvas(e,t){let{sheet:i}=t,{upperLeftCorner:s,lowerRightCorner:o,folioId:d}=i;this._appendSheetGroupTitle(e,d),this._appendSheetGroupRectangle(e,s,o)}_addFolioSystemsToSvgCanvas(e,t){t.systems.systemsLines.forEach((i,s)=>{let o=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:s+1,class:"systems-group"}),d=this._appendSvgElementWithAttrs(o,"g",{systemLineGroupId:s+1,class:"system-line-group"});this._appendSystemsGroupLabel(o,t,s),this._appendSystemsGroupLines(d,i)})}_addFolioContentSegmentsToSvgCanvas(e,t){t?.contentSegments?.forEach(i=>{if(!i)return;let s=this._appendContentSegmentGroup(e,i),o=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(o,i.segmentVertices),this._appendContentSegmentLinkLabel(o,i)})}_appendCanvasSheetGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:t.sheet.folioId,class:"sheet-group"})}_appendContentSegmentGroup(e,t){let i=this._appendContentSegmentGroupElement(e,t);return this._appendContentSegmentGroupTitle(i,t),i.on("click",()=>t.selectable?this.ref.selectSvgSheet({complexId:t.complexId,sheetId:t.sheetId}):this.ref.openModal(t.linkTo)),i}_appendContentSegmentGroupElement(e,t){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:t.segmentLabel,contentSegmentId:t.sheetId,class:"content-segment-group",stroke:t.selectable?this._fgColor:this._disabledColor,fill:t.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,t){return this._appendSvgElementWithAttrs(e,"title",{}).text(t.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,t){let i=this._appendContentSegmentLinkLabelTextElement(e,t.centeredXPosition,t.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(i,t),t.reversed&&i.attr("transform",`rotate(${this._contentSegmentReversedRotationAngle}, ${t.centeredXPosition}, ${t.centeredYPosition})`),i}_appendContentSegmentLinkLabelTextElement(e,t,i){let s={class:"content-segment-label",x:t,y:i};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,t){t.segmentLabelArray.forEach((i,s)=>{if(i!==""){let o={};s>0&&(o.x=t.centeredXPosition,o.y=t.centeredYPosition,o.dy="1.2em",o["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",o).text(i)}})}_appendContentSegmentLinkPolygon(e,t){let i={class:"content-segment-shape",points:t,fill:this._contentSegmentFillColor};return i["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"polygon",i)}_appendSheetGroupRectangle(e,t,i){let{x:s,y:o}=t,{x:d,y:S}=i,D={x:s,y:o,width:d-s,height:S-o,fill:this._sheetFillColor,stroke:this._bgColor};return D["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",D)}_appendSheetGroupTitle(e,t){this._appendSvgElementWithAttrs(e,"title",{}).text(`Bl. ${t}`)}_appendSystemsGroupLabel(e,t,i){let{x:s,y:o}=t.systems.systemsLabelPositions[i],d=i+1,S={class:"system-label",x:s,y:o,fill:this._bgColor};S["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",S).text(d)}_appendSystemsGroupLines(e,t){t.forEach(i=>{let{x:s,y:o}=i.START_POINT,{x:d,y:S}=i.END_POINT,D={class:"system-line",x1:s,y1:o,x2:d,y2:S,stroke:this._bgColor};D["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",D)})}_appendSvgElementWithAttrs(e,t,i){let s=e.append(t);return Object.keys(i).forEach(o=>{s.attr(o,i[o])}),s}};X=r([de({providedIn:"root"})],X);var y,$=(y=class{constructor(){this.openModalRequest=new n,this.selectSvgSheetRequest=new n,this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0},this._folioService=v(X),this.ref=this}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,t)=>{let i=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(i);s.empty()||(s.selectAll("*").remove(),this._folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[t]),this._folioService.addFolioToSvgCanvas(s,e,this.ref),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let t=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${t}`}openModal(e){e&&this.openModalRequest.emit(e)}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let t=se(ie({},this._folioSettings),{formatX:+e.format.width,formatY:+e.format.height,numberOfFolios:this.selectedConvolute.folios.length}),i=this._calculateViewBoxDimension(t,"X"),s=this._calculateViewBoxDimension(t,"Y");return this.viewBoxArray.push(new ke(i,s)),this._folioService.getFolioSvgData(t,e)}))}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(t,i,s)=>{let o=te(s[i]).attr("contentSegmentId");return this.isSelectedSvgSheet(o)})})}_calculateViewBoxDimension(e,t){let i=`format${t}`,s=`initialOffset${t}`;return(e[i]+2*e[s])*e.factor}_d3Select(e){return te(e)}},y.ctorParameters=()=>[],y.propDecorators={selectedConvolute:[{type:l}],selectedSvgSheet:[{type:l}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},y);$=r([c({selector:"awg-edition-folio-viewer",template:Ze,changeDetection:h.OnPush,styles:[Xe]})],$);var Y=class{};Y=r([g({imports:[p],declarations:[$],exports:[$]})],Y);var Q=class{};Q=r([g({imports:[p,Y],declarations:[B],exports:[B]})],Q);var Ye=`<!-- content: edition detail -->
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
                    [selectedTextcriticalCommentBlocks]="selectedTextcriticalCommentBlocks"
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
`;var Qe="";var O,V=(O=class{constructor(){this.errorObject=null,this.isFullscreen=!1,this.showTkA=!1,this._isFirstPageLoad=!0,this._destroyed$=new I,this._editionDataService=v(xe),this._editionSheetsService=v(Re),this._editionStateService=v(Ee),this._loadingService=v(Oe),this._route=v(ge),this._router=v(ve),this._utils=v(C)}get editionRouteConstants(){return _e}get isLoading$(){return this._loadingService.getLoadingStatus()}ngOnInit(){this.getEditionSheetsData()}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}getEditionSheetsData(){this.errorObject=null,this.snapshotQueryParamsId=this._route.snapshot.queryParamMap.get("id"),ne([this._route.paramMap,this._route.queryParamMap]).pipe(J(([e,t])=>this._fetchEditionComplexData(t)),ae(e=>(this.errorObject=e,re)),z(this._destroyed$)).subscribe()}onBrowseSvgSheet(e){let t=this._editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,this.svgSheetsData.sheets);if(!t)return;let i=this.svgSheetsData.sheets[t],s=this._editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,i);this.onSvgSheetSelect({complexId:"",sheetId:s})}onFullscreenToggle(e){this.isFullscreen=e}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let t=this.selectedTextcritics.linkBoxes.find(i=>i.svgGroupId===e);if(t){let i=t.linkTo;this.onSvgSheetSelect(i)}}onOverlaySelect(e){this.selectedTextcriticalCommentBlocks=this._editionSheetsService.getTextcriticalCommentsForOverlays(this.selectedTextcritics.comments,e),this.showTkA=this._utils.isNotEmptyArray(this.selectedTextcriticalCommentBlocks)}onReportFragmentNavigate(e){let t=this.editionRouteConstants.EDITION_REPORT.route,i={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,t,i)}onSvgSheetSelect(e){let t=this.editionRouteConstants.EDITION_SHEETS.route,i={queryParams:{id:e?.sheetId??""},queryParamsHandling:"merge"};this._navigateWithComplexId(e?.complexId,t,i)}_assignData(e){this.folioConvoluteData=e[0],this.svgSheetsData=e[1],this.textcriticsData=e[2]}_fetchEditionComplexData(e){return this._editionStateService.getSelectedEditionComplex().pipe(P(t=>this.editionComplex=t),J(t=>this._editionDataService.getEditionSheetsData(t)),P(t=>this._assignData(t)),P(()=>this._handleQueryParams(e)))}_getDefaultSheetId(){let e=this.svgSheetsData?.sheets?.sketchEditions?.[0],t=e?.content?.length>1?e.content[0]?.partial:"";return(e?.id||"")+t}_handleQueryParams(e){let t=e?.get("id");t&&this.svgSheetsData?this._selectSvgSheet(t):(t=this._isFirstPageLoad&&this.snapshotQueryParamsId?this.snapshotQueryParamsId:this._getDefaultSheetId(),t===""&&(this.selectedSvgSheet=void 0),this.onSvgSheetSelect({complexId:"",sheetId:t})),this._isFirstPageLoad=!1}_navigateWithComplexId(e,t,i){let s=e?`/edition/complex/${e}/`:this.editionComplex.baseRoute;this._router.navigate([s,t],i)}_selectSvgSheet(e){e&&(this.selectedSvgSheet=this._editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets,e),this.selectedConvolute=this._editionSheetsService.selectConvolute(this.folioConvoluteData.convolutes,this.svgSheetsData.sheets,this.selectedSvgSheet),this.selectedTextcritics=this._editionSheetsService.findTextcritics(this.textcriticsData.textcritics,this.selectedSvgSheet),this.onOverlaySelect([]),this._utils.isNotEmptyObject(this.selectedTextcritics)&&this._utils.isNotEmptyArray(this.selectedTextcritics.comments)&&(this.selectedTextcriticalCommentBlocks=this.selectedTextcritics.comments))}},O.propDecorators={modal:[{type:m,args:["modal",{static:!0}]}]},O);V=r([c({selector:"awg-edition-sheets",template:Ye,styles:[Qe]})],V);var wt=[{path:"",component:V,data:{title:"AWG Online Edition \u2013 Sheets"}}],Ke=[V],K=class{};K=r([g({imports:[ee.forChild(wt)],exports:[ee]})],K);var Je=class{};Je=r([g({imports:[p,Z,Q,K],declarations:[Ke]})],Je);export{Je as EditionSheetsModule};
