import{B as U,Cb as A,D as l,Ga as G,Ia as P,K as c,Ka as y,M as p,Mb as H,Nb as V,Ob as L,Q as F,Qb as W,R as s,T as n,U as g,W as f,a as E,b as R,h as N,i as k,j as i,l as O,mb as j,n as D,nc as z,o as T,q as B,s as q,x as M,y as x,z as $}from"./chunk-KXCYYFOT.js";var Y=`@if (introBlockContent) {
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
`;var Z=`.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table{text-wrap:nowrap}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr>td{padding-right:20px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table{display:table;width:80%;margin-left:auto;margin-right:auto}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child{border-top:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child td{padding-top:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child{border-bottom:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child td{padding-bottom:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0;text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .no-indent{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak{display:block;margin-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.list{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.no-indent{margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .list{margin-left:1em;text-indent:-1em}
`;var _=class{constructor(){this.navigateToIntroFragmentRequest=new c,this.navigateToReportFragmentRequest=new c,this.openModalRequest=new c,this.selectSvgSheetRequest=new c,this._editionGlyphService=l(V),this.ref=this}getGlyph(t){return this._editionGlyphService.getGlyph(t)}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}static{this.ctorParameters=()=>[]}static{this.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],navigateToIntroFragmentRequest:[{type:g}],navigateToReportFragmentRequest:[{type:g}],openModalRequest:[{type:g}],selectSvgSheetRequest:[{type:g}]}}};_=i([s({selector:"awg-edition-intro-content",template:Y,changeDetection:p.OnPush,standalone:!1,styles:[Z]})],_);var J=`@if (introBlockContent) {
    <div class="awg-edition-intro-nav">
        <ul class="nav flex-column">
            <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)">
            </awg-language-switcher>
            <hr class="mt-0 mb-2" />
            @for (introBlock of introBlockContent; track $index) {
                @if (introBlock.blockHeader) {
                    <li class="nav-item small">
                        <a
                            class="nav-link awg-edition-intro-nav-link pt-0"
                            [routerLink]="'.'"
                            [fragment]="introBlock.blockId"
                            [innerHTML]="introBlock.blockHeader"></a>
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
`;var w=class{constructor(){this.languageChangeRequest=new c}setLanguage(t){(t===0||t===1)&&this.languageChangeRequest.emit(t)}static{this.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],currentLanguage:[{type:n}],languageChangeRequest:[{type:g}]}}};w=i([s({selector:"awg-edition-intro-nav",template:J,changeDetection:p.OnPush,standalone:!1,styles:[K]})],w);var Q=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
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
`;var X="";var b=class{static{this.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}],editionRoute:[{type:n}],seriesRoute:[{type:n}],sectionRoute:[{type:n}],introRoute:[{type:n}]}}};b=i([s({selector:"awg-edition-intro-partial-disclaimer",template:Q,standalone:!1,styles:[X]})],b);var tt=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionLabel }}
        {{ editionComplex?.pubStatement?.series?.short }}/{{ editionComplex?.pubStatement?.section?.short }}.]
    </p>
</div>
`;var et="";var v=class{static{this.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}]}}};v=i([s({selector:"awg-edition-intro-placeholder",template:tt,changeDetection:p.OnPush,standalone:!1,styles:[et]})],v);var ot=`<!-- content: intro -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- intro -->
    @if (editionIntroData$ | async; as editionIntroData) {
        <div class="awg-edition-intro-view p-5 border rounded-3">
            <div class="row justify-content-center">
                @if (UTILS.isNotEmptyArray(editionIntroData.intro[currentLanguage].content)) {
                    @if (editionComplex) {
                        <awg-edition-intro-partial-disclaimer
                            class="col-12 col-xl-6"
                            [editionComplex]="editionComplex"
                            [editionLabel]="editionRouteConstants.EDITION.short"
                            [editionRoute]="editionRouteConstants.EDITION.route"
                            [seriesRoute]="editionRouteConstants.SERIES.route"
                            [sectionRoute]="editionRouteConstants.SECTION.route"
                            [introRoute]="
                                editionRouteConstants.EDITION_INTRO.route
                            "></awg-edition-intro-partial-disclaimer>
                    }
                    <awg-edition-intro-content
                        class="col-12 col-xl-10"
                        [introBlockContent]="editionIntroData?.intro[currentLanguage]?.content"
                        [notesLabel]="notesLabels.get(currentLanguage)"
                        (navigateToIntroFragmentRequest)="onIntroFragmentNavigate($event)"
                        (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                        (openModalRequest)="onModalOpen($event)"
                        (selectSvgSheetRequest)="onSvgSheetSelect($event)"></awg-edition-intro-content>

                    <awg-edition-intro-nav
                        class="col-12 col-xl-2 d-none d-xl-block"
                        [introBlockContent]="editionIntroData?.intro[currentLanguage]?.content"
                        [notesLabel]="notesLabels.get(currentLanguage)"
                        [currentLanguage]="currentLanguage"
                        (languageChangeRequest)="onLanguageSet($event)"></awg-edition-intro-nav>
                } @else {
                    <awg-edition-intro-placeholder
                        class="col-12"
                        [editionComplex]="editionComplex"
                        [editionLabel]="editionRouteConstants.EDITION.short"></awg-edition-intro-placeholder>
                }
            </div>
        </div>
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <awg-alert-error [errorObject]="errorObject"></awg-alert-error>
        } @else {
            <!-- loading spinner -->
            <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
        }
    }
</div>
`;var nt="";var h=class{constructor(){this.currentLanguage=0,this.notesLabels=new Map([[0,"Anmerkungen"],[1,"Notes"]]),this.errorObject=null,this.UTILS=l(j),this._destroyed$=new N,this._editionDataService=l(H),this._editionStateService=l(W),this._router=l(P),this._initScrollListener()}get editionRouteConstants(){return A}ngOnInit(){this.getEditionIntroData()}ngOnDestroy(){this._editionStateService.clearIsIntroView(),this.editionIntroData$=void 0,this._destroyed$.next(!0),this._destroyed$.complete()}getEditionIntroData(){this._router.events.subscribe(t=>{if(this._isNavigationEndToIntro(t)){let{seriesNumber:e,sectionNumber:o}=this._extractUrlSegments(t.urlAfterRedirects);e&&o?this._updateEditionState(e,o):console.error("Invalid URL segments:",t.urlAfterRedirects)}}),this._loadEditionIntroData()}onIntroFragmentNavigate(t){let e={fragment:t?.fragmentId??""};this._router.navigate([],e)}onLanguageSet(t){this.currentLanguage=t}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let e=this.editionRouteConstants.EDITION_REPORT.route,o={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,e,o)}onSvgSheetSelect(t){let e=this.editionRouteConstants.EDITION_SHEETS.route,o={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,e,o)}_extractUrlSegments(t){if(!t)return{seriesNumber:void 0,sectionNumber:void 0};let e=t.split("/"),o=e.indexOf("series")+1,r=e.indexOf("section")+1,d=e[o],a=e[r],S=u=>u!==void 0&&/^[1-3]$/.test(u),C=u=>u!==void 0&&/^[1-5]+[ab]?$/.test(u);return{seriesNumber:S(d)?d:void 0,sectionNumber:C(a)?a:void 0}}_fetchAndFilterIntroData(t,e,o){return this._editionDataService.getEditionSectionIntroData(t,e).pipe(x(r=>o?(this.editionComplex=o,this._editionDataService.getEditionComplexIntroData(this.editionComplex).pipe(D(d=>{let a=d.intro[0].id;return this._filterSectionIntroDataById(r,a)}))):(this.editionComplex=void 0,O(r))))}_filterSectionIntroDataById(t,e){return R(E({},t),{intro:t.intro.map(o=>R(E({},o),{content:o.content.filter(r=>r.blockId===e)}))})}_initScrollListener(){B(window,"scroll").pipe(U(200),$(this._destroyed$)).subscribe({next:t=>this._onIntroScroll(t)})}_isNavigationEndToIntro(t){return t instanceof G&&t.urlAfterRedirects?.includes("intro")}_loadEditionIntroData(){this.editionIntroData$=T([this._editionStateService.getSelectedEditionSeries(),this._editionStateService.getSelectedEditionSection(),this._editionStateService.getSelectedEditionComplex().pipe(M(null))]).pipe(x(([t,e,o])=>t&&e?this._fetchAndFilterIntroData(t.series.route,e.section.route,o):k),q(t=>(this.errorObject=t,k)))}_navigateWithComplexId(t,e,o){let r=t?`/edition/complex/${t}/`:this.editionComplex.baseRoute;this._router.navigate([r,e],o)}_onIntroScroll(t){if(t?.type==="scroll"){let e=window.scrollY||document.documentElement.scrollTop,o=document.querySelectorAll(".awg-edition-intro-section"),r=document.querySelectorAll("a.awg-edition-intro-nav-link"),d=null;o.forEach(a=>{let S=a.offsetTop-10,C=a.offsetTop+a.offsetHeight;S<=e&&C>e&&(d=a.id)}),r.forEach(a=>{a.classList.toggle("active",a.hash.includes(d))})}}_updateEditionState(t,e){let o=L.getEditionSeriesById(t),r=L.getEditionSectionById(t,e);this._editionStateService.updateSelectedEditionSeries(o),this._editionStateService.updateSelectedEditionSection(r),this._editionStateService.updateIsIntroView(!0)}static{this.ctorParameters=()=>[]}static{this.propDecorators={modal:[{type:F,args:["modal",{static:!0}]}]}}};h=i([s({selector:"awg-edition-intro",template:ot,standalone:!1,styles:[nt]})],h);var ft=[{path:"",component:h,data:{title:"AWG Online Edition \u2013 Intro"}}],it=[h],I=class{};I=i([f({imports:[y.forChild(ft)],exports:[y]})],I);var rt=class{};rt=i([f({imports:[z,I],declarations:[_,w,b,v,it]})],rt);export{rt as EditionIntroModule};
