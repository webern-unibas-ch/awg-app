import{D as r,Ka as g,M as o,Na as h,Rb as v,S as t,Tb as d,U as n,X as c,h as u,j as e,pb as x,qc as D,r as C,z as E}from"./chunk-HQO2XKMF.js";var w=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var y="";var l=class{static{this.propDecorators={complexes:[{type:n}]}}};l=e([t({selector:"awg-edition-section-detail-complex-card",template:w,changeDetection:o.OnPush,standalone:!1,styles:[y]})],l);var I=`<awg-alert-info
    [infoMessage]="
        'Die Online-Edition wird in Bezug auf Umfang und Funktionalit\xE4t kontinuierlich erweitert.'
    "></awg-alert-info>
`;var R="";var p=class{};p=e([t({selector:"awg-edition-section-detail-disclaimer",template:I,changeDetection:o.OnPush,standalone:!1,styles:[R]})],p);var O=`@if (selectedSeries && selectedSection) {
    <div class="card awg-edition-card h-100">
        <h5 class="card-header">
            <span class="awg-edition-info-header-title" [innerHTML]="'Einleitung'"></span>
        </h5>
        <div class="card-body d-flex flex-column">
            <p class="card-text">{{ selectedSection?.content?.intro.preview }} \u2026</p>
        </div>
        <div class="card-footer d-flex flex-column">
            <p class="mt-auto text-end">
                <a
                    [routerLink]="[
                        '/edition',
                        'series',
                        selectedSeries?.series.route,
                        'section',
                        selectedSection?.section.route,
                        'intro',
                    ]"
                    class="btn btn-outline-info"
                    [ngClass]="{ disabled: selectedSection?.content?.intro.disabled }"
                    >Mehr ...
                </a>
            </p>
        </div>
    </div>
}
`;var b="";var m=class{static{this.propDecorators={selectedSeries:[{type:n}],selectedSection:[{type:n}]}}};m=e([t({selector:"awg-edition-section-detail-intro-card",template:O,changeDetection:o.OnPush,standalone:!1,styles:[b]})],m);var L=`<awg-alert-info
    [infoMessage]="
        '[Diese Inhalte erscheinen im Zusammenhang der vollsta\u0308ndigen Edition von AWG ' +
        selectedSeries?.series.short +
        '/' +
        selectedSection?.section.short +
        '.]'
    "></awg-alert-info>
`;var N="";var S=class{static{this.propDecorators={selectedSeries:[{type:n}],selectedSection:[{type:n}]}}};S=e([t({selector:"awg-edition-section-detail-placeholder",template:L,changeDetection:o.OnPush,standalone:!1,styles:[N]})],S);var U=`@if (selectedSection$ | async; as selectedSection) {
    @if (
        UTILS.isNotEmptyArray(selectedSection?.content?.complexTypes?.opus) ||
        UTILS.isNotEmptyArray(selectedSection?.content?.complexTypes?.mnr)
    ) {
        <div class="awg-edition-section-detail">
            <awg-edition-section-detail-disclaimer></awg-edition-section-detail-disclaimer>

            @if (!selectedSection?.content?.intro.disabled) {
                <div class="awg-edition-section-detail-intro para p-3 shadow border rounded-3">
                    <div class="row">
                        <div class="col-12 col-xl-8">
                            <awg-edition-section-detail-intro-card
                                [selectedSeries]="selectedSeries$ | async"
                                [selectedSection]="selectedSection"></awg-edition-section-detail-intro-card>
                        </div>
                    </div>
                </div>
            }
            @if (UTILS.isNotEmptyArray(selectedSection?.content?.complexTypes?.opus)) {
                <div class="awg-edition-section-detail-opus para p-3 shadow border rounded-3">
                    <h5>nach Opusnummer:</h5>
                    <awg-edition-section-detail-complex-card
                        [complexes]="
                            selectedSection.content.complexTypes.opus
                        "></awg-edition-section-detail-complex-card>
                </div>
            }
            @if (UTILS.isNotEmptyArray(selectedSection?.content?.complexTypes?.mnr)) {
                <div class="awg-edition-section-detail-mnr p-3 shadow border rounded-3">
                    <h5>nach Moldenhauer-Nummer:</h5>
                    <awg-edition-section-detail-complex-card
                        [complexes]="
                            selectedSection.content.complexTypes.mnr
                        "></awg-edition-section-detail-complex-card>
                </div>
            }
        </div>
    } @else {
        <awg-edition-section-detail-placeholder
            [selectedSeries]="selectedSeries$ | async"
            [selectedSection]="selectedSection"></awg-edition-section-detail-placeholder>
    }
}
`;var M="";var s=class{constructor(){this.UTILS=r(x),this._editionStateService=r(d)}ngOnInit(){this.setupSectionDetailOverview()}setupSectionDetailOverview(){this.selectedSeries$=this._editionStateService.getSelectedEditionSeries(),this.selectedSection$=this._editionStateService.getSelectedEditionSection()}};s=e([t({selector:"awg-edition-section-detail-overview",template:U,changeDetection:o.OnPush,standalone:!1,styles:[M]})],s);var T=`<router-outlet />
`;var G="";var a=class{constructor(){this._destroyed$=new u,this._editionStateService=r(d),this._route=r(g)}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){let k=this._route.snapshot.paramMap.get("id");this._editionStateService.getSelectedEditionSeries().pipe(E(this._destroyed$),C(f=>!!f)).subscribe(f=>{let A=f?.series?.route,j=v.getEditionSectionById(A,k);this._editionStateService.updateSelectedEditionSection(j)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}};a=e([t({selector:"awg-edition-section-detail",template:T,standalone:!1,styles:[G]})],a);var Y=[{path:"",component:a,children:[{path:"intro",loadChildren:()=>import("./chunk-NSKTTIWF.js").then(i=>i.EditionIntroModule)},{path:"",component:s}]}],$=[a,s],_=class{};_=e([c({imports:[h.forChild(Y)],exports:[h]})],_);var P=class{};P=e([c({imports:[D,_],declarations:[l,p,m,S,$]})],P);export{P as EditionSectionDetailModule};
