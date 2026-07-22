import{a as v}from"./chunk-GYSG6DRK.js";import{p as x}from"./chunk-2YX547QS.js";import{O as D,R as c}from"./chunk-WAXSJXVR.js";import{i as f}from"./chunk-HGSXQJIU.js";import"./chunk-WSKUQSIZ.js";import"./chunk-5SOH7MKA.js";import"./chunk-32WF2V76.js";import{Va as t,Xa as o,_a as d,cb as C,da as r,gb as g,o as e,oa as E,xa as i}from"./chunk-GSPESANJ.js";var I=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var w="";var l=class{static{this.propDecorators={complexes:[{type:o}]}}};l=e([t({selector:"awg-edition-section-detail-complex-card",template:I,changeDetection:i.OnPush,standalone:!1,styles:[w]})],l);var L=`<awg-alert-info
    [infoMessage]="'Die Online-Edition wird in Bezug auf Umfang und Funktionalit\xE4t kontinuierlich erweitert.'" />
`;var R="";var m=class{};m=e([t({selector:"awg-edition-section-detail-disclaimer",template:L,changeDetection:i.OnPush,standalone:!1,styles:[R]})],m);var y=`@if (selectedSeries && selectedSection) {
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
`;var O="";var p=class{static{this.propDecorators={selectedSeries:[{type:o}],selectedSection:[{type:o}]}}};p=e([t({selector:"awg-edition-section-detail-intro-card",template:y,changeDetection:i.OnPush,standalone:!1,styles:[O]})],p);var b=`<awg-alert-info
    [infoMessage]="
        '[Diese Inhalte erscheinen im Zusammenhang der vollst\xE4ndigen Edition von AWG ' +
        selectedSeries?.series.short +
        '/' +
        selectedSection?.section.short +
        '.]'
    " />
`;var U="";var S=class{static{this.propDecorators={selectedSeries:[{type:o}],selectedSection:[{type:o}]}}};S=e([t({selector:"awg-edition-section-detail-placeholder",template:b,changeDetection:i.OnPush,standalone:!1,styles:[U]})],S);var M=`@if (editionData(); as editionData) {
    @let content = editionData.section?.content;
    @let opusList = content?.complexTypes?.opus;
    @let mnrList = content?.complexTypes?.mnr;

    @if (UTILS.isEmptyArray(opusList) && UTILS.isEmptyArray(mnrList)) {
        <awg-edition-section-detail-placeholder
            [selectedSeries]="editionData.series"
            [selectedSection]="editionData.section" />
    } @else {
        <div class="awg-edition-section-detail">
            <awg-edition-section-detail-disclaimer />

            @if (!content?.intro.disabled) {
                <div class="awg-edition-section-detail-intro para p-3 shadow border rounded-3">
                    <div class="row">
                        <div class="col-12 col-xl-8">
                            <awg-edition-section-detail-intro-card
                                [selectedSeries]="editionData.series"
                                [selectedSection]="editionData.section" />
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
`;var N="";var s=class{constructor(){this._editionStateService=r(c),this.UTILS=v,this.editionData=C(()=>({series:this._editionStateService.selectedEditionSeries(),section:this._editionStateService.selectedEditionSection()}))}};s=e([t({selector:"awg-edition-section-detail-overview",template:M,changeDetection:i.OnPush,standalone:!1,styles:[N]})],s);var T=`<router-outlet />
`;var G="";var a=class{constructor(){this._editionOutlineService=r(D),this._editionStateService=r(c),this.sectionId=g(null),this.updateSectionFromRoute()}updateSectionFromRoute(){E(()=>{let u=this._editionStateService.selectedEditionSeries(),A=this.sectionId();if(!u)return;let h=u.series?.route;if(!h){this._editionStateService.updateSelectedEditionSection(null);return}let F=this._editionOutlineService.getEditionSectionById(h,A)??null;this._editionStateService.updateSelectedEditionSection(F)})}static{this.ctorParameters=()=>[]}static{this.propDecorators={sectionId:[{type:o,args:[{isSignal:!0,alias:"sectionId",required:!1,transform:void 0}]}]}}};a=e([t({selector:"awg-edition-section-detail",template:T,standalone:!1,styles:[G]})],a);var X=[{path:"",component:a,children:[{path:"intro",loadChildren:()=>import("./chunk-25IVYYZT.js").then(n=>n.EditionIntroModule)},{path:"",component:s}]}],P=[a,s],_=class{};_=e([d({imports:[f.forChild(X)],exports:[f]})],_);var k=class{};k=e([d({imports:[x,_],declarations:[l,m,p,S,P]})],k);export{k as EditionSectionDetailModule};
