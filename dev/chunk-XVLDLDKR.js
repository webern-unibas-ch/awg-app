import{a as z}from"./chunk-6HWWYBUE.js";import{a as be,e as xe}from"./chunk-MC3CQCD2.js";import{f as C}from"./chunk-NMY2ZX3B.js";import{a as we,b as ye,i as K,l as _e,m as Ce}from"./chunk-AQCUJ54N.js";import{c as ve,e as pe,f as b,g as Se,j as me,k as ue,t as fe}from"./chunk-4SGEMXE3.js";import"./chunk-VD4ISSYF.js";import{A as B,B as $,G as p,J as oe,L as l,La as ae,Ma as le,Oa as Q,Q as m,R as c,T as a,U as d,Va as de,W as re,X as h,Xa as ce,a as J,b as ee,ca as ne,db as he,f as te,h as O,jb as ge,l as r,ob as g,q as ie,u as se,z as j}from"./chunk-L2YCISRN.js";var ke=`<div class="awg-edition-svg-sheet-footer mt-4">
    <div class="awg-edition-svg-sheet-footer-evaluation">
        <p (click)="toggleTextcritics()" style="cursor: pointer">
            @if (selectedTextcritics.description && utils.isNotEmptyArray(selectedTextcritics.description)) {
                <span>
                    <fa-icon [icon]="showTextcritics ? faChevronDown : faChevronRight"></fa-icon>
                    &nbsp;
                </span>
            }

            <span class="smallcaps"
                ><awg-edition-tka-label [id]="selectedTextcritics.id" [labelType]="'evaluation'"></awg-edition-tka-label
                >:</span
            >
            @if (selectedTextcritics.description && !utils.isNotEmptyArray(selectedTextcritics.description)) {
                <span>&nbsp;---</span>
            }
        </p>
        @if (
            showTextcritics && selectedTextcritics.description && utils.isNotEmptyArray(selectedTextcritics.description)
        ) {
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
                <awg-edition-tka-label [id]="selectedTextcritics.id" [labelType]="'comment'"></awg-edition-tka-label>:
            </p>
            <awg-edition-tka-table
                [textcriticalComments]="selectedTextcriticalComments"
                [isRowTable]="selectedTextcritics.rowtable"
                [isSketchId]="utils.isSketchId(selectedTextcritics.id)"
                (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                (openModalRequest)="openModal($event)"
                (selectSvgSheetRequest)="selectSvgSheet($event)">
            </awg-edition-tka-table>
        </div>
    }
</div>
`;var Re="";var u,D=(u=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new l,this.openModalRequest=new l,this.selectSvgSheetRequest=new l,this.faChevronRight=ge,this.faChevronDown=he,this.showTextcritics=!1,this.ref=this}navigateToReportFragment(e){e&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleTextcritics(){this.showTextcritics=!this.showTextcritics}},u.ctorParameters=()=>[{type:C}],u.propDecorators={selectedTextcriticalComments:[{type:a}],selectedTextcritics:[{type:a}],showTkA:[{type:a}],navigateToReportFragmentRequest:[{type:d}],openModalRequest:[{type:d}],selectSvgSheetRequest:[{type:d}]},u);D=r([c({selector:"awg-edition-svg-sheet-footer",template:ke,changeDetection:p.OnPush,styles:[Re]})],D);var V=class{};V=r([h({imports:[g,z],declarations:[D],exports:[D]})],V);var Ee=`<h6 class="card-title">
    {{ navItemLabel }}:
    @if (!utils.isNotEmptyArray(svgSheets)) {
        <span>---</span>
    }
</h6>
@for (svgSheet of svgSheets; track svgSheet) {
    @if (svgSheet.content.length === 1) {
        <a
            class="btn btn-default w-100 awg-svg-sheet-nav-link card-text text-start"
            [ngClass]="{ active: isSelectedSvgSheet(svgSheet.id), 'text-muted': !isSelectedSvgSheet(svgSheet.id) }"
            (click)="selectSvgSheet('', svgSheet.id)">
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
                @for (svgSheetContent of svgSheet.content; track svgSheetContent; let i = $index) {
                    <div>
                        <a
                            class="dropdown-item"
                            [ngClass]="{
                                active: isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial),
                                'text-muted': !isSelectedSvgSheet(svgSheet.id, svgSheetContent.partial)
                            }"
                            (click)="selectSvgSheet('', svgSheet.id + svgSheetContent.partial)"
                            >{{ svgSheet.label }}
                            <span class="text-muted">[{{ i + 1 }}/{{ svgSheet.content.length }}]</span></a
                        >
                    </div>
                }
            </div>
        </div>
    }
}
`;var Te=`a#dropDownSheetNav.btn{border:none!important}a#dropDownSheetNav.active,a#dropDownSheetNav:active{color:#149b9e!important}a#dropDownSheetNav:hover{color:#333!important}a#dropDownSheetNav>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var f,A=(f=class{constructor(e){this.utils=e,this.selectSvgSheetRequest=new l}isSelectedSvgSheet(e,t){let i=e,s=this.selectedSvgSheet.id;return t&&this.selectedSvgSheet.content?.[0]?.partial&&(i+=t,s+=this.selectedSvgSheet.content[0].partial),i===s}selectSvgSheet(e,t){t&&this.selectSvgSheetRequest.emit({complexId:e,sheetId:t})}},f.ctorParameters=()=>[{type:C}],f.propDecorators={navItemLabel:[{type:a}],svgSheets:[{type:a}],selectedSvgSheet:[{type:a}],selectSvgSheetRequest:[{type:d}]},f);A=r([c({selector:"awg-edition-svg-sheet-nav-item",template:Ee,styles:[Te]})],A);var Oe=`@if (svgSheetsData) {
    <div class="awg-svg-sheet-nav card">
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
`;var De="";var x,I=(x=class{constructor(){this.selectSvgSheetRequest=new l}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},x.propDecorators={svgSheetsData:[{type:a}],selectedSvgSheet:[{type:a}],selectSvgSheetRequest:[{type:d}]},x);I=r([c({selector:"awg-edition-svg-sheet-nav",template:Oe,changeDetection:p.OnPush,styles:[De]})],I);var P=class{};P=r([h({imports:[g],declarations:[I,A],exports:[I,A]})],P);var Ae=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
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
                        (click)="toggleAllClassesOpacity()" />
                    <label class="form-check-label" for="all-supplied-classes">
                        Alle {{ allClassesVisible ? 'aus' : 'ein' }}blenden
                    </label>
                </div>
            </div>
            @for (suppliedClass of suppliedClasses | keyvalue; track suppliedClass; let i = $index) {
                <div class="col-12 col-sm-4">
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            [checked]="suppliedClass.value"
                            value=""
                            [id]="suppliedClass.key"
                            (click)="toggleSingleSuppliedClassOpacity(suppliedClass.key)" />
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
                            (click)="toggleTkkClassesHighlight()" />
                        <label class="form-check-label" for="tkk">
                            <awg-edition-tka-label [id]="id" [labelType]="'comment'"></awg-edition-tka-label
                        ></label>
                    </div>
                </div>
            }
        </div>
    </div>
</div>
`;var Ie="";var k,q=(k=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new l,this.toggleTkkClassesHighlightRequest=new l,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let t=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,t),this.suppliedClasses.set(e,!t);let i=Array.from(this.suppliedClasses.values());i.every(s=>s===i[0])&&(this.allClassesVisible=i[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,t)=>{this.suppliedClasses.set(t,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){e!==void 0?this.tkkHighlightingVisible=e:this.tkkHighlightingVisible=!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,t){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:t})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],t=e.every(s=>s),i=e.every(s=>!s);(t||i)&&(this.allClassesVisible=e[0])}},k.propDecorators={id:[{type:a}],suppliedClasses:[{type:a}],hasAvailableTkaOverlays:[{type:a}],toggleSuppliedClassesOpacityRequest:[{type:d}],toggleTkkClassesHighlightRequest:[{type:d}]},k);q=r([c({selector:"awg-edition-svg-sheet-viewer-switch",template:Ae,changeDetection:p.OnPush,styles:[Ie]})],q);var qe=`@if (selectedSvgSheet) {
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
            <div class="awg-edition-svg-sheet-viewer-nav">
                <div class="prev" (click)="browseSvgSheet(-1)">
                    <span>&#10094;</span>
                </div>
                <div class="next" (click)="browseSvgSheet(1)">
                    <span>&#10095;</span>
                </div>
            </div>
        </div>
    </div>
}
`;var Le=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7}#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav>.prev,#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav>.prev:hover,#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav>.prev span,#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#149b9e}#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd}#awg-edition-svg-container .awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#149b9e}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;margin-top:0}
`;var w,L=(w=class{constructor(e,t){this.cdr=e,this.svgDrawingService=t,this.browseSvgSheetRequest=new l,this.selectLinkBoxRequest=new l,this.selectOverlaysRequest=new l,this.faCompressArrowsAlt=de,this.hasAvailableTkaOverlays=!1,this.sliderConfig=new be(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this._isRendered=!1,this._resize$=new O,this._destroyed$=new O,this.ref=this}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(se(150),B(this._destroyed$)).subscribe(e=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:t,isCurrentlyVisible:i}=e;this.svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,t,i)}onTkkClassesHighlightToggle(e){let t="tkk";this.svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,t).nodes().forEach(s=>{let[o,n]=this._getOverlayAndSelection(s.id,t),v=e?b.fill:b.transparent;this.svgDrawingService.updateTkkOverlayColor(o,n,v)})}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this.cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return te(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this.svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this.svgSheetRootGroupSelection&&(this._createOverlays("link-box",this._createLinkBoxOverlay.bind(this)),this._createOverlays("tkk",this._createTkaOverlay.bind(this)),this.hasAvailableTkaOverlays=!!this._availableTkaOverlays&&this._availableTkaOverlays.length>0,this._getSuppliedClasses())}_createOverlays(e,t){let i=this.svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,e);i&&i.nodes().forEach(s=>{t(s,e)})}_createLinkBoxOverlay(e,t){let i=e.id,s=this.svgDrawingService.getD3SelectionById(this.svgSheetRootGroupSelection,i),o=s.select("path");o.style("fill",this.svgDrawingService.linkBoxFillColor),s.on("mouseover",()=>{let n=this.svgDrawingService.linkBoxHoverFillColor;this.svgDrawingService.fillD3SelectionWithColor(o,n),s.style("cursor","pointer")}).on("mouseout",()=>{let n=this.svgDrawingService.linkBoxFillColor;this.svgDrawingService.fillD3SelectionWithColor(o,n)}).on("click",()=>{this._onLinkBoxSelect(i)})}_createTkaOverlay(e,t){let i=e.id,s=e.getBBox();this._availableTkaOverlays.push(new Se(pe.tka,i,!1));let o=this.svgDrawingService.createOverlayGroup(this.svgSheetRootGroupSelection,i,s,t),[n,v]=this._getOverlayAndSelection(i,t);o.on("mouseover",()=>{this.svgDrawingService.updateTkkOverlayColor(n,v,b.hover),v.style("cursor","pointer")}).on("mouseout",()=>{this.svgDrawingService.updateTkkOverlayColor(n,v,b.fill)}).on("click",()=>{n&&(n.isSelected=!n.isSelected),this.svgDrawingService.updateTkkOverlayColor(n,v,b.hover),this._selectedTkaOverlays=this._getSelectedOverlays(this._availableTkaOverlays),this._onOverlaySelect(this._selectedTkaOverlays)})}_getContainerDimensions(e){let t=this.svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:t.width,this._divHeight=this._divHeight?this._divHeight:t.height}_getOverlayById(e,t){return e.find(i=>i.id===t)}_getOverlayAndSelection(e,t){let i=this._getOverlayById(this._availableTkaOverlays,e),s=this.svgDrawingService.getOverlayGroupRectSelection(this.svgSheetRootGroupSelection,e,t);return[i,s]}_getSelectedOverlays(e){return e.filter(t=>t.isSelected)}_getSuppliedClasses(){this.suppliedClasses=this.svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let t=this.sliderConfig.stepSize;return((o,n)=>+(Math.round(+(o+"e"+n))+"e-"+n))(e,(o=>Math.floor(o)===o?0:o.toString().split(".")[1].length)(t))}_zoomHandler(e,t){let i=s=>{let o=s.transform,n=this._roundToScaleStepDecimalPrecision(o.k);e.attr("transform",o),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=n,this.sliderConfig.value=n),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=n+"x")};this._zoomBehaviour=xe().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",i),t.call(this._zoomBehaviour)}},w.ctorParameters=()=>[{type:ne},{type:_e}],w.propDecorators={svgSheetContainerRef:[{type:m,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:m,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:m,args:["svgSheetRootGroup"]}],sliderInput:[{type:m,args:["sliderInput"]}],sliderInputLabel:[{type:m,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:a}],browseSvgSheetRequest:[{type:d}],selectLinkBoxRequest:[{type:d}],selectOverlaysRequest:[{type:d}],onResize:[{type:re,args:["window:resize"]}]},w);L=r([c({selector:"awg-edition-svg-sheet-viewer",template:qe,styles:[Le]})],L);var H=class{};H=r([h({imports:[g,z],declarations:[L,q],exports:[L,q]})],H);var Me=`<div ngbAccordion>
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
                            @if (svgSheetsData && selectedSvgSheet) {
                                <awg-edition-svg-sheet-nav
                                    [svgSheetsData]="svgSheetsData"
                                    [selectedSvgSheet]="selectedSvgSheet"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)">
                                </awg-edition-svg-sheet-nav>
                            }
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
                                    [selectedTextcriticalComments]="selectedTextcriticalComments"
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
`;var Ge="";var R,M=(R=class{constructor(){this.browseSvgSheetRequest=new l,this.navigateToReportFragmentRequest=new l,this.openModalRequest=new l,this.selectLinkBoxRequest=new l,this.selectOverlaysRequest=new l,this.selectSvgSheetRequest=new l}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}navigateToReportFragment(e){e&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},R.propDecorators={svgSheetsData:[{type:a}],selectedSvgSheet:[{type:a}],selectedTextcriticalComments:[{type:a}],selectedTextcritics:[{type:a}],showTkA:[{type:a}],browseSvgSheetRequest:[{type:d}],navigateToReportFragmentRequest:[{type:d}],openModalRequest:[{type:d}],selectLinkBoxRequest:[{type:d}],selectOverlaysRequest:[{type:d}],selectSvgSheetRequest:[{type:d}]},R);M=r([c({selector:"awg-edition-accolade",template:Me,changeDetection:p.OnPush,styles:[Ge]})],M);var W=class{};W=r([h({imports:[g,V,P,H],declarations:[M],exports:[M]})],W);var Fe=`<div ngbAccordion>
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
`;var Ne="";var E,G=(E=class{constructor(){this.openModalRequest=new l,this.selectSvgSheetRequest=new l,this.faSquare=ce,this.folioLegends=[{color:"olivedrab",label:"aktuell ausgew\xE4hlt"},{color:"orange",label:"ausw\xE4hlbar"},{color:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},E.propDecorators={selectedConvolute:[{type:a}],selectedSvgSheet:[{type:a}],openModalRequest:[{type:d}],selectSvgSheetRequest:[{type:d}]},E);G=r([c({selector:"awg-edition-convolute",template:Fe,changeDetection:p.OnPush,styles:[Ne]})],G);var Be=`<!-- embedded svg: Edition Folio Viewer -->
@if (folioSvgDataArray) {
    <div class="container-fluid svgGrid">
        <div class="row svgRow">
            @for (folioSvgData of folioSvgDataArray; track folioSvgData) {
                <div class="col-sm-6 col-lg-{{ 12 / folioSvgDataArray?.length }} svgCol">
                    <span class="text-muted">[{{ folioSvgData.sheet?.folioId }}]</span>
                    <svg id="folio-{{ selectedSvgSheet?.id }}-{{ folioSvgData.sheet?.folioId }}"></svg>
                </div>
            }
        </div>
    </div>
}
`;var $e=`.svgGrid{margin-bottom:2em}.svgRow{padding-top:1em;width:inherit;text-align:center;box-shadow:5px 5px 6px #ccc;border:1px solid #eeeeee}.svgCol{display:inline-block}
`;var U=class{constructor(){this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentReversedRotationAngle=180,this._contentSegmentStrokeWidth=2,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7,this._appendSvgElementWithAttrs=(e,t,i)=>{let s=e.append(t);return Object.keys(i).forEach(o=>{s.attr(o,i[o])}),s}}getFolioSvgData(e,t){let i=new me(e,t,this._contentSegmentOffsetCorrection);return new ue(i)}addViewBoxToSvgCanvas(e,t){e.attr("viewBox",t.viewBox).attr("width",t.svgWidth).attr("height",t.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,t,i){this.ref=i;let s=this._appendCanvasSheetGroup(e,t);this._addFolioSheetToSvgCanvas(s,t),this._addFolioSystemsToSvgCanvas(s,t),this._addFolioContentSegmentsToSvgCanvas(s,t)}_addFolioSheetToSvgCanvas(e,t){let{sheet:i}=t,{upperLeftCorner:s,lowerRightCorner:o,folioId:n}=i;this._appendSheetGroupTitle(e,n),this._appendSheetGroupRectangle(e,s,o)}_addFolioSystemsToSvgCanvas(e,t){t.systems.systemsLines.forEach((i,s)=>{let o=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:s+1,class:"systems-group"}),n=this._appendSvgElementWithAttrs(o,"g",{systemLineGroupId:s+1,class:"system-line-group"});this._appendSystemsGroupLabel(o,t,s),this._appendSystemsGroupLines(n,i)})}_addFolioContentSegmentsToSvgCanvas(e,t){t?.contentSegments?.forEach(i=>{if(!i)return;let s=this._appendContentSegmentGroup(e,i),o=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(o,i.segmentVertices),this._appendContentSegmentLinkLabel(o,i)})}_appendCanvasSheetGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:t.sheet.folioId,class:"sheet-group"})}_appendContentSegmentGroup(e,t){let i=this._appendContentSegmentGroupElement(e,t);return this._appendContentSegmentGroupTitle(i,t),i.on("click",()=>t.selectable?this.ref.selectSvgSheet(t.complexId,t.sheetId):this.ref.openModal(t.linkTo)),i}_appendContentSegmentGroupElement(e,t){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:t.segmentLabel,contentSegmentId:t.sheetId,class:"content-segment-group",stroke:t.selectable?this._fgColor:this._disabledColor,fill:t.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,t){return this._appendSvgElementWithAttrs(e,"title",{}).text(t.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,t){let i=this._appendContentSegmentLinkLabelTextElement(e,t.centeredXPosition,t.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(i,t),t.reversed&&i.attr("transform",`rotate(${this._contentSegmentReversedRotationAngle}, ${t.centeredXPosition}, ${t.centeredYPosition})`),i}_appendContentSegmentLinkLabelTextElement(e,t,i){let s={class:"content-segment-label",x:t,y:i};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,t){t.segmentLabelArray.forEach((i,s)=>{if(i!==""){let o={};s>0&&(o.x=t.centeredXPosition,o.y=t.centeredYPosition,o.dy="1.2em",o["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",o).text(i)}})}_appendContentSegmentLinkPolygon(e,t){let i={class:"content-segment-shape",points:t,fill:this._contentSegmentFillColor};return i["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"polygon",i)}_appendSheetGroupRectangle(e,t,i){let{x:s,y:o}=t,{x:n,y:v}=i,T={x:s,y:o,width:n-s,height:v-o,fill:this._sheetFillColor,stroke:this._bgColor};return T["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",T)}_appendSheetGroupTitle(e,t){this._appendSvgElementWithAttrs(e,"title",{}).text(`Bl. ${t}`)}_appendSystemsGroupLabel(e,t,i){let{x:s,y:o}=t.systems.systemsLabelPositions[i],n=i+1,v={class:"system-label",x:s,y:o,fill:this._bgColor};v["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",v).text(n)}_appendSystemsGroupLines(e,t){t.forEach(i=>{let{x:s,y:o}=i.START_POINT,{x:n,y:v}=i.END_POINT,T={class:"system-line",x1:s,y1:o,x2:n,y2:v,stroke:this._bgColor};T["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",T)})}};U=r([oe({providedIn:"root"})],U);var y,F=(y=class{constructor(e){this.folioService=e,this.openModalRequest=new l,this.selectSvgSheetRequest=new l,this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0},this.ref=this}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,t)=>{let i=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(i);s.empty()||(s.selectAll("*").remove(),this.folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[t]),this.folioService.addFolioToSvgCanvas(s,e,this.ref),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let t=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${t}`}openModal(e){e&&this.openModalRequest.emit(e)}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let t=ee(J({},this._folioSettings),{formatX:+e.format.width,formatY:+e.format.height,numberOfFolios:this.selectedConvolute.folios.length}),i=this._calculateViewBoxDimension(t,"X"),s=this._calculateViewBoxDimension(t,"Y");return this.viewBoxArray.push(new fe(i,s)),this.folioService.getFolioSvgData(t,e)}))}selectSvgSheet(e,t){t&&this.selectSvgSheetRequest.emit({complexId:e,sheetId:t})}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(t,i,s)=>{let o=K(s[i]).attr("contentSegmentId");return this.isSelectedSvgSheet(o)})})}_calculateViewBoxDimension(e,t){let i=`format${t}`,s=`initialOffset${t}`;return(e[i]+2*e[s])*e.factor}_d3Select(e){return K(e)}},y.ctorParameters=()=>[{type:U}],y.propDecorators={selectedConvolute:[{type:a}],selectedSvgSheet:[{type:a}],openModalRequest:[{type:d}],selectSvgSheetRequest:[{type:d}]},y);F=r([c({selector:"awg-edition-folio-viewer",template:Be,changeDetection:p.OnPush,styles:[$e]})],F);var Z=class{};Z=r([h({imports:[g],declarations:[F],exports:[F]})],Z);var Y=class{};Y=r([h({imports:[g,Z],declarations:[G],exports:[G]})],Y);var ze=`<!-- content: edition detail -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- body with embedded svg's -->
    <!-- accolade view -->
    @if (svgSheetsData && selectedSvgSheet) {
        <awg-edition-accolade
            [svgSheetsData]="svgSheetsData"
            [selectedSvgSheet]="selectedSvgSheet"
            [selectedTextcritics]="selectedTextcritics"
            [selectedTextcriticalComments]="selectedTextcriticalComments"
            [showTkA]="showTkA"
            (browseSvgSheetRequest)="onBrowseSvgSheet($event)"
            (navigateToReportFragmentRequest)="onNavigateToReportFragment($event)"
            (openModalRequest)="modal.open($event)"
            (selectLinkBoxRequest)="onLinkBoxSelect($event)"
            (selectOverlaysRequest)="onOverlaySelect($event)"
            (selectSvgSheetRequest)="onSvgSheetSelect($event)">
        </awg-edition-accolade>
    }

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
`;var Ve="";var _,N=(_=class{constructor(e,t,i,s,o,n){this.editionDataService=e,this.editionSheetsService=t,this.editionService=i,this.utils=s,this.route=o,this.router=n,this.errorMessage=void 0,this.showTkA=!1,this._destroyed$=new O,this._isFirstPageLoad=!0}get editionRouteConstants(){return ve}ngOnInit(){this.getEditionSheetsData()}getEditionSheetsData(){this.snapshotQueryParamsId=this.route.snapshot.queryParamMap.get("id"),ie([this.route.paramMap,this.route.queryParamMap]).pipe(j(([e,t])=>this._fetchEditionComplexData(t)),B(this._destroyed$)).subscribe({next:()=>{},error:e=>{console.error(e),this.errorMessage=e}})}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let t=this.selectedTextcritics.linkBoxes.find(i=>i.svgGroupId===e);if(t){let i=t.linkTo;this.onSvgSheetSelect(i)}}onNavigateToReportFragment(e){e||(e="");let t={fragment:e};this.router.navigate([this.editionComplex.baseRoute,this.editionRouteConstants.EDITION_REPORT.route],t)}onOverlaySelect(e){this.selectedTextcriticalComments=this.editionSheetsService.getTextcriticalCommentsForOverlays(this.selectedTextcritics.comments,e),this.showTkA=this.utils.isNotEmptyArray(this.selectedTextcriticalComments)}onBrowseSvgSheet(e){let t=this.editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,this.svgSheetsData.sheets);if(!t)return;let i=this.svgSheetsData.sheets[t],s=this.editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,i);this.onSvgSheetSelect({complexId:"",sheetId:s})}onSvgSheetSelect(e){let t=e.complexId?`/edition/complex/${e.complexId}/`:this.editionComplex.baseRoute,i={queryParams:{id:e.sheetId},queryParamsHandling:"merge"};this.router.navigate([t,this.editionRouteConstants.EDITION_SHEETS.route],i)}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}_assignData(e){this.folioConvoluteData=e[0],this.svgSheetsData=e[1],this.textcriticsData=e[2]}_fetchEditionComplexData(e){return this.editionService.getEditionComplex().pipe($(t=>this.editionComplex=t),j(t=>this.editionDataService.getEditionSheetsData(t)),$(t=>this._assignData(t)),$(()=>this._handleQueryParams(e)))}_getDefaultSheetId(){let e=this.svgSheetsData?.sheets?.sketchEditions?.[0],t=e?.content?.length>1?e.content[0]?.partial:"";return(e?.id||"")+t}_handleQueryParams(e){let t=e?.get("id");t&&this.svgSheetsData?this._selectSvgSheet(t):(t=this._isFirstPageLoad&&this.snapshotQueryParamsId?this.snapshotQueryParamsId:this._getDefaultSheetId(),this.onSvgSheetSelect({complexId:"",sheetId:t})),this._isFirstPageLoad=!1}_selectSvgSheet(e){e&&(this.selectedSvgSheet=this.editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets,e),this.selectedConvolute=this.editionSheetsService.selectConvolute(this.folioConvoluteData.convolutes,this.svgSheetsData.sheets,this.selectedSvgSheet),this.selectedTextcritics=this.editionSheetsService.findTextcritics(this.textcriticsData.textcritics,this.selectedSvgSheet),this.onOverlaySelect([]),this.utils.isNotEmptyObject(this.selectedTextcritics)&&this.utils.isNotEmptyArray(this.selectedTextcritics.comments)&&(this.selectedTextcriticalComments=this.selectedTextcritics.comments))}},_.ctorParameters=()=>[{type:we},{type:ye},{type:Ce},{type:C},{type:ae},{type:le}],_.propDecorators={modal:[{type:m,args:["modal",{static:!0}]}]},_);N=r([c({selector:"awg-edition-sheets",template:ze,styles:[Ve]})],N);var dt=[{path:"",component:N,data:{title:"AWG Online Edition \u2013 Sheets"}}],Pe=[N],X=class{};X=r([h({imports:[Q.forChild(dt)],exports:[Q]})],X);var He=class{};He=r([h({imports:[g,W,Y,X],declarations:[Pe]})],He);export{He as EditionSheetsModule};
