import{f as I}from"./chunk-OBTV6KD4.js";import"./chunk-TAW2325W.js";import{m as O,o as f}from"./chunk-WXC5S4UM.js";import{B as w,Ca as e,I as o,Oa as D,Ra as x,T as t,V as i,Z as _,h as v,s as y,tb as R}from"./chunk-VFHTK4A5.js";var b=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var N="";var r,h=(r=class{},r.propDecorators={complexes:[{type:i}]},r);h=e([t({selector:"awg-edition-section-detail-complex-card",template:b,changeDetection:o.OnPush,styles:[N]})],h);var L=`<awg-alert-info
    [infoMessage]="
        'Die Online-Edition wird in Bezug auf Umfang und Funktionalit\xE4t kontinuierlich erweitert.'
    "></awg-alert-info>
`;var M="";var u=class{};u=e([t({selector:"awg-edition-section-detail-disclaimer",template:L,changeDetection:o.OnPush,styles:[M]})],u);var U=`@if (selectedSeries && selectedSection) {
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
`;var G="";var s,g=(s=class{},s.propDecorators={selectedSeries:[{type:i}],selectedSection:[{type:i}]},s);g=e([t({selector:"awg-edition-section-detail-intro-card",template:U,changeDetection:o.OnPush,styles:[G]})],g);var T=`<awg-alert-info
    [infoMessage]="
        '[Diese Inhalte erscheinen im Zusammenhang der vollsta\u0308ndigen Edition von AWG ' +
        selectedSeries?.series.short +
        '/' +
        selectedSection?.section.short +
        '.]'
    "></awg-alert-info>
`;var $="";var c,E=(c=class{},c.propDecorators={selectedSeries:[{type:i}],selectedSection:[{type:i}]},c);E=e([t({selector:"awg-edition-section-detail-placeholder",template:T,changeDetection:o.OnPush,styles:[$]})],E);var P=`@if (selectedSection$ | async; as selectedSection) {
    @if (
        utils.isNotEmptyArray(selectedSection?.content?.complexTypes?.opus) ||
        utils.isNotEmptyArray(selectedSection?.content?.complexTypes?.mnr)
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
            @if (utils.isNotEmptyArray(selectedSection?.content?.complexTypes?.opus)) {
                <div class="awg-edition-section-detail-opus para p-3 shadow border rounded-3">
                    <h5>nach Opusnummer:</h5>
                    <awg-edition-section-detail-complex-card
                        [complexes]="
                            selectedSection.content.complexTypes.opus
                        "></awg-edition-section-detail-complex-card>
                </div>
            }
            @if (utils.isNotEmptyArray(selectedSection?.content?.complexTypes?.mnr)) {
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
`;var k="";var a,p=(a=class{constructor(l,n){this.editionStateService=l,this.utils=n}ngOnInit(){this.setupSectionDetailOverview()}setupSectionDetailOverview(){this.selectedSeries$=this.editionStateService.getSelectedEditionSeries(),this.selectedSection$=this.editionStateService.getSelectedEditionSection()}},a.ctorParameters=()=>[{type:f},{type:I}],a);p=e([t({selector:"awg-edition-section-detail-overview",template:P,changeDetection:o.OnPush,styles:[k]})],p);var A=`<router-outlet />
`;var F="";var d,m=(d=class{constructor(l,n){this.route=l,this.editionStateService=n,this._destroyed$=new v}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){let l=this.route.snapshot.paramMap.get("id");this.editionStateService.getSelectedEditionSeries().pipe(w(this._destroyed$),y(n=>!!n)).subscribe(n=>{let j=n?.series?.route,z=O.getEditionSectionById(j,l);this.editionStateService.updateSelectedEditionSection(z)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},d.ctorParameters=()=>[{type:D},{type:f}],d);m=e([t({selector:"awg-edition-section-detail",template:A,styles:[F]})],m);var ie=[{path:"",component:m,children:[{path:"intro",loadChildren:()=>import("./chunk-3EDTS7IL.js").then(S=>S.EditionIntroModule)},{path:"",component:p}]}],B=[m,p],C=class{};C=e([_({imports:[x.forChild(ie)],exports:[x]})],C);var H=class{};H=e([_({imports:[R,C],declarations:[h,u,g,E,B]})],H);export{H as EditionSectionDetailModule};
