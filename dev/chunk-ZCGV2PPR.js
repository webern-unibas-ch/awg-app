import{a as f}from"./chunk-PP6HJ337.js";import{f as j}from"./chunk-RRURER27.js";import"./chunk-CINYXDPH.js";import{a as n,h as G,m as r,o as s}from"./chunk-G65HWV4P.js";import{B as A,Da as t,J as w,Pa as O,Sa as D,U as i,W as k,_ as T,h as L,k as M,ub as V,x as a}from"./chunk-LZWTKYZ5.js";var P=`<!-- sideinfo: edition -->
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
`;var $="";var c,C=(c=class{constructor(e){this.editionStateService=e,this.editionInfoHeader="Edition",this.DISPLAYED_SECTIONS=[r.getEditionSectionById("1","5"),r.getEditionSectionById("2","2a")]}get editionRouteConstants(){return n}ngOnInit(){this.setupEditionView()}setupEditionView(){this.editionStateService.getSelectedEditionSection().subscribe(e=>{this.selectedEditionSection=e})}combineComplexes(e){let l=e?.content?.complexTypes?.opus||[],d=e?.content?.complexTypes?.mnr||[];return[...l,...d]}},c.ctorParameters=()=>[{type:s}],c);C=t([i({selector:"awg-edition-info",template:P,styles:[$]})],C);var B=`<!--
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
`;var U="";var p,I=(p=class{constructor(e,l,d){this.route=e,this.editionStateService=l,this.utils=d}get editionRouteConstants(){return n}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this.route.paramMap.subscribe(e=>{let l=e.get("complexId")||"",d=G.getEditionComplexById(l.toUpperCase());if(this.utils.isNotEmptyObject(d)){let oe=r.getEditionSeriesById(d.pubStatement.series.route),ne=r.getEditionSectionById(d.pubStatement.series.route,d.pubStatement.section.route);this.editionStateService.updateSelectedEditionSeries(oe),this.editionStateService.updateSelectedEditionSection(ne),this.editionStateService.updateSelectedEditionComplex(d),this.selectedEditionComplex$=this.editionStateService.getSelectedEditionComplex().pipe(a(0))}else this.selectedEditionComplex$=M})}ngOnDestroy(){this.editionStateService.clearSelectedEditionComplex(),this.editionStateService.clearSelectedEditionSeries(),this.editionStateService.clearSelectedEditionSection()}},p.ctorParameters=()=>[{type:O},{type:s},{type:j}],p);I=t([i({selector:"awg-edition-complex",template:B,styles:[U]})],I);var H=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''">
    </awg-router-link-button-group>
}

<router-outlet />
`;var z="";var m,b=(m=class{constructor(e){this.editionStateService=e,this._destroyed$=new L}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this.editionStateService.getSelectedEditionComplex().pipe(A(this._destroyed$)).subscribe({next:e=>{this.editionComplex=e,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new f(this.editionComplex.baseRoute,n.EDITION_INTRO.route,n.EDITION_INTRO.short,!1),new f(this.editionComplex.baseRoute,n.EDITION_SHEETS.route,n.EDITION_SHEETS.short,!1),new f(this.editionComplex.baseRoute,n.EDITION_REPORT.route,n.EDITION_REPORT.short,!1),new f(this.editionComplex.baseRoute,n.EDITION_GRAPH.route,n.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},m.ctorParameters=()=>[{type:s}],m);b=t([i({selector:"awg-edition-detail-nav",template:H,styles:[z]})],b);var W=`@if (editionOutline) {
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
`;var F="";var u,_=(u=class{constructor(e){this.editionStateService=e}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this.editionStateService.clearSelectedEditionSeries(),this.editionStateService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=r.getEditionOutline()}},u.ctorParameters=()=>[{type:s}],u);_=t([i({selector:"awg-edition-series",template:W,styles:[F]})],_);var J=`<router-outlet />
`;var K="";var S,R=(S=class{constructor(e,l){this.route=e,this.editionStateService=l}ngOnInit(){this.updateSeriesFromRoute()}updateSeriesFromRoute(){let e=this.route.snapshot.paramMap.get("id");this.selectedSeries=r.getEditionSeriesById(e),this.editionStateService.updateSelectedEditionSeries(this.selectedSeries)}},S.ctorParameters=()=>[{type:O},{type:s}],S);R=t([i({selector:"awg-edition-series-detail",template:J,styles:[K]})],R);var Q=`@if (selectedSeries$ | async; as selectedSeries) {
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
`;var Y=`@media (max-width: 768px){.awg-img-container{max-height:150px;overflow:hidden;border-right:1px solid var(--bs-card-border-color)}img{object-fit:contain;height:100%}}.awg-card-border-top{border-top:1px solid var(--bs-card-border-color)}
`;var h,v=(h=class{constructor(e){this.editionStateService=e}ngOnInit(){this.clearSelectedSection(),this.getSeries()}clearSelectedSection(){this.editionStateService.clearSelectedEditionSection()}getSeries(){this.selectedSeries$=this.editionStateService.getSelectedEditionSeries()}},h.ctorParameters=()=>[{type:s}],h);v=t([i({selector:"awg-edition-sections",template:Q,styles:[Y]})],v);var q=`<!-- content: edition-view -->
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
`;var Z="";var E,x=(E=class{constructor(e){this.editionStateService=e,this.editionViewTitle="Editions\xFCbersicht",this.editionViewId="awg-edition-view"}get editionRouteConstants(){return n}ngOnInit(){this.setupEditionView()}setupEditionView(){this.selectedEditionSeries$=this.editionStateService.getSelectedEditionSeries().pipe(a(0)),this.selectedEditionSection$=this.editionStateService.getSelectedEditionSection().pipe(a(0)),this.selectedEditionComplex$=this.editionStateService.getSelectedEditionComplex().pipe(a(0)),this.isIntroView$=this.editionStateService.getIsIntroView().pipe(a(0)),this.isPrefaceView$=this.editionStateService.getIsPrefaceView().pipe(a(0)),this.isRowTableView$=this.editionStateService.getIsRowTableView().pipe(a(0))}},E.ctorParameters=()=>[{type:s}],E);x=t([i({selector:"awg-edition-view",template:q,changeDetection:w.Default,styles:[Z]})],x);var Ce=[{path:"",outlet:"side",component:C},{path:"",component:x,children:[{path:"preface",loadChildren:()=>import("./chunk-YRYKEHPX.js").then(o=>o.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-YAOYE3LH.js").then(o=>o.EditionRowTablesModule)},{path:"series",component:_},{path:"series/:id",component:R,children:[{path:"sections",component:v},{path:"section/:id",loadChildren:()=>import("./chunk-YIKVMMV5.js").then(o=>o.EditionSectionDetailModule)},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:I,children:[{path:"",component:b,children:[{path:"intro",loadChildren:()=>import("./chunk-JJ5FD65O.js").then(o=>o.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-G4DSEXKQ.js").then(o=>o.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-J5VCQ5SY.js").then(o=>o.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-BVES2UXH.js").then(o=>o.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]}]}],X=[x,I,b,C,v,_,R],N=class{};N=t([T({imports:[D.forChild(Ce)],exports:[D]})],N);var ee=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h3 id="{{ jumbotronId }}" [innerHTML]="jumbotronTitle"></h3>
</div>
`;var te="";var g,y=(g=class{},g.propDecorators={jumbotronId:[{type:k}],jumbotronTitle:[{type:k}]},g);y=t([i({selector:"awg-edition-jumbotron",template:ee,changeDetection:w.OnPush,styles:[te]})],y);var ie=class{};ie=t([T({imports:[V,N],declarations:[X,y]})],ie);export{ie as EditionViewModule};
