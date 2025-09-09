import{a as p}from"./chunk-PP6HJ337.js";import{D as i,Ea as b,Gb as k,Ha as w,I as _,Lb as d,Nb as s,O as o,Q as x,T as I,h as T,i as O,j as t,jb as D,kc as y,v as a,z as N,zb as n}from"./chunk-5726QUSZ.js";var L=`<!-- sideinfo: edition -->
<div class="card">
    <div class="card-body bg-light">
        <h5 id="awg-edition-info-header">{{ editionInfoHeader }}</h5>
        <p>&#9671;</p>
        <div ngbAccordion>
            <!-- Allgemein -->
            <div ngbAccordionItem [collapsed]="false">
                <div ngbAccordionHeader>
                    <button ngbAccordionButton>Allgemein</button>
                </div>
                <div ngbAccordionCollapse>
                    <div ngbAccordionBody>
                        <ng-template
                            ><p>
                                <a
                                    class="awg-edition-info-item-link"
                                    [routerLink]="[
                                        editionRouteConstants.EDITION.route,
                                        editionRouteConstants.SERIES.route,
                                    ]"
                                    ><span class="awg-edition-info-item-title">{{
                                        editionRouteConstants.SERIES.full
                                    }}</span></a
                                >
                            </p>
                            <p>
                                <a
                                    class="awg-edition-info-item-link"
                                    [routerLink]="[
                                        editionRouteConstants.EDITION.route,
                                        editionRouteConstants.ROWTABLES.route,
                                    ]"
                                    ><span class="awg-edition-info-item-title">{{
                                        editionRouteConstants.ROWTABLES.full
                                    }}</span></a
                                >
                            </p>
                            <p>
                                <a
                                    class="awg-edition-info-item-link"
                                    [routerLink]="[
                                        editionRouteConstants.EDITION.route,
                                        editionRouteConstants.PREFACE.route,
                                    ]"
                                    ><span class="awg-edition-info-item-title">{{
                                        editionRouteConstants.PREFACE.full
                                    }}</span></a
                                >
                            </p>
                        </ng-template>
                    </div>
                </div>
            </div>
            <!-- Displayed Sections -->
            @for (section of DISPLAYED_SECTIONS; track $index) {
                <div ngbAccordionItem [collapsed]="selectedEditionSection !== section">
                    <div ngbAccordionHeader>
                        <button ngbAccordionButton>
                            {{ editionRouteConstants.EDITION.short }} {{ section.seriesParent.short }}/{{
                                section.section.short
                            }}
                        </button>
                    </div>
                    <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                            <ng-template>
                                @if (!section.content.intro.disabled) {
                                    <p>
                                        <a
                                            class="awg-edition-info-item-link"
                                            [routerLink]="[
                                                editionRouteConstants.EDITION.route,
                                                editionRouteConstants.SERIES.route,
                                                section?.seriesParent?.route,
                                                editionRouteConstants.SECTION.route,
                                                section?.section?.route,
                                                editionRouteConstants.EDITION_INTRO.route,
                                            ]"
                                            ><span
                                                class="awg-edition-info-item-title"
                                                [innerHTML]="editionRouteConstants.EDITION_INTRO.full"></span
                                        ></a>
                                    </p>
                                }

                                @if (combineComplexes(section).length > 0) {
                                    @for (
                                        editionComplex of combineComplexes(section);
                                        track editionComplex.complex.complexId.short
                                    ) {
                                        <ng-template #editionInfoComplex>
                                            <span
                                                class="awg-edition-info-item-title"
                                                [innerHTML]="editionComplex.complex.complexId.full"></span>
                                        </ng-template>

                                        <p>
                                            <span>
                                                @if (editionComplex.disabled) {
                                                    <span class="text-muted">
                                                        <ng-container
                                                            *ngTemplateOutlet="editionInfoComplex"></ng-container>
                                                    </span>
                                                } @else {
                                                    <a
                                                        class="awg-edition-info-item-link"
                                                        [routerLink]="[
                                                            editionComplex.complex.baseRoute,
                                                            editionRouteConstants.EDITION_SHEETS.route,
                                                        ]">
                                                        <ng-container
                                                            *ngTemplateOutlet="editionInfoComplex"></ng-container>
                                                    </a>
                                                }
                                            </span>
                                        </p>
                                    }
                                }
                            </ng-template>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>
</div>
`;var M="";var u=class{constructor(){this.editionInfoHeader="Edition",this.DISPLAYED_SECTIONS=[d.getEditionSectionById("1","5"),d.getEditionSectionById("2","2a")],this._editionStateService=i(s)}get editionRouteConstants(){return n}ngOnInit(){this.setupEditionView()}setupEditionView(){this._editionStateService.getSelectedEditionSection().subscribe(r=>{this.selectedEditionSection=r})}combineComplexes(r){let m=r?.content?.complexTypes?.opus||[],l=r?.content?.complexTypes?.mnr||[];return[...m,...l]}};u=t([o({selector:"awg-edition-info",template:L,standalone:!1,styles:[M]})],u);var j=`<!--
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
`;var V="";var S=class{constructor(){this._editionStateService=i(s),this._route=i(b),this._utils=i(D)}get editionRouteConstants(){return n}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this._route.paramMap.subscribe(r=>{let m=r.get("complexId")||"",l=k.getEditionComplexById(m.toUpperCase());if(this._utils.isNotEmptyObject(l)){let q=d.getEditionSeriesById(l.pubStatement.series.route),Z=d.getEditionSectionById(l.pubStatement.series.route,l.pubStatement.section.route);this._editionStateService.updateSelectedEditionSeries(q),this._editionStateService.updateSelectedEditionSection(Z),this._editionStateService.updateSelectedEditionComplex(l),this.selectedEditionComplex$=this._editionStateService.getSelectedEditionComplex().pipe(a(0))}else this.selectedEditionComplex$=O})}ngOnDestroy(){this._editionStateService.clearSelectedEditionComplex(),this._editionStateService.clearSelectedEditionSeries(),this._editionStateService.clearSelectedEditionSection()}};S=t([o({selector:"awg-edition-complex",template:j,standalone:!1,styles:[V]})],S);var A=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''">
    </awg-router-link-button-group>
}

<router-outlet />
`;var G="";var E=class{constructor(){this._destroyed$=new T,this._editionStateService=i(s)}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this._editionStateService.getSelectedEditionComplex().pipe(N(this._destroyed$)).subscribe({next:r=>{this.editionComplex=r,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new p(this.editionComplex.baseRoute,n.EDITION_INTRO.route,n.EDITION_INTRO.short,!1),new p(this.editionComplex.baseRoute,n.EDITION_SHEETS.route,n.EDITION_SHEETS.short,!1),new p(this.editionComplex.baseRoute,n.EDITION_REPORT.route,n.EDITION_REPORT.short,!1),new p(this.editionComplex.baseRoute,n.EDITION_GRAPH.route,n.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}};E=t([o({selector:"awg-edition-detail-nav",template:A,standalone:!1,styles:[G]})],E);var $=`@if (editionOutline) {
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
            @for (series of editionOutline; track $index) {
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
`;var B="";var h=class{constructor(){this._editionStateService=i(s)}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this._editionStateService.clearSelectedEditionSeries(),this._editionStateService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=d.getEditionOutline()}};h=t([o({selector:"awg-edition-series",template:$,standalone:!1,styles:[B]})],h);var P=`<router-outlet />
`;var U="";var g=class{constructor(){this._editionStateService=i(s),this._route=i(b)}ngOnInit(){this.updateSeriesFromRoute()}updateSeriesFromRoute(){let r=this._route.snapshot.paramMap.get("id"),m=d.getEditionSeriesById(r);this._editionStateService.updateSelectedEditionSeries(m)}};g=t([o({selector:"awg-edition-series-detail",template:P,standalone:!1,styles:[U]})],g);var H=`@if (selectedSeries$ | async; as selectedSeries) {
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
`;var z=`@media (max-width: 768px){.awg-img-container{max-height:150px;overflow:hidden;border-right:1px solid var(--bs-card-border-color)}img{object-fit:contain;height:100%}}.awg-card-border-top{border-top:1px solid var(--bs-card-border-color)}
`;var f=class{constructor(){this._editionStateService=i(s)}ngOnInit(){this.clearSelectedSection(),this.getSeries()}clearSelectedSection(){this._editionStateService.clearSelectedEditionSection()}getSeries(){this.selectedSeries$=this._editionStateService.getSelectedEditionSeries()}};f=t([o({selector:"awg-edition-sections",template:H,standalone:!1,styles:[z]})],f);var W=`<!-- content: edition-view -->
<div class="awg-edition-view p-3 border rounded-3">
    <awg-scroll-to-top />

    @if (isPrefaceView$ | async; as isPrefaceView) {
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
                [jumbotronId]="editionViewId"
                [jumbotronTitle]="editionRouteConstants.PREFACE.full"></awg-edition-jumbotron>
        </div>
    }

    @if (isRowTableView$ | async; as isRowTableView) {
        <div class="awg-edition-row-tables para">
            <h6 class="awg-edition-info-breadcrumb">
                <a [routerLink]="[editionRouteConstants.SERIES.route]">
                    {{ editionRouteConstants.EDITION?.short }}
                </a>
                /
                <span>{{ editionRouteConstants.ROWTABLES.full }}</span>
            </h6>
            <!-- Jumbotron -->
            <awg-edition-jumbotron [jumbotronId]="editionViewId" [jumbotronTitle]="'\xDCbersicht'"></awg-edition-jumbotron>
        </div>
    }

    @if (selectedEditionComplex$ | async; as selectedEditionComplex) {
        <div class="awg-edition-complex">
            <h6 class="awg-edition-info-breadcrumb">
                <a [routerLink]="[editionRouteConstants.SERIES.route]">
                    {{ editionRouteConstants.EDITION?.short }}
                </a>
                /
                <a
                    [routerLink]="[
                        editionRouteConstants.SERIES.route,
                        selectedEditionComplex.pubStatement.series.route,
                    ]">
                    {{ selectedEditionComplex.pubStatement.series.full }}
                </a>
                /
                <a
                    [routerLink]="[
                        editionRouteConstants.SERIES.route,
                        selectedEditionComplex.pubStatement.series.route,
                        'section',
                        selectedEditionComplex.pubStatement.section.route,
                    ]">
                    {{ selectedEditionComplex.pubStatement.section.full }}
                </a>
                /
                <span [innerHTML]="selectedEditionComplex.complexId.short"></span>
            </h6>
            <awg-edition-jumbotron
                [jumbotronId]="editionViewId"
                [jumbotronTitle]="selectedEditionComplex.complexId.full"></awg-edition-jumbotron>

            <!-- declamation -->
            <div class="awg-edition-responsibility mt-3 mb-5">
                <p>
                    Ediert von
                    @for (editor of selectedEditionComplex.respStatement.editors; track $index; let isLast = $last) {
                        <span class="editor">
                            <a href="{{ editor.homepage }}">{{ editor.name }}</a>
                            @if (!isLast) {
                                <span>&nbsp;&&nbsp;</span>
                            }
                        </span>
                    }
                    <br />
                    Versionsdatum:
                    <span class="version">{{ selectedEditionComplex.respStatement.lastModified }}</span>
                </p>
            </div>
        </div>
    }

    @if (
        (selectedEditionComplex$ | async) === null &&
        (isRowTableView$ | async) === null &&
        (isPrefaceView$ | async) === null
    ) {
        <div class="awg-edition-series para">
            <h6 class="awg-edition-info-breadcrumb">
                <ng-template #breadCrumbEdition>
                    {{ editionRouteConstants.EDITION?.short }}
                </ng-template>

                @if (selectedEditionSeries$ | async; as selectedSeries) {
                    <ng-template #breadCrumbSeries>
                        {{ selectedSeries?.series.full }}
                    </ng-template>

                    <a [routerLink]="[editionRouteConstants.SERIES.route]">
                        <ng-container *ngTemplateOutlet="breadCrumbEdition"></ng-container>
                    </a>
                    /
                    @if (selectedEditionSection$ | async; as selectedSection) {
                        <ng-template #breadCrumbSection>
                            {{ selectedSection?.section.full }}
                        </ng-template>

                        <a [routerLink]="['./series', selectedSeries.series.route]">
                            <ng-container *ngTemplateOutlet="breadCrumbSeries"></ng-container>
                        </a>
                        /
                        @if (isIntroView$ | async) {
                            <a
                                [routerLink]="[
                                    './series',
                                    selectedSeries.series.route,
                                    'section',
                                    selectedSection.section.route,
                                ]">
                                <ng-container *ngTemplateOutlet="breadCrumbSection"></ng-container>
                            </a>
                            /
                            <span>{{ editionRouteConstants.EDITION_INTRO.full }}</span>
                        } @else {
                            <span>
                                <ng-container *ngTemplateOutlet="breadCrumbSection"></ng-container>
                            </span>
                        }
                    } @else {
                        <ng-container *ngTemplateOutlet="breadCrumbSeries"></ng-container>
                        /
                    }
                } @else {
                    <ng-container *ngTemplateOutlet="breadCrumbEdition"></ng-container>
                    /
                }
            </h6>
            <!-- Jumbotron -->
            <awg-edition-jumbotron
                [jumbotronId]="editionViewId"
                [jumbotronTitle]="
                    (isIntroView$ | async) === null ? editionViewTitle : editionRouteConstants.EDITION_INTRO.full
                "></awg-edition-jumbotron>
        </div>
    }

    <!-- edition routes -->
    <router-outlet />
</div>
`;var F="";var C=class{constructor(){this.editionViewTitle="Editions\xFCbersicht",this.editionViewId="awg-edition-view",this._editionStateService=i(s)}get editionRouteConstants(){return n}ngOnInit(){this.setupEditionView()}setupEditionView(){this.selectedEditionSeries$=this._editionStateService.getSelectedEditionSeries().pipe(a(0)),this.selectedEditionSection$=this._editionStateService.getSelectedEditionSection().pipe(a(0)),this.selectedEditionComplex$=this._editionStateService.getSelectedEditionComplex().pipe(a(0)),this.isIntroView$=this._editionStateService.getIsIntroView().pipe(a(0)),this.isPrefaceView$=this._editionStateService.getIsPrefaceView().pipe(a(0)),this.isRowTableView$=this._editionStateService.getIsRowTableView().pipe(a(0))}};C=t([o({selector:"awg-edition-view",template:W,changeDetection:_.Default,standalone:!1,styles:[F]})],C);var ue=[{path:"",outlet:"side",component:u},{path:"",component:C,children:[{path:"preface",loadChildren:()=>import("./chunk-YZVBBPIJ.js").then(e=>e.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-JZQ4A5Q4.js").then(e=>e.EditionRowTablesModule)},{path:"series",component:h},{path:"series/:id",component:g,children:[{path:"sections",component:f},{path:"section/:id",loadChildren:()=>import("./chunk-RI7DOBDS.js").then(e=>e.EditionSectionDetailModule)},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:S,children:[{path:"",component:E,children:[{path:"intro",loadChildren:()=>import("./chunk-JMXHKBXL.js").then(e=>e.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-DWH3IZOM.js").then(e=>e.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-WB2OJBXF.js").then(e=>e.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-NZZIZNYN.js").then(e=>e.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]}]}],J=[C,S,E,u,f,h,g],R=class{};R=t([I({imports:[w.forChild(ue)],exports:[w]})],R);var K=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h3 id="{{ jumbotronId }}" [innerHTML]="jumbotronTitle"></h3>
</div>
`;var Q="";var c,v=(c=class{},c.propDecorators={jumbotronId:[{type:x}],jumbotronTitle:[{type:x}]},c);v=t([o({selector:"awg-edition-jumbotron",template:K,changeDetection:_.OnPush,standalone:!1,styles:[Q]})],v);var Y=class{};Y=t([I({imports:[y,R],declarations:[J,v]})],Y);export{Y as EditionViewModule};
