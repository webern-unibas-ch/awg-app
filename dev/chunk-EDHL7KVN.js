import{a as U}from"./chunk-O2L2NWUQ.js";import"./chunk-PVUL6KQX.js";import{a as M}from"./chunk-GYSG6DRK.js";import"./chunk-UUCKM3QQ.js";import"./chunk-3F66QUQP.js";import{a as B}from"./chunk-MLU7T4UK.js";import{i as k,n as N}from"./chunk-BFD4LCFP.js";import{F as D,U as q}from"./chunk-HR66FILD.js";import{e as O,i as _}from"./chunk-PHA4MKGK.js";import"./chunk-VEHUZ5QH.js";import"./chunk-YQCKQZIK.js";import"./chunk-VBLWJHEV.js";import{B as I,Ua as i,W as R,Wa as e,Xa as d,Y as x,Za as m,bb as y,da as c,gb as L,k as E,ka as g,kb as T,na as S,o,xa as r}from"./chunk-KW3I6Z6V.js";var G=`@if (introBlockContent) {
    <div class="awg-edition-intro-content">
        @for (introBlock of introBlockContent; track $index) {
            <section class="awg-edition-intro-section" [id]="introBlock.blockId">
                @if (introBlock.blockHeader) {
                    <div class="awg-edition-intro-block">
                        <p class="heading" [innerHTML]="introBlock.blockHeader"></p>
                    </div>
                }
                @if (introBlock.blockContent.length > 0) {
                    @for (blockContent of introBlock.blockContent; track $index) {
                        <div
                            class="awg-edition-intro-block"
                            [compile-html]="blockContent"
                            [compile-html-ref]="this"></div>
                    }
                }
            </section>
        }
        <section class="awg-edition-intro-section mt-5" id="notes">
            <hr />
            <h5>{{ notesLabel }}</h5>
            <div class="awg-edition-intro-notes">
                @for (introBlock of introBlockContent; track $index) {
                    @if (introBlock.blockNotes.length > 0) {
                        @for (note of introBlock.blockNotes; track $index) {
                            <small
                                ><div
                                    class="awg-edition-intro-note"
                                    [compile-html]="note"
                                    [compile-html-ref]="this"></div
                            ></small>
                        }
                    }
                }
            </div>
        </section>
    </div>
}
`;var F=`@charset "UTF-8";.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul li,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table{white-space:nowrap}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table th,.awg-edition-intro-content .awg-edition-intro-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr.row-gap>td{padding-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table{display:table;width:80%;margin-left:auto;margin-right:auto}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child{border-top:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child td{padding-top:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child{border-bottom:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child td{padding-bottom:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var u=class{constructor(){this.navigateToIntroFragmentRequest=new g,this.navigateToReportFragmentRequest=new g,this.openModalRequest=new g,this.selectSvgSheetRequest=new g,this._editionGlyphService=c(B),this.ref=this}getGlyph(t){return this._editionGlyphService.getGlyph(t)}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}static{this.ctorParameters=()=>[]}static{this.propDecorators={introBlockContent:[{type:e}],notesLabel:[{type:e}],navigateToIntroFragmentRequest:[{type:d}],navigateToReportFragmentRequest:[{type:d}],openModalRequest:[{type:d}],selectSvgSheetRequest:[{type:d}]}}};u=o([i({selector:"awg-edition-intro-content",template:G,changeDetection:r.OnPush,standalone:!1,styles:[F]})],u);var P=`@if (introBlockContent) {
    <div class="awg-edition-intro-nav">
        <ul class="nav flex-column">
            <awg-language-switcher [(selectedLanguage)]="selectedLanguage" />
            <hr class="mt-0 mb-2" />
            @for (introBlock of introBlockContent; track $index) {
                @if (introBlock.blockHeader) {
                    <li class="nav-item small">
                        <a
                            class="nav-link awg-edition-intro-nav-link pt-0"
                            [routerLink]="'.'"
                            [fragment]="introBlock.blockId"
                            [innerHTML]="introBlock.blockHeader"
                            ><span class="visually-hidden">{{ introBlock.blockHeader }}</span></a
                        >
                    </li>
                }
            }
            <hr class="mb-2" />
            <li class="nav-item small">
                <a class="nav-link awg-edition-intro-nav-link pt-0" [routerLink]="'.'" fragment="notes">{{
                    notesLabel
                }}</a>
            </li>
        </ul>
    </div>
}
`;var $=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var w=class{constructor(){this.selectedLanguage=L.required()}static{this.propDecorators={introBlockContent:[{type:e}],notesLabel:[{type:e}],selectedLanguage:[{type:e,args:[{isSignal:!0,alias:"selectedLanguage",required:!0}]},{type:d,args:["selectedLanguageChange"]}]}}};w=o([i({selector:"awg-edition-intro-nav",template:P,changeDetection:r.OnPush,standalone:!1,styles:[$]})],w);var H=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
    <p class="no-para-margin text-muted">
        [Siehe auch die gesamte Einleitung zu
        <a
            [routerLink]="[
                editionRoute,
                seriesRoute,
                editionComplex?.pubStatement?.series?.route,
                sectionRoute,
                editionComplex?.pubStatement?.section?.route,
                introRoute,
            ]"
            ><span
                >{{ editionLabel }} {{ editionComplex?.pubStatement?.series?.short }}/{{
                    editionComplex?.pubStatement?.section?.short
                }}</span
            ></a
        >.]
    </p>
</div>
`;var j="";var h=class{static{this.propDecorators={editionComplex:[{type:e}],editionLabel:[{type:e}],editionRoute:[{type:e}],seriesRoute:[{type:e}],sectionRoute:[{type:e}],introRoute:[{type:e}]}}};h=o([i({selector:"awg-edition-intro-partial-disclaimer",template:H,standalone:!1,styles:[j]})],h);var A=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionComplex?.pubStatement?.labeledSectionRoute.label }}.]
    </p>
</div>
`;var W="";var b=class{static{this.propDecorators={editionComplex:[{type:e}],editionLabel:[{type:e}]}}};b=o([i({selector:"awg-edition-intro-placeholder",template:A,changeDetection:r.OnPush,standalone:!1,styles:[W]})],b);var z=`<!-- content: intro -->
<div>
    <!-- modal -->
    <awg-modal #modal />

    <!-- intro -->
    @if (viewData(); as view) {
        @if (view.error; as errorObject) {
            <awg-alert-error [errorObject]="errorObject" />
        } @else if (view.isLoading) {
            <awg-twelve-tone-spinner />
        } @else {
            @let complex = selectedEditionComplex();
            @let intro = view.data.introData.intro;
            @let lang = selectedLanguage();
            @let notesLabel = notesSectionLabel();

            <div class="awg-edition-intro-view p-5 border rounded-3">
                <div class="row justify-content-center">
                    @if (UTILS.isEmptyArray(intro?.[lang]?.content)) {
                        <awg-edition-intro-placeholder
                            class="col-12"
                            [editionComplex]="complex"
                            [editionLabel]="editionRouteConstants.EDITION.short" />
                    } @else {
                        @if (complex) {
                            <awg-edition-intro-partial-disclaimer
                                class="col-12 col-xl-6"
                                [editionComplex]="complex"
                                [editionLabel]="editionRouteConstants.EDITION.short"
                                [editionRoute]="editionRouteConstants.EDITION.route"
                                [seriesRoute]="editionRouteConstants.SERIES.route"
                                [sectionRoute]="editionRouteConstants.SECTION.route"
                                [introRoute]="editionRouteConstants.EDITION_INTRO.route" />
                        }
                        <awg-edition-intro-content
                            class="col-12 col-xl-10"
                            [introBlockContent]="intro[lang].content"
                            [notesLabel]="notesLabel"
                            (navigateToIntroFragmentRequest)="onIntroFragmentNavigate($event)"
                            (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                            (openModalRequest)="onModalOpen($event)"
                            (selectSvgSheetRequest)="onSvgSheetSelect($event)" />

                        <awg-edition-intro-nav
                            class="col-12 col-xl-2 d-none d-xl-block"
                            [introBlockContent]="intro[lang].content"
                            [notesLabel]="notesLabel"
                            [(selectedLanguage)]="selectedLanguage" />
                    }
                </div>
            </div>
        }
    }
</div>
`;var V="";var p=class{constructor(){this._router=c(O),this._destroyed$=new E,this.UTILS=M,this.selectedEditionComplex=c(q).selectedEditionComplex,this.viewData=c(U).introViewData,this.selectedLanguage=S(k.DE),this.notesSectionLabel=y(()=>this.selectedLanguage()===k.DE?"Anmerkungen":"Notes"),this._initScrollListener()}get editionRouteConstants(){return D}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}onIntroFragmentNavigate(t){let n={fragment:t?.fragmentId??""};this._router.navigate([],n)}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let n=this.editionRouteConstants.EDITION_REPORT.route,a={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,n,a)}onSvgSheetSelect(t){let n=this.editionRouteConstants.EDITION_SHEETS.route,a={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,n,a)}_initScrollListener(){I(globalThis,"scroll").pipe(x(200),R(this._destroyed$)).subscribe({next:t=>this._onIntroScroll(t)})}_navigateWithComplexId(t,n,a){let v=t?`/edition/complex/${t}`:this.selectedEditionComplex()?.baseRoute??"/edition/series";this._router.navigate([v,n],a)}_onIntroScroll(t){if(t?.type==="scroll"){let n=globalThis.scrollY||document.documentElement.scrollTop,a=document.querySelectorAll(".awg-edition-intro-section"),v=document.querySelectorAll("a.awg-edition-intro-nav-link"),C=null;a.forEach(l=>{let J=l.offsetTop-10,K=l.offsetTop+l.offsetHeight;J<=n&&K>n&&(C=l.id)}),v.forEach(l=>{l.classList.toggle("active",l.hash.includes(C))})}}static{this.ctorParameters=()=>[]}static{this.propDecorators={modal:[{type:T,args:["modal",{static:!0}]}]}}};p=o([i({selector:"awg-edition-intro",template:z,changeDetection:r.OnPush,standalone:!1,styles:[V]})],p);var dt=[{path:"",component:p,data:{title:"AWG Online Edition \u2013 Intro"}}],Y=[p],f=class{};f=o([m({imports:[_.forChild(dt)],exports:[_]})],f);var Z=class{};Z=o([m({imports:[N,f],declarations:[u,w,h,b,Y]})],Z);export{Z as EditionIntroModule};
