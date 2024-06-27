import{a as P}from"./chunk-VMTBHNC5.js";import{a as ke,e as Re}from"./chunk-EDA5T2EZ.js";import{f as C}from"./chunk-77XUXP2S.js";import{a as _e,b as Ce,i as ee,l as be,m as xe}from"./chunk-G45JEWHN.js";import{c as Se,e as me,f as b,g as ue,j as fe,k as we,t as ye}from"./chunk-D2RHGJ6J.js";import"./chunk-S3KMMJN6.js";import{A as V,B as z,G as g,J as ne,L as a,La as de,Ma as ce,Oa as J,Q as m,R as c,T as d,U as l,Va as he,W as ae,X as h,Xa as ge,a as te,b as ie,ca as le,db as pe,f as se,h as D,jb as ve,l as r,ob as p,q as oe,u as re,z as K}from"./chunk-W5BVVD4C.js";var Ee=`<div class="awg-edition-svg-sheet-footer mt-4">
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
                    [textcriticalComments]="selectedTextcriticalComments"
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
`;var Te="";var u,I=(u=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.faChevronRight=ve,this.faChevronDown=pe,this.showTextcritics=!1,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleTextcritics(){this.showTextcritics=!this.showTextcritics}},u.ctorParameters=()=>[{type:C}],u.propDecorators={selectedTextcriticalComments:[{type:d}],selectedTextcritics:[{type:d}],showTkA:[{type:d}],navigateToReportFragmentRequest:[{type:l}],openModalRequest:[{type:l}],selectSvgSheetRequest:[{type:l}]},u);I=r([c({selector:"awg-edition-svg-sheet-footer",template:Ee,changeDetection:g.OnPush,styles:[Te]})],I);var H=class{};H=r([h({imports:[p,P],declarations:[I],exports:[I]})],H);var Oe=`<h6 class="card-title">
    {{ navItemLabel }}:
    @if (!utils.isNotEmptyArray(svgSheets)) {
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
`;var De=`a#dropDownSheetNav.btn{border:none!important}a#dropDownSheetNav.active,a#dropDownSheetNav:active{color:#149b9e!important}a#dropDownSheetNav:hover{color:#333!important}a#dropDownSheetNav>span{display:inline-block;white-space:break-spaces;text-align:start}
`;var f,A=(f=class{constructor(e){this.utils=e,this.selectSvgSheetRequest=new a}isSelectedSvgSheet(e,t){let i=e,s=this.selectedSvgSheet?.id;return t&&this.selectedSvgSheet?.content?.[0]?.partial&&(i+=t,s+=this.selectedSvgSheet.content[0].partial),i===s}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},f.ctorParameters=()=>[{type:C}],f.propDecorators={navItemLabel:[{type:d}],svgSheets:[{type:d}],selectedSvgSheet:[{type:d}],selectSvgSheetRequest:[{type:l}]},f);A=r([c({selector:"awg-edition-svg-sheet-nav-item",template:Oe,styles:[De]})],A);var Ie=`@if (svgSheetsData) {
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
`;var Ae="";var x,q=(x=class{constructor(){this.selectSvgSheetRequest=new a}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},x.propDecorators={svgSheetsData:[{type:d}],selectedSvgSheet:[{type:d}],selectSvgSheetRequest:[{type:l}]},x);q=r([c({selector:"awg-edition-svg-sheet-nav",template:Ie,changeDetection:g.OnPush,styles:[Ae]})],q);var W=class{};W=r([h({imports:[p],declarations:[q,A],exports:[q,A]})],W);var qe=`<div class="awg-edition-svg-sheet-viewer-nav">
    <div class="prev" (click)="browseSvgSheet(-1)" (keydown)="browseSvgSheet(-1)" tabindex="0">
        <span>&#10094;</span>
    </div>
    <div class="next" (click)="browseSvgSheet(1)" (keydown)="browseSvgSheet(1)" tabindex="0">
        <span>&#10095;</span>
    </div>
</div>
`;var Le=`.awg-edition-svg-sheet-viewer-nav>.prev,.awg-edition-svg-sheet-viewer-nav .next{cursor:pointer;position:absolute;height:100%;top:0;width:auto;padding:8px;-webkit-user-select:none;user-select:none}.awg-edition-svg-sheet-viewer-nav>.prev:hover,.awg-edition-svg-sheet-viewer-nav .next:hover{background-color:#ddd}.awg-edition-svg-sheet-viewer-nav>.prev span,.awg-edition-svg-sheet-viewer-nav .next span{position:relative;top:45%;font-weight:700;font-size:18px;transition:.6s ease;color:#149b9e}.awg-edition-svg-sheet-viewer-nav>.prev{border-right:1px solid #dddddd}.awg-edition-svg-sheet-viewer-nav>.next{right:0;border-left:1px solid #dddddd}
`;var k,L=(k=class{constructor(){this.browseSvgSheetRequest=new a}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}},k.propDecorators={browseSvgSheetRequest:[{type:l}]},k);L=r([c({selector:"awg-edition-svg-sheet-viewer-nav",template:qe,changeDetection:g.OnPush,styles:[Le]})],L);var Me=`<div class="card awg-edition-svg-sheet-viewer-settings float-none my-2">
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
`;var Ge="";var R,M=(R=class{constructor(){this.toggleSuppliedClassesOpacityRequest=new a,this.toggleTkkClassesHighlightRequest=new a,this.allClassesVisible=!0,this.tkkHighlightingVisible=!0}ngOnChanges(e){e.suppliedClasses&&!e.suppliedClasses.isFirstChange()&&(this.allClassesVisible=!0,this.tkkHighlightingVisible=!0)}toggleSingleSuppliedClassOpacity(e){let t=this.suppliedClasses.get(e)||!1;this._onSuppliedClassesOpacityToggle(e,t),this.suppliedClasses.set(e,!t);let i=Array.from(this.suppliedClasses.values());i.every(s=>s===i[0])&&(this.allClassesVisible=i[0])}toggleAllClassesOpacity(){this._onSuppliedClassesOpacityToggle(void 0,this.allClassesVisible),this.allClassesVisible=!this.allClassesVisible,this.suppliedClasses.forEach((e,t)=>{this.suppliedClasses.set(t,this.allClassesVisible)}),this.toggleTkkClassesHighlight(this.allClassesVisible)}toggleTkkClassesHighlight(e){e!==void 0?this.tkkHighlightingVisible=e:this.tkkHighlightingVisible=!this.tkkHighlightingVisible,this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible),this._updateAllClassesVisibility()}_onSuppliedClassesOpacityToggle(e,t){this.toggleSuppliedClassesOpacityRequest.emit({className:e,isCurrentlyVisible:t})}_updateAllClassesVisibility(){let e=[...Array.from(this.suppliedClasses.values()),this.tkkHighlightingVisible],t=e.every(s=>s),i=e.every(s=>!s);(t||i)&&(this.allClassesVisible=e[0])}},R.propDecorators={id:[{type:d}],suppliedClasses:[{type:d}],hasAvailableTkaOverlays:[{type:d}],toggleSuppliedClassesOpacityRequest:[{type:l}],toggleTkkClassesHighlightRequest:[{type:l}]},R);M=r([c({selector:"awg-edition-svg-sheet-viewer-switch",template:Me,changeDetection:g.OnPush,styles:[Ge]})],M);var Ne=`@if (selectedSvgSheet) {
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
`;var Fe=`#awg-edition-svg-container,#awg-edition-svg-container .awg-edition-svg-icon-bar{position:relative;width:100%}#awg-edition-svg-container .awg-edition-svg-sheet-container{position:inherit;height:100%;box-shadow:5px 5px 6px #ccc;border:1px solid #e7e7e7}.input-group.awg-edition-svg-zoom-slider-container{flex-wrap:nowrap;width:auto;margin-left:2rem!important}.input-group.awg-edition-svg-zoom-slider-container>:not(:first-child){margin-left:0!important}#slider-label.input-group-text{min-width:50px;color:#149b9e}input[type=range].awg-edition-svg-zoom-slider{width:100%;background-color:transparent;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider:focus{outline:none}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-lower{background:#ddddddc7}input[type=range].awg-edition-svg-zoom-slider:focus::-ms-fill-upper{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider:focus::-webkit-slider-runnable-track{background:#e5e5e5}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-runnable-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-webkit-slider-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;-webkit-appearance:none}input[type=range].awg-edition-svg-zoom-slider::-moz-range-track{background:#ddddddc7;border:.2px solid #dddddd;border-radius:1.3px;width:100%;height:29px;cursor:pointer;-moz-margin-start:fill;margin-right:fill}input[type=range].awg-edition-svg-zoom-slider::-moz-range-thumb{width:15px;height:27px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-track{background:transparent;border-color:transparent;border-width:7.4px 0;color:transparent;width:100%;height:31px;cursor:pointer}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-lower{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-fill-upper{background:#ddddddc7;border:.2px solid #dddddd;border-radius:2.6px}input[type=range].awg-edition-svg-zoom-slider::-ms-thumb{width:15px;height:29px;background:#149b9e;border:1.8px solid #149b9e;border-radius:10px;cursor:pointer;margin-top:0}
`;var w,G=(w=class{constructor(e,t){this.cdr=e,this.svgDrawingService=t,this.browseSvgSheetRequest=new a,this.selectLinkBoxRequest=new a,this.selectOverlaysRequest=new a,this.faCompressArrowsAlt=he,this.hasAvailableTkaOverlays=!1,this.sliderConfig=new ke(1,.1,10,.01,1),this.suppliedClasses=new Map,this.svgSheetFilePath="",this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this._isRendered=!1,this._resize$=new D,this._destroyed$=new D,this.ref=this}onResize(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||(this._getContainerDimensions(this.svgSheetContainerRef),this._resize$.next(!0))}ngOnChanges(e){e.selectedSvgSheet&&this._isRendered&&this.renderSheet()}ngAfterViewInit(){this._resize$.pipe(re(150),V(this._destroyed$)).subscribe(e=>{this.renderSheet()}),this.renderSheet(),this._isRendered=!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}onSuppliedClassesOpacityToggle(e){let{className:t,isCurrentlyVisible:i}=e;this.svgDrawingService.toggleSuppliedClassOpacity(this.svgSheetRootGroupSelection,t,i)}onTkkClassesHighlightToggle(e){let t="tkk";this.svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,t).nodes().forEach(s=>{let[o,n]=this._getOverlayAndSelection(s.id,t),v=e?b.fill:b.transparent;this.svgDrawingService.updateTkkOverlayColor(o,n,v)})}onZoomChange(e){this.sliderConfig.value=e,this._rescaleZoom()}renderSheet(){this._clearSvg(),this._availableTkaOverlays=[],this._selectedTkaOverlays=[],this.svgSheetFilePath=this.selectedSvgSheet?.content?.[0].svg,this.svgSheetFilePath&&this._createSvg().then(()=>{this.resetZoom(),this._createSvgOverlays(),this.cdr.detectChanges()})}resetZoom(){!this.svgSheetSelection||!this.sliderConfig||(this.onZoomChange(this.sliderConfig.initial),this._resetZoomTranslation())}_clearSvg(){this.svgSheetRootGroupSelection?.selectAll("*").remove(),this.svgSheetSelection?.selectAll("*").remove()}_createSvg(){return se(this,null,function*(){if(!this.svgSheetContainerRef){console.warn("No svg sheet container ref");return}this.svgSheetSelection=yield this.svgDrawingService.createSvg(this.svgSheetFilePath,this.svgSheetElementRef?.nativeElement,this.svgSheetRootGroupRef?.nativeElement),this.svgSheetRootGroupSelection=this.svgSheetSelection.select("#awg-edition-svg-sheet-root-group"),this._getContainerDimensions(this.svgSheetContainerRef),this._zoomHandler(this.svgSheetRootGroupSelection,this.svgSheetSelection)})}_createSvgOverlays(){this.svgSheetRootGroupSelection&&(this._createOverlays("link-box",this._createLinkBoxOverlay.bind(this)),this._createOverlays("tkk",this._createTkaOverlay.bind(this)),this.hasAvailableTkaOverlays=!!this._availableTkaOverlays&&this._availableTkaOverlays.length>0,this._getSuppliedClasses())}_createOverlays(e,t){let i=this.svgDrawingService.getGroupsBySelector(this.svgSheetRootGroupSelection,e);i&&i.nodes().forEach(s=>{t(s,e)})}_createLinkBoxOverlay(e,t){let i=e.id,s=this.svgDrawingService.getD3SelectionById(this.svgSheetRootGroupSelection,i),o=s.select("path");o.style("fill",this.svgDrawingService.linkBoxFillColor),s.on("mouseover",()=>{let n=this.svgDrawingService.linkBoxHoverFillColor;this.svgDrawingService.fillD3SelectionWithColor(o,n),s.style("cursor","pointer")}).on("mouseout",()=>{let n=this.svgDrawingService.linkBoxFillColor;this.svgDrawingService.fillD3SelectionWithColor(o,n)}).on("click",()=>{this._onLinkBoxSelect(i)})}_createTkaOverlay(e,t){let i=e.id,s=e.getBBox();this._availableTkaOverlays.push(new ue(me.tka,i,!1));let o=this.svgDrawingService.createOverlayGroup(this.svgSheetRootGroupSelection,i,s,t),[n,v]=this._getOverlayAndSelection(i,t);o.on("mouseover",()=>{this.svgDrawingService.updateTkkOverlayColor(n,v,b.hover),v.style("cursor","pointer")}).on("mouseout",()=>{this.svgDrawingService.updateTkkOverlayColor(n,v,b.fill)}).on("click",()=>{n&&(n.isSelected=!n.isSelected),this.svgDrawingService.updateTkkOverlayColor(n,v,b.hover),this._selectedTkaOverlays=this._getSelectedOverlays(this._availableTkaOverlays),this._onOverlaySelect(this._selectedTkaOverlays)})}_getContainerDimensions(e){let t=this.svgDrawingService.getContainerDimensions(e);this._divWidth=this._divWidth?this._divWidth:t.width,this._divHeight=this._divHeight?this._divHeight:t.height}_getOverlayById(e,t){return e.find(i=>i.id===t)}_getOverlayAndSelection(e,t){let i=this._getOverlayById(this._availableTkaOverlays,e),s=this.svgDrawingService.getOverlayGroupRectSelection(this.svgSheetRootGroupSelection,e,t);return[i,s]}_getSelectedOverlays(e){return e.filter(t=>t.isSelected)}_getSuppliedClasses(){this.suppliedClasses=this.svgDrawingService.getSuppliedClasses(this.svgSheetRootGroupSelection)}_onLinkBoxSelect(e){e&&this.selectLinkBoxRequest.emit(e)}_onOverlaySelect(e){e&&this.selectOverlaysRequest.emit(e)}_rescaleZoom(){!this.svgSheetSelection||!this.sliderConfig.value||this._zoomBehaviour.scaleTo(this.svgSheetSelection,this.sliderConfig.value)}_resetZoomTranslation(){!this.svgSheetSelection||!this.svgSheetRootGroupSelection||this.svgSheetRootGroupSelection.attr("transform","translate(0,0)")}_roundToScaleStepDecimalPrecision(e){let t=this.sliderConfig.stepSize;return((o,n)=>+(Math.round(+(o+"e"+n))+"e-"+n))(e,(o=>Math.floor(o)===o?0:o.toString().split(".")[1].length)(t))}_zoomHandler(e,t){let i=s=>{let o=s.transform,n=this._roundToScaleStepDecimalPrecision(o.k);e.attr("transform",o),this.sliderInput?.nativeElement&&(this.sliderInput.nativeElement.value=n,this.sliderConfig.value=n),this.sliderInputLabel?.nativeElement&&(this.sliderInputLabel.nativeElement.innerText=n+"x")};this._zoomBehaviour=Re().scaleExtent([this.sliderConfig.min,this.sliderConfig.max]).on("zoom",i),t.call(this._zoomBehaviour)}},w.ctorParameters=()=>[{type:le},{type:be}],w.propDecorators={svgSheetContainerRef:[{type:m,args:["svgSheetContainer"]}],svgSheetElementRef:[{type:m,args:["svgSheetElement"]}],svgSheetRootGroupRef:[{type:m,args:["svgSheetRootGroup"]}],sliderInput:[{type:m,args:["sliderInput"]}],sliderInputLabel:[{type:m,args:["sliderInputLabel"]}],selectedSvgSheet:[{type:d}],browseSvgSheetRequest:[{type:l}],selectLinkBoxRequest:[{type:l}],selectOverlaysRequest:[{type:l}],onResize:[{type:ae,args:["window:resize"]}]},w);G=r([c({selector:"awg-edition-svg-sheet-viewer",template:Ne,styles:[Fe]})],G);var U=class{};U=r([h({imports:[p,P],declarations:[G,L,M],exports:[G,L,M]})],U);var Be=`<div ngbAccordion>
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
`;var $e="";var E,N=(E=class{constructor(){this.browseSvgSheetRequest=new a,this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectLinkBoxRequest=new a,this.selectOverlaysRequest=new a,this.selectSvgSheetRequest=new a}browseSvgSheet(e){e&&this.browseSvgSheetRequest.emit(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectLinkBox(e){this.selectLinkBoxRequest.emit(e)}selectOverlays(e){this.selectOverlaysRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},E.propDecorators={svgSheetsData:[{type:d}],selectedSvgSheet:[{type:d}],selectedTextcriticalComments:[{type:d}],selectedTextcritics:[{type:d}],showTkA:[{type:d}],browseSvgSheetRequest:[{type:l}],navigateToReportFragmentRequest:[{type:l}],openModalRequest:[{type:l}],selectLinkBoxRequest:[{type:l}],selectOverlaysRequest:[{type:l}],selectSvgSheetRequest:[{type:l}]},E);N=r([c({selector:"awg-edition-accolade",template:Be,changeDetection:g.OnPush,styles:[$e]})],N);var Z=class{};Z=r([h({imports:[p,H,W,U],declarations:[N],exports:[N]})],Z);var Ve=`<div ngbAccordion>
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
`;var ze="";var T,F=(T=class{constructor(){this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.faSquare=ge,this.folioLegends=[{color:"olivedrab",label:"aktuell ausgew\xE4hlt"},{color:"orange",label:"ausw\xE4hlbar"},{color:"grey",label:"(momentan noch) nicht ausw\xE4hlbar"}]}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},T.propDecorators={selectedConvolute:[{type:d}],selectedSvgSheet:[{type:d}],openModalRequest:[{type:l}],selectSvgSheetRequest:[{type:l}]},T);F=r([c({selector:"awg-edition-convolute",template:Ve,changeDetection:g.OnPush,styles:[ze]})],F);var Pe=`<!-- embedded svg: Edition Folio Viewer -->
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
`;var He=`.svgGrid{margin-bottom:2em}.svgRow{padding-top:1em;width:inherit;text-align:center;box-shadow:5px 5px 6px #ccc;border:1px solid #eeeeee}.svgCol{display:inline-block}
`;var Y=class{constructor(){this._bgColor="#a3a3a3",this._disabledColor="grey",this._fgColor="orange",this._contentSegmentFillColor="#eeeeee",this._contentSegmentFontFamily="Source Sans Pro, source-sans-pro, sans-serif",this._contentSegmentFontSize="11px",this._contentSegmentOffsetCorrection=4,this._contentSegmentReversedRotationAngle=180,this._contentSegmentStrokeWidth=2,this._sheetFillColor="white",this._sheetStrokeWidth=1,this._systemsLineStrokeWidth=.7,this._appendSvgElementWithAttrs=(e,t,i)=>{let s=e.append(t);return Object.keys(i).forEach(o=>{s.attr(o,i[o])}),s}}getFolioSvgData(e,t){let i=new fe(e,t,this._contentSegmentOffsetCorrection);return new we(i)}addViewBoxToSvgCanvas(e,t){e.attr("viewBox",t.viewBox).attr("width",t.svgWidth).attr("height",t.svgHeight).attr("version","1.1").attr("xmlns","https://www.w3.org/2000/svg").attr("xlink","https://www.w3.org/1999/xlink").attr("preserveAspectRatio","xMinYMin meet")}addFolioToSvgCanvas(e,t,i){this.ref=i;let s=this._appendCanvasSheetGroup(e,t);this._addFolioSheetToSvgCanvas(s,t),this._addFolioSystemsToSvgCanvas(s,t),this._addFolioContentSegmentsToSvgCanvas(s,t)}_addFolioSheetToSvgCanvas(e,t){let{sheet:i}=t,{upperLeftCorner:s,lowerRightCorner:o,folioId:n}=i;this._appendSheetGroupTitle(e,n),this._appendSheetGroupRectangle(e,s,o)}_addFolioSystemsToSvgCanvas(e,t){t.systems.systemsLines.forEach((i,s)=>{let o=this._appendSvgElementWithAttrs(e,"g",{systemsGroupId:s+1,class:"systems-group"}),n=this._appendSvgElementWithAttrs(o,"g",{systemLineGroupId:s+1,class:"system-line-group"});this._appendSystemsGroupLabel(o,t,s),this._appendSystemsGroupLines(n,i)})}_addFolioContentSegmentsToSvgCanvas(e,t){t?.contentSegments?.forEach(i=>{if(!i)return;let s=this._appendContentSegmentGroup(e,i),o=this._appendContentSegmentLink(s);this._appendContentSegmentLinkPolygon(o,i.segmentVertices),this._appendContentSegmentLinkLabel(o,i)})}_appendCanvasSheetGroup(e,t){return this._appendSvgElementWithAttrs(e,"g",{sheetGroupId:t.sheet.folioId,class:"sheet-group"})}_appendContentSegmentGroup(e,t){let i=this._appendContentSegmentGroupElement(e,t);return this._appendContentSegmentGroupTitle(i,t),i.on("click",()=>t.selectable?this.ref.selectSvgSheet({complexId:t.complexId,sheetId:t.sheetId}):this.ref.openModal(t.linkTo)),i}_appendContentSegmentGroupElement(e,t){return this._appendSvgElementWithAttrs(e,"g",{contentSegmentGroupId:t.segmentLabel,contentSegmentId:t.sheetId,class:"content-segment-group",stroke:t.selectable?this._fgColor:this._disabledColor,fill:t.selectable?this._fgColor:this._disabledColor})}_appendContentSegmentGroupTitle(e,t){return this._appendSvgElementWithAttrs(e,"title",{}).text(t.segmentLabel)}_appendContentSegmentLink(e){return this._appendSvgElementWithAttrs(e,"a",{class:"content-segment-link"})}_appendContentSegmentLinkLabel(e,t){let i=this._appendContentSegmentLinkLabelTextElement(e,t.centeredXPosition,t.centeredYPosition);return this._appendContentSegmentLinkLabelTspanElements(i,t),t.reversed&&i.attr("transform",`rotate(${this._contentSegmentReversedRotationAngle}, ${t.centeredXPosition}, ${t.centeredYPosition})`),i}_appendContentSegmentLinkLabelTextElement(e,t,i){let s={class:"content-segment-label",x:t,y:i};return s["font-family"]=this._contentSegmentFontFamily,s["dominant-baseline"]="middle",s["text-anchor"]="middle",this._appendSvgElementWithAttrs(e,"text",s).style("font-size",this._contentSegmentFontSize)}_appendContentSegmentLinkLabelTspanElements(e,t){t.segmentLabelArray.forEach((i,s)=>{if(i!==""){let o={};s>0&&(o.x=t.centeredXPosition,o.y=t.centeredYPosition,o.dy="1.2em",o["text-anchor"]="middle"),this._appendSvgElementWithAttrs(e,"tspan",o).text(i)}})}_appendContentSegmentLinkPolygon(e,t){let i={class:"content-segment-shape",points:t,fill:this._contentSegmentFillColor};return i["stroke-width"]=this._contentSegmentStrokeWidth,this._appendSvgElementWithAttrs(e,"polygon",i)}_appendSheetGroupRectangle(e,t,i){let{x:s,y:o}=t,{x:n,y:v}=i,O={x:s,y:o,width:n-s,height:v-o,fill:this._sheetFillColor,stroke:this._bgColor};return O["stroke-width"]=this._sheetStrokeWidth,this._appendSvgElementWithAttrs(e,"rect",O)}_appendSheetGroupTitle(e,t){this._appendSvgElementWithAttrs(e,"title",{}).text(`Bl. ${t}`)}_appendSystemsGroupLabel(e,t,i){let{x:s,y:o}=t.systems.systemsLabelPositions[i],n=i+1,v={class:"system-label",x:s,y:o,fill:this._bgColor};v["dominant-baseline"]="hanging",this._appendSvgElementWithAttrs(e,"text",v).text(n)}_appendSystemsGroupLines(e,t){t.forEach(i=>{let{x:s,y:o}=i.START_POINT,{x:n,y:v}=i.END_POINT,O={class:"system-line",x1:s,y1:o,x2:n,y2:v,stroke:this._bgColor};O["stroke-width"]=this._systemsLineStrokeWidth,this._appendSvgElementWithAttrs(e,"line",O)})}};Y=r([ne({providedIn:"root"})],Y);var y,B=(y=class{constructor(e){this.folioService=e,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.canvasArray=[],this.folioSvgDataArray=[],this.viewBoxArray=[],this._folioSettings={factor:1.5,formatX:175,formatY:270,initialOffsetX:5,initialOffsetY:5,numberOfFolios:0},this.ref=this}ngOnChanges(e){e.selectedConvolute&&this.prepareFolioSvgOutput()}ngAfterViewChecked(){this.createSVGCanvas()}createSVGCanvas(){this.canvasArray=[],this.viewBoxArray.length===this.folioSvgDataArray.length&&(this.folioSvgDataArray.forEach((e,t)=>{let i=`#folio-${this.selectedSvgSheet.id}-${e.sheet.folioId}`,s=this._d3Select(i);s.empty()||(s.selectAll("*").remove(),this.folioService.addViewBoxToSvgCanvas(s,this.viewBoxArray[t]),this.folioService.addFolioToSvgCanvas(s,e,this.ref),this.canvasArray.push(s))}),this.toggleActiveClass())}isSelectedSvgSheet(e){let t=this.selectedSvgSheet?.content[0]?.partial||"";return e===`${this.selectedSvgSheet?.id}${t}`}openModal(e){e&&this.openModalRequest.emit(e)}prepareFolioSvgOutput(){this.folioSvgDataArray=[],this.viewBoxArray=[],this.selectedConvolute?.folios&&(this.folioSvgDataArray=this.selectedConvolute.folios.map(e=>{let t=ie(te({},this._folioSettings),{formatX:+e.format.width,formatY:+e.format.height,numberOfFolios:this.selectedConvolute.folios.length}),i=this._calculateViewBoxDimension(t,"X"),s=this._calculateViewBoxDimension(t,"Y");return this.viewBoxArray.push(new ye(i,s)),this.folioService.getFolioSvgData(t,e)}))}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleActiveClass(){this.canvasArray&&this.canvasArray.forEach(e=>{e.selectAll(".content-segment-group").classed("active",(t,i,s)=>{let o=ee(s[i]).attr("contentSegmentId");return this.isSelectedSvgSheet(o)})})}_calculateViewBoxDimension(e,t){let i=`format${t}`,s=`initialOffset${t}`;return(e[i]+2*e[s])*e.factor}_d3Select(e){return ee(e)}},y.ctorParameters=()=>[{type:Y}],y.propDecorators={selectedConvolute:[{type:d}],selectedSvgSheet:[{type:d}],openModalRequest:[{type:l}],selectSvgSheetRequest:[{type:l}]},y);B=r([c({selector:"awg-edition-folio-viewer",template:Pe,changeDetection:g.OnPush,styles:[He]})],B);var j=class{};j=r([h({imports:[p],declarations:[B],exports:[B]})],j);var X=class{};X=r([h({imports:[p,j],declarations:[F],exports:[F]})],X);var We=`<!-- content: edition detail -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- body with embedded svg's -->
    <!-- accolade view -->

    <awg-edition-accolade
        [svgSheetsData]="svgSheetsData"
        [selectedSvgSheet]="selectedSvgSheet"
        [selectedTextcritics]="selectedTextcritics"
        [selectedTextcriticalComments]="selectedTextcriticalComments"
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
`;var Ue="";var _,$=(_=class{constructor(e,t,i,s,o,n){this.editionDataService=e,this.editionSheetsService=t,this.editionService=i,this.utils=s,this.route=o,this.router=n,this.errorMessage=void 0,this.showTkA=!1,this._destroyed$=new D,this._isFirstPageLoad=!0}get editionRouteConstants(){return Se}ngOnInit(){this.getEditionSheetsData()}getEditionSheetsData(){this.snapshotQueryParamsId=this.route.snapshot.queryParamMap.get("id"),oe([this.route.paramMap,this.route.queryParamMap]).pipe(K(([e,t])=>this._fetchEditionComplexData(t)),V(this._destroyed$)).subscribe({next:()=>{},error:e=>{console.error(e),this.errorMessage=e}})}onLinkBoxSelect(e){if(!this.selectedSvgSheet||!this.selectedTextcritics?.linkBoxes)return;let t=this.selectedTextcritics.linkBoxes.find(i=>i.svgGroupId===e);if(t){let i=t.linkTo;this.onSvgSheetSelect(i)}}onReportFragmentNavigate(e){let t=this.editionRouteConstants.EDITION_REPORT.route,i={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,t,i)}onOverlaySelect(e){this.selectedTextcriticalComments=this.editionSheetsService.getTextcriticalCommentsForOverlays(this.selectedTextcritics.comments,e),this.showTkA=this.utils.isNotEmptyArray(this.selectedTextcriticalComments)}onBrowseSvgSheet(e){let t=this.editionSheetsService.getCurrentEditionType(this.selectedSvgSheet,this.svgSheetsData.sheets);if(!t)return;let i=this.svgSheetsData.sheets[t],s=this.editionSheetsService.getNextSheetId(e,this.selectedSvgSheet,i);this.onSvgSheetSelect({complexId:"",sheetId:s})}onSvgSheetSelect(e){let t=this.editionRouteConstants.EDITION_SHEETS.route,i={queryParams:{id:e?.sheetId??""},queryParamsHandling:"merge"};this._navigateWithComplexId(e?.complexId,t,i)}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}_assignData(e){this.folioConvoluteData=e[0],this.svgSheetsData=e[1],this.textcriticsData=e[2]}_fetchEditionComplexData(e){return this.editionService.getEditionComplex().pipe(z(t=>this.editionComplex=t),K(t=>this.editionDataService.getEditionSheetsData(t)),z(t=>this._assignData(t)),z(()=>this._handleQueryParams(e)))}_getDefaultSheetId(){let e=this.svgSheetsData?.sheets?.sketchEditions?.[0],t=e?.content?.length>1?e.content[0]?.partial:"";return(e?.id||"")+t}_handleQueryParams(e){let t=e?.get("id");t&&this.svgSheetsData?this._selectSvgSheet(t):(t=this._isFirstPageLoad&&this.snapshotQueryParamsId?this.snapshotQueryParamsId:this._getDefaultSheetId(),this.onSvgSheetSelect({complexId:"",sheetId:t})),this._isFirstPageLoad=!1}_navigateWithComplexId(e,t,i){let s=e?`/edition/complex/${e}/`:this.editionComplex.baseRoute;this.router.navigate([s,t],i)}_selectSvgSheet(e){e&&(this.selectedSvgSheet=this.editionSheetsService.selectSvgSheetById(this.svgSheetsData.sheets,e),this.selectedConvolute=this.editionSheetsService.selectConvolute(this.folioConvoluteData.convolutes,this.svgSheetsData.sheets,this.selectedSvgSheet),this.selectedTextcritics=this.editionSheetsService.findTextcritics(this.textcriticsData.textcritics,this.selectedSvgSheet),this.onOverlaySelect([]),this.utils.isNotEmptyObject(this.selectedTextcritics)&&this.utils.isNotEmptyArray(this.selectedTextcritics.comments)&&(this.selectedTextcriticalComments=this.selectedTextcritics.comments))}},_.ctorParameters=()=>[{type:_e},{type:Ce},{type:xe},{type:C},{type:de},{type:ce}],_.propDecorators={modal:[{type:m,args:["modal",{static:!0}]}]},_);$=r([c({selector:"awg-edition-sheets",template:We,styles:[Ue]})],$);var St=[{path:"",component:$,data:{title:"AWG Online Edition \u2013 Sheets"}}],Ze=[$],Q=class{};Q=r([h({imports:[J.forChild(St)],exports:[J]})],Q);var Ye=class{};Ye=r([h({imports:[p,Z,X,Q],declarations:[Ze]})],Ye);export{Ye as EditionSheetsModule};
