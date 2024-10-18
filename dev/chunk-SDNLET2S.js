import{f as G}from"./chunk-TP5QNBOO.js";import"./chunk-X663MHK7.js";import{b as H,m as j,p as A}from"./chunk-YFDU6MHV.js";import{A as x,B as M,Ca as i,D as $,I as m,N as l,Pa as U,Ra as y,S as F,T as a,V as n,W as d,Z as w,a as E,b,h as L,k,m as O,o as D,p as T,r as N,rb as P,t as B,z as q}from"./chunk-QGPQRYE7.js";var W=`@if (introBlockContent) {
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
`;var V=`.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr>td{padding-right:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0;text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .no-indent{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak{display:block;margin-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.list{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.no-indent{margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .list{margin-left:1em;text-indent:-1em}
`;var c,C=(c=class{constructor(){this.navigateToIntroFragmentRequest=new l,this.navigateToReportFragmentRequest=new l,this.openModalRequest=new l,this.selectSvgSheetRequest=new l,this.ref=this}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}},c.ctorParameters=()=>[],c.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],navigateToIntroFragmentRequest:[{type:d}],navigateToReportFragmentRequest:[{type:d}],openModalRequest:[{type:d}],selectSvgSheetRequest:[{type:d}]},c);C=i([a({selector:"awg-edition-intro-content",template:W,changeDetection:m.OnPush,styles:[V]})],C);var z=`@if (introBlockContent) {
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
`;var Y=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var p,I=(p=class{constructor(){this.languageChangeRequest=new l}setLanguage(t){(t===0||t===1)&&this.languageChangeRequest.emit(t)}},p.propDecorators={introBlockContent:[{type:n}],notesLabel:[{type:n}],currentLanguage:[{type:n}],languageChangeRequest:[{type:d}]},p);I=i([a({selector:"awg-edition-intro-nav",template:z,changeDetection:m.OnPush,styles:[Y]})],I);var Z=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
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
`;var J="";var u,_=(u=class{},u.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}],editionRoute:[{type:n}],seriesRoute:[{type:n}],sectionRoute:[{type:n}],introRoute:[{type:n}]},u);_=i([a({selector:"awg-edition-intro-partial-disclaimer",template:Z,styles:[J]})],_);var K=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionLabel }}
        {{ editionComplex?.pubStatement?.series?.short }}/{{ editionComplex?.pubStatement?.section?.short }}.]
    </p>
</div>
`;var Q="";var h,R=(h=class{},h.propDecorators={editionComplex:[{type:n}],editionLabel:[{type:n}]},h);R=i([a({selector:"awg-edition-intro-placeholder",template:K,changeDetection:m.OnPush,styles:[Q]})],R);var X=`<!-- content: intro -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- intro -->
    @if (editionIntroData$ | async; as editionIntroData) {
        <div class="awg-edition-intro-view p-5 border rounded-3">
            <div class="row justify-content-center">
                @if (utils.isNotEmptyArray(editionIntroData.intro[currentLanguage].content)) {
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
            <awg-error-alert [errorObject]="errorObject"></awg-error-alert>
        } @else {
            <!-- loading spinner -->
            <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
        }
    }
</div>
`;var tt="";var g,f=(g=class{constructor(t,e,o,r){this.editionDataService=t,this.editionStateService=e,this.router=o,this.utils=r,this.currentLanguage=0,this.notesLabels=new Map([[0,"Anmerkungen"],[1,"Notes"]]),this.errorObject=null,this._destroyed$=new L,this._initScrollListener()}get editionRouteConstants(){return H}ngOnInit(){this.getEditionIntroData()}ngOnDestroy(){this.editionStateService.clearIsIntroView(),this.editionIntroData$=null,this._destroyed$.next(!0),this._destroyed$.complete()}getEditionIntroData(){this.editionStateService.updateIsIntroView(!0),this.editionIntroData$=T([this.editionStateService.getSelectedEditionSeries(),this.editionStateService.getSelectedEditionSection(),this.editionStateService.getSelectedEditionComplex().pipe(q(null))]).pipe(x(([t,e,o])=>t&&e?this._fetchAndFilterIntroData(t.series.route,e.section.route,o):k),B(t=>(this.errorObject=t,k)))}onIntroFragmentNavigate(t){let e={fragment:t?.fragmentId??""};this.router.navigate([],e)}onLanguageSet(t){this.currentLanguage=t}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let e=this.editionRouteConstants.EDITION_REPORT.route,o={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,e,o)}onSvgSheetSelect(t){let e=this.editionRouteConstants.EDITION_SHEETS.route,o={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,e,o)}_fetchAndFilterIntroData(t,e,o){return this.editionDataService.getEditionSectionIntroData(t,e).pipe(x(r=>o?(this.editionComplex=o,this.editionDataService.getEditionComplexIntroData(this.editionComplex).pipe(D(v=>{let s=v.intro[0].id;return this._filterSectionIntroDataById(r,s)}))):(this.editionComplex=void 0,O(r))))}_filterSectionIntroDataById(t,e){return b(E({},t),{intro:t.intro.map(o=>b(E({},o),{content:o.content.filter(r=>r.blockId===e)}))})}_initScrollListener(){N(window,"scroll").pipe($(200),M(this._destroyed$)).subscribe(t=>this._onIntroScroll(t))}_navigateWithComplexId(t,e,o){let r=t?`/edition/complex/${t}/`:this.editionComplex.baseRoute;this.router.navigate([r,e],o)}_onIntroScroll(t){let e=window.scrollY||document.documentElement.scrollTop,o=document.querySelectorAll(".awg-edition-intro-section"),r=document.querySelectorAll("a.awg-edition-intro-nav-link"),v=null;o.forEach(s=>{let it=s.offsetTop-10,rt=s.offsetTop+s.offsetHeight;it<=e&&rt>e&&(v=s.id)}),r.forEach(s=>{s.classList.toggle("active",s.hash.includes(v))})}},g.ctorParameters=()=>[{type:j},{type:A},{type:U},{type:G}],g.propDecorators={modal:[{type:F,args:["modal",{static:!0}]}]},g);f=i([a({selector:"awg-edition-intro",template:X,styles:[tt]})],f);var ft=[{path:"",component:f,data:{title:"AWG Online Edition \u2013 Intro"}}],et=[f],S=class{};S=i([w({imports:[y.forChild(ft)],exports:[y]})],S);var ot=class{};ot=i([w({imports:[P,S],declarations:[C,I,_,R,et]})],ot);export{ot as EditionIntroModule};
