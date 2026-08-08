import{a as $,b as K}from"./chunk-JIXOBVXX.js";import{a as Z}from"./chunk-NS6AUQMB.js";import"./chunk-LWES2WNR.js";import{a as J,b as m}from"./chunk-IDGFDMNS.js";import"./chunk-3F66QUQP.js";import{a as Q}from"./chunk-GYSG6DRK.js";import{c as H,o as q}from"./chunk-33I5VXJA.js";import{K as c,L as l}from"./chunk-2HT4AE2P.js";import{c as P,d as W,f as N,i as M}from"./chunk-5FREDXQW.js";import{b as z}from"./chunk-LLVWCOFR.js";import{A as F}from"./chunk-4HOKAIBV.js";import"./chunk-HAEFB3OM.js";import{Lb as V,Ua as d,Wa as p,Za as T,a as G,b as y,bb as h,da as n,fb as u,na as A,o as i,oa as j,va as U,xa as f}from"./chunk-JTYMAISI.js";var X=`<h6 class="awg-edition-info-breadcrumb">
    @for (item of items(); track $index; let last = $last) {
        @if (item.label) {
            @if (item.route && item.route.length > 0) {
                <a [routerLink]="item.route">{{ item.label }}</a>
            } @else {
                <span [innerHTML]="item.label"></span>
            }
        }

        @if (!last) {
            <span class="mx-1">/</span>
        }
    }
</h6>
`;var Y="";var _=class{constructor(){this.items=u.required()}static{this.propDecorators={items:[{type:p,args:[{isSignal:!0,alias:"items",required:!0,transform:void 0}]}]}}};_=i([d({selector:"awg-edition-breadcrumb",template:X,changeDetection:f.OnPush,imports:[N],styles:[Y]})],_);var te=`<!-- sideinfo: edition -->
<div class="card">
    <div class="card-body bg-light">
        <h5 id="awg-edition-info-header">{{ EDITION_INFO_HEADER }}</h5>
        <p>&#9671;</p>
        <div ngbAccordion>
            <!-- General -->
            <div ngbAccordionItem [collapsed]="false">
                <div ngbAccordionHeader>
                    <button ngbAccordionButton>Allgemein</button>
                </div>
                <div ngbAccordionCollapse>
                    <div ngbAccordionBody>
                        <ng-template>
                            @for (link of generalEditionLinks; track link.label) {
                                <p>
                                    <a class="awg-edition-info-item-link" [routerLink]="link.route">
                                        <span class="awg-edition-info-item-title">{{ link.label }}</span>
                                    </a>
                                </p>
                            }
                        </ng-template>
                    </div>
                </div>
            </div>
            <!-- Displayed Sections -->
            @for (section of sectionsData(); track section.section.short) {
                <div ngbAccordionItem [collapsed]="section.section.route !== selectedEditionSection()?.section?.route">
                    <div ngbAccordionHeader>
                        <button ngbAccordionButton>
                            {{ section.labeledRoute.label }}
                        </button>
                    </div>
                    <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                            <ng-template>
                                <!-- Intro Section -->
                                @if (!section.content.intro.disabled) {
                                    <p>
                                        <a
                                            class="awg-edition-info-item-link"
                                            [routerLink]="section.content.intro.labeledRoute?.route"
                                            ><span
                                                class="awg-edition-info-item-title"
                                                [innerHTML]="section.content.intro.labeledRoute?.label"></span
                                        ></a>
                                    </p>
                                }

                                <!-- Complexes Section -->
                                @for (
                                    complex of section.content.sectionComplexes;
                                    track complex.complex.complexId.short
                                ) {
                                    <p>
                                        @if (complex.disabled) {
                                            <span
                                                class="text-muted awg-edition-info-item-title"
                                                [innerHTML]="complex.labeledRoute.label"></span>
                                        } @else {
                                            <a
                                                class="awg-edition-info-item-link"
                                                [routerLink]="complex.labeledRoute.route">
                                                <span
                                                    class="awg-edition-info-item-title"
                                                    [innerHTML]="complex.labeledRoute.label"></span>
                                            </a>
                                        }
                                    </p>
                                }
                            </ng-template>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>
</div>
`;var ie="";var E=class{constructor(){this._editionOutlineService=n(m),this._editionStateService=n(l),this.EDITION_INFO_HEADER="Edition",this.generalEditionLinks=K,this.selectedEditionSection=this._editionStateService.selectedEditionSection,this.sectionsData=A($.map(t=>this._editionOutlineService.getEditionSectionById(t.seriesId,t.sectionId)).filter(t=>t!==void 0)).asReadonly()}};E=i([d({selector:"awg-edition-info",template:te,imports:[H,N],styles:[ie]})],E);var oe=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h3 [id]="id()" [innerHTML]="title()"></h3>
</div>
`;var ne="";var S=class{constructor(){this.id=u.required(),this.title=u.required()}static{this.propDecorators={id:[{type:p,args:[{isSignal:!0,alias:"id",required:!0,transform:void 0}]}],title:[{type:p,args:[{isSignal:!0,alias:"title",required:!0,transform:void 0}]}]}}};S=i([d({selector:"awg-edition-jumbotron",template:oe,changeDetection:f.OnPush,styles:[ne]})],S);var re=`<!--
<div *ngIf="selectedEditionComplex$ | async as complex">
    <p>
        Editionskomplex {{ complex.complexId.short }}: <br />
        {{ complex | json }}
    </p>
    <p>Titel: {{ complex.titleStatement | json }}</p>
    <p>
        <a [routerLink]="[editionRouteConstants.EDITION_INTRO.route]">
            {{ editionRouteConstants.EDITION_INTRO.short }}
        </a>
        {{ editionRouteConstants.EDITION_INTRO | json }}
    </p>
    <div>
        <p>Werkedition: {{ complex.titleStatement | json }}</p>
        <ul>
            <li [innerHtml]="complex.complexId.full"></li>
            enth\xE4lt:
            <ul>
                <li>\u201EDer Tag ist vergangen\u201C M 212: Textfassung 3</li>
                <li>Die geheimnisvolle Fl\xF6te (\u201EAn einem Abend\u201C) M 217: einzige Textfassung</li>
                <li>\u201ESchien mir\u2019s, als ich sah die Sonne\u201C M 213: einzige Textfassung</li>
                <li>Gleich und Gleich (\u201EEin Blumengl\xF6ckchen\u201C) M 216: Textfassung 2</li>
            </ul>
        </ul>
    </div>
    <div>
        <p>Texteditionen: {{ complex.titleStatement | json }}</p>
        <ul>
            <li>\u201EDer Tag ist vergangen\u201C M 212: Textfassung 1</li>
            <li>\u201EDer Tag ist vergangen\u201C M 212: Textfassung 2</li>
            <li>Gleich und Gleich (\u201EEin Blumengl\xF6ckchen\u201C) M 216: Textfassung 1</li>
        </ul>
    </div>
    <div>
        <p>Skizzeneditionen: {{ complex.titleStatement | json }}</p>
        <ul>
            <li>M 212 Sk 1</li>
            <li>M 212 Sk 2</li>
            <li>M 212 Sk 3</li>
            <li>M 212 Sk 4</li>
            <li>M 212 Sk 5</li>
        </ul>
    </div>
    <p>
        <a [routerLink]="[editionRouteConstants.EDITION_REPORT.route]">
            {{ editionRouteConstants.EDITION_REPORT.short }}
        </a>
        {{ editionRouteConstants.EDITION_REPORT | json }}
    </p>
</div>
-->

<!-- edition routes -->
<router-outlet />
`;var se="";var b=class{constructor(){this._editionComplexesService=n(J),this._editionOutlineService=n(m),this._editionStateService=n(l),this._route=n(P),this.selectedEditionComplex=this._editionStateService.selectedEditionComplex}get editionRouteConstants(){return c}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this._route.paramMap.subscribe(t=>{let o=t.get("complexId")||"",r=this._editionComplexesService.getEditionComplexById(o);if(Q.isEmptyObject(r))this._editionStateService.updateSelectedEditionSeries(null);else{let s=this._editionOutlineService.getEditionSeriesById(r.pubStatement.series.route)??null,a=this._editionOutlineService.getEditionSectionById(r.pubStatement.series.route,r.pubStatement.section.route)??null;this._editionStateService.updateSelectedEditionSeries(s),this._editionStateService.updateSelectedEditionSection(a),this._editionStateService.updateSelectedEditionComplex(r)}})}ngOnDestroy(){this._editionStateService.updateSelectedEditionSeries(null)}};b=i([d({selector:"awg-edition-complex",template:re,standalone:!1,styles:[se]})],b);var de=`@if (editionRouterLinkButtons(); as linkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="linkButtons" [queryParamsHandling]="''" />
}

<router-outlet />
`;var le="";var D=class{constructor(t,o,r,s){this.root=t,this.link=o,this.label=r,this.disabled=s}};var I=class{constructor(){this._editionStateService=n(l),this.selectedEditionComplex=this._editionStateService.selectedEditionComplex,this.editionRouterLinkButtons=h(()=>{let t=this.selectedEditionComplex();if(!t)return null;let o=c;return[o.EDITION_INTRO,o.EDITION_SHEETS,o.EDITION_REPORT,o.EDITION_GRAPH].map(s=>new D(t.baseRoute,s.route,s.short,!1))})}};I=i([d({selector:"awg-edition-detail-nav",template:de,standalone:!1,styles:[le]})],I);var ae=`@if (editionOutline(); as outline) {
    <div class="awg-edition-series">
        <div class="awg-edition-series-text p-4 border rounded-3 para">
            <p>
                Die Anton Webern Gesamtausgabe (AWG) versteht sich als historisch-kritische Gesamtausgabe der
                Kompositionen Anton Weberns. Sie ist <i>historisch</i>, indem sie die Kompositionen durch Dokumentation
                verschiedener Textfassungen und ihrer Skizzen als in sich chronologisch differenzierte Editionskomplexe
                pr\xE4sentiert sowie deren Entstehung in den Zusammenhang der Biographie des Komponisten und der
                allgemeinen Musikgeschichte einordnet. Sie ist <i>kritisch</i>, indem sie s\xE4mtliche erreichbaren Quellen
                vergleicht und textkritisch pr\xFCft. Sie ist eine <i>Gesamt</i>ausgabe, indem sie die auf Grundlage dieser
                Quellenkritik erkennbaren Textfassungen und Skizzen s\xE4mtlicher, auch fragmentarischer Kompositionen
                ediert. Sie ist eine Gesamt<i>ausgabe</i>, indem sie Notentexte mit dem methodischen Bewusstsein
                vorlegt, dass eine Edition grunds\xE4tzlich eine Interpretation des durch die Quellen bezeugten Texts
                darstellt.
            </p>

            <p>Die AWG gliedert sich in drei Serien:</p>
        </div>

        <div class="awg-edition-series-grid row row-cols-1 row-cols-md-3 g-4">
            @for (series of outline; track $index) {
                <div class="col">
                    <div class="card awg-edition-series-card h-100 shadow">
                        <h5 class="card-header">
                            {{ series.series.full }}
                        </h5>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                @for (section of series.sections; track $index) {
                                    <li class="list-group-item">
                                        @if (!section.disabled) {
                                            <a [routerLink]="[series.series.route, 'section', section.section.route]">{{
                                                section.section.full
                                            }}</a>
                                        } @else {
                                            <span class="text-muted">{{ section.section.full }}</span>
                                        }
                                    </li>
                                }
                            </ul>
                        </div>
                        <div class="card-footer text-end">
                            <a [routerLink]="[series.series.route]" class="btn btn-outline-info">Mehr ...</a>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>
}
`;var ce="";var v=class{constructor(){this._editionStateService=n(l),this.editionOutline=n(m).editionOutline,this._editionStateService.updateSelectedEditionSeries(null)}static{this.ctorParameters=()=>[]}};v=i([d({selector:"awg-edition-series",template:ae,standalone:!1,styles:[ce]})],v);var me=`<router-outlet />
`;var pe="";var C=class{constructor(){this._editionOutlineService=n(m),this._editionStateService=n(l),this.seriesId=u(null),this.updateSeriesFromRoute()}updateSeriesFromRoute(){j(t=>{let o=this.seriesId();if(!o){this._editionStateService.updateSelectedEditionSeries(null);return}let r=this._editionOutlineService.getEditionSeriesById(o)??null;this._editionStateService.updateSelectedEditionSeries(r),t(()=>{this._editionStateService.updateSelectedEditionSeries(null)})})}static{this.ctorParameters=()=>[]}static{this.propDecorators={seriesId:[{type:p,args:[{isSignal:!0,alias:"seriesId",required:!1,transform:void 0}]}]}}};C=i([d({selector:"awg-edition-series-detail",template:me,standalone:!1,styles:[pe]})],C);var ue=`@if (selectedSeries(); as selectedSeries) {
    <div class="awg-edition-sections-grid row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
        @for (section of selectedSeries.sections; track $index) {
            <div class="col">
                <div class="card awg-edition-section-card h-100 shadow">
                    <div class="row g-0 h-100">
                        @if (!section.disabled) {
                            <div class="col-4 col-sm-2 col-md-12 awg-img-container">
                                <img
                                    [src]="
                                        'assets/img/edition/series/' +
                                        selectedSeries.series.route +
                                        '/section/' +
                                        section.section.route +
                                        '/cover.jpg'
                                    "
                                    title="AWG {{ selectedSeries.series.short }}/{{ section.section.short }}"
                                    class="card-img-top img-fluid"
                                    alt="In Vorbereitung" />
                            </div>
                        }
                        <div
                            [ngClass]="{ 'col-8 col-sm-10': !section.disabled }"
                            class="col-md-12 d-flex flex-column awg-edition-section-card-content">
                            <div class="card-body flex-grow-1" [ngClass]="{ 'awg-card-border-top': !section.disabled }">
                                <h5 class="card-title" [ngClass]="{ 'text-muted': section.disabled }">
                                    {{ section.section.full }}
                                </h5>
                            </div>
                            <div class="card-footer text-end">
                                <a
                                    [routerLink]="[section.section.route]"
                                    class="btn btn-outline-info"
                                    [ngClass]="{ disabled: section.disabled }"
                                    >Mehr ...
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
}
`;var fe=`@media(max-width:768px){.awg-img-container{max-height:150px;overflow:hidden;border-right:1px solid var(--bs-card-border-color)}img{object-fit:contain;height:100%}}.awg-card-border-top{border-top:1px solid var(--bs-card-border-color)}
`;var x=class{constructor(){this._editionStateService=n(l),this.selectedSeries=this._editionStateService.selectedEditionSeries}};x=i([d({selector:"awg-edition-sections",template:ue,standalone:!1,styles:[fe]})],x);var he=`<!-- content: edition-view -->
<div class="awg-edition-view p-3 border rounded-3">
    <awg-scroll-to-top-button />

    @let context = viewContext();
    @let editionComplex = selectedEditionComplex();

    @if (context.isPreface) {
        <div class="awg-edition-preface para">
            <awg-edition-breadcrumb [items]="breadcrumbItems()" />
            <awg-edition-jumbotron [id]="EDITION_VIEW_ID" [title]="jumbotronTitle()" />
        </div>
    }

    @if (context.isRowtables) {
        <div class="awg-edition-rowtables para">
            <awg-edition-breadcrumb [items]="breadcrumbItems()" />
            <awg-edition-jumbotron [id]="EDITION_VIEW_ID" [title]="jumbotronTitle()" />
        </div>
    }

    @if (editionComplex) {
        <div class="awg-edition-complex">
            <awg-edition-breadcrumb [items]="breadcrumbItems()" />
            <awg-edition-jumbotron [id]="EDITION_VIEW_ID" [title]="jumbotronTitle()" />

            <!-- declamation -->
            <div class="awg-edition-responsibility mt-3 mb-5">
                <p>
                    Ediert von
                    @for (editor of editionComplex.respStatement.editors; track $index; let isLast = $last) {
                        <span class="editor">
                            <a [href]="editor.homepage">{{ editor.name }}</a>
                            <awg-meta-identifier-badges [identifiers]="editor.identifiers" />
                            @if (!isLast) {
                                <span>&nbsp;&&nbsp;</span>
                            }
                        </span>
                    }
                    <br />
                    Versionsdatum:
                    <span class="version">{{
                        editionComplex.respStatement.lastModified === '---'
                            ? '---'
                            : (editionComplex.respStatement.lastModified | date: 'longDate')
                    }}</span>
                </p>
            </div>
        </div>
    }

    @if (editionComplex === null && !context.isRowtables && !context.isPreface) {
        <div class="awg-edition-series para">
            <awg-edition-breadcrumb [items]="breadcrumbItems()" />
            <awg-edition-jumbotron [id]="EDITION_VIEW_ID" [title]="jumbotronTitle()" />
        </div>
    }

    <!-- edition routes -->
    <router-outlet />
</div>
`;var _e="";var k=class{getBreadcrumbItems(t,o,r,s){return h(()=>{let a=t(),R=o(),w=r(),ge=s(),{EDITION:B,SERIES:be,PREFACE:Ie,ROWTABLES:ve}=c,Ce=[B.route,be.route],O={label:B.short,route:Ce};return a.isPreface?[O,{label:Ie.short,route:[]}]:a.isRowtables?[O,{label:ve.full,route:[]}]:R?this._getComplexBreadcrumbs(O,R):this._getOverviewBreadcrumbs(O,a,w,ge)})}_getComplexBreadcrumbs(t,o){let{series:r,section:s,labeledSectionRoute:a}=o.pubStatement;return[t,{label:r.full,route:[...t.route,r.route]},{label:s.full,route:a.route},{label:o.complexId.short,route:[]}]}_getOverviewBreadcrumbs(t,o,r,s){let{EDITION_INTRO:a}=c;if(r){let R=s?[...t.route,r.series.route]:[],w=[t,{label:r.series.full,route:R},...s?[{label:s.section.full,route:o.isIntro?s.labeledRoute.route:[]}]:[],...s&&o.isIntro?[{label:a.full,route:[]}]:[]];return o.isIntro||w.push({label:"",route:[]}),w}return[y(G({},t),{route:[]}),{label:"",route:[]}]}};k=i([U({providedIn:"root"})],k);var g=class{constructor(){this._editionStateService=n(l),this.EDITION_VIEW_ID="awg-edition-view",this.EDITION_VIEW_TITLE="Editions\xFCbersicht",this.viewContext=n(Z).viewContext,this.selectedEditionComplex=this._editionStateService.selectedEditionComplex,this.selectedEditionSection=this._editionStateService.selectedEditionSection,this.selectedEditionSeries=this._editionStateService.selectedEditionSeries,this.breadcrumbItems=n(k).getBreadcrumbItems(this.viewContext,this.selectedEditionComplex,this.selectedEditionSeries,this.selectedEditionSection),this.jumbotronTitle=h(()=>{let t=this.viewContext(),o=this.selectedEditionComplex(),{PREFACE:r,EDITION_INTRO:s}=c;return t.isPreface?r.full:t.isRowtables?"\xDCbersicht":o?o.complexId.full:t.isIntro?s.full:this.EDITION_VIEW_TITLE})}};g=i([d({selector:"awg-edition-view",template:he,changeDetection:f.OnPush,imports:[_,S,z,F,V,W],styles:[_e]})],g);var We=[{path:"",outlet:"side",component:E},{path:"",component:g,children:[{path:"preface",loadChildren:()=>import("./chunk-IBF2SF7L.js").then(e=>e.EditionPrefaceModule)},{path:"rowtables",loadChildren:()=>import("./chunk-ZASPTWYS.js").then(e=>e.EditionRowtablesModule)},{path:"row-tables",redirectTo:"rowtables",pathMatch:"full"},{path:"series",component:v},{path:"series/:seriesId",component:C,children:[{path:"sections",component:x},{path:"section/:sectionId",loadChildren:()=>import("./chunk-UARH5SLQ.js").then(e=>e.EditionSectionDetailModule)},{path:"sections/:sectionId",redirectTo:"section/:sectionId",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:b,children:[{path:"",component:I,children:[{path:"intro",loadChildren:()=>import("./chunk-LX3FYQ4T.js").then(e=>e.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-W7F76AIZ.js").then(e=>e.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-FVNJFM3Y.js").then(e=>e.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-OWSBXKB4.js").then(e=>e.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]}]}],Ee=[b,I,x,v,C],L=class{};L=i([T({imports:[M.forChild(We)],exports:[M]})],L);var Se=class{};Se=i([T({imports:[q,L,_,E,S,g],declarations:[Ee]})],Se);export{Se as EditionViewModule};
