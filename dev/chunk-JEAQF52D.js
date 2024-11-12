import{f as j}from"./chunk-HSNJW6JI.js";import"./chunk-XZSGKVJZ.js";import{a as H,l as A,o as W}from"./chunk-Q5BBFFUU.js";import{A as L,B as $,D as F,Da as i,F as f,J as m,O as l,Qa as P,Sa as y,T as U,U as r,W as o,X as d,_ as w,a as b,b as k,h as O,k as x,m as D,o as T,p as N,r as B,t as q,ub as G,z as M}from"./chunk-OIF6Z6X7.js";var V=`@if (introBlockContent) {
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
`;var z=`.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr>td{padding-right:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0;text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .no-indent{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak{display:block;margin-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.list{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.no-indent{margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .list{margin-left:1em;text-indent:-1em}
`;var c,C=(c=class{constructor(){this.navigateToIntroFragmentRequest=new l,this.navigateToReportFragmentRequest=new l,this.openModalRequest=new l,this.selectSvgSheetRequest=new l,this.ref=this}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}},c.ctorParameters=()=>[],c.propDecorators={introBlockContent:[{type:o}],notesLabel:[{type:o}],navigateToIntroFragmentRequest:[{type:d}],navigateToReportFragmentRequest:[{type:d}],openModalRequest:[{type:d}],selectSvgSheetRequest:[{type:d}]},c);C=i([r({selector:"awg-edition-intro-content",template:V,changeDetection:m.OnPush,styles:[z]})],C);var Y=`@if (introBlockContent) {
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
`;var Z=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var p,I=(p=class{constructor(){this.languageChangeRequest=new l}setLanguage(t){(t===0||t===1)&&this.languageChangeRequest.emit(t)}},p.propDecorators={introBlockContent:[{type:o}],notesLabel:[{type:o}],currentLanguage:[{type:o}],languageChangeRequest:[{type:d}]},p);I=i([r({selector:"awg-edition-intro-nav",template:Y,changeDetection:m.OnPush,styles:[Z]})],I);var J=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
    <p class="no-para text-muted">
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
`;var K="";var u,R=(u=class{},u.propDecorators={editionComplex:[{type:o}],editionLabel:[{type:o}],editionRoute:[{type:o}],seriesRoute:[{type:o}],sectionRoute:[{type:o}],introRoute:[{type:o}]},u);R=i([r({selector:"awg-edition-intro-partial-disclaimer",template:J,styles:[K]})],R);var Q=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionLabel }}
        {{ editionComplex?.pubStatement?.series?.short }}/{{ editionComplex?.pubStatement?.section?.short }}.]
    </p>
</div>
`;var X="";var h,S=(h=class{},h.propDecorators={editionComplex:[{type:o}],editionLabel:[{type:o}]},h);S=i([r({selector:"awg-edition-intro-placeholder",template:Q,changeDetection:m.OnPush,styles:[X]})],S);var tt=`<!-- content: intro -->
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
`;var et="";var g,v=(g=class{constructor(){this.currentLanguage=0,this.notesLabels=new Map([[0,"Anmerkungen"],[1,"Notes"]]),this.errorObject=null,this.UTILS=f(j),this._destroyed$=new O,this._editionDataService=f(A),this._editionStateService=f(W),this._router=f(P),this._initScrollListener()}get editionRouteConstants(){return H}ngOnInit(){this.getEditionIntroData()}ngOnDestroy(){this._editionStateService.clearIsIntroView(),this.editionIntroData$=null,this._destroyed$.next(!0),this._destroyed$.complete()}getEditionIntroData(){this._editionStateService.updateIsIntroView(!0),this.editionIntroData$=N([this._editionStateService.getSelectedEditionSeries(),this._editionStateService.getSelectedEditionSection(),this._editionStateService.getSelectedEditionComplex().pipe(M(null))]).pipe(L(([t,e,n])=>t&&e?this._fetchAndFilterIntroData(t.series.route,e.section.route,n):x),q(t=>(this.errorObject=t,x)))}onIntroFragmentNavigate(t){let e={fragment:t?.fragmentId??""};this._router.navigate([],e)}onLanguageSet(t){this.currentLanguage=t}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let e=this.editionRouteConstants.EDITION_REPORT.route,n={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,e,n)}onSvgSheetSelect(t){let e=this.editionRouteConstants.EDITION_SHEETS.route,n={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,e,n)}_fetchAndFilterIntroData(t,e,n){return this._editionDataService.getEditionSectionIntroData(t,e).pipe(L(s=>n?(this.editionComplex=n,this._editionDataService.getEditionComplexIntroData(this.editionComplex).pipe(T(_=>{let a=_.intro[0].id;return this._filterSectionIntroDataById(s,a)}))):(this.editionComplex=void 0,D(s))))}_filterSectionIntroDataById(t,e){return k(b({},t),{intro:t.intro.map(n=>k(b({},n),{content:n.content.filter(s=>s.blockId===e)}))})}_initScrollListener(){B(window,"scroll").pipe(F(200),$(this._destroyed$)).subscribe(t=>this._onIntroScroll(t))}_navigateWithComplexId(t,e,n){let s=t?`/edition/complex/${t}/`:this.editionComplex.baseRoute;this._router.navigate([s,e],n)}_onIntroScroll(t){let e=window.scrollY||document.documentElement.scrollTop,n=document.querySelectorAll(".awg-edition-intro-section"),s=document.querySelectorAll("a.awg-edition-intro-nav-link"),_=null;n.forEach(a=>{let rt=a.offsetTop-10,at=a.offsetTop+a.offsetHeight;rt<=e&&at>e&&(_=a.id)}),s.forEach(a=>{a.classList.toggle("active",a.hash.includes(_))})}},g.ctorParameters=()=>[],g.propDecorators={modal:[{type:U,args:["modal",{static:!0}]}]},g);v=i([r({selector:"awg-edition-intro",template:tt,styles:[et]})],v);var vt=[{path:"",component:v,data:{title:"AWG Online Edition \u2013 Intro"}}],ot=[v],E=class{};E=i([w({imports:[y.forChild(vt)],exports:[y]})],E);var nt=class{};nt=i([w({imports:[G,E],declarations:[C,I,R,S,ot]})],nt);export{nt as EditionIntroModule};
