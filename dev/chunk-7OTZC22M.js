import{B,D as d,Fb as F,H as p,La as M,M as s,Na as R,Pb as G,Qb as U,R as q,S as r,Tb as P,U as o,V as c,X as h,a as C,b as I,h as k,i as E,j as i,l as x,n as y,o as L,pb as $,q as D,qc as j,s as O,x as T,y as S,z as N}from"./chunk-UXDAWL3Z.js";var H=`@if (introBlockContent) {
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
`;var A=`.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table{text-wrap:nowrap}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr>td{padding-right:20px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table{display:table;width:80%;margin-left:auto;margin-right:auto}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child{border-top:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child td{padding-top:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child{border-bottom:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child td{padding-bottom:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0;text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .no-indent{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak{display:block;margin-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.list{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .spacebreak.no-indent{margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .list{margin-left:1em;text-indent:-1em}
`;var w=class{constructor(){this.navigateToIntroFragmentRequest=new s,this.navigateToReportFragmentRequest=new s,this.openModalRequest=new s,this.selectSvgSheetRequest=new s,this._editionGlyphService=d(U),this.ref=this}getGlyph(t){return this._editionGlyphService.getGlyph(t)}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}static{this.ctorParameters=()=>[]}static{this.propDecorators={introBlockContent:[{type:o}],notesLabel:[{type:o}],navigateToIntroFragmentRequest:[{type:c}],navigateToReportFragmentRequest:[{type:c}],openModalRequest:[{type:c}],selectSvgSheetRequest:[{type:c}]}}};w=i([r({selector:"awg-edition-intro-content",template:H,changeDetection:p.OnPush,styles:[A]})],w);var W=`@if (introBlockContent) {
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
`;var V=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var f=class{constructor(){this.languageChangeRequest=new s}setLanguage(t){(t===0||t===1)&&this.languageChangeRequest.emit(t)}static{this.propDecorators={introBlockContent:[{type:o}],notesLabel:[{type:o}],currentLanguage:[{type:o}],languageChangeRequest:[{type:c}]}}};f=i([r({selector:"awg-edition-intro-nav",template:W,changeDetection:p.OnPush,styles:[V]})],f);var z=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
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
`;var Y="";var v=class{static{this.propDecorators={editionComplex:[{type:o}],editionLabel:[{type:o}],editionRoute:[{type:o}],seriesRoute:[{type:o}],sectionRoute:[{type:o}],introRoute:[{type:o}]}}};v=i([r({selector:"awg-edition-intro-partial-disclaimer",template:z,styles:[Y]})],v);var Z=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionLabel }}
        {{ editionComplex?.pubStatement?.series?.short }}/{{ editionComplex?.pubStatement?.section?.short }}.]
    </p>
</div>
`;var J="";var _=class{static{this.propDecorators={editionComplex:[{type:o}],editionLabel:[{type:o}]}}};_=i([r({selector:"awg-edition-intro-placeholder",template:Z,changeDetection:p.OnPush,styles:[J]})],_);var K=`<!-- content: intro -->
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
`;var Q="";var m=class{constructor(){this.currentLanguage=0,this.notesLabels=new Map([[0,"Anmerkungen"],[1,"Notes"]]),this.errorObject=null,this.UTILS=d($),this._destroyed$=new k,this._editionDataService=d(G),this._editionStateService=d(P),this._router=d(M),this._initScrollListener()}get editionRouteConstants(){return F}ngOnInit(){this.getEditionIntroData()}ngOnDestroy(){this._editionStateService.clearIsIntroView(),this.editionIntroData$=null,this._destroyed$.next(!0),this._destroyed$.complete()}getEditionIntroData(){this._editionStateService.updateIsIntroView(!0),this.editionIntroData$=L([this._editionStateService.getSelectedEditionSeries(),this._editionStateService.getSelectedEditionSection(),this._editionStateService.getSelectedEditionComplex().pipe(T(null))]).pipe(S(([t,e,n])=>t&&e?this._fetchAndFilterIntroData(t.series.route,e.section.route,n):E),O(t=>(this.errorObject=t,E)))}onIntroFragmentNavigate(t){let e={fragment:t?.fragmentId??""};this._router.navigate([],e)}onLanguageSet(t){this.currentLanguage=t}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let e=this.editionRouteConstants.EDITION_REPORT.route,n={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,e,n)}onSvgSheetSelect(t){let e=this.editionRouteConstants.EDITION_SHEETS.route,n={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,e,n)}_fetchAndFilterIntroData(t,e,n){return this._editionDataService.getEditionSectionIntroData(t,e).pipe(S(l=>n?(this.editionComplex=n,this._editionDataService.getEditionComplexIntroData(this.editionComplex).pipe(y(u=>{let a=u.intro[0].id;return this._filterSectionIntroDataById(l,a)}))):(this.editionComplex=void 0,x(l))))}_filterSectionIntroDataById(t,e){return I(C({},t),{intro:t.intro.map(n=>I(C({},n),{content:n.content.filter(l=>l.blockId===e)}))})}_initScrollListener(){D(window,"scroll").pipe(B(200),N(this._destroyed$)).subscribe({next:t=>this._onIntroScroll(t)})}_navigateWithComplexId(t,e,n){let l=t?`/edition/complex/${t}/`:this.editionComplex.baseRoute;this._router.navigate([l,e],n)}_onIntroScroll(t){if(t?.type==="scroll"){let e=window.scrollY||document.documentElement.scrollTop,n=document.querySelectorAll(".awg-edition-intro-section"),l=document.querySelectorAll("a.awg-edition-intro-nav-link"),u=null;n.forEach(a=>{let et=a.offsetTop-10,ot=a.offsetTop+a.offsetHeight;et<=e&&ot>e&&(u=a.id)}),l.forEach(a=>{a.classList.toggle("active",a.hash.includes(u))})}}static{this.ctorParameters=()=>[]}static{this.propDecorators={modal:[{type:q,args:["modal",{static:!0}]}]}}};m=i([r({selector:"awg-edition-intro",template:K,styles:[Q]})],m);var mt=[{path:"",component:m,data:{title:"AWG Online Edition \u2013 Intro"}}],X=[m],b=class{};b=i([h({imports:[R.forChild(mt)],exports:[R]})],b);var tt=class{};tt=i([h({imports:[j,b],declarations:[w,f,v,_,X]})],tt);export{tt as EditionIntroModule};
