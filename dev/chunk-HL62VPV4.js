import{a as W}from"./chunk-YLLTIKGV.js";import{a as Oe,e as De}from"./chunk-J7NHGWK7.js";import{f as C}from"./chunk-D67VI4CF.js";import"./chunk-H7RGF2OO.js";import{a as _e,b as we,c as b,d as ye,e as Ce,f as be,g as ke,l as xe,n as Re,o as Ee,v as te,y as Te}from"./chunk-Q5BBFFUU.js";import{$a as Se,A as J,B as z,C as P,Da as r,F as S,J as h,M as de,O as n,Pa as ge,Qa as ve,Sa as ee,T as u,U as c,W as d,X as a,Z as ce,Za as pe,_ as g,a as ie,b as se,cb as me,f as oe,fa as he,h as I,jb as ue,k as re,p as ne,pb as fe,t as ae,u as le,ub as v}from"./chunk-OIF6Z6X7.js";var Ie=`<div class="awg-edition-svg-sheet-footer mt-4">
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
`;var Ae="";var f,A=(f=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new n,this.openModalRequest=new n,this.selectSvgSheetRequest=new n,this.faChevronRight=fe,this.faChevronDown=ue,this.showTextcritics=!1,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleTextcritics(){this.showTextcritics=!this.showTextcritics}},f.ctorParameters=()=>[{type:C}],f.propDecorators={selectedTextcriticalCommentBlocks:[{type:d}],selectedTextcritics:[{type:d}],showTkA:[{type:d}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},f);A=r([c({selector:"awg-edition-svg-sheet-footer",template:Ie,changeDetection:h.OnPush,styles:[Ae]})],A);var H=class{};H=r([g({imports:[v,W],declarations:[A],exports:[A]})],H);var Le=`<h6 class="card-title">
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
`;var qe=`a#dropDownSheetNav.btn{border:none!important}a#dropDownSheetNav.active,a#dropDownSheetNav:active{color:#149b9e!important}a#dropDownSheetNav:hover{color:#333!important}a#dropDownSheetNav>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var _,L=(_=class{constructor(e){this.utils=e,this.selectSvgSheetRequest=new n,this.disclaimerWorkEditions="Werkeditionen sind aus rechtlichen Gr\xFCnden fr\xFChestens ab 2049 online verf\xFCgbar. Bis dahin konsultieren Sie bitte die entsprechende Printausgabe.",this.faCalendarXmark=me}isSelectedSvgSheet(e,t){let i=e,s=this.selectedSvgSheet?.id;return t&&this.selectedSvgSheet?.content?.[0]?.partial&&(i+=t,s+=this.selectedSvgSheet.content[0].partial),i===s}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},_.ctorParameters=()=>[{type:C}],_.propDecorators={navItemLabel:[{type:d}],svgSheets:[{type:d}],selectedSvgSheet:[{type:d}],selectSvgSheetRequest:[{type:a}]},_);L=r([c({selector:"awg-edition-svg-sheet-nav-item",template:Le,changeDetection:h.OnPush,styles:[qe]})],L);var Me=`@if (svgSheetsData) {
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
`;var Ge="";var k,q=(k=class{constructor(){this.selectSvgSheetRequest=new n}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},k.propDecorators={svgSheetsData:[{type:d}],selectedSvgSheet:[{type:d}],selectSvgSheetRequest:[{type:a}]},k);q=r([c({selector:"awg-edition-svg-sheet-nav",template:Me,changeDetection:h.OnPush,styles:[Ge]})],q);var U=class{};U=r([g({imports:[v],declarations:[q,L],exports:[q,L]})],U);var Ne=`<div class="awg-edition-svg-sheet-viewer-nav">
    <div class="prev" (click)="browseSvgSheet(-1)" (keydown)="browseSvgSheet(-1)" tabindex="0">
        <span>&#10094;</span>
    </div>
    <div class="next" (click)="browseSvgSheet(1)" (keydown)="browseSvgSheet(1)" tabindex="0">
        <span>&#10095;</span>
    </div>
</div>
`;var Fe=`.awg-edition-svg-sheet-viewer-nav>.prev,.awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}.awg-edition-svg-sheet-viewer-nav>.prev:hover,.awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}.awg-edition-svg-sheet-viewer-nav>.prev span,.awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#149b9e}.awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd}.awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd}
`;var x,M=(x=class{constructor(){this.browseSvgSheetRequest=new n}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}},x.propDecorators={browseSvgSheetRequest:[{type:a}]},x);M=r([c({selector:"awg-edition-svg-sheet-viewer-nav",template:Ne,changeDetection:h.OnPush,styles:[Fe]})],M);var Be=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
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
`;var $e="";var R,G=(R=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new n,this.toggleTkkClassesHighlightRequest=new n,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let t=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,t),this.suppliedClasses.set(e,!t);let i=Array.from(this.suppliedClasses.values());i.every(s=>s===i[0])&&(this.allClassesVisible=i[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,t)=>{this.suppliedClasses.set(t,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){e!==void 0?this.tkkHighlightingVisible=e:this.tkkHighlightingVisible=!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,t){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:t})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],t=e.every(s=>s),i=e.every(s=>!s);(t||i)&&(this.allClassesVisible=e[0])}},R.propDecorators={id:[{type:d}],suppliedClasses:[{type:d}],hasAvailableTkaOverlays:[{type:d}],toggleSuppliedClassesOpacityRequest:[{type:a}],toggleTkkClassesHighlightRequest:[{type:a}]},R);G=r([c({selector:"awg-edition-svg-sheet-viewer-switch",template:Be,changeDetection:h.OnPush,styles:[$e]})],G);var Ve=`@if (selectedSvgSheet) {
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
`;var ze=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#149b9e}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;margin-top:0}
`;var w,N=(w=class{constructor(){this.browseSvgSheetRequest=new n,this.selectLinkBoxRequest=new n,this.selectOverlaysRequest=new n,this.faCompressArrowsAlt=pe,this.hasAvailableTkaOverlays=!1,this.sliderConfig=new Oe(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this._isRendered=!1,this._destroyed$=new I,this._resize$=new I,this._cdr=S(he),this._svgDrawingService=S(Te),this.ref=this}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(le(150),z(this._destroyed$)).subscribe(e=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:t,isCurrentlyVisible:i}=e;this._svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,t,i)}onTkkClassesHighlightToggle(e){let t="tkk";this._svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,t).nodes().forEach(s=>{let[o,l]=this._getOverlayAndSelection(s.id,t),p=e?b.fill:b.transparent;this._svgDrawingService.updateTkkOverlayColor(o,l,p)})}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this._cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return oe(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this._svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this.svgSheetRootGroupSelection&&(this._createOverlays("link-box",this._createLinkBoxOverlay.bind(this)),this._createOverlays("tkk",this._createTkaOverlay.bind(this)),this.hasAvailableTkaOverlays=!!this._availableTkaOverlays&&this._availableTkaOverlays.length>0,this._getSuppliedClasses())}_createOverlays(e,t){let i=this._svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,e);i&&i.nodes().forEach(s=>{t(s,e)})}_createLinkBoxOverlay(e,t){let i=e.id,s=this._svgDrawingService.getD3SelectionById(this.svgSheetRootGroupSelection,i),o=s.select("path");o.style("fill",this._svgDrawingService.linkBoxFillColor),s.on("mouseover",()=>{let l=this._svgDrawingService.linkBoxHoverFillColor;this._svgDrawingService.fillD3SelectionWithColor(o,l),s.style("cursor","pointer")}).on("mouseout",()=>{let l=this._svgDrawingService.linkBoxFillColor;this._svgDrawingService.fillD3SelectionWithColor(o,l)}).on("click",()=>{this._onLinkBoxSelect(i)})}_createTkaOverlay(e,t){let i=e.id,s=e.getBBox();this._availableTkaOverlays.push(new ye(we.tka,i,!1));let o=this._svgDrawingService.createOverlayGroup(this.svgSheetRootGroupSelection,i,s,t),[l,p]=this._getOverlayAndSelection(i,t);o.on("mouseover",()=>{this._svgDrawingService.updateTkkOverlayColor(l,p,b.hover),p.style("cursor","pointer")}).on("mouseout",()=>{this._svgDrawingService.updateTkkOverlayColor(l,p,b.fill)}).on("click",()=>{l&&(l.isSelected=!l.isSelected),this._svgDrawingService.updateTkkOverlayColor(l,p,b.hover),this._selectedTkaOverlays=this._getSelectedOverlays(this._availableTkaOverlays),this._onOverlaySelect(this._selectedTkaOverlays)})}_getContainerDimensions(e){let t=this._svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:t.width,this._divHeight=this._divHeight?this._divHeight:t.height}_getOverlayById(e,t){return e.find(i=>i.id===t)}_getOverlayAndSelection(e,t){let i=this._getOverlayById(this._availableTkaOverlays,e),s=this._svgDrawingService.getOverlayGroupRectSelection(this.svgSheetRootGroupSelection,e,t);return[i,s]}_getSelectedOverlays(e){return e.filter(t=>t.isSelected)}_getSuppliedClasses(){this.suppliedClasses=this._svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let t=this.sliderConfig.stepSize;return((o,l)=>+(Math.round(+(o+"e"+l))+"e-"+l))(e,(o=>Math.floor(o)===o?0:o.toString().split(".")[1].length)(t))}_zoomHandler(e,t){let i=s=>{let o=s.transform,l=this._roundToScaleStepDecimalPrecision(o.k);e.attr("transform",o),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=l,this.sliderConfig.value=l),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=l+"x")};this._zoomBehaviour=De().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",i),t.call(this._zoomBehaviour)}},w.ctorParameters=()=>[],w.propDecorators={svgSheetContainerRef:[{type:u,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:u,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:u,args:["svgSheetRootGroup"]}],sliderInput:[{type:u,args:["sliderInput"]}],sliderInputLabel:[{type:u,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:d}],browseSvgSheetRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],onResize:[{type:ce,args:["window:resize"]}]},w);N=r([c({selector:"awg-edition-svg-sheet-viewer",template:Ve,styles:[ze]})],N);var j=class{};j=r([g({imports:[v,W],declarations:[N,M,G],exports:[N,M,G]})],j);var Pe=`<div ngbAccordion>
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
`;var We="";var E,F=(E=class{constructor(){this.browseSvgSheetRequest=new n,this.navigateToReportFragmentRequest=new n,this.openModalRequest=new n,this.selectLinkBoxRequest=new n,this.selectOverlaysRequest=new n,this.selectSvgSheetRequest=new n}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},E.propDecorators={svgSheetsData:[{type:d}],selectedSvgSheet:[{type:d}],selectedTextcriticalCommentBlocks:[{type:d}],selectedTextcritics:[{type:d}],showTkA:[{type:d}],browseSvgSheetRequest:[{type:a}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectLinkBoxRequest:[{type:a}],selectOverlaysRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},E);F=r([c({selector:"awg-edition-accolade",template:Pe,changeDetection:h.OnPush,styles:[We]})],F);var Z=class{};Z=r([g({imports:[v,H,U,j],declarations:[F],exports:[F]})],Z);var He=`<div ngbAccordion>
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
`;var Ue="";var T,B=(T=class{constructor(){this.openModalRequest=new n,this.selectSvgSheetRequest=new n,this.faSquare=Se,this.folioLegends=[{color:"olivedrab",label:"aktuell ausgew\xE4hlt"},{color:"orange",label:"ausw\xE4hlbar"},{color:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},T.propDecorators={selectedConvolute:[{type:d}],selectedSvgSheet:[{type:d}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},T);B=r([c({selector:"awg-edition-convolute",template:He,changeDetection:h.OnPush,styles:[Ue]})],B);var je=`<!-- embedded svg: Edition Folio Viewer -->
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
`;var Ze=`.svgGrid{margin-bottom:2em}.svgRow{padding-top:1em;width:inherit;text-align:center;box-shadow:5px 5px 6px #ccc;border:1px solid #eeeeee}.svgCol{display:inline-block}
`;var X=class{constructor(){this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentReversedRotationAngle=180,this._contentSegmentStrokeWidth=2,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7}getFolioSvgData(e,t){let i=new Ce(e,t,this._contentSegmentOffsetCorrection);return new be(i)}addViewBoxToSvgCanvas(e,t){e.attr("viewBox",t.viewBox).attr("width",t.svgWidth).attr("height",t.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,t,i){this.ref=i;let s=this._appendCanvasSheetGroup(e,t);this._addFolioSheetToSvgCanvas(s,t),this._addFolioSystemsToSvgCanvas(s,t),this._addFolioContentSegmentsToSvgCanvas(s,t)}_addFolioSheetToSvgCanvas(e,t){let{sheet:i}=t,{upperLeftCorner:s,lowerRightCorner:o,folioId:l}=i;this._appendSheetGroupTitle(e,l),this._appendSheetGroupRectangle(e,s,o)}_addFolioSystemsToSvgCanvas(e,t){t.systems.systemsLines.forEach((i,s)=>{let o=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:s+1,class:"systems-group"}),l=this._appendSvgElementWithAttrs(o,"g",{systemLineGroupId:s+1,class:"system-line-group"});this._appendSystemsGroupLabel(o,t,s),this._appendSystemsGroupLines(l,i)})}_addFolioContentSegmentsToSvgCanvas(e,t){t?.contentSegments?.forEach(i=>{if(!i)return;let s=this._appendContentSegmentGroup(e,i),o=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(o,i.segmentVertices),this._appendContentSegmentLinkLabel(o,i)})}_appendCanvasSheetGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:t.sheet.folioId,class:"sheet-group"})}_appendContentSegmentGroup(e,t){let i=this._appendContentSegmentGroupElement(e,t);return this._appendContentSegmentGroupTitle(i,t),i.on("click",()=>t.selectable?this.ref.selectSvgSheet({complexId:t.complexId,sheetId:t.sheetId}):this.ref.openModal(t.linkTo)),i}_appendContentSegmentGroupElement(e,t){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:t.segmentLabel,contentSegmentId:t.sheetId,class:"content-segment-group",stroke:t.selectable?this._fgColor:this._disabledColor,fill:t.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,t){return this._appendSvgElementWithAttrs(e,"title",{}).text(t.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,t){let i=this._appendContentSegmentLinkLabelTextElement(e,t.centeredXPosition,t.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(i,t),t.reversed&&i.attr("transform",`rotate(${this._contentSegmentReversedRotationAngle}, ${t.centeredXPosition}, ${t.centeredYPosition})`),i}_appendContentSegmentLinkLabelTextElement(e,t,i){let s={class:"content-segment-label",x:t,y:i};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,t){t.segmentLabelArray.forEach((i,s)=>{if(i!==""){let o={};s>0&&(o.x=t.centeredXPosition,o.y=t.centeredYPosition,o.dy="1.2em",o["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",o).text(i)}})}_appendContentSegmentLinkPolygon(e,t){let i={class:"content-segment-shape",points:t,fill:this._contentSegmentFillColor};return i["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"polygon",i)}_appendSheetGroupRectangle(e,t,i){let{x:s,y:o}=t,{x:l,y:p}=i,D={x:s,y:o,width:l-s,height:p-o,fill:this._sheetFillColor,stroke:this._bgColor};return D["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",D)}_appendSheetGroupTitle(e,t){this._appendSvgElementWithAttrs(e,"title",{}).text(`Bl. ${t}`)}_appendSystemsGroupLabel(e,t,i){let{x:s,y:o}=t.systems.systemsLabelPositions[i],l=i+1,p={class:"system-label",x:s,y:o,fill:this._bgColor};p["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",p).text(l)}_appendSystemsGroupLines(e,t){t.forEach(i=>{let{x:s,y:o}=i.START_POINT,{x:l,y:p}=i.END_POINT,D={class:"system-line",x1:s,y1:o,x2:l,y2:p,stroke:this._bgColor};D["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",D)})}_appendSvgElementWithAttrs(e,t,i){let s=e.append(t);return Object.keys(i).forEach(o=>{s.attr(o,i[o])}),s}};X=r([de({providedIn:"root"})],X);var y,$=(y=class{constructor(){this.openModalRequest=new n,this.selectSvgSheetRequest=new n,this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0},this._folioService=S(X),this.ref=this}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,t)=>{let i=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(i);s.empty()||(s.selectAll("*").remove(),this._folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[t]),this._folioService.addFolioToSvgCanvas(s,e,this.ref),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let t=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${t}`}openModal(e){e&&this.openModalRequest.emit(e)}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let t=se(ie({},this._folioSettings),{formatX:+e.format.width,formatY:+e.format.height,numberOfFolios:this.selectedConvolute.folios.length}),i=this._calculateViewBoxDimension(t,"X"),s=this._calculateViewBoxDimension(t,"Y");return this.viewBoxArray.push(new ke(i,s)),this._folioService.getFolioSvgData(t,e)}))}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(t,i,s)=>{let o=te(s[i]).attr("contentSegmentId");return this.isSelectedSvgSheet(o)})})}_calculateViewBoxDimension(e,t){let i=`format${t}`,s=`initialOffset${t}`;return(e[i]+2*e[s])*e.factor}_d3Select(e){return te(e)}},y.ctorParameters=()=>[],y.propDecorators={selectedConvolute:[{type:d}],selectedSvgSheet:[{type:d}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},y);$=r([c({selector:"awg-edition-folio-viewer",template:je,changeDetection:h.OnPush,styles:[Ze]})],$);var Y=class{};Y=r([g({imports:[v],declarations:[$],exports:[$]})],Y);var Q=class{};Q=r([g({imports:[v,Y],declarations:[B],exports:[B]})],Q);var Xe=`<!-- content: edition detail -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- loading spinner -->
    @if (isLoading) {
        <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <awg-alert-error [errorObject]="errorObject"></awg-alert-error>
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
`;var Ye="";var O,V=(O=class{constructor(){this.errorObject=null,this.isLoading=!0,this.showTkA=!1,this._isFirstPageLoad=!0,this._destroyed$=new I,this._editionDataService=S(xe),this._editionSheetsService=S(Re),this._editionStateService=S(Ee),this._route=S(ge),this._router=S(ve),this._utils=S(C)}get editionRouteConstants(){return _e}ngOnInit(){this.getEditionSheetsData()}getEditionSheetsData(){this.errorObject=null,this.snapshotQueryParamsId=this._route.snapshot.queryParamMap.get("id"),ne([this._route.paramMap,this._route.queryParamMap]).pipe(J(([e,t])=>this._fetchEditionComplexData(t)),ae(e=>(this.errorObject=e,this.isLoading=!1,re)),z(this._destroyed$)).subscribe({next:()=>{this.isLoading=!1},error:e=>{this.errorObject=e,this.isLoading=!1}})}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let t=this.selectedTextcritics.linkBoxes.find(i=>i.svgGroupId===e);if(t){let i=t.linkTo;this.onSvgSheetSelect(i)}}onReportFragmentNavigate(e){let t=this.editionRouteConstants.EDITION_REPORT.route,i={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,t,i)}onOverlaySelect(e){this.selectedTextcriticalCommentBlocks=this._editionSheetsService.getTextcriticalCommentsForOverlays(this.selectedTextcritics.comments,e),this.showTkA=this._utils.isNotEmptyArray(this.selectedTextcriticalCommentBlocks)}onBrowseSvgSheet(e){let t=this._editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,this.svgSheetsData.sheets);if(!t)return;let i=this.svgSheetsData.sheets[t],s=this._editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,i);this.onSvgSheetSelect({complexId:"",sheetId:s})}onSvgSheetSelect(e){let t=this.editionRouteConstants.EDITION_SHEETS.route,i={queryParams:{id:e?.sheetId??""},queryParamsHandling:"merge"};this._navigateWithComplexId(e?.complexId,t,i)}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}_assignData(e){this.folioConvoluteData=e[0],this.svgSheetsData=e[1],this.textcriticsData=e[2]}_fetchEditionComplexData(e){return this.isLoading=!0,this._editionStateService.getSelectedEditionComplex().pipe(P(t=>this.editionComplex=t),J(t=>this._editionDataService.getEditionSheetsData(t)),P(t=>this._assignData(t)),P(()=>this._handleQueryParams(e)))}_getDefaultSheetId(){let e=this.svgSheetsData?.sheets?.sketchEditions?.[0],t=e?.content?.length>1?e.content[0]?.partial:"";return(e?.id||"")+t}_handleQueryParams(e){let t=e?.get("id");t&&this.svgSheetsData?this._selectSvgSheet(t):(t=this._isFirstPageLoad&&this.snapshotQueryParamsId?this.snapshotQueryParamsId:this._getDefaultSheetId(),t===""&&(this.selectedSvgSheet=void 0),this.onSvgSheetSelect({complexId:"",sheetId:t})),this._isFirstPageLoad=!1,this.isLoading=!1}_navigateWithComplexId(e,t,i){let s=e?`/edition/complex/${e}/`:this.editionComplex.baseRoute;this._router.navigate([s,t],i)}_selectSvgSheet(e){e&&(this.selectedSvgSheet=this._editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets,e),this.selectedConvolute=this._editionSheetsService.selectConvolute(this.folioConvoluteData.convolutes,this.svgSheetsData.sheets,this.selectedSvgSheet),this.selectedTextcritics=this._editionSheetsService.findTextcritics(this.textcriticsData.textcritics,this.selectedSvgSheet),this.onOverlaySelect([]),this._utils.isNotEmptyObject(this.selectedTextcritics)&&this._utils.isNotEmptyArray(this.selectedTextcritics.comments)&&(this.selectedTextcriticalCommentBlocks=this.selectedTextcritics.comments))}},O.propDecorators={modal:[{type:u,args:["modal",{static:!0}]}]},O);V=r([c({selector:"awg-edition-sheets",template:Xe,styles:[Ye]})],V);var _t=[{path:"",component:V,data:{title:"AWG Online Edition \u2013 Sheets"}}],Qe=[V],K=class{};K=r([g({imports:[ee.forChild(_t)],exports:[ee]})],K);var Ke=class{};Ke=r([g({imports:[v,Z,Q,K],declarations:[Qe]})],Ke);export{Ke as EditionSheetsModule};
