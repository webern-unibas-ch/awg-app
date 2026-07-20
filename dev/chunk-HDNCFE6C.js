import{a as D}from"./chunk-GYSG6DRK.js";import{p as g}from"./chunk-7NCN5QDV.js";import{O as x,R as c}from"./chunk-AZXFL34H.js";import{i as f}from"./chunk-QXP3OB7Y.js";import"./chunk-YU53SDCH.js";import"./chunk-4IHYY5MM.js";import"./chunk-ZUPIHVI2.js";import{Ua as t,Wa as i,Za as d,bb as C,da as a,fb as E,o as e,oa as h,xa as o}from"./chunk-GJ62PT2J.js";var v=`<div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
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
`;var I="";var l=class{static{this.propDecorators={complexes:[{type:i}]}}};l=e([t({selector:"awg-edition-section-detail-complex-card",template:v,changeDetection:o.OnPush,standalone:!1,styles:[I]})],l);var w=`<awg-alert-info
    [infoMessage]="'Die Online-Edition wird in Bezug auf Umfang und Funktionalit\xE4t kontinuierlich erweitert.'" />
`;var L="";var m=class{};m=e([t({selector:"awg-edition-section-detail-disclaimer",template:w,changeDetection:o.OnPush,standalone:!1,styles:[L]})],m);var R=`@if (selectedSeries && selectedSection) {
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
`;var y="";var p=class{static{this.propDecorators={selectedSeries:[{type:i}],selectedSection:[{type:i}]}}};p=e([t({selector:"awg-edition-section-detail-intro-card",template:R,changeDetection:o.OnPush,standalone:!1,styles:[y]})],p);var O=`<awg-alert-info
    [infoMessage]="
        '[Diese Inhalte erscheinen im Zusammenhang der vollst\xE4ndigen Edition von AWG ' +
        selectedSeries?.series.short +
        '/' +
        selectedSection?.section.short +
        '.]'
    " />
`;var b="";var S=class{static{this.propDecorators={selectedSeries:[{type:i}],selectedSection:[{type:i}]}}};S=e([t({selector:"awg-edition-section-detail-placeholder",template:O,changeDetection:o.OnPush,standalone:!1,styles:[b]})],S);var U=`@if (editionData(); as editionData) {
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
`;var M="";var r=class{constructor(){this._editionStateService=a(c),this.UTILS=D,this.editionData=C(()=>({series:this._editionStateService.selectedEditionSeries(),section:this._editionStateService.selectedEditionSection()}))}};r=e([t({selector:"awg-edition-section-detail-overview",template:U,changeDetection:o.OnPush,standalone:!1,styles:[M]})],r);var N=`<router-outlet />
`;var T="";var s=class{constructor(){this._editionStateService=a(c),this.sectionId=E(null),this.updateSectionFromRoute()}updateSectionFromRoute(){h(()=>{let u=this._editionStateService.selectedEditionSeries(),k=this.sectionId();if(!u)return;let A=u.series?.route,F=x.getEditionSectionById(A,k);this._editionStateService.updateSelectedEditionSection(F)})}static{this.ctorParameters=()=>[]}static{this.propDecorators={sectionId:[{type:i,args:[{isSignal:!0,alias:"sectionId",required:!1,transform:void 0}]}]}}};s=e([t({selector:"awg-edition-section-detail",template:N,standalone:!1,styles:[T]})],s);var X=[{path:"",component:s,children:[{path:"intro",loadChildren:()=>import("./chunk-5TVF5HS6.js").then(n=>n.EditionIntroModule)},{path:"",component:r}]}],G=[s,r],_=class{};_=e([d({imports:[f.forChild(X)],exports:[f]})],_);var P=class{};P=e([d({imports:[g,_],declarations:[l,m,p,S,G]})],P);export{P as EditionSectionDetailModule};
