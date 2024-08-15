import{a as g}from"./chunk-PP6HJ337.js";import{f as M,u as A}from"./chunk-ZSVNPVZK.js";import{p as s}from"./chunk-5PQBUCWJ.js";import{b as r}from"./chunk-T5UDFDIT.js";import"./chunk-TGRRTK4F.js";import{A as y,G as N,La as a,Ma as G,Oa as j,R as i,T as C,X as L,h as O,k as $,l as e,ob as P,s as U,x as l}from"./chunk-3ACQ2C22.js";var B=`<!--
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
`;var F="";var c,x=(c=class{constructor(t,o,d){this.route=t,this.editionService=o,this.utils=d}get editionRouteConstants(){return r}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this.route.paramMap.subscribe(t=>{let o=t.get("complexId")||"",d=A.getEditionComplexById(o.toUpperCase());d?(this.editionService.updateSelectedEditionComplex(d),this.selectedEditionComplex$=this.editionService.getSelectedEditionComplex().pipe(l(0))):this.selectedEditionComplex$=$})}ngOnDestroy(){this.editionService.clearSelectedEditionComplex()}},c.ctorParameters=()=>[{type:a},{type:s},{type:M}],c);x=e([i({selector:"awg-edition-complex",template:B,styles:[F]})],x);var H=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''">
    </awg-router-link-button-group>
}

<router-outlet />
`;var J="";var p,v=(p=class{constructor(t){this.editionService=t,this._destroyed$=new O}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this.editionService.getSelectedEditionComplex().pipe(y(this._destroyed$)).subscribe({next:t=>{this.editionComplex=t,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new g(this.editionComplex.baseRoute,r.EDITION_INTRO.route,r.EDITION_INTRO.short,!1),new g(this.editionComplex.baseRoute,r.EDITION_SHEETS.route,r.EDITION_SHEETS.short,!1),new g(this.editionComplex.baseRoute,r.EDITION_REPORT.route,r.EDITION_REPORT.short,!1),new g(this.editionComplex.baseRoute,r.EDITION_GRAPH.route,r.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},p.ctorParameters=()=>[{type:s}],p);v=e([i({selector:"awg-edition-detail-nav",template:H,styles:[J]})],v);var z=`@if (editionOutline) {
    <div class="row row-cols-1 row-cols-md-3 g-4">
        @for (series of editionOutline; track series) {
            <div class="col">
                <div class="card h-100">
                    <h5 class="card-header">
                        {{ series.series.full }}
                    </h5>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            @for (section of series.sections; track section) {
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
`;var W="";var m,R=(m=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this.editionService.clearSelectedEditionSeries(),this.editionService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=this.editionService.getEditionOutline()}},m.ctorParameters=()=>[{type:s}],m);R=e([i({selector:"awg-edition-series",template:z,styles:[W]})],R);var q=`<router-outlet />
`;var Y="";var u,I=(u=class{constructor(t,o){this.route=t,this.editionService=o}ngOnInit(){this.updateSeriesFromRoute()}updateSeriesFromRoute(){let t=this.route.snapshot.paramMap.get("id");this.selectedSeries=this.editionService.getEditionSeriesById(t),this.editionService.updateSelectedEditionSeries(this.selectedSeries)}},u.ctorParameters=()=>[{type:a},{type:s}],u);I=e([i({selector:"awg-edition-series-detail",template:q,styles:[Y]})],I);var Z=`@if (
    selectedSection &&
    utils.isNotEmptyObject(selectedSection.complexes) &&
    (utils.isNotEmptyArray(selectedSection.complexes.opus) || utils.isNotEmptyArray(selectedSection.complexes.mnr))
) {
    <div class="awg-edition-section-detail">
        @if (utils.isNotEmptyArray(selectedSection.complexes.opus)) {
            <div class="awg-edition-section-detail-opus para p-3 border rounded-3">
                <h5>nach Opusnummer:</h5>
                <awg-edition-complex-card [complexes]="selectedSection.complexes.opus"></awg-edition-complex-card>
            </div>
        }
        @if (utils.isNotEmptyArray(selectedSection.complexes.mnr)) {
            <div class="awg-edition-section-detail-mnr p-3 border rounded-3">
                <h5>nach Moldenhauer-Nummer:</h5>
                <awg-edition-complex-card [complexes]="selectedSection.complexes.mnr"></awg-edition-complex-card>
            </div>
        }
    </div>
} @else {
    <div class="alert alert-info" role="alert">
        <p class="text-muted" style="margin-bottom: 0">
            [Diese Inhalte erscheinen im Zusammenhang der vollsta\u0308ndigen Edition von AWG
            {{ selectedSeries?.series.short }}/{{ selectedSection?.section.short }}.]
        </p>
    </div>
}
`;var K="";var h,b=(h=class{constructor(t,o,d){this.route=t,this.editionService=o,this.utils=d,this._destroyed$=new O}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){let t=this.route.snapshot.paramMap.get("id");this.editionService.getSelectedEditionSeries().pipe(y(this._destroyed$),U(o=>!!o)).subscribe(o=>{this.selectedSeries=o;let d=o.series.route;this.selectedSection=this.editionService.getEditionSectionById(d,t),this.editionService.updateSelectedEditionSection(this.selectedSection)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},h.ctorParameters=()=>[{type:a},{type:s},{type:M}],h);b=e([i({selector:"awg-edition-section-detail",template:Z,styles:[K]})],b);var Q=`@if (selectedSeries$ | async; as selectedSeries) {
    <div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
        @for (section of selectedSeries.sections; track section) {
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
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
        }
    </div>
}
`;var X="";var E,w=(E=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelectedSection(),this.getSeries()}getSeries(){this.selectedSeries$=this.editionService.getSelectedEditionSeries()}clearSelectedSection(){this.editionService.clearSelectedEditionSection()}},E.ctorParameters=()=>[{type:s}],E);w=e([i({selector:"awg-edition-sections",template:Q,styles:[X]})],w);var ee=`<!-- content: edition-view -->

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
                        <a [routerLink]="['./series', selectedSeries.series.route]">
                            <ng-container *ngTemplateOutlet="breadCrumbSeries"></ng-container>
                        </a>
                        /
                        <span>
                            {{ selectedSection?.section.full }}
                        </span>
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
                [jumbotronTitle]="editionViewTitle"></awg-edition-jumbotron>
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
            </h6>
            <h3 class="awg-edition-info-header">
                <span class="awg-edition-info-header-title" [innerHTML]="selectedEditionComplex.complexId.full"></span>
            </h3>
            <!-- declamation -->
            <div class="awg-edition-responsibility mt-3 mb-5">
                <p>
                    Ediert von
                    @for (editor of selectedEditionComplex.respStatement.editors; track editor; let isLast = $last) {
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

    <!-- edition routes -->
    <router-outlet />
</div>
`;var te="";var S,T=(S=class{constructor(t,o){this.editionService=t,this.router=o,this.editionViewTitle="Inhalt",this.editionViewId="awg-edition-view"}get editionRouteConstants(){return r}ngOnInit(){this.setupEditionView(),this.routeToSidenav()}setupEditionView(){this.selectedEditionSeries$=this.editionService.getSelectedEditionSeries().pipe(l(0)),this.selectedEditionSection$=this.editionService.getSelectedEditionSection().pipe(l(0)),this.selectedEditionComplex$=this.editionService.getSelectedEditionComplex().pipe(l(0)),this.isPrefaceView$=this.editionService.getIsPrefaceView().pipe(l(0)),this.isRowTableView$=this.editionService.getIsRowTableView().pipe(l(0))}routeToSidenav(){this.router.navigate([{outlets:{side:"editionInfo"}}],{preserveFragment:!0})}},S.ctorParameters=()=>[{type:s},{type:G}],S);T=e([i({selector:"awg-edition-view",template:ee,styles:[te]})],T);var ve=[{path:"",component:T,children:[{path:"series",component:R},{path:"series/:id",component:I,children:[{path:"sections",component:w},{path:"section/:id",component:b},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:x,children:[{path:"",component:v,children:[{path:"intro",loadChildren:()=>import("./chunk-WSMZOXER.js").then(n=>n.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-W25D2S7B.js").then(n=>n.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-KRMFXDCO.js").then(n=>n.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-AEMC4X3F.js").then(n=>n.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]},{path:"preface",loadChildren:()=>import("./chunk-BQX3DWQJ.js").then(n=>n.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-PT6Y5WVK.js").then(n=>n.EditionRowTablesModule)}]}],ie=[T,x,v,w,b,R,I],D=class{};D=e([L({imports:[j.forChild(ve)],exports:[j]})],D);var oe=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
    @for (complex of complexes; track complex.complex.complexId.short) {
        <div class="col">
            <div class="card awg-edition-card h-100">
                <div class="card-body">
                    <h5 class="card-title" [ngClass]="{ 'text-muted': complex.disabled }">
                        <span class="awg-edition-info-header-title" [innerHTML]="complex.complex.complexId.full"></span>
                    </h5>
                </div>
                <div class="card-footer">
                    @if (!complex.disabled) {
                        <p class="awg-edition-responsibility">
                            <small class="text-muted">
                                Ediert von
                                @for (
                                    editor of complex.complex.respStatement.editors;
                                    track editor.name;
                                    let isLast = $last
                                ) {
                                    <span class="editor">
                                        <a href="{{ editor.homepage }}">{{ editor.name }}</a>
                                        @if (!isLast) {
                                            <span>&nbsp;&&nbsp;</span>
                                        }
                                    </span>
                                }
                                <br />
                                Versionsdatum:
                                <span class="version">{{ complex.complex.respStatement.lastModified }}</span>
                            </small>
                        </p>
                    }
                    <p class="text-end">
                        <a
                            [routerLink]="[complex.complex.baseRoute]"
                            class="btn btn-outline-info"
                            [ngClass]="{ disabled: complex.disabled }"
                            >Mehr ...
                        </a>
                    </p>
                </div>
            </div>
        </div>
    }
</div>
`;var se="";var f,k=(f=class{},f.propDecorators={complexes:[{type:C}]},f);k=e([i({selector:"awg-edition-complex-card",template:oe,changeDetection:N.OnPush,styles:[se]})],k);var ne=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h1 id="{{ jumbotronId }}" class="mb-4">{{ jumbotronTitle }}</h1>
</div>
`;var re="";var _,V=(_=class{},_.propDecorators={jumbotronId:[{type:C}],jumbotronTitle:[{type:C}]},_);V=e([i({selector:"awg-edition-jumbotron",template:ne,changeDetection:N.OnPush,styles:[re]})],V);var de=class{};de=e([L({imports:[P,D],declarations:[ie,k,V]})],de);export{de as EditionViewModule};
