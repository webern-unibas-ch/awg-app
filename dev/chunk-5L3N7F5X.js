import{a as z}from"./chunk-GYSG6DRK.js";import{b as $,c as G,p as P}from"./chunk-XV2JSPZC.js";import{D as j,M as A,N as H,O as V,R as W}from"./chunk-PARXMUNB.js";import{b as U,e as F,i as L}from"./chunk-MRRWHCSE.js";import"./chunk-TLWDB4YF.js";import"./chunk-7WPXTGUD.js";import"./chunk-JRG5ZD2C.js";import{B as D,I as N,Ua as d,V as x,W as y,Wa as n,Xa as p,Y as B,Za as b,a as E,b as R,bb as q,da as c,k as O,ka as g,kb as M,o as i,q as f,u as T,xa as l}from"./chunk-NJV4ZJ5R.js";var Y=`@if (introBlockContent) {
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
`;var Z=`@charset "UTF-8";.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul li,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table{white-space:nowrap}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table th,.awg-edition-intro-content .awg-edition-intro-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr.row-gap>td{padding-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table{display:table;width:80%;margin-left:auto;margin-right:auto}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child{border-top:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child td{padding-top:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child{border-bottom:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child td{padding-bottom:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var w=class{constructor(){this.navigateToIntroFragmentRequest=new g,this.navigateToReportFragmentRequest=new g,this.openModalRequest=new g,this.selectSvgSheetRequest=new g,this._editionGlyphService=c(H),this.ref=this}getGlyph(t){return this._editionGlyphService.getGlyph(t)}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}static{this.ctorParameters=()=>[]}static{this.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],navigateToIntroFragmentRequest:[{type:p}],navigateToReportFragmentRequest:[{type:p}],openModalRequest:[{type:p}],selectSvgSheetRequest:[{type:p}]}}};w=i([d({selector:"awg-edition-intro-content",template:Y,changeDetection:l.OnPush,standalone:!1,styles:[Z]})],w);var J=`@if (introBlockContent) {
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
`;var K=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var _=class{constructor(){this.languageChangeRequest=new g}setLanguage(t){(t===0||t===1)&&this.languageChangeRequest.emit(t)}static{this.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],currentLanguage:[{type:n}],languageChangeRequest:[{type:p}]}}};_=i([d({selector:"awg-edition-intro-nav",template:J,changeDetection:l.OnPush,standalone:!1,styles:[K]})],_);var Q=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
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
`;var X="";var v=class{static{this.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}],editionRoute:[{type:n}],seriesRoute:[{type:n}],sectionRoute:[{type:n}],introRoute:[{type:n}]}}};v=i([d({selector:"awg-edition-intro-partial-disclaimer",template:Q,standalone:!1,styles:[X]})],v);var tt=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionComplex?.pubStatement?.labeledSectionRoute.label }}.]
    </p>
</div>
`;var et="";var I=class{static{this.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}]}}};I=i([d({selector:"awg-edition-intro-placeholder",template:tt,changeDetection:l.OnPush,standalone:!1,styles:[et]})],I);var ot=`<!-- content: intro -->
<div>
    <!-- modal -->
    <awg-modal #modal />

    <!-- intro -->
    @if (editionIntroData(); as editionIntroData) {
        <div class="awg-edition-intro-view p-5 border rounded-3">
            <div class="row justify-content-center">
                @if (UTILS.isEmptyArray(editionIntroData?.intro?.[currentLanguage]?.content)) {
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
`;var nt="";var h=class{constructor(){this._editionDataService=c(A),this._editionOutlineService=c(V),this._editionStateService=c(W),this._router=c(F),this.currentLanguage=0,this.notesLabels=new Map([[0,"Anmerkungen"],[1,"Notes"]]),this.errorObject=null,this.editionIntroData=G($(q(()=>({series:this._editionStateService.selectedEditionSeries(),section:this._editionStateService.selectedEditionSection(),complex:this._editionStateService.selectedEditionComplex()}))).pipe(x(({series:t,section:e,complex:o})=>{if(!t||!e)return f(null);let s=o&&o.pubStatement?.series?.route===t.series.route&&o.pubStatement?.section?.route===e.section.route?o:null;return this._fetchAndFilterIntroData(t.series.route,e.section.route,s)}),N(t=>(this.errorObject=t,f(void 0)))),{initialValue:null}),this.UTILS=z,this._destroyed$=new O,this._initScrollListener()}get editionRouteConstants(){return j}ngOnInit(){this._editionStateService.updateIsIntroView(!0),this.listenToRouteChanges()}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete(),this._editionStateService.updateIsIntroView(!1)}listenToRouteChanges(){this._router.events.pipe(y(this._destroyed$)).subscribe(t=>{if(this._isNavigationEndToIntro(t)){let{seriesId:e,sectionId:o}=this._extractUrlSegments(t.urlAfterRedirects);e&&o?this._updateEditionState(e,o):console.error("Invalid URL segments:",t.urlAfterRedirects)}})}onIntroFragmentNavigate(t){let e={fragment:t?.fragmentId??""};this._router.navigate([],e)}onLanguageSet(t){this.currentLanguage=t}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let e=this.editionRouteConstants.EDITION_REPORT.route,o={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,e,o)}onSvgSheetSelect(t){let e=this.editionRouteConstants.EDITION_SHEETS.route,o={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,e,o)}_extractUrlSegments(t){if(!t)return{seriesId:void 0,sectionId:void 0};let e=t.split("/"),o=e.indexOf("series")+1,r=e.indexOf("section")+1,s=e[o],a=e[r],C=u=>u!==void 0&&/^[1-3]$/.test(u),k=u=>u!==void 0&&/^[1-5]+[ab]?$/.test(u);return{seriesId:C(s)?s:void 0,sectionId:k(a)?a:void 0}}_fetchAndFilterIntroData(t,e,o){return this._editionDataService.getEditionSectionIntroData(t,e).pipe(x(r=>o?(this.editionComplex=o,this._editionDataService.getEditionComplexIntroData(this.editionComplex).pipe(T(s=>{let a=s.intro[0].id;return this._filterSectionIntroDataById(r,a)}))):(this.editionComplex=void 0,f(r))))}_filterSectionIntroDataById(t,e){return R(E({},t),{intro:t.intro.map(o=>R(E({},o),{content:o.content.filter(r=>r.blockId===e)}))})}_initScrollListener(){D(globalThis,"scroll").pipe(B(200),y(this._destroyed$)).subscribe({next:t=>this._onIntroScroll(t)})}_isNavigationEndToIntro(t){return t instanceof U&&t.urlAfterRedirects?.includes("intro")}_navigateWithComplexId(t,e,o){let r=t?`/edition/complex/${t}`:this.editionComplex.baseRoute;this._router.navigate([r,e],o)}_onIntroScroll(t){if(t?.type==="scroll"){let e=globalThis.scrollY||document.documentElement.scrollTop,o=document.querySelectorAll(".awg-edition-intro-section"),r=document.querySelectorAll("a.awg-edition-intro-nav-link"),s=null;o.forEach(a=>{let C=a.offsetTop-10,k=a.offsetTop+a.offsetHeight;C<=e&&k>e&&(s=a.id)}),r.forEach(a=>{a.classList.toggle("active",a.hash.includes(s))})}}_updateEditionState(t,e){let o=this._editionOutlineService.getEditionSeriesById(t)??null,r=this._editionOutlineService.getEditionSectionById(t,e)??null;this._editionStateService.updateSelectedEditionSeries(o),this._editionStateService.updateSelectedEditionSection(r)}static{this.ctorParameters=()=>[]}static{this.propDecorators={modal:[{type:M,args:["modal",{static:!0}]}]}}};h=i([d({selector:"awg-edition-intro",template:ot,changeDetection:l.OnPush,standalone:!1,styles:[nt]})],h);var ft=[{path:"",component:h,data:{title:"AWG Online Edition \u2013 Intro"}}],it=[h],S=class{};S=i([b({imports:[L.forChild(ft)],exports:[L]})],S);var rt=class{};rt=i([b({imports:[P,S],declarations:[w,_,v,I,it]})],rt);export{rt as EditionIntroModule};
