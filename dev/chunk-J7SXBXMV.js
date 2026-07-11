import{a as u}from"./chunk-WPV5PZRC.js";import{b as g,n as l}from"./chunk-DYM5ZA7Q.js";import{la as s,ma as f,qa as m}from"./chunk-65YTQYRL.js";import{i as n}from"./chunk-JKMSDOC4.js";import"./chunk-QCQ5AK7H.js";import"./chunk-NELWNM3I.js";import"./chunk-6VY4TR36.js";import"./chunk-BTLRFNJL.js";import{Ca as d,ea as t,o as e,sb as p,xb as a}from"./chunk-GKVY7SCJ.js";var h=`@if (isLoading()) {
    <awg-twelve-tone-spinner />
} @else {
    @if (prefaceData(); as prefaceData) {
        <div class="awg-preface-view p-5 border rounded-3">
            <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)" />
            @for (prefaceParagraph of prefaceData.preface[currentLanguage].content; track $index) {
                <div
                    class="awg-edition-preface-block"
                    [compile-html]="prefaceParagraph"
                    [compile-html-ref]="this"></div>
            }
        </div>
    }
}
`;var w=`@charset "UTF-8";.awg-edition-preface-block{margin:0;text-indent:1.5em;text-align:justify;text-justify:inter-word}.awg-edition-preface-block::ng-deep p{margin-bottom:0!important}.awg-edition-preface-block::ng-deep figure,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-preface-block::ng-deep ul li,.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{text-indent:0}.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-preface-block::ng-deep img.awg-preface-img{display:block;margin-left:auto;margin-right:auto}.awg-edition-preface-block::ng-deep figure{text-align:center}.awg-edition-preface-block::ng-deep table{white-space:nowrap}.awg-edition-preface-block::ng-deep table th,.awg-edition-preface-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-preface-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var i=class{constructor(){this._editionDataService=t(s),this._editionGlyphService=t(f),this._editionStateService=t(m),this._loadingService=t(u),this.currentLanguage=0,this.isLoading=this._loadingService.isLoading,this.prefaceData=g(this._editionDataService.getEditionPrefaceData(),{initialValue:null}),this.ref=this}ngOnInit(){this._editionStateService.updateIsPrefaceView(!0)}getGlyph(r){return this._editionGlyphService.getGlyph(r)}setLanguage(r){this.currentLanguage=r}ngOnDestroy(){this._editionStateService.clearIsPrefaceView()}static{this.ctorParameters=()=>[]}};i=e([p({selector:"awg-edition-preface",template:h,changeDetection:d.OnPush,standalone:!1,styles:[w]})],i);var S=[{path:"",component:i,data:{title:"AWG Online Edition \u2013 Preface"}}],b=[i],o=class{};o=e([a({imports:[n.forChild(S)],exports:[n]})],o);var _=class{};_=e([a({imports:[l,o],declarations:[b]})],_);export{_ as EditionPrefaceModule};
