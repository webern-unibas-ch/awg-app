import{a as R}from"./chunk-GYSG6DRK.js";import{n as y}from"./chunk-X4QJDBRK.js";import{O as L,R as _}from"./chunk-IKWMRWX7.js";import{c as I,i as E}from"./chunk-DPKB5SVI.js";import"./chunk-PGZWJU43.js";import"./chunk-FJWL4MQU.js";import"./chunk-FDGTDPK3.js";import{F as v,Ua as t,V as D,W as w,Wa as n,Za as m,da as d,k as g,o as e,u as p,v as x,xa as o}from"./chunk-6QPGRHX6.js";var O=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
                                        <a [href]="editor.homepage">{{ editor.name }}</a>
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
`;var b="";var S=class{static{this.propDecorators={complexes:[{type:n}]}}};S=e([t({selector:"awg-edition-section-detail-complex-card",template:O,changeDetection:o.OnPush,standalone:!1,styles:[b]})],S);var M=`<awg-alert-info
    [infoMessage]="'Die Online-Edition wird in Bezug auf Umfang und Funktionalit\xE4t kontinuierlich erweitert.'" />
`;var U="";var f=class{};f=e([t({selector:"awg-edition-section-detail-disclaimer",template:M,changeDetection:o.OnPush,standalone:!1,styles:[U]})],f);var N=`@if (selectedSeries && selectedSection) {
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
`;var T="";var h=class{static{this.propDecorators={selectedSeries:[{type:n}],selectedSection:[{type:n}]}}};h=e([t({selector:"awg-edition-section-detail-intro-card",template:N,changeDetection:o.OnPush,standalone:!1,styles:[T]})],h);var G=`<awg-alert-info
    [infoMessage]="
        '[Diese Inhalte erscheinen im Zusammenhang der vollst\xE4ndigen Edition von AWG ' +
        selectedSeries?.series.short +
        '/' +
        selectedSection?.section.short +
        '.]'
    " />
`;var P="";var u=class{static{this.propDecorators={selectedSeries:[{type:n}],selectedSection:[{type:n}]}}};u=e([t({selector:"awg-edition-section-detail-placeholder",template:G,changeDetection:o.OnPush,standalone:!1,styles:[P]})],u);var k=`@if (editionData$ | async; as data) {
    @let content = data.section?.content;
    @let opusList = content?.complexTypes?.opus;
    @let mnrList = content?.complexTypes?.mnr;

    @if (UTILS.isEmptyArray(opusList) && UTILS.isEmptyArray(mnrList)) {
        <awg-edition-section-detail-placeholder [selectedSeries]="data.series" [selectedSection]="data.section" />
    } @else {
        <div class="awg-edition-section-detail">
            <awg-edition-section-detail-disclaimer />

            @if (!content?.intro.disabled) {
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
            @if (!UTILS.isEmptyArray(opusList)) {
                <div class="awg-edition-section-detail-opus para p-3 shadow border rounded-3">
                    <h5>nach Opusnummer:</h5>
                    <awg-edition-section-detail-complex-card [complexes]="opusList" />
                </div>
            }
            @if (!UTILS.isEmptyArray(mnrList)) {
                <div class="awg-edition-section-detail-mnr p-3 shadow border rounded-3">
                    <h5>nach Moldenhauer-Nummer:</h5>
                    <awg-edition-section-detail-complex-card [complexes]="mnrList" />
                </div>
            }
        </div>
    }
}
`;var A="";var c=class{constructor(){this.UTILS=R,this._editionStateService=d(_)}ngOnInit(){this.setupSectionDetailOverview()}setupSectionDetailOverview(){this.editionData$=x([this._editionStateService.getSelectedEditionSeries(),this._editionStateService.getSelectedEditionSection()]).pipe(p(([r,s])=>({series:r,section:s})))}};c=e([t({selector:"awg-edition-section-detail-overview",template:k,changeDetection:o.OnPush,standalone:!1,styles:[A]})],c);var $=`<router-outlet />
`;var j="";var l=class{constructor(){this._destroyed$=new g,this._editionStateService=d(_),this._route=d(I)}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){this._route.paramMap.pipe(w(this._destroyed$),D(r=>{let s=r.get("id");return this._editionStateService.getSelectedEditionSeries().pipe(v(a=>!!a),p(a=>({seriesId:a?.series?.route,sectionId:s})))})).subscribe({next:({seriesId:r,sectionId:s})=>{let a=L.getEditionSectionById(r,s);this._editionStateService.updateSelectedEditionSection(a)}})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}};l=e([t({selector:"awg-edition-section-detail",template:$,standalone:!1,styles:[j]})],l);var te=[{path:"",component:l,children:[{path:"intro",loadChildren:()=>import("./chunk-HXIN3G3O.js").then(i=>i.EditionIntroModule)},{path:"",component:c}]}],F=[l,c],C=class{};C=e([m({imports:[E.forChild(te)],exports:[E]})],C);var B=class{};B=e([m({imports:[y,C],declarations:[S,f,h,u,F]})],B);export{B as EditionSectionDetailModule};
