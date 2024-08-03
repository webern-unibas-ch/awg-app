import{a as C}from"./chunk-PP6HJ337.js";import{f as D}from"./chunk-DA7P3D5H.js";import{m as s}from"./chunk-62A6PBJ5.js";import{c as r,v as P}from"./chunk-6QWKLRTO.js";import"./chunk-SUAPIDDN.js";import{A as y,G as N,La as l,Ma as $,Oa as V,R as i,T as _,X as L,h as T,l as e,ob as G,s as U,x as d}from"./chunk-KHOU7TSZ.js";var A=`<!--
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
`;var B="";var a,x=(a=class{constructor(t,o,g){this.route=t,this.editionService=o,this.utils=g}get editionRouteConstants(){return r}ngOnInit(){this.getEditionComplexFromRoute()}getEditionComplexFromRoute(){this.route.paramMap.subscribe(t=>{let o=t.get("complexId")||"";this.editionService.updateEditionComplex(P[o.toUpperCase()]),this.selectedEditionComplex$=this.editionService.getEditionComplex().pipe(d(0))})}ngOnDestroy(){this.editionService.clearEditionComplex()}},a.ctorParameters=()=>[{type:l},{type:s},{type:D}],a);x=e([i({selector:"awg-edition-complex",template:A,styles:[B]})],x);var F=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''">
    </awg-router-link-button-group>
}

<router-outlet />
`;var H="";var c,v=(c=class{constructor(t){this.editionService=t,this._destroyed$=new T}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this.editionService.getEditionComplex().pipe(y(this._destroyed$)).subscribe({next:t=>{this.editionComplex=t,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new C(this.editionComplex.baseRoute,r.EDITION_INTRO.route,r.EDITION_INTRO.short,!1),new C(this.editionComplex.baseRoute,r.EDITION_SHEETS.route,r.EDITION_SHEETS.short,!1),new C(this.editionComplex.baseRoute,r.EDITION_REPORT.route,r.EDITION_REPORT.short,!1),new C(this.editionComplex.baseRoute,r.EDITION_GRAPH.route,r.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},c.ctorParameters=()=>[{type:s}],c);v=e([i({selector:"awg-edition-detail-nav",template:F,styles:[H]})],v);var J=`@if (editionOutline) {
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
`;var z="";var m,R=(m=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this.editionService.clearSelectedEditionSeries(),this.editionService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=this.editionService.getEditionOutline()}},m.ctorParameters=()=>[{type:s}],m);R=e([i({selector:"awg-edition-series",template:J,styles:[z]})],R);var W=`<router-outlet />
`;var q="";var p,I=(p=class{constructor(t,o){this.route=t,this.editionService=o}ngOnInit(){this.getSeries()}getSeries(){let t=this.route.snapshot.paramMap.get("id");this.selectedSeries=this.editionService.getEditionSeriesById(t),this.editionService.updateSelectedEditionSeries(this.selectedSeries)}},p.ctorParameters=()=>[{type:l},{type:s}],p);I=e([i({selector:"awg-edition-series-detail",template:W,styles:[q]})],I);var X=`@if (
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
`;var Z="";var u,b=(u=class{constructor(t,o,g){this.route=t,this.editionService=o,this.utils=g,this._destroyed$=new T}ngOnInit(){this.getSection()}getSection(){let t=this.route.snapshot.paramMap.get("id");this.editionService.getSelectedEditionSeries().pipe(y(this._destroyed$),U(o=>!!o)).subscribe(o=>{this.selectedSeries=o;let g=o.series.route;this.selectedSection=this.editionService.getEditionSectionById(g,t),this.editionService.updateSelectedEditionSection(this.selectedSection)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},u.ctorParameters=()=>[{type:l},{type:s},{type:D}],u);b=e([i({selector:"awg-edition-section-detail",template:X,styles:[Z]})],b);var K=`@if (selectedSeries$ | async; as selectedSeries) {
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
`;var Q="";var h,w=(h=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelectedSection(),this.getSeries()}getSeries(){this.selectedSeries$=this.editionService.getSelectedEditionSeries()}clearSelectedSection(){this.editionService.clearSelectedEditionSection()}},h.ctorParameters=()=>[{type:s}],h);w=e([i({selector:"awg-edition-sections",template:K,styles:[Q]})],w);var Y=`<!-- content: edition-view -->

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
                <a [routerLink]="[editionRouteConstants.SERIES.route, selectedEditionComplex.series.route]">
                    {{ selectedEditionComplex.series.full }}
                </a>
                /
                <a
                    [routerLink]="[
                        editionRouteConstants.SERIES.route,
                        selectedEditionComplex.series.route,
                        'section',
                        selectedEditionComplex.section.route,
                    ]">
                    {{ selectedEditionComplex.section.full }}
                </a>
            </h6>
            <h3 class="awg-edition-info-header">
                <span class="awg-edition-info-header-title" [innerHTML]="selectedEditionComplex.complexId.full"></span>
            </h3>
            <!-- declamation -->
            <div class="awg-edition-responsibility mt-3 mb-5">
                <p>
                    Ediert von
                    @for (
                        editor of selectedEditionComplex.responsibilityStatement.editors;
                        track editor;
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
                    <span class="version">{{ selectedEditionComplex.responsibilityStatement.lastModified }}</span>
                </p>
            </div>
        </div>
    }

    <!-- edition routes -->
    <router-outlet />
</div>
`;var ee="";var E,O=(E=class{constructor(t,o){this.editionService=t,this.router=o,this.editionViewTitle="Inhalt",this.editionViewId="awg-edition-view"}get editionRouteConstants(){return r}ngOnInit(){this.getSelectionsFromRoute(),this.routeToSidenav()}getSelectionsFromRoute(){this.selectedEditionSeries$=this.editionService.getSelectedEditionSeries().pipe(d(0)),this.selectedEditionSection$=this.editionService.getSelectedEditionSection().pipe(d(0)),this.selectedEditionComplex$=this.editionService.getEditionComplex().pipe(d(0)),this.isPrefaceView$=this.editionService.getIsPrefaceView().pipe(d(0)),this.isRowTableView$=this.editionService.getIsRowTableView().pipe(d(0))}routeToSidenav(){this.router.navigate([{outlets:{side:"editionInfo"}}],{preserveFragment:!0})}},E.ctorParameters=()=>[{type:s},{type:$}],E);O=e([i({selector:"awg-edition-view",template:Y,styles:[ee]})],O);var xe=[{path:"",component:O,children:[{path:"series",component:R},{path:"series/:id",component:I,children:[{path:"sections",component:w},{path:"section/:id",component:b},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:x,children:[{path:"",component:v,children:[{path:"intro",loadChildren:()=>import("./chunk-YC5XINKI.js").then(n=>n.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-BEBYKLQS.js").then(n=>n.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-E7CGASQP.js").then(n=>n.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-PGTQSKH4.js").then(n=>n.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]},{path:"preface",loadChildren:()=>import("./chunk-LYWENX5V.js").then(n=>n.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-KM3PG2U7.js").then(n=>n.EditionRowTablesModule)}]}],te=[O,x,v,w,b,R,I],M=class{};M=e([L({imports:[V.forChild(xe)],exports:[V]})],M);var ie=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
                                    editor of complex.complex.responsibilityStatement.editors;
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
                                <span class="version">{{ complex.complex.responsibilityStatement.lastModified }}</span>
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
`;var oe="";var S,k=(S=class{},S.propDecorators={complexes:[{type:_}]},S);k=e([i({selector:"awg-edition-complex-card",template:ie,changeDetection:N.OnPush,styles:[oe]})],k);var se=`<div
    class="p-5 bg-image text-white text-center awg-jumbotron-image shadow border rounded-3"
    style="background-image: url('https://mdbcdn.b-cdn.net/img/new/slides/041.webp')">
    <h1 id="{{ jumbotronId }}" class="mb-4">{{ jumbotronTitle }}</h1>
</div>
`;var ne="";var f,j=(f=class{},f.propDecorators={jumbotronId:[{type:_}],jumbotronTitle:[{type:_}]},f);j=e([i({selector:"awg-edition-jumbotron",template:se,changeDetection:N.OnPush,styles:[ne]})],j);var re=class{};re=e([L({imports:[G,M],declarations:[te,k,j]})],re);export{re as EditionViewModule};
