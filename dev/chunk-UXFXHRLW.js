import{a as s}from"./chunk-VLZI2266.js";import"./chunk-3GIP7FOY.js";import{a as f}from"./chunk-TZJEY4RM.js";import{i as l,n as g}from"./chunk-L5PREP3I.js";import"./chunk-LOLY6PYH.js";import{i as r}from"./chunk-75VXETE6.js";import"./chunk-4L52XKCF.js";import"./chunk-FXWM3VZO.js";import"./chunk-GQTJTTLH.js";import{Ua as c,Za as i,da as a,na as p,o as e,xa as d}from"./chunk-XLLILVXQ.js";var m=`@if (viewData(); as view) {
    @if (view.error; as errorObject) {
        <awg-alert-error [errorObject]="errorObject" />
    } @else if (view.isLoading) {
        <awg-twelve-tone-spinner />
    } @else {
        @let preface = view.data.prefaceData.preface;

        <div class="awg-preface-view p-5 border rounded-3">
            <awg-language-switcher [(selectedLanguage)]="selectedLanguage" />

            @let lang = selectedLanguage();

            @for (prefaceParagraph of preface[lang]?.content; track $index) {
                <div
                    class="awg-edition-preface-block"
                    [compile-html]="prefaceParagraph"
                    [compile-html-ref]="this"></div>
            }
        </div>
    }
}
`;var w=`@charset "UTF-8";.awg-edition-preface-block{margin:0;text-indent:1.5em;text-align:justify;text-justify:inter-word}.awg-edition-preface-block::ng-deep p{margin-bottom:0!important}.awg-edition-preface-block::ng-deep figure,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-preface-block::ng-deep ul li,.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{text-indent:0}.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-preface-block::ng-deep img.awg-preface-img{display:block;margin-left:auto;margin-right:auto}.awg-edition-preface-block::ng-deep figure{text-align:center}.awg-edition-preface-block::ng-deep table{white-space:nowrap}.awg-edition-preface-block::ng-deep table th,.awg-edition-preface-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-preface-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var t=class{constructor(){this._editionGlyphService=a(f),this.viewData=a(s).prefaceViewData,this.selectedLanguage=p(l.DE),this.ref=this}getGlyph(h){return this._editionGlyphService.getGlyph(h)}};t=e([c({selector:"awg-edition-preface",template:m,changeDetection:d.OnPush,standalone:!1,styles:[w]})],t);var E=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Preface"}}],u=[t],o=class{};o=e([i({imports:[r.forChild(E)],exports:[r]})],o);var b=class{};b=e([i({imports:[g,o],declarations:[u]})],b);export{b as EditionPrefaceModule};
