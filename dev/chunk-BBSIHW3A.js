import{a as N}from"./chunk-EFDLJDZO.js";import"./chunk-EGXKLOY2.js";import{a as O}from"./chunk-GYSG6DRK.js";import{h as b,o as S}from"./chunk-ZVJGC5J5.js";import{K as R,L as y}from"./chunk-6L2GCM7O.js";import{i as u}from"./chunk-VAULFYEU.js";import"./chunk-S2BKK7ZR.js";import"./chunk-7K5DQKRU.js";import"./chunk-U7A6YGL5.js";import{B as _,Ua as e,W as h,Wa as t,Xa as I,Y as v,Za as l,bb as x,da as w,gb as L,k as C,na as E,o,xa as n}from"./chunk-OSONM4QX.js";var D=`@if (introBlockContent) {
    <div class="awg-edition-intro-content">
        @for (introBlock of introBlockContent; track $index) {
            <section class="awg-edition-intro-section" [id]="introBlock.blockId">
                @if (introBlock.blockHeader) {
                    <div class="awg-edition-intro-block">
                        <p class="heading" [awgCompileHtml]="introBlock.blockHeader"></p>
                    </div>
                }
                @if (introBlock.blockContent.length > 0) {
                    @for (blockContent of introBlock.blockContent; track $index) {
                        <div class="awg-edition-intro-block" [awgCompileHtml]="blockContent"></div>
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
                            <small><div class="awg-edition-intro-note" [awgCompileHtml]="note"></div></small>
                        }
                    }
                }
            </div>
        </section>
    </div>
}
`;var T=`@charset "UTF-8";.awg-edition-intro-content{margin-top:1.5em}.awg-edition-intro-content .awg-edition-intro-note,.awg-edition-intro-content .awg-edition-intro-block{text-align:justify;text-justify:inter-word}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-1-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-1-dig{margin-left:1.3em;text-indent:-1.3em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-2-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-2-dig{margin-left:1.8em;text-indent:-1.8em}.awg-edition-intro-content .awg-edition-intro-note::ng-deep .note-3-dig,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .note-3-dig{margin-left:2.3em;text-indent:-2.3em}.awg-edition-intro-content .awg-edition-intro-block{margin:0;text-indent:1.5em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep p{margin-bottom:0!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul li,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading,.awg-edition-intro-content .awg-edition-intro-block::ng-deep .block-lead{text-indent:0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .heading{display:block;font-weight:700;margin:1.5em 0}.awg-edition-intro-content .awg-edition-intro-block::ng-deep .small,.awg-edition-intro-content .awg-edition-intro-block::ng-deep blockquote,.awg-edition-intro-content .awg-edition-intro-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table{white-space:nowrap}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table th,.awg-edition-intro-content .awg-edition-intro-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table>tbody>tr.row-gap>td{padding-top:1em}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table{display:table;width:80%;margin-left:auto;margin-right:auto}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child{border-top:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:first-child td{padding-top:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child{border-bottom:1px solid black!important}.awg-edition-intro-content .awg-edition-intro-block::ng-deep table.awg-intro-table>tbody>tr:last-child td{padding-bottom:10px}.awg-edition-intro-content .awg-edition-intro-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var d=class{static{this.propDecorators={introBlockContent:[{type:t}],notesLabel:[{type:t}]}}};d=o([e({selector:"awg-edition-intro-content",template:D,changeDetection:n.OnPush,standalone:!1,styles:[T]})],d);var B=`@if (introBlockContent) {
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
`;var U=`.awg-edition-intro-nav{position:sticky;top:0}.awg-edition-intro-nav .nav .nav-item{text-align:end}.awg-edition-intro-nav .nav .nav-item a.active{color:#000}.awg-edition-intro-nav .nav .nav-item .nav-link{padding-right:0}
`;var s=class{constructor(){this.selectedLanguage=L.required()}static{this.propDecorators={introBlockContent:[{type:t}],notesLabel:[{type:t}],selectedLanguage:[{type:t,args:[{isSignal:!0,alias:"selectedLanguage",required:!0}]},{type:I,args:["selectedLanguageChange"]}]}}};s=o([e({selector:"awg-edition-intro-nav",template:B,changeDetection:n.OnPush,standalone:!1,styles:[U]})],s);var H=`<div class="p-3 border rounded-3 text-center awg-edition-intro-partial-disclaimer">
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
`;var M="";var c=class{static{this.propDecorators={editionComplex:[{type:t}],editionLabel:[{type:t}],editionRoute:[{type:t}],seriesRoute:[{type:t}],sectionRoute:[{type:t}],introRoute:[{type:t}]}}};c=o([e({selector:"awg-edition-intro-partial-disclaimer",template:H,standalone:!1,styles:[M]})],c);var P=`<div class="awg-edition-intro-placeholder">
    <p class="text-muted small">
        [Die Einleitung zum Editionskomplex <span [innerHTML]="editionComplex?.complexId?.full"></span> erscheint im
        Zusammenhang der vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex?.complexId?.short"></span> in
        {{ editionComplex?.pubStatement?.labeledSectionRoute.label }}.]
    </p>
</div>
`;var G="";var g=class{static{this.propDecorators={editionComplex:[{type:t}],editionLabel:[{type:t}]}}};g=o([e({selector:"awg-edition-intro-placeholder",template:P,changeDetection:n.OnPush,standalone:!1,styles:[G]})],g);var $=`<!-- content: intro -->
<div>
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
                            [notesLabel]="notesLabel" />

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
`;var j="";var a=class{constructor(){this._destroyed$=new C,this.UTILS=O,this.selectedEditionComplex=w(y).selectedEditionComplex,this.viewData=w(N).introViewData,this.selectedLanguage=E(b.DE),this.notesSectionLabel=x(()=>this.selectedLanguage()===b.DE?"Anmerkungen":"Notes"),this._initScrollListener()}get editionRouteConstants(){return R}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}_initScrollListener(){_(globalThis,"scroll").pipe(v(200),h(this._destroyed$)).subscribe({next:m=>this._onIntroScroll(m)})}_onIntroScroll(m){if(m?.type==="scroll"){let f=globalThis.scrollY||document.documentElement.scrollTop,z=document.querySelectorAll(".awg-edition-intro-section"),V=document.querySelectorAll("a.awg-edition-intro-nav-link"),k=null;z.forEach(i=>{let F=i.offsetTop-10,W=i.offsetTop+i.offsetHeight;F<=f&&W>f&&(k=i.id)}),V.forEach(i=>{i.classList.toggle("active",i.hash.includes(k))})}}static{this.ctorParameters=()=>[]}};a=o([e({selector:"awg-edition-intro",template:$,changeDetection:n.OnPush,standalone:!1,styles:[j]})],a);var it=[{path:"",component:a,data:{title:"AWG Online Edition \u2013 Intro"}}],q=[a],p=class{};p=o([l({imports:[u.forChild(it)],exports:[u]})],p);var A=class{};A=o([l({imports:[S,p],declarations:[d,s,c,g,q]})],A);export{A as EditionIntroModule};
