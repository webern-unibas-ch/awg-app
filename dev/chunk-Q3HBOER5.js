import{C as r,G as o,Ka as w,Na as E,R as t,Sb as y,T as i,Ub as m,W as p,h as C,q as x,qb as D,rc as I,y as v,ya as e}from"./chunk-UFEZXZ35.js";var R=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var O="";var s,S=(s=class{},s.propDecorators={complexes:[{type:i}]},s);S=e([t({selector:"awg-edition-section-detail-complex-card",template:R,changeDetection:o.OnPush,styles:[O]})],S);var b=`<awg-alert-info
    [infoMessage]="
        'Die Online-Edition wird in Bezug auf Umfang und Funktionalit\xE4t kontinuierlich erweitert.'
    "></awg-alert-info>
`;var L="";var _=class{};_=e([t({selector:"awg-edition-section-detail-disclaimer",template:b,changeDetection:o.OnPush,styles:[L]})],_);var N=`@if (selectedSeries && selectedSection) {
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
`;var U="";var c,f=(c=class{},c.propDecorators={selectedSeries:[{type:i}],selectedSection:[{type:i}]},c);f=e([t({selector:"awg-edition-section-detail-intro-card",template:N,changeDetection:o.OnPush,styles:[U]})],f);var M=`<awg-alert-info
    [infoMessage]="
        '[Diese Inhalte erscheinen im Zusammenhang der vollsta\u0308ndigen Edition von AWG ' +
        selectedSeries?.series.short +
        '/' +
        selectedSection?.section.short +
        '.]'
    "></awg-alert-info>
`;var T="";var a,h=(a=class{},a.propDecorators={selectedSeries:[{type:i}],selectedSection:[{type:i}]},a);h=e([t({selector:"awg-edition-section-detail-placeholder",template:M,changeDetection:o.OnPush,styles:[T]})],h);var G=`@if (selectedSection$ | async; as selectedSection) {
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
`;var $="";var d=class{constructor(){this.UTILS=r(D),this._editionStateService=r(m)}ngOnInit(){this.setupSectionDetailOverview()}setupSectionDetailOverview(){this.selectedSeries$=this._editionStateService.getSelectedEditionSeries(),this.selectedSection$=this._editionStateService.getSelectedEditionSection()}};d=e([t({selector:"awg-edition-section-detail-overview",template:G,changeDetection:o.OnPush,styles:[$]})],d);var k=`<router-outlet />
`;var A="";var l=class{constructor(){this._destroyed$=new C,this._editionStateService=r(m),this._route=r(w)}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){let F=this._route.snapshot.paramMap.get("id");this._editionStateService.getSelectedEditionSeries().pipe(v(this._destroyed$),x(g=>!!g)).subscribe(g=>{let B=g?.series?.route,H=y.getEditionSectionById(B,F);this._editionStateService.updateSelectedEditionSection(H)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}};l=e([t({selector:"awg-edition-section-detail",template:k,styles:[A]})],l);var oe=[{path:"",component:l,children:[{path:"intro",loadChildren:()=>import("./chunk-HZNUSZZD.js").then(n=>n.EditionIntroModule)},{path:"",component:d}]}],P=[l,d],u=class{};u=e([p({imports:[E.forChild(oe)],exports:[E]})],u);var j=class{};j=e([p({imports:[I,u],declarations:[S,_,f,h,P]})],j);export{j as EditionSectionDetailModule};
