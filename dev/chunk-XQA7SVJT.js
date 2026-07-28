import{a as M,b as V}from"./chunk-JUXGEFIA.js";import{a as A}from"./chunk-GYSG6DRK.js";import{f as k,p as L}from"./chunk-ITC7DNBV.js";import{D as c,J as j,O as a,R as s}from"./chunk-XSZ2EBRP.js";import{c as N,f as D,i as x}from"./chunk-MRWTJLMJ.js";import"./chunk-SGOAGJ73.js";import"./chunk-TRXTACR3.js";import"./chunk-7PCIQTME.js";import{Ua as o,Wa as p,Za as I,bb as T,da as i,fb as O,na as R,o as t,oa as w,xa as g}from"./chunk-2BV3OLGI.js";var G=`<!-- sideinfo: edition -->
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
`;var y="";var m=class{constructor(){this._editionOutlineService=i(a),this._editionStateService=i(s),this.EDITION_INFO_HEADER="Edition",this.generalEditionLinks=V,this.selectedEditionSection=this._editionStateService.selectedEditionSection,this.sectionsData=R(M.map(n=>this._editionOutlineService.getEditionSectionById(n.seriesId,n.sectionId)).filter(n=>n!==void 0)).asReadonly()}};m=t([o({selector:"awg-edition-info",template:G,imports:[k,D],styles:[y]})],m);var U=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h3 [id]="jumbotronId" [innerHTML]="jumbotronTitle"></h3>
</div>
`;var B="";var C=class{static{this.propDecorators={jumbotronId:[{type:p}],jumbotronTitle:[{type:p}]}}};C=t([o({selector:"awg-edition-jumbotron",template:U,changeDetection:g.OnPush,standalone:!1,styles:[B]})],C);var P=`<!--
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
`;var W="";var u=class{constructor(){this._editionComplexesService=i(j),this._editionOutlineService=i(a),this._editionStateService=i(s),this._route=i(N),this.selectedEditionComplex=this._editionStateService.selectedEditionComplex}get editionRouteConstants(){return c}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this._route.paramMap.subscribe(n=>{let r=n.get("complexId")||"",d=this._editionComplexesService.getEditionComplexById(r);if(A.isEmptyObject(d))this._editionStateService.updateSelectedEditionSeries(null);else{let l=this._editionOutlineService.getEditionSeriesById(d.pubStatement.series.route)??null,te=this._editionOutlineService.getEditionSectionById(d.pubStatement.series.route,d.pubStatement.section.route)??null;this._editionStateService.updateSelectedEditionSeries(l),this._editionStateService.updateSelectedEditionSection(te),this._editionStateService.updateSelectedEditionComplex(d)}})}ngOnDestroy(){this._editionStateService.updateSelectedEditionSeries(null)}};u=t([o({selector:"awg-edition-complex",template:P,standalone:!1,styles:[W]})],u);var H=`@if (editionRouterLinkButtons(); as linkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="linkButtons" [queryParamsHandling]="''" />
}

<router-outlet />
`;var z="";var b=class{constructor(n,r,d,l){this.root=n,this.link=r,this.label=d,this.disabled=l}};var S=class{constructor(){this._editionStateService=i(s),this.selectedEditionComplex=this._editionStateService.selectedEditionComplex,this.editionRouterLinkButtons=T(()=>{let n=this.selectedEditionComplex();if(!n)return null;let r=c;return[r.EDITION_INTRO,r.EDITION_SHEETS,r.EDITION_REPORT,r.EDITION_GRAPH].map(l=>new b(n.baseRoute,l.route,l.short,!1))})}};S=t([o({selector:"awg-edition-detail-nav",template:H,standalone:!1,styles:[z]})],S);var F=`@if (editionOutline(); as outline) {
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
`;var J="";var h=class{constructor(){this._editionOutlineService=i(a),this._editionStateService=i(s),this.editionOutline=this._editionOutlineService.editionOutline,this._editionStateService.updateSelectedEditionSeries(null)}static{this.ctorParameters=()=>[]}};h=t([o({selector:"awg-edition-series",template:F,standalone:!1,styles:[J]})],h);var $=`<router-outlet />
`;var K="";var E=class{constructor(){this._editionOutlineService=i(a),this._editionStateService=i(s),this.seriesId=O(null),this.updateSeriesFromRoute()}updateSeriesFromRoute(){w(()=>{let n=this.seriesId();if(!n){this._editionStateService.updateSelectedEditionSeries(null);return}let r=this._editionOutlineService.getEditionSeriesById(n)??null;this._editionStateService.updateSelectedEditionSeries(r)})}static{this.ctorParameters=()=>[]}static{this.propDecorators={seriesId:[{type:p,args:[{isSignal:!0,alias:"seriesId",required:!1,transform:void 0}]}]}}};E=t([o({selector:"awg-edition-series-detail",template:$,standalone:!1,styles:[K]})],E);var Q=`@if (selectedSeries(); as selectedSeries) {
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
`;var q=`@media(max-width:768px){.awg-img-container{max-height:150px;overflow:hidden;border-right:1px solid var(--bs-card-border-color)}img{object-fit:contain;height:100%}}.awg-card-border-top{border-top:1px solid var(--bs-card-border-color)}
`;var f=class{constructor(){this._editionStateService=i(s),this.selectedSeries=this._editionStateService.selectedEditionSeries}};f=t([o({selector:"awg-edition-sections",template:Q,standalone:!1,styles:[q]})],f);var Z=`<!-- content: edition-view -->
<div class="awg-edition-view p-3 border rounded-3">
    <awg-scroll-to-top-button />

    @let introView = isIntroView();
    @let prefaceView = isPrefaceView();
    @let rowTableView = isRowTableView();
    @let editionComplex = selectedEditionComplex();
    @let editionSection = selectedEditionSection();
    @let editionSeries = selectedEditionSeries();

    @if (prefaceView) {
        <div class="awg-edition-preface para">
            <h6 class="awg-edition-info-breadcrumb">
                <a [routerLink]="[editionRouteConstants.SERIES.route]">
                    {{ editionRouteConstants.EDITION?.short }}
                </a>
                /
                <span>{{ editionRouteConstants.PREFACE.short }}</span>
            </h6>
            <!-- Jumbotron -->
            <awg-edition-jumbotron
                [jumbotronId]="EDITION_VIEW_ID"
                [jumbotronTitle]="editionRouteConstants.PREFACE.full" />
        </div>
    }

    @if (rowTableView) {
        <div class="awg-edition-row-tables para">
            <h6 class="awg-edition-info-breadcrumb">
                <a [routerLink]="[editionRouteConstants.SERIES.route]">
                    {{ editionRouteConstants.EDITION?.short }}
                </a>
                /
                <span>{{ editionRouteConstants.ROWTABLES.full }}</span>
            </h6>
            <!-- Jumbotron -->
            <awg-edition-jumbotron [jumbotronId]="EDITION_VIEW_ID" [jumbotronTitle]="'\xDCbersicht'" />
        </div>
    }

    @if (editionComplex) {
        <div class="awg-edition-complex">
            <h6 class="awg-edition-info-breadcrumb">
                <a [routerLink]="[editionRouteConstants.SERIES.route]">
                    {{ editionRouteConstants.EDITION?.short }}
                </a>
                /
                <a [routerLink]="[editionRouteConstants.SERIES.route, editionComplex.pubStatement.series.route]">
                    {{ editionComplex.pubStatement.series.full }}
                </a>
                /
                <a
                    [routerLink]="[
                        editionRouteConstants.SERIES.route,
                        editionComplex.pubStatement.series.route,
                        'section',
                        editionComplex.pubStatement.section.route,
                    ]">
                    {{ editionComplex.pubStatement.section.full }}
                </a>
                /
                <span [innerHTML]="editionComplex.complexId.short"></span>
            </h6>
            <awg-edition-jumbotron [jumbotronId]="EDITION_VIEW_ID" [jumbotronTitle]="editionComplex.complexId.full" />

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

    @if (editionComplex === null && rowTableView !== true && prefaceView !== true) {
        <div class="awg-edition-series para">
            <h6 class="awg-edition-info-breadcrumb">
                <ng-template #breadCrumbEdition>
                    {{ editionRouteConstants.EDITION?.short }}
                </ng-template>

                @if (editionSeries) {
                    <ng-template #breadCrumbSeries>
                        {{ editionSeries?.series.full }}
                    </ng-template>

                    <a [routerLink]="[editionRouteConstants.SERIES.route]">
                        <ng-container *ngTemplateOutlet="breadCrumbEdition" />
                    </a>
                    /
                    @if (editionSection) {
                        <ng-template #breadCrumbSection>
                            {{ editionSection?.section.full }}
                        </ng-template>

                        <a [routerLink]="['./series', editionSeries.series.route]">
                            <ng-container *ngTemplateOutlet="breadCrumbSeries" />
                        </a>
                        /
                        @if (introView) {
                            <a
                                [routerLink]="[
                                    './series',
                                    editionSeries.series.route,
                                    'section',
                                    editionSection.section.route,
                                ]">
                                <ng-container *ngTemplateOutlet="breadCrumbSection" />
                            </a>
                            /
                            <span>{{ editionRouteConstants.EDITION_INTRO.full }}</span>
                        } @else {
                            <span>
                                <ng-container *ngTemplateOutlet="breadCrumbSection" />
                            </span>
                        }
                    } @else {
                        <ng-container *ngTemplateOutlet="breadCrumbSeries" />
                        /
                    }
                } @else {
                    <ng-container *ngTemplateOutlet="breadCrumbEdition" />
                    /
                }
            </h6>
            <!-- Jumbotron -->
            <awg-edition-jumbotron
                [jumbotronId]="EDITION_VIEW_ID"
                [jumbotronTitle]="introView ? editionRouteConstants.EDITION_INTRO.full : EDITION_VIEW_TITLE" />
        </div>
    }

    <!-- edition routes -->
    <router-outlet />
</div>
`;var X="";var _=class{constructor(){this._editionStateService=i(s),this.EDITION_VIEW_ID="awg-edition-view",this.EDITION_VIEW_TITLE="Editions\xFCbersicht",this.isIntroView=this._editionStateService.isIntroView,this.isPrefaceView=this._editionStateService.isPrefaceView,this.isRowTableView=this._editionStateService.isRowTableView,this.selectedEditionComplex=this._editionStateService.selectedEditionComplex,this.selectedEditionSection=this._editionStateService.selectedEditionSection,this.selectedEditionSeries=this._editionStateService.selectedEditionSeries}get editionRouteConstants(){return c}};_=t([o({selector:"awg-edition-view",template:Z,changeDetection:g.Eager,standalone:!1,styles:[X]})],_);var _e=[{path:"",outlet:"side",component:m},{path:"",component:_,children:[{path:"preface",loadChildren:()=>import("./chunk-3SJOQXU3.js").then(e=>e.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-YTU76PD3.js").then(e=>e.EditionRowTablesModule)},{path:"series",component:h},{path:"series/:seriesId",component:E,children:[{path:"sections",component:f},{path:"section/:sectionId",loadChildren:()=>import("./chunk-TRTWZHFP.js").then(e=>e.EditionSectionDetailModule)},{path:"sections/:sectionId",redirectTo:"section/:sectionId",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:u,children:[{path:"",component:S,children:[{path:"intro",loadChildren:()=>import("./chunk-MIPAOGRB.js").then(e=>e.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-IHOMX2GC.js").then(e=>e.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-KSQX2WX3.js").then(e=>e.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-F6FSKTDY.js").then(e=>e.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]}]}],Y=[_,u,S,f,h,E],v=class{};v=t([I({imports:[x.forChild(_e)],exports:[x]})],v);var ee=class{};ee=t([I({imports:[L,v,m],declarations:[Y,C]})],ee);export{ee as EditionViewModule};
