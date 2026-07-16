import{a as W}from"./chunk-GYSG6DRK.js";import{n as P}from"./chunk-BBVJ6WCN.js";import{D as j,M as A,N as H,O,R as V}from"./chunk-WUD757BQ.js";import{b as F,e as G,i as T}from"./chunk-K47NROX7.js";import"./chunk-XWRZ2ILN.js";import"./chunk-V5RNJIMG.js";import"./chunk-Z2OGMWPH.js";import{B as q,I as M,U as x,Ua as d,V as y,W as L,Wa as n,Xa as g,Y as $,Za as b,a as E,b as R,da as m,k as D,ka as c,kb as U,o as i,q as f,u as N,v as B,xa as l}from"./chunk-6DTYCQCV.js";var z=`@if (introBlockContent) {
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
`;var Y=`@charset "UTF-8";.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul li,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table{white-space:nowrap}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table th,.awg-edition-intro-content .awg-edition-intro-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr.row-gap>td{padding-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table{display:table;width:80%;margin-left:auto;margin-right:auto}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child{border-top:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child td{padding-top:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child{border-bottom:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child td{padding-bottom:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var w=class{constructor(){this.navigateToIntroFragmentRequest=new c,this.navigateToReportFragmentRequest=new c,this.openModalRequest=new c,this.selectSvgSheetRequest=new c,this._editionGlyphService=m(H),this.ref=this}getGlyph(t){return this._editionGlyphService.getGlyph(t)}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}static{this.ctorParameters=()=>[]}static{this.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],navigateToIntroFragmentRequest:[{type:g}],navigateToReportFragmentRequest:[{type:g}],openModalRequest:[{type:g}],selectSvgSheetRequest:[{type:g}]}}};w=i([d({selector:"awg-edition-intro-content",template:z,changeDetection:l.OnPush,standalone:!1,styles:[Y]})],w);var Z=`@if (introBlockContent) {
    <div class="awg-edition-intro-nav">
        <ul class="nav flex-column">
            <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)" />
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
`;var J=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var _=class{constructor(){this.languageChangeRequest=new c}setLanguage(t){(t===0||t===1)&&this.languageChangeRequest.emit(t)}static{this.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],currentLanguage:[{type:n}],languageChangeRequest:[{type:g}]}}};_=i([d({selector:"awg-edition-intro-nav",template:Z,changeDetection:l.OnPush,standalone:!1,styles:[J]})],_);var K=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
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
`;var Q="";var v=class{static{this.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}],editionRoute:[{type:n}],seriesRoute:[{type:n}],sectionRoute:[{type:n}],introRoute:[{type:n}]}}};v=i([d({selector:"awg-edition-intro-partial-disclaimer",template:K,standalone:!1,styles:[Q]})],v);var X=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionLabel }}
        {{ editionComplex?.pubStatement?.series?.short }}/{{ editionComplex?.pubStatement?.section?.short }}.]
    </p>
</div>
`;var tt="";var I=class{static{this.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}]}}};I=i([d({selector:"awg-edition-intro-placeholder",template:X,changeDetection:l.OnPush,standalone:!1,styles:[tt]})],I);var et=`<!-- content: intro -->
<div>
    <!-- modal -->
    <awg-modal #modal />

    <!-- intro -->
    @if (editionIntroData$ | async; as editionIntroData) {
        <div class="awg-edition-intro-view p-5 border rounded-3">
            <div class="row justify-content-center">
                @if (UTILS.isEmptyArray(editionIntroData?.intro[currentLanguage]?.content)) {
                    <awg-edition-intro-placeholder
                        class="col-12"
                        [editionComplex]="editionComplex"
                        [editionLabel]="editionRouteConstants.EDITION.short" />
                } @else {
                    @if (editionComplex) {
                        <awg-edition-intro-partial-disclaimer
                            class="col-12 col-xl-6"
                            [editionComplex]="editionComplex"
                            [editionLabel]="editionRouteConstants.EDITION.short"
                            [editionRoute]="editionRouteConstants.EDITION.route"
                            [seriesRoute]="editionRouteConstants.SERIES.route"
                            [sectionRoute]="editionRouteConstants.SECTION.route"
                            [introRoute]="editionRouteConstants.EDITION_INTRO.route" />
                    }
                    <awg-edition-intro-content
                        class="col-12 col-xl-10"
                        [introBlockContent]="editionIntroData.intro[currentLanguage].content"
                        [notesLabel]="notesLabels.get(currentLanguage)"
                        (navigateToIntroFragmentRequest)="onIntroFragmentNavigate($event)"
                        (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                        (openModalRequest)="onModalOpen($event)"
                        (selectSvgSheetRequest)="onSvgSheetSelect($event)" />

                    <awg-edition-intro-nav
                        class="col-12 col-xl-2 d-none d-xl-block"
                        [introBlockContent]="editionIntroData.intro[currentLanguage].content"
                        [notesLabel]="notesLabels.get(currentLanguage)"
                        [currentLanguage]="currentLanguage"
                        (languageChangeRequest)="onLanguageSet($event)" />
                }
            </div>
        </div>
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <awg-alert-error [errorObject]="errorObject" />
        } @else {
            <!-- loading spinner fallback -->
            <awg-twelve-tone-spinner />
        }
    }
</div>
`;var ot="";var h=class{constructor(){this._editionDataService=m(A),this._editionStateService=m(V),this._router=m(G),this.currentLanguage=0,this.notesLabels=new Map([[0,"Anmerkungen"],[1,"Notes"]]),this.errorObject=null,this.UTILS=W,this._destroyed$=new D,this._initScrollListener()}get editionRouteConstants(){return j}ngOnInit(){this.listenToRouteChanges(),this.getEditionIntroData()}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete(),this._editionStateService.clearIsIntroView(),this.editionIntroData$=void 0}listenToRouteChanges(){this._router.events.pipe(L(this._destroyed$)).subscribe(t=>{if(this._isNavigationEndToIntro(t)){let{seriesId:e,sectionId:o}=this._extractUrlSegments(t.urlAfterRedirects);e&&o?this._updateEditionState(e,o):console.error("Invalid URL segments:",t.urlAfterRedirects)}})}getEditionIntroData(){this.editionIntroData$=B([this._editionStateService.getSelectedEditionSeries(),this._editionStateService.getSelectedEditionSection(),this._editionStateService.getSelectedEditionComplex().pipe(x(null))]).pipe(y(([t,e,o])=>{if(!t||!e)return f(null);let s=o&&o.pubStatement?.series?.route===t.series.route&&o.pubStatement?.section?.route===e.section.route?o:null;return this._fetchAndFilterIntroData(t.series.route,e.section.route,s).pipe(x(null))}),M(t=>(this.errorObject=t,f(void 0))))}onIntroFragmentNavigate(t){let e={fragment:t?.fragmentId??""};this._router.navigate([],e)}onLanguageSet(t){this.currentLanguage=t}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let e=this.editionRouteConstants.EDITION_REPORT.route,o={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,e,o)}onSvgSheetSelect(t){let e=this.editionRouteConstants.EDITION_SHEETS.route,o={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,e,o)}_extractUrlSegments(t){if(!t)return{seriesId:void 0,sectionId:void 0};let e=t.split("/"),o=e.indexOf("series")+1,r=e.indexOf("section")+1,s=e[o],a=e[r],C=u=>u!==void 0&&/^[1-3]$/.test(u),k=u=>u!==void 0&&/^[1-5]+[ab]?$/.test(u);return{seriesId:C(s)?s:void 0,sectionId:k(a)?a:void 0}}_fetchAndFilterIntroData(t,e,o){return this._editionDataService.getEditionSectionIntroData(t,e).pipe(y(r=>o?(this.editionComplex=o,this._editionDataService.getEditionComplexIntroData(this.editionComplex).pipe(N(s=>{let a=s.intro[0].id;return this._filterSectionIntroDataById(r,a)}))):(this.editionComplex=void 0,f(r))))}_filterSectionIntroDataById(t,e){return R(E({},t),{intro:t.intro.map(o=>R(E({},o),{content:o.content.filter(r=>r.blockId===e)}))})}_initScrollListener(){q(globalThis,"scroll").pipe($(200),L(this._destroyed$)).subscribe({next:t=>this._onIntroScroll(t)})}_isNavigationEndToIntro(t){return t instanceof F&&t.urlAfterRedirects?.includes("intro")}_navigateWithComplexId(t,e,o){let r=t?`/edition/complex/${t}`:this.editionComplex.baseRoute;this._router.navigate([r,e],o)}_onIntroScroll(t){if(t?.type==="scroll"){let e=globalThis.scrollY||document.documentElement.scrollTop,o=document.querySelectorAll(".awg-edition-intro-section"),r=document.querySelectorAll("a.awg-edition-intro-nav-link"),s=null;o.forEach(a=>{let C=a.offsetTop-10,k=a.offsetTop+a.offsetHeight;C<=e&&k>e&&(s=a.id)}),r.forEach(a=>{a.classList.toggle("active",a.hash.includes(s))})}}_updateEditionState(t,e){let o=O.getEditionSeriesById(t),r=O.getEditionSectionById(t,e);this._editionStateService.updateSelectedEditionSeries(o),this._editionStateService.updateSelectedEditionSection(r),this._editionStateService.updateIsIntroView(!0)}static{this.ctorParameters=()=>[]}static{this.propDecorators={modal:[{type:U,args:["modal",{static:!0}]}]}}};h=i([d({selector:"awg-edition-intro",template:et,changeDetection:l.OnPush,standalone:!1,styles:[ot]})],h);var ht=[{path:"",component:h,data:{title:"AWG Online Edition \u2013 Intro"}}],nt=[h],S=class{};S=i([b({imports:[T.forChild(ht)],exports:[T]})],S);var it=class{};it=i([b({imports:[P,S],declarations:[w,_,v,I,nt]})],it);export{it as EditionIntroModule};
