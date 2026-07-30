import{a as m}from"./chunk-QYMCKAPA.js";import"./chunk-3GWTUQ35.js";import{b as s}from"./chunk-J44SJ7W4.js";import"./chunk-3F66QUQP.js";import{m as l}from"./chunk-SF2RIEEF.js";import{U as f}from"./chunk-ZRLKKSTB.js";import{i as n}from"./chunk-3BZQ7CXH.js";import"./chunk-LV4P6VJV.js";import"./chunk-I22XAGWJ.js";import"./chunk-UJPKQH37.js";import{Ua as g,Za as o,da as t,ia as p,o as e,xa as d}from"./chunk-2UFBJ743.js";var u=`@if (viewData(); as view) {
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
`;var w=`@charset "UTF-8";.awg-edition-preface-block{margin:0;text-indent:1.5em;text-align:justify;text-justify:inter-word}.awg-edition-preface-block::ng-deep p{margin-bottom:0!important}.awg-edition-preface-block::ng-deep figure,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-preface-block::ng-deep ul li,.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{text-indent:0}.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-preface-block::ng-deep img.awg-preface-img{display:block;margin-left:auto;margin-right:auto}.awg-edition-preface-block::ng-deep figure{text-align:center}.awg-edition-preface-block::ng-deep table{white-space:nowrap}.awg-edition-preface-block::ng-deep table th,.awg-edition-preface-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-preface-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var i=class{constructor(){this._editionGlyphService=t(s),this._editionStateService=t(f),this.currentLanguage=0,this.viewData=t(m).prefaceViewData,this._editionStateService.updateIsPrefaceView(!0),this.ref=this,t(p).onDestroy(()=>{this._editionStateService.updateIsPrefaceView(!1)})}getGlyph(r){return this._editionGlyphService.getGlyph(r)}setLanguage(r){this.currentLanguage=r}static{this.ctorParameters=()=>[]}};i=e([g({selector:"awg-edition-preface",template:u,changeDetection:d.OnPush,standalone:!1,styles:[w]})],i);var k=[{path:"",component:i,data:{title:"AWG Online Edition \u2013 Preface"}}],h=[i],a=class{};a=e([o({imports:[n.forChild(k)],exports:[n]})],a);var b=class{};b=e([o({imports:[l,a],declarations:[h]})],b);export{b as EditionPrefaceModule};
