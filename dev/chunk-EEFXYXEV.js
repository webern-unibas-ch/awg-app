import{a as y}from"./chunk-GYSG6DRK.js";import{n as D}from"./chunk-BTLQ32AW.js";import{ca as n,ia as k,na as a,qa as s}from"./chunk-SNRJ6BG6.js";import{c as R,i as O}from"./chunk-7S2PYHZJ.js";import"./chunk-QSGG4RFN.js";import"./chunk-BGGPLHQO.js";import"./chunk-JYIXRVGB.js";import"./chunk-BVPCGSEX.js";import{Ca as I,N as l,W as _,ea as i,k as C,n as N,o as t,sb as o,ub as T,yb as b}from"./chunk-Z3BUILC6.js";var L=`<!-- sideinfo: edition -->
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
                                                        <ng-container *ngTemplateOutlet="editionInfoComplex" />
                                                    </span>
                                                } @else {
                                                    <a
                                                        class="awg-edition-info-item-link"
                                                        [routerLink]="[
                                                            editionComplex.complex.baseRoute,
                                                            editionRouteConstants.EDITION_SHEETS.route,
                                                        ]">
                                                        <ng-container *ngTemplateOutlet="editionInfoComplex" />
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
`;var M="";var p=class{constructor(){this.editionInfoHeader="Edition",this.DISPLAYED_SECTIONS=[a.getEditionSectionById("1","5"),a.getEditionSectionById("2","2a")],this._editionStateService=i(s)}get editionRouteConstants(){return n}ngOnInit(){this.setupEditionView()}setupEditionView(){this._editionStateService.getSelectedEditionSection().subscribe(r=>{this.selectedEditionSection=r})}combineComplexes(r){let c=r?.content?.complexTypes?.opus||[],d=r?.content?.complexTypes?.mnr||[];return[...c,...d]}};p=t([o({selector:"awg-edition-info",template:L,standalone:!1,styles:[M]})],p);var V=`<!--
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
`;var j="";var u=class{constructor(){this._editionStateService=i(s),this._route=i(R)}get editionRouteConstants(){return n}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this._route.paramMap.subscribe(r=>{let c=r.get("complexId")||"",d=k.getEditionComplexById(c);if(y.isEmptyObject(d))this.selectedEditionComplex$=N;else{let w=a.getEditionSeriesById(d.pubStatement.series.route),q=a.getEditionSectionById(d.pubStatement.series.route,d.pubStatement.section.route);this._editionStateService.updateSelectedEditionSeries(w),this._editionStateService.updateSelectedEditionSection(q),this._editionStateService.updateSelectedEditionComplex(d),this.selectedEditionComplex$=this._editionStateService.getSelectedEditionComplex().pipe(l(0))}})}ngOnDestroy(){this._editionStateService.clearSelectedEditionComplex(),this._editionStateService.clearSelectedEditionSeries(),this._editionStateService.clearSelectedEditionSection()}};u=t([o({selector:"awg-edition-complex",template:V,standalone:!1,styles:[j]})],u);var A=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''" />
}

<router-outlet />
`;var G="";var m=class{constructor(r,c,d,w){this.root=r,this.link=c,this.label=d,this.disabled=w}};var S=class{constructor(){this._destroyed$=new C,this._editionStateService=i(s)}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this._editionStateService.getSelectedEditionComplex().pipe(_(this._destroyed$)).subscribe({next:r=>{this.editionComplex=r,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new m(this.editionComplex.baseRoute,n.EDITION_INTRO.route,n.EDITION_INTRO.short,!1),new m(this.editionComplex.baseRoute,n.EDITION_SHEETS.route,n.EDITION_SHEETS.short,!1),new m(this.editionComplex.baseRoute,n.EDITION_REPORT.route,n.EDITION_REPORT.short,!1),new m(this.editionComplex.baseRoute,n.EDITION_GRAPH.route,n.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}};S=t([o({selector:"awg-edition-detail-nav",template:A,standalone:!1,styles:[G]})],S);var $=`@if (editionOutline) {
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
`;var P="";var E=class{constructor(){this._editionStateService=i(s)}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this._editionStateService.clearSelectedEditionSeries(),this._editionStateService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=a.getEditionOutline()}};E=t([o({selector:"awg-edition-series",template:$,standalone:!1,styles:[P]})],E);var U=`<router-outlet />
`;var B="";var h=class{constructor(){this._editionStateService=i(s),this._route=i(R),this._destroyed$=new C}ngOnInit(){this.updateSeriesFromRoute()}updateSeriesFromRoute(){this._route.paramMap.pipe(_(this._destroyed$)).subscribe({next:r=>{let c=r.get("id"),d=a.getEditionSeriesById(c);this._editionStateService.updateSelectedEditionSeries(d)}})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}};h=t([o({selector:"awg-edition-series-detail",template:U,standalone:!1,styles:[B]})],h);var H=`@if (selectedSeries$ | async; as selectedSeries) {
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
`;var z=`@media(max-width:768px){.awg-img-container{max-height:150px;overflow:hidden;border-right:1px solid var(--bs-card-border-color)}img{object-fit:contain;height:100%}}.awg-card-border-top{border-top:1px solid var(--bs-card-border-color)}
`;var g=class{constructor(){this._editionStateService=i(s)}ngOnInit(){this.clearSelectedSection(),this.getSeries()}clearSelectedSection(){this._editionStateService.clearSelectedEditionSection()}getSeries(){this.selectedSeries$=this._editionStateService.getSelectedEditionSeries()}};g=t([o({selector:"awg-edition-sections",template:H,standalone:!1,styles:[z]})],g);var W=`<!-- content: edition-view -->
<div class="awg-edition-view p-3 border rounded-3">
    <awg-scroll-to-top />

    @let isIntroView = isIntroView$ | async;
    @let isPrefaceView = isPrefaceView$ | async;
    @let isRowTableView = isRowTableView$ | async;
    @let selectedEditionComplex = selectedEditionComplex$ | async;
    @let selectedEditionSeries = selectedEditionSeries$ | async;
    @let selectedEditionSection = selectedEditionSection$ | async;

    @if (isPrefaceView) {
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
                [jumbotronTitle]="editionRouteConstants.PREFACE.full" />
        </div>
    }

    @if (isRowTableView) {
        <div class="awg-edition-row-tables para">
            <h6 class="awg-edition-info-breadcrumb">
                <a [routerLink]="[editionRouteConstants.SERIES.route]">
                    {{ editionRouteConstants.EDITION?.short }}
                </a>
                /
                <span>{{ editionRouteConstants.ROWTABLES.full }}</span>
            </h6>
            <!-- Jumbotron -->
            <awg-edition-jumbotron [jumbotronId]="editionViewId" [jumbotronTitle]="'\xDCbersicht'" />
        </div>
    }

    @if (selectedEditionComplex) {
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
                [jumbotronTitle]="selectedEditionComplex.complexId.full" />

            <!-- declamation -->
            <div class="awg-edition-responsibility mt-3 mb-5">
                <p>
                    Ediert von
                    @for (editor of selectedEditionComplex.respStatement.editors; track $index; let isLast = $last) {
                        <span class="editor">
                            <a href="{{ editor.homepage }}">{{ editor.name }}</a>
                            <awg-meta-identifier-badges [identifiers]="editor.identifiers" />
                            @if (!isLast) {
                                <span>&nbsp;&&nbsp;</span>
                            }
                        </span>
                    }
                    <br />
                    Versionsdatum:
                    <span class="version">{{
                        selectedEditionComplex.respStatement.lastModified === '---'
                            ? '---'
                            : (selectedEditionComplex.respStatement.lastModified | date: 'longDate')
                    }}</span>
                </p>
            </div>
        </div>
    }

    @if (selectedEditionComplex === null && isRowTableView !== true && isPrefaceView !== true) {
        <div class="awg-edition-series para">
            <h6 class="awg-edition-info-breadcrumb">
                <ng-template #breadCrumbEdition>
                    {{ editionRouteConstants.EDITION?.short }}
                </ng-template>

                @if (selectedEditionSeries) {
                    <ng-template #breadCrumbSeries>
                        {{ selectedEditionSeries?.series.full }}
                    </ng-template>

                    <a [routerLink]="[editionRouteConstants.SERIES.route]">
                        <ng-container *ngTemplateOutlet="breadCrumbEdition" />
                    </a>
                    /
                    @if (selectedEditionSection) {
                        <ng-template #breadCrumbSection>
                            {{ selectedEditionSection?.section.full }}
                        </ng-template>

                        <a [routerLink]="['./series', selectedEditionSeries.series.route]">
                            <ng-container *ngTemplateOutlet="breadCrumbSeries" />
                        </a>
                        /
                        @if (isIntroView) {
                            <a
                                [routerLink]="[
                                    './series',
                                    selectedEditionSeries.series.route,
                                    'section',
                                    selectedEditionSection.section.route,
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
                [jumbotronId]="editionViewId"
                [jumbotronTitle]="isIntroView ? editionRouteConstants.EDITION_INTRO.full : editionViewTitle" />
        </div>
    }

    <!-- edition routes -->
    <router-outlet />
</div>
`;var F="";var f=class{constructor(){this.editionViewTitle="Editions\xFCbersicht",this.editionViewId="awg-edition-view",this._editionStateService=i(s)}get editionRouteConstants(){return n}ngOnInit(){this.setupEditionView()}setupEditionView(){this.selectedEditionSeries$=this._editionStateService.getSelectedEditionSeries().pipe(l(0)),this.selectedEditionSection$=this._editionStateService.getSelectedEditionSection().pipe(l(0)),this.selectedEditionComplex$=this._editionStateService.getSelectedEditionComplex().pipe(l(0)),this.isIntroView$=this._editionStateService.getIsIntroView().pipe(l(0)),this.isPrefaceView$=this._editionStateService.getIsPrefaceView().pipe(l(0)),this.isRowTableView$=this._editionStateService.getIsRowTableView().pipe(l(0))}};f=t([o({selector:"awg-edition-view",template:W,changeDetection:I.Eager,standalone:!1,styles:[F]})],f);var pe=[{path:"",outlet:"side",component:p},{path:"",component:f,children:[{path:"preface",loadChildren:()=>import("./chunk-T4FN22XQ.js").then(e=>e.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-F53AFIRU.js").then(e=>e.EditionRowTablesModule)},{path:"series",component:E},{path:"series/:id",component:h,children:[{path:"sections",component:g},{path:"section/:id",loadChildren:()=>import("./chunk-UQ6CZ5VL.js").then(e=>e.EditionSectionDetailModule)},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:u,children:[{path:"",component:S,children:[{path:"intro",loadChildren:()=>import("./chunk-YNII36KT.js").then(e=>e.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-M7N5BSRZ.js").then(e=>e.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-PKXVKNUS.js").then(e=>e.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-XE5VUPVZ.js").then(e=>e.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]}]}],J=[f,u,S,p,g,E,h],v=class{};v=t([b({imports:[O.forChild(pe)],exports:[O]})],v);var K=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h3 id="{{ jumbotronId }}" [innerHTML]="jumbotronTitle"></h3>
</div>
`;var Q="";var x=class{static{this.propDecorators={jumbotronId:[{type:T}],jumbotronTitle:[{type:T}]}}};x=t([o({selector:"awg-edition-jumbotron",template:K,changeDetection:I.OnPush,standalone:!1,styles:[Q]})],x);var Y=class{};Y=t([b({imports:[D,v],declarations:[J,x]})],Y);export{Y as EditionViewModule};
