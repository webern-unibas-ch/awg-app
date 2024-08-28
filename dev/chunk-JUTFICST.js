import{a as x}from"./chunk-PP6HJ337.js";import{f as D}from"./chunk-4QEUJVOL.js";import"./chunk-UHEWK5QQ.js";import{b as r,i as B,n as c,z as n}from"./chunk-BW4OISKU.js";import{A as N,G as L,La as a,Ma as P,Oa as V,R as i,T as g,X as M,h as y,k as U,l as e,ob as A,s as G,x as l}from"./chunk-E6VRQLW7.js";var F=`<!--
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
`;var H="";var p,v=(p=class{constructor(t,o,d){this.route=t,this.editionService=o,this.utils=d}get editionRouteConstants(){return r}ngOnInit(){this.updateEditionComplexFromRoute()}updateEditionComplexFromRoute(){this.route.paramMap.subscribe(t=>{let o=t.get("complexId")||"",d=B.getEditionComplexById(o.toUpperCase());d?(this.editionService.updateSelectedEditionComplex(d),this.selectedEditionComplex$=this.editionService.getSelectedEditionComplex().pipe(l(0))):this.selectedEditionComplex$=U})}ngOnDestroy(){this.editionService.clearSelectedEditionComplex()}},p.ctorParameters=()=>[{type:a},{type:n},{type:D}],p);v=e([i({selector:"awg-edition-complex",template:F,styles:[H]})],v);var J=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''">
    </awg-router-link-button-group>
}

<router-outlet />
`;var z="";var m,R=(m=class{constructor(t){this.editionService=t,this._destroyed$=new y}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this.editionService.getSelectedEditionComplex().pipe(N(this._destroyed$)).subscribe({next:t=>{this.editionComplex=t,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new x(this.editionComplex.baseRoute,r.EDITION_INTRO.route,r.EDITION_INTRO.short,!1),new x(this.editionComplex.baseRoute,r.EDITION_SHEETS.route,r.EDITION_SHEETS.short,!1),new x(this.editionComplex.baseRoute,r.EDITION_REPORT.route,r.EDITION_REPORT.short,!1),new x(this.editionComplex.baseRoute,r.EDITION_GRAPH.route,r.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},m.ctorParameters=()=>[{type:n}],m);R=e([i({selector:"awg-edition-detail-nav",template:J,styles:[z]})],R);var W=`@if (editionOutline) {
    <div class="row row-cols-1 row-cols-md-3 g-4">
        @for (series of editionOutline; track $index) {
            <div class="col">
                <div class="card h-100 shadow">
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
`;var q="";var u,I=(u=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this.editionService.clearSelectedEditionSeries(),this.editionService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=c.getEditionOutline()}},u.ctorParameters=()=>[{type:n}],u);I=e([i({selector:"awg-edition-series",template:W,styles:[q]})],I);var Y=`<router-outlet />
`;var Z="";var h,b=(h=class{constructor(t,o){this.route=t,this.editionService=o}ngOnInit(){this.updateSeriesFromRoute()}updateSeriesFromRoute(){let t=this.route.snapshot.paramMap.get("id");this.selectedSeries=c.getEditionSeriesById(t),this.editionService.updateSelectedEditionSeries(this.selectedSeries)}},h.ctorParameters=()=>[{type:a},{type:n}],h);b=e([i({selector:"awg-edition-series-detail",template:Y,styles:[Z]})],b);var K=`@if (
    selectedSection &&
    utils.isNotEmptyObject(selectedSection.complexTypes) &&
    (utils.isNotEmptyArray(selectedSection.complexTypes.opus) ||
        utils.isNotEmptyArray(selectedSection.complexTypes.mnr))
) {
    <div class="awg-edition-section-detail">
        @if (utils.isNotEmptyArray(selectedSection.complexTypes.opus)) {
            <div class="awg-edition-section-detail-opus para p-3 shadow border rounded-3">
                <h5>nach Opusnummer:</h5>
                <awg-edition-complex-card [complexes]="selectedSection.complexTypes.opus"></awg-edition-complex-card>
            </div>
        }
        @if (utils.isNotEmptyArray(selectedSection.complexTypes.mnr)) {
            <div class="awg-edition-section-detail-mnr p-3 shadow border rounded-3">
                <h5>nach Moldenhauer-Nummer:</h5>
                <awg-edition-complex-card [complexes]="selectedSection.complexTypes.mnr"></awg-edition-complex-card>
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
`;var Q="";var E,w=(E=class{constructor(t,o,d){this.route=t,this.editionService=o,this.utils=d,this._destroyed$=new y}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){let t=this.route.snapshot.paramMap.get("id");this.editionService.getSelectedEditionSeries().pipe(N(this._destroyed$),G(o=>!!o)).subscribe(o=>{this.selectedSeries=o;let d=o.series.route;this.selectedSection=c.getEditionSectionById(d,t),this.editionService.updateSelectedEditionSection(this.selectedSection)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},E.ctorParameters=()=>[{type:a},{type:n},{type:D}],E);w=e([i({selector:"awg-edition-section-detail",template:K,styles:[Q]})],w);var X=`@if (selectedSeries$ | async; as selectedSeries) {
    <div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
        @for (section of selectedSeries.sections; track $index) {
            <div class="col">
                <div class="card h-100 shadow">
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
`;var ee="";var S,T=(S=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelectedSection(),this.getSeries()}clearSelectedSection(){this.editionService.clearSelectedEditionSection()}getSeries(){this.selectedSeries$=this.editionService.getSelectedEditionSeries()}},S.ctorParameters=()=>[{type:n}],S);T=e([i({selector:"awg-edition-sections",template:X,styles:[ee]})],T);var te=`<!-- content: edition-view -->

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

    <!-- edition routes -->
    <router-outlet />
</div>
`;var ie="";var f,O=(f=class{constructor(t,o){this.editionService=t,this.router=o,this.editionViewTitle="Inhalt",this.editionViewId="awg-edition-view"}get editionRouteConstants(){return r}ngOnInit(){this.setupEditionView(),this.routeToSidenav()}setupEditionView(){this.selectedEditionSeries$=this.editionService.getSelectedEditionSeries().pipe(l(0)),this.selectedEditionSection$=this.editionService.getSelectedEditionSection().pipe(l(0)),this.selectedEditionComplex$=this.editionService.getSelectedEditionComplex().pipe(l(0)),this.isPrefaceView$=this.editionService.getIsPrefaceView().pipe(l(0)),this.isRowTableView$=this.editionService.getIsRowTableView().pipe(l(0))}routeToSidenav(){this.router.navigate([{outlets:{side:"editionInfo"}}],{preserveFragment:!0})}},f.ctorParameters=()=>[{type:n},{type:P}],f);O=e([i({selector:"awg-edition-view",template:te,styles:[ie]})],O);var Re=[{path:"",component:O,children:[{path:"series",component:I},{path:"series/:id",component:b,children:[{path:"sections",component:T},{path:"section/:id",component:w},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:v,children:[{path:"",component:R,children:[{path:"intro",loadChildren:()=>import("./chunk-SXHWTPZJ.js").then(s=>s.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-S6HUGOFP.js").then(s=>s.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-CPQ4GUGS.js").then(s=>s.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-XBAL4ZZ3.js").then(s=>s.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]},{path:"preface",loadChildren:()=>import("./chunk-2AJSDDET.js").then(s=>s.EditionPrefaceModule)},{path:"row-tables",loadChildren:()=>import("./chunk-7SGBXYJQ.js").then(s=>s.EditionRowTablesModule)}]}],oe=[O,v,R,T,w,I,b],k=class{};k=e([M({imports:[V.forChild(Re)],exports:[V]})],k);var ne=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var se="";var _,j=(_=class{},_.propDecorators={complexes:[{type:g}]},_);j=e([i({selector:"awg-edition-complex-card",template:ne,changeDetection:L.OnPush,styles:[se]})],j);var re=`<div class="p-3 pt-4 text-center shadow border rounded-3 awg-jumbotron">
    <h3 id="{{ jumbotronId }}" [innerHTML]="jumbotronTitle"></h3>
</div>
`;var de="";var C,$=(C=class{},C.propDecorators={jumbotronId:[{type:g}],jumbotronTitle:[{type:g}]},C);$=e([i({selector:"awg-edition-jumbotron",template:re,changeDetection:L.OnPush,styles:[de]})],$);var le=class{};le=e([M({imports:[A,k],declarations:[oe,j,$]})],le);export{le as EditionViewModule};
