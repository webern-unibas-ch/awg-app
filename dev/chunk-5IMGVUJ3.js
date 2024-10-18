import{a as g}from"./chunk-PP6HJ337.js";import{f as j}from"./chunk-I4QXLD6W.js";import"./chunk-IMAAQVBQ.js";import{b as n,i as $,n as l,p as r}from"./chunk-YFDU6MHV.js";import{B as D,Ca as e,I as L,Oa as w,Pa as k,Ra as N,T as o,V as O,Z as v,h as y,k as M,rb as V,x as s}from"./chunk-QGPQRYE7.js";var P=`<!--
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
`;var G="";var c,f=(c=class{constructor(t,d,a){this.route=t,this.editionStateService=d,this.utils=a}get editionRouteConstants(){return n}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this.route.paramMap.subscribe(t=>{let d=t.get("complexId")||"",a=$.getEditionComplexById(d.toUpperCase());if(this.utils.isNotEmptyObject(a)){let ee=l.getEditionSeriesById(a.pubStatement.series.route),te=l.getEditionSectionById(a.pubStatement.series.route,a.pubStatement.section.route);this.editionStateService.updateSelectedEditionSeries(ee),this.editionStateService.updateSelectedEditionSection(te),this.editionStateService.updateSelectedEditionComplex(a),this.selectedEditionComplex$=this.editionStateService.getSelectedEditionComplex().pipe(s(0))}else this.selectedEditionComplex$=M})}ngOnDestroy(){this.editionStateService.clearSelectedEditionComplex(),this.editionStateService.clearSelectedEditionSeries(),this.editionStateService.clearSelectedEditionSection()}},c.ctorParameters=()=>[{type:w},{type:r},{type:j}],c);f=e([o({selector:"awg-edition-complex",template:P,styles:[G]})],f);var U=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''">
    </awg-router-link-button-group>
}

<router-outlet />
`;var B="";var m,C=(m=class{constructor(t){this.editionStateService=t,this._destroyed$=new y}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this.editionStateService.getSelectedEditionComplex().pipe(D(this._destroyed$)).subscribe({next:t=>{this.editionComplex=t,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new g(this.editionComplex.baseRoute,n.EDITION_INTRO.route,n.EDITION_INTRO.short,!1),new g(this.editionComplex.baseRoute,n.EDITION_SHEETS.route,n.EDITION_SHEETS.short,!1),new g(this.editionComplex.baseRoute,n.EDITION_REPORT.route,n.EDITION_REPORT.short,!1),new g(this.editionComplex.baseRoute,n.EDITION_GRAPH.route,n.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},m.ctorParameters=()=>[{type:r}],m);C=e([o({selector:"awg-edition-detail-nav",template:U,styles:[B]})],C);var A=`@if (editionOutline) {
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
}
`;var F="";var p,_=(p=class{constructor(t){this.editionStateService=t}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this.editionStateService.clearSelectedEditionSeries(),this.editionStateService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=l.getEditionOutline()}},p.ctorParameters=()=>[{type:r}],p);_=e([o({selector:"awg-edition-series",template:A,styles:[F]})],_);var H=`<router-outlet />
`;var J="";var u,I=(u=class{constructor(t,d){this.route=t,this.editionStateService=d}ngOnInit(){this.updateSeriesFromRoute()}updateSeriesFromRoute(){let t=this.route.snapshot.paramMap.get("id");this.selectedSeries=l.getEditionSeriesById(t),this.editionStateService.updateSelectedEditionSeries(this.selectedSeries)}},u.ctorParameters=()=>[{type:w},{type:r}],u);I=e([o({selector:"awg-edition-series-detail",template:H,styles:[J]})],I);var z=`@if (selectedSeries$ | async; as selectedSeries) {
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
`;var W=`@media (max-width: 768px){.awg-img-container{max-height:150px;overflow:hidden;border-right:1px solid var(--bs-card-border-color)}img{object-fit:contain;height:100%}}.awg-card-border-top{border-top:1px solid var(--bs-card-border-color)}
`;var S,b=(S=class{constructor(t){this.editionStateService=t}ngOnInit(){this.clearSelectedSection(),this.getSeries()}clearSelectedSection(){this.editionStateService.clearSelectedEditionSection()}getSeries(){this.selectedSeries$=this.editionStateService.getSelectedEditionSeries()}},S.ctorParameters=()=>[{type:r}],S);b=e([o({selector:"awg-edition-sections",template:z,styles:[W]})],b);var q=`<!-- content: edition-view -->

<div>
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
`;var Y="";var h,R=(h=class{constructor(t,d){this.editionStateService=t,this.router=d,this.editionViewTitle="Inhalt",this.editionViewId="awg-edition-view"}get editionRouteConstants(){return n}ngOnInit(){this.setupEditionView(),this.routeToSidenav()}setupEditionView(){this.selectedEditionSeries$=this.editionStateService.getSelectedEditionSeries().pipe(s(0)),this.selectedEditionSection$=this.editionStateService.getSelectedEditionSection().pipe(s(0)),this.selectedEditionComplex$=this.editionStateService.getSelectedEditionComplex().pipe(s(0)),this.isIntroView$=this.editionStateService.getIsIntroView().pipe(s(0)),this.isPrefaceView$=this.editionStateService.getIsPrefaceView().pipe(s(0)),this.isRowTableView$=this.editionStateService.getIsRowTableView().pipe(s(0))}routeToSidenav(){this.router.navigate([{outlets:{side:"editionInfo"}}],{preserveFragment:!0})}},h.ctorParameters=()=>[{type:r},{type:k}],h);R=e([o({selector:"awg-edition-view",template:q,styles:[Y]})],R);var Se=[{path:"",component:R,children:[{path:"preface",loadChildren:()=>import("./chunk-QEZGYIFB.js").then(i=>i.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-Y5DRRLG7.js").then(i=>i.EditionRowTablesModule)},{path:"series",component:_},{path:"series/:id",component:I,children:[{path:"sections",component:b},{path:"section/:id",loadChildren:()=>import("./chunk-VLQ7JYDX.js").then(i=>i.EditionSectionDetailModule)},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:f,children:[{path:"",component:C,children:[{path:"intro",loadChildren:()=>import("./chunk-2B754ZOS.js").then(i=>i.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-MFZHX67V.js").then(i=>i.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-Y4BVOYOY.js").then(i=>i.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-VPPZLJ24.js").then(i=>i.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]}]}],K=[R,f,C,b,_,I],x=class{};x=e([v({imports:[N.forChild(Se)],exports:[N]})],x);var Q=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h3 id="{{ jumbotronId }}" [innerHTML]="jumbotronTitle"></h3>
</div>
`;var X="";var E,T=(E=class{},E.propDecorators={jumbotronId:[{type:O}],jumbotronTitle:[{type:O}]},E);T=e([o({selector:"awg-edition-jumbotron",template:Q,changeDetection:L.OnPush,styles:[X]})],T);var Z=class{};Z=e([v({imports:[V,x],declarations:[K,T]})],Z);export{Z as EditionViewModule};
