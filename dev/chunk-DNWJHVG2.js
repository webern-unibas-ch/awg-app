import{a as g}from"./chunk-PP6HJ337.js";import{f as D}from"./chunk-YTAIMXM5.js";import{m as s}from"./chunk-4HMOHHU7.js";import{c as n,u as A}from"./chunk-HJINLW2S.js";import"./chunk-4ZDW7TQH.js";import{A as T,G as N,La as d,Ma as V,Oa as $,R as i,T as C,X as L,h as O,l as e,ob as P,s as j,x as a}from"./chunk-TSRZPXKZ.js";var B=`<!--
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
`;var H="";var c,x=(c=class{constructor(t,o,l){this.route=t,this.editionService=o,this.utils=l}get editionRouteConstants(){return n}ngOnInit(){this.getEditionComplexFromRoute()}getEditionComplexFromRoute(){this.route.paramMap.subscribe(t=>{let o=t.get("complexId")||"";this.editionService.updateEditionComplex(A[o.toUpperCase()]),this.selectedEditionComplex$=this.editionService.getEditionComplex().pipe(a(0))})}ngOnDestroy(){this.editionService.clearEditionComplex()}},c.ctorParameters=()=>[{type:d},{type:s},{type:D}],c);x=e([i({selector:"awg-edition-complex",template:B,styles:[H]})],x);var F=`@if (editionRouterLinkButtons) {
    <awg-router-link-button-group [routerLinkButtons]="editionRouterLinkButtons" [queryParamsHandling]="''">
    </awg-router-link-button-group>
}

<router-outlet />
`;var z="";var p,v=(p=class{constructor(t){this.editionService=t,this._destroyed$=new O}ngOnInit(){this.getEditionComplex()}getEditionComplex(){this.editionService.getEditionComplex().pipe(T(this._destroyed$)).subscribe({next:t=>{this.editionComplex=t,this.setButtons()}})}setButtons(){this.editionRouterLinkButtons=[new g(this.editionComplex.baseRoute,n.EDITION_INTRO.route,n.EDITION_INTRO.short,!1),new g(this.editionComplex.baseRoute,n.EDITION_SHEETS.route,n.EDITION_SHEETS.short,!1),new g(this.editionComplex.baseRoute,n.EDITION_REPORT.route,n.EDITION_REPORT.short,!1),new g(this.editionComplex.baseRoute,n.EDITION_GRAPH.route,n.EDITION_GRAPH.short,!1)]}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},p.ctorParameters=()=>[{type:s}],p);v=e([i({selector:"awg-edition-detail-nav",template:F,styles:[z]})],v);var J=`@if (editionOutline) {
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
`;var W="";var m,R=(m=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelections(),this.getEditionOutline()}clearSelections(){this.editionService.clearSelectedEditionSeries(),this.editionService.clearSelectedEditionSection()}getEditionOutline(){this.editionOutline=this.editionService.getEditionOutline()}},m.ctorParameters=()=>[{type:s}],m);R=e([i({selector:"awg-edition-series",template:J,styles:[W]})],R);var q=`<router-outlet />
`;var X="";var u,I=(u=class{constructor(t,o){this.route=t,this.editionService=o}ngOnInit(){this.getSeries()}getSeries(){let t=this.route.snapshot.paramMap.get("id");this.selectedSeries=this.editionService.getEditionSeriesById(t),this.editionService.updateSelectedEditionSeries(this.selectedSeries)}},u.ctorParameters=()=>[{type:d},{type:s}],u);I=e([i({selector:"awg-edition-series-detail",template:q,styles:[X]})],I);var Z=`@if (
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
`;var K="";var h,b=(h=class{constructor(t,o,l){this.route=t,this.editionService=o,this.utils=l,this._destroyed$=new O}ngOnInit(){this.getSection()}getSection(){let t=this.route.snapshot.paramMap.get("id");this.editionService.getSelectedEditionSeries().pipe(T(this._destroyed$),j(o=>!!o)).subscribe(o=>{this.selectedSeries=o;let l=o.series.route;this.selectedSection=this.editionService.getEditionSectionById(l,t),this.editionService.updateSelectedEditionSection(this.selectedSection)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},h.ctorParameters=()=>[{type:d},{type:s},{type:D}],h);b=e([i({selector:"awg-edition-section-detail",template:Z,styles:[K]})],b);var Q=`@if (selectedSeries$ | async; as selectedSeries) {
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
`;var Y="";var E,w=(E=class{constructor(t){this.editionService=t}ngOnInit(){this.clearSelectedSection(),this.getSeries()}getSeries(){this.selectedSeries$=this.editionService.getSelectedEditionSeries()}clearSelectedSection(){this.editionService.clearSelectedEditionSection()}},E.ctorParameters=()=>[{type:s}],E);w=e([i({selector:"awg-edition-sections",template:Q,styles:[Y]})],w);var ee=`<p>edition-type works!</p>

<router-outlet />
`;var te="";var M=class{};M=e([i({selector:"awg-edition-type",template:ee,styles:[te]})],M);var ie=`<!-- content: edition-view -->

<div>
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

    @if ((selectedEditionComplex$ | async) === null && (isRowTableView$ | async) === null) {
        <div class="awg-edition-series para">
            <h6 class="awg-edition-info-breadcrumb">
                @if (selectedEditionSeries$ | async; as selectedSeries) {
                    <a [routerLink]="[editionRouteConstants.SERIES.route]">
                        {{ editionRouteConstants.EDITION?.short }}
                    </a>
                } @else {
                    {{ editionRouteConstants.EDITION?.short }}
                }
                /
                @if (selectedEditionSeries$ | async; as selectedSeries) {
                    <span>
                        @if (selectedEditionSection$ | async; as selectedSection) {
                            <a [routerLink]="['./series', selectedSeries.series.route]">
                                {{ selectedSeries?.series.full }}
                            </a>
                        } @else {
                            {{ selectedSeries?.series.full }}
                        }
                        /
                    </span>
                }
                @if (selectedEditionSection$ | async; as selectedSection) {
                    <span>
                        {{ selectedSection?.section.full }}
                    </span>
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
`;var oe="";var S,y=(S=class{constructor(t,o,l){this.editionService=t,this.route=o,this.router=l,this.editionViewTitle="Inhalt",this.editionViewId="awg-edition-view"}get editionRouteConstants(){return n}ngOnInit(){this.getSelectionsFromRoute(),this.routeToSidenav()}getSelectionsFromRoute(){this.selectedEditionSeries$=this.editionService.getSelectedEditionSeries().pipe(a(0)),this.selectedEditionSection$=this.editionService.getSelectedEditionSection().pipe(a(0)),this.selectedEditionComplex$=this.editionService.getEditionComplex().pipe(a(0)),this.isRowTableView$=this.editionService.getIsRowTableView().pipe(a(0))}routeToSidenav(){this.router.navigate([{outlets:{side:"editionInfo"}}],{preserveFragment:!0})}},S.ctorParameters=()=>[{type:s},{type:d},{type:V}],S);y=e([i({selector:"awg-edition-view",template:ie,styles:[oe]})],y);var we=[{path:"",component:y,children:[{path:"series",component:R},{path:"series/:id",component:I,children:[{path:"sections",component:w},{path:"section/:id",component:b},{path:"sections/:id",redirectTo:"section/:id",pathMatch:"full"},{path:"",redirectTo:"sections",pathMatch:"full"}]},{path:"composition",redirectTo:"complex",pathMatch:"prefix"},{path:"complex/:complexId",component:x,children:[{path:"",component:v,children:[{path:"intro",loadChildren:()=>import("./chunk-R2U7VAN6.js").then(r=>r.EditionIntroModule)},{path:"sheets",loadChildren:()=>import("./chunk-46KDAB6P.js").then(r=>r.EditionSheetsModule)},{path:"report",loadChildren:()=>import("./chunk-KJZGN2V7.js").then(r=>r.EditionReportModule)},{path:"graph",loadChildren:()=>import("./chunk-JVN5EZ43.js").then(r=>r.EditionGraphModule)},{path:"",redirectTo:"sheets",pathMatch:"full"}]}]},{path:"row-tables",loadChildren:()=>import("./chunk-UVUCUWIC.js").then(r=>r.EditionRowTablesModule)}]}],se=[y,x,v,w,b,R,I,M],k=class{};k=e([L({imports:[$.forChild(we)],exports:[$]})],k);var ne=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var re="";var f,U=(f=class{},f.propDecorators={complexes:[{type:C}]},f);U=e([i({selector:"awg-edition-complex-card",template:ne,changeDetection:N.OnPush,styles:[re]})],U);var de=`<div
    class="p-5 bg-image text-white text-center awg-jumbotron-image shadow border rounded-3"
    style="background-image: url('https://mdbcdn.b-cdn.net/img/new/slides/041.webp')">
    <h1 id="{{ jumbotronId }}" class="mb-4">{{ jumbotronTitle }}</h1>
</div>
`;var le="";var _,G=(_=class{},_.propDecorators={jumbotronId:[{type:C}],jumbotronTitle:[{type:C}]},_);G=e([i({selector:"awg-edition-jumbotron",template:de,changeDetection:N.OnPush,styles:[le]})],G);var ae=class{};ae=e([L({imports:[P,k],declarations:[se,U,G]})],ae);export{ae as EditionViewModule};
