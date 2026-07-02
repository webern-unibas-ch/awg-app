import{a as O}from"./chunk-OSFKXW5U.js";import{m as I}from"./chunk-R5RLJUTP.js";import{na as R,qa as _}from"./chunk-2REUTTIV.js";import{c as y,i as E}from"./chunk-KZ4WOI5Q.js";import"./chunk-W3U75S6H.js";import"./chunk-C6DFHTG3.js";import"./chunk-3CTZTA23.js";import"./chunk-CSLMBFJE.js";import{Ca as o,F as v,V as D,W as w,ea as r,k as g,o as e,sb as t,u as p,ub as n,v as x,yb as m}from"./chunk-BZ45EVRY.js";var b=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
                                <span class="version">{{
                                    complex.complex.respStatement.lastModified === '---'
                                        ? '---'
                                        : (complex.complex.respStatement.lastModified | date: 'longDate')
                                }}</span>
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
`;var L="";var S=class{static{this.propDecorators={complexes:[{type:n}]}}};S=e([t({selector:"awg-edition-section-detail-complex-card",template:b,changeDetection:o.OnPush,standalone:!1,styles:[L]})],S);var M=`<awg-alert-info
    [infoMessage]="'Die Online-Edition wird in Bezug auf Umfang und Funktionalit\xE4t kontinuierlich erweitert.'" />
`;var N="";var f=class{};f=e([t({selector:"awg-edition-section-detail-disclaimer",template:M,changeDetection:o.OnPush,standalone:!1,styles:[N]})],f);var U=`@if (selectedSeries && selectedSection) {
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
`;var T="";var h=class{static{this.propDecorators={selectedSeries:[{type:n}],selectedSection:[{type:n}]}}};h=e([t({selector:"awg-edition-section-detail-intro-card",template:U,changeDetection:o.OnPush,standalone:!1,styles:[T]})],h);var G=`<awg-alert-info
    [infoMessage]="
        '[Diese Inhalte erscheinen im Zusammenhang der vollst\xE4ndigen Edition von AWG ' +
        selectedSeries?.series.short +
        '/' +
        selectedSection?.section.short +
        '.]'
    " />
`;var P="";var u=class{static{this.propDecorators={selectedSeries:[{type:n}],selectedSection:[{type:n}]}}};u=e([t({selector:"awg-edition-section-detail-placeholder",template:G,changeDetection:o.OnPush,standalone:!1,styles:[P]})],u);var k=`@if (editionData$ | async; as data) {
    @if (
        UTILS.isNotEmptyArray(data.section?.content?.complexTypes?.opus) ||
        UTILS.isNotEmptyArray(data.section?.content?.complexTypes?.mnr)
    ) {
        <div class="awg-edition-section-detail">
            <awg-edition-section-detail-disclaimer />

            @if (!data.section?.content?.intro.disabled) {
                <div class="awg-edition-section-detail-intro para p-3 shadow border rounded-3">
                    <div class="row">
                        <div class="col-12 col-xl-8">
                            <awg-edition-section-detail-intro-card
                                [selectedSeries]="data.series"
                                [selectedSection]="data.section" />
                        </div>
                    </div>
                </div>
            }
            @if (UTILS.isNotEmptyArray(data.section?.content?.complexTypes?.opus)) {
                <div class="awg-edition-section-detail-opus para p-3 shadow border rounded-3">
                    <h5>nach Opusnummer:</h5>
                    <awg-edition-section-detail-complex-card [complexes]="data.section.content.complexTypes.opus" />
                </div>
            }
            @if (UTILS.isNotEmptyArray(data.section?.content?.complexTypes?.mnr)) {
                <div class="awg-edition-section-detail-mnr p-3 shadow border rounded-3">
                    <h5>nach Moldenhauer-Nummer:</h5>
                    <awg-edition-section-detail-complex-card [complexes]="data.section.content.complexTypes.mnr" />
                </div>
            }
        </div>
    } @else {
        <awg-edition-section-detail-placeholder [selectedSeries]="data.series" [selectedSection]="data.section" />
    }
}
`;var A="";var c=class{constructor(){this.UTILS=r(O),this._editionStateService=r(_)}ngOnInit(){this.setupSectionDetailOverview()}setupSectionDetailOverview(){this.editionData$=x([this._editionStateService.getSelectedEditionSeries(),this._editionStateService.getSelectedEditionSection()]).pipe(p(([a,s])=>({series:a,section:s})))}};c=e([t({selector:"awg-edition-section-detail-overview",template:k,changeDetection:o.OnPush,standalone:!1,styles:[A]})],c);var $=`<router-outlet />
`;var j="";var l=class{constructor(){this._destroyed$=new g,this._editionStateService=r(_),this._route=r(y)}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){this._route.paramMap.pipe(w(this._destroyed$),D(a=>{let s=a.get("id");return this._editionStateService.getSelectedEditionSeries().pipe(v(d=>!!d),p(d=>({seriesId:d?.series?.route,sectionId:s})))})).subscribe({next:({seriesId:a,sectionId:s})=>{let d=R.getEditionSectionById(a,s);this._editionStateService.updateSelectedEditionSection(d)}})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}};l=e([t({selector:"awg-edition-section-detail",template:$,standalone:!1,styles:[j]})],l);var te=[{path:"",component:l,children:[{path:"intro",loadChildren:()=>import("./chunk-IL2Y6URJ.js").then(i=>i.EditionIntroModule)},{path:"",component:c}]}],F=[l,c],C=class{};C=e([m({imports:[E.forChild(te)],exports:[E]})],C);var B=class{};B=e([m({imports:[I,C],declarations:[S,f,h,u,F]})],B);export{B as EditionSectionDetailModule};
