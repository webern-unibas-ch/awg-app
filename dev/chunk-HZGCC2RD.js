import{a as $}from"./chunk-GDZ4XRCG.js";import"./chunk-FIQXNHA3.js";import{a as U}from"./chunk-GYSG6DRK.js";import{b as B,c as M}from"./chunk-OQWROXKL.js";import"./chunk-3F66QUQP.js";import{m as N}from"./chunk-6MUDWHZI.js";import{F as D,U as q}from"./chunk-EXXKQA7V.js";import{b as T,e as O,i as R}from"./chunk-3GPKAFYB.js";import"./chunk-BW2DVDXO.js";import"./chunk-B7RJOAWD.js";import"./chunk-2NW2DMD2.js";import{B as x,Ua as a,W as E,Wa as o,Xa as g,Y as y,Za as w,da as l,k as S,ka as c,kb as L,o as i,xa as s}from"./chunk-LOJZDTEA.js";var G=`@if (introBlockContent) {
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
`;var f=class{constructor(){this.navigateToIntroFragmentRequest=new c,this.navigateToReportFragmentRequest=new c,this.openModalRequest=new c,this.selectSvgSheetRequest=new c,this._editionGlyphService=l(B),this.ref=this}getGlyph(t){return this._editionGlyphService.getGlyph(t)}navigateToIntroFragment(t){t?.fragmentId&&this.navigateToIntroFragmentRequest.emit(t)}navigateToReportFragment(t){t?.fragmentId&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}static{this.ctorParameters=()=>[]}static{this.propDecorators={introBlockContent:[{type:o}],notesLabel:[{type:o}],navigateToIntroFragmentRequest:[{type:g}],navigateToReportFragmentRequest:[{type:g}],openModalRequest:[{type:g}],selectSvgSheetRequest:[{type:g}]}}};f=i([a({selector:"awg-edition-intro-content",template:G,changeDetection:s.OnPush,standalone:!1,styles:[F]})],f);var P=`@if (introBlockContent) {
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
`;var H=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var b=class{constructor(){this.languageChangeRequest=new c}setLanguage(t){(t===0||t===1)&&this.languageChangeRequest.emit(t)}static{this.propDecorators={introBlockContent:[{type:o}],notesLabel:[{type:o}],currentLanguage:[{type:o}],languageChangeRequest:[{type:g}]}}};b=i([a({selector:"awg-edition-intro-nav",template:P,changeDetection:s.OnPush,standalone:!1,styles:[H]})],b);var j=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
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
`;var A="";var v=class{static{this.propDecorators={editionComplex:[{type:o}],editionLabel:[{type:o}],editionRoute:[{type:o}],seriesRoute:[{type:o}],sectionRoute:[{type:o}],introRoute:[{type:o}]}}};v=i([a({selector:"awg-edition-intro-partial-disclaimer",template:j,standalone:!1,styles:[A]})],v);var V=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionComplex?.pubStatement?.labeledSectionRoute.label }}.]
    </p>
</div>
`;var W="";var _=class{static{this.propDecorators={editionComplex:[{type:o}],editionLabel:[{type:o}]}}};_=i([a({selector:"awg-edition-intro-placeholder",template:V,changeDetection:s.OnPush,standalone:!1,styles:[W]})],_);var z=`<!-- content: intro -->
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

            <div class="awg-edition-intro-view p-5 border rounded-3">
                <div class="row justify-content-center">
                    @if (UTILS.isEmptyArray(intro?.[currentLanguage]?.content)) {
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
                            [introBlockContent]="intro[currentLanguage].content"
                            [notesLabel]="notesLabels.get(currentLanguage)"
                            (navigateToIntroFragmentRequest)="onIntroFragmentNavigate($event)"
                            (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                            (openModalRequest)="onModalOpen($event)"
                            (selectSvgSheetRequest)="onSvgSheetSelect($event)" />

                        <awg-edition-intro-nav
                            class="col-12 col-xl-2 d-none d-xl-block"
                            [introBlockContent]="intro[currentLanguage].content"
                            [notesLabel]="notesLabels.get(currentLanguage)"
                            [currentLanguage]="currentLanguage"
                            (languageChangeRequest)="onLanguageSet($event)" />
                    }
                </div>
            </div>
        }
    }
</div>
`;var Y="";var h=class{constructor(){this._editionOutlineService=l(M),this._editionStateService=l(q),this._router=l(O),this._destroyed$=new S,this.UTILS=U,this.currentLanguage=0,this.notesLabels=new Map([[0,"Anmerkungen"],[1,"Notes"]]),this.selectedEditionComplex=this._editionStateService.selectedEditionComplex,this.viewData=l($).introViewData,this._initScrollListener()}get editionRouteConstants(){return D}ngOnInit(){this.listenToRouteChanges()}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}listenToRouteChanges(){this._router.events.pipe(E(this._destroyed$)).subscribe(t=>{if(this._isNavigationEndToIntro(t)){let{seriesId:e,sectionId:n}=this._extractUrlSegments(t.urlAfterRedirects);e&&n?this._updateEditionState(e,n):console.error("Invalid URL segments:",t.urlAfterRedirects)}})}onIntroFragmentNavigate(t){let e={fragment:t?.fragmentId??""};this._router.navigate([],e)}onLanguageSet(t){this.currentLanguage=t}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){let e=this.editionRouteConstants.EDITION_REPORT.route,n={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,e,n)}onSvgSheetSelect(t){let e=this.editionRouteConstants.EDITION_SHEETS.route,n={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,e,n)}_extractUrlSegments(t){if(!t)return{seriesId:void 0,sectionId:void 0};let e=t.split("/"),n=e.indexOf("series")+1,d=e.indexOf("section")+1,m=e[n],r=e[d],I=u=>u!==void 0&&/^[1-3]$/.test(u),k=u=>u!==void 0&&/^[1-5]+[ab]?$/.test(u);return{seriesId:I(m)?m:void 0,sectionId:k(r)?r:void 0}}_initScrollListener(){x(globalThis,"scroll").pipe(y(200),E(this._destroyed$)).subscribe({next:t=>this._onIntroScroll(t)})}_isNavigationEndToIntro(t){return t instanceof T&&t.urlAfterRedirects?.includes("intro")}_navigateWithComplexId(t,e,n){let d=t?`/edition/complex/${t}`:this.selectedEditionComplex()?.baseRoute??"/edition/series";this._router.navigate([d,e],n)}_onIntroScroll(t){if(t?.type==="scroll"){let e=globalThis.scrollY||document.documentElement.scrollTop,n=document.querySelectorAll(".awg-edition-intro-section"),d=document.querySelectorAll("a.awg-edition-intro-nav-link"),m=null;n.forEach(r=>{let I=r.offsetTop-10,k=r.offsetTop+r.offsetHeight;I<=e&&k>e&&(m=r.id)}),d.forEach(r=>{r.classList.toggle("active",r.hash.includes(m))})}}_updateEditionState(t,e){let n=this._editionOutlineService.getEditionSeriesById(t)??null,d=this._editionOutlineService.getEditionSectionById(t,e)??null;this._editionStateService.updateSelectedEditionSeries(n),this._editionStateService.updateSelectedEditionSection(d)}static{this.ctorParameters=()=>[]}static{this.propDecorators={modal:[{type:L,args:["modal",{static:!0}]}]}}};h=i([a({selector:"awg-edition-intro",template:z,changeDetection:s.OnPush,standalone:!1,styles:[Y]})],h);var st=[{path:"",component:h,data:{title:"AWG Online Edition \u2013 Intro"}}],Z=[h],C=class{};C=i([w({imports:[R.forChild(st)],exports:[R]})],C);var J=class{};J=i([w({imports:[N,C],declarations:[f,b,v,_,Z]})],J);export{J as EditionIntroModule};
