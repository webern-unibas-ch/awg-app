import{f as I}from"./chunk-ANIAX7UL.js";import"./chunk-CWFJFFOQ.js";import{n as O,p as f}from"./chunk-5F46XBGR.js";import{B as w,Ca as e,I as n,Oa as D,Ra as C,T as t,V as o,Z as _,h as g,rb as R,s as y}from"./chunk-W2TAS6DV.js";var b=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var N="";var r,u=(r=class{},r.propDecorators={complexes:[{type:o}]},r);u=e([t({selector:"awg-edition-section-detail-complex-card",template:b,changeDetection:n.OnPush,styles:[N]})],u);var L=`<div class="alert alert-info" role="alert">
    <p class="no-para text-muted text-center small">
        [Die online verf\xFCgbaren Inhalte werden sukzessive erg\xE4nzt und erweitert.]
    </p>
</div>
`;var M="";var h=class{};h=e([t({selector:"awg-edition-section-detail-disclaimer",template:L,styles:[M]})],h);var U=`@if (selectedSeries && selectedSection) {
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
`;var G="";var s,E=(s=class{},s.propDecorators={selectedSeries:[{type:o}],selectedSection:[{type:o}]},s);E=e([t({selector:"awg-edition-section-detail-intro-card",template:U,changeDetection:n.OnPush,styles:[G]})],E);var T=`<div class="alert alert-info" role="alert">
    <p class="no-para text-muted text-center">
        [Diese Inhalte erscheinen im Zusammenhang der vollsta\u0308ndigen Edition von AWG
        {{ selectedSeries?.series.short }}/{{ selectedSection?.section.short }}.]
    </p>
</div>
`;var $="";var c,x=(c=class{},c.propDecorators={selectedSeries:[{type:o}],selectedSection:[{type:o}]},c);x=e([t({selector:"awg-edition-section-detail-placeholder",template:T,styles:[$]})],x);var A=`@if (selectedSection$ | async; as selectedSection) {
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
`;var P="";var d,p=(d=class{constructor(l,i){this.editionStateService=l,this.utils=i}ngOnInit(){this.setupSectionDetailOverview()}setupSectionDetailOverview(){this.selectedSeries$=this.editionStateService.getSelectedEditionSeries(),this.selectedSection$=this.editionStateService.getSelectedEditionSection()}},d.ctorParameters=()=>[{type:f},{type:I}],d);p=e([t({selector:"awg-edition-section-detail-overview",template:A,changeDetection:n.OnPush,styles:[P]})],p);var k=`<router-outlet />
`;var z="";var a,m=(a=class{constructor(l,i){this.route=l,this.editionStateService=i,this._destroyed$=new g}ngOnInit(){this.updateSectionFromRoute()}updateSectionFromRoute(){let l=this.route.snapshot.paramMap.get("id");this.editionStateService.getSelectedEditionSeries().pipe(w(this._destroyed$),y(i=>!!i)).subscribe(i=>{let j=i?.series?.route,B=O.getEditionSectionById(j,l);this.editionStateService.updateSelectedEditionSection(B)})}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},a.ctorParameters=()=>[{type:D},{type:f}],a);m=e([t({selector:"awg-edition-section-detail",template:k,styles:[z]})],m);var ie=[{path:"",component:m,children:[{path:"intro",loadChildren:()=>import("./chunk-BDJ6Q23D.js").then(S=>S.EditionIntroModule)},{path:"",component:p}]}],F=[m,p],v=class{};v=e([_({imports:[C.forChild(ie)],exports:[C]})],v);var H=class{};H=e([_({imports:[R,v],declarations:[u,h,E,x,F]})],H);export{H as EditionSectionDetailModule};
