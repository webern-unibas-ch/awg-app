import{a as f}from"./chunk-XZVG5EI2.js";import"./chunk-FTSJMWR5.js";import{b as l}from"./chunk-35VWLIFR.js";import"./chunk-3F66QUQP.js";import{m as g}from"./chunk-S33MIVMM.js";import"./chunk-F4F5XUED.js";import{i as n}from"./chunk-FVW7GIPT.js";import"./chunk-EBQEHJAD.js";import"./chunk-7TDKMI75.js";import"./chunk-TCBF3DEM.js";import{Ua as d,Za as i,da as r,o as e,xa as p}from"./chunk-KL6VAWUG.js";var s=`@if (viewData(); as view) {
    @if (view.error; as errorObject) {
        <awg-alert-error [errorObject]="errorObject" />
    } @else if (view.isLoading) {
        <awg-twelve-tone-spinner />
    } @else {
        @let preface = view.data.prefaceData.preface;

        <div class="awg-preface-view p-5 border rounded-3">
            <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)" />
            @for (prefaceParagraph of preface[currentLanguage].content; track $index) {
                <div
                    class="awg-edition-preface-block"
                    [compile-html]="prefaceParagraph"
                    [compile-html-ref]="this"></div>
            }
        </div>
    }
}
`;var m=`@charset "UTF-8";.awg-edition-preface-block{margin:0;text-indent:1.5em;text-align:justify;text-justify:inter-word}.awg-edition-preface-block::ng-deep p{margin-bottom:0!important}.awg-edition-preface-block::ng-deep figure,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-preface-block::ng-deep ul li,.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{text-indent:0}.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-preface-block::ng-deep img.awg-preface-img{display:block;margin-left:auto;margin-right:auto}.awg-edition-preface-block::ng-deep figure{text-align:center}.awg-edition-preface-block::ng-deep table{white-space:nowrap}.awg-edition-preface-block::ng-deep table th,.awg-edition-preface-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-preface-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var t=class{constructor(){this._editionGlyphService=r(l),this.currentLanguage=0,this.viewData=r(f).prefaceViewData,this.ref=this}getGlyph(a){return this._editionGlyphService.getGlyph(a)}setLanguage(a){this.currentLanguage=a}static{this.ctorParameters=()=>[]}};t=e([d({selector:"awg-edition-preface",template:s,changeDetection:p.OnPush,standalone:!1,styles:[m]})],t);var v=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Preface"}}],u=[t],o=class{};o=e([i({imports:[n.forChild(v)],exports:[n]})],o);var w=class{};w=e([i({imports:[g,o],declarations:[u]})],w);export{w as EditionPrefaceModule};
