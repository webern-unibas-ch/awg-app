import{C as n,Na as p,Pb as d,R as g,Rb as s,Ub as f,W as r,rc as m,ya as e}from"./chunk-VWVP5EUB.js";var l=`@if (prefaceData$ | async; as prefaceData) {
    <div class="awg-preface-view p-5 border rounded-3">
        <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)">
        </awg-language-switcher>
        @for (prefaceParagraph of prefaceData.preface[currentLanguage].content; track $index) {
            <p class="awg-preface-para" [compile-html]="prefaceParagraph" [compile-html-ref]="this"></p>
        }
    </div>
}
`;var u=`.awg-preface-para{margin:0;text-indent:25px;text-align:justify;text-justify:inter-word}.awg-preface-para::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}.awg-preface-para::ng-deep .heading,.awg-preface-para::ng-deep .small,.awg-preface-para::ng-deep .no-indent{text-indent:0}.awg-preface-para::ng-deep .small:not(.spacebreak),.awg-preface-para::ng-deep .no-indent{margin-left:-25px}.awg-preface-para::ng-deep .spacebreak{display:block;margin-top:25px}.awg-preface-para::ng-deep .spacebreak.no-indent{margin-left:0}
`;var t,a=(t=class{constructor(){this.currentLanguage=0,this.GLYPHS=d,this._editionDataService=n(s),this._editionStateService=n(f),this.ref=this}ngOnInit(){this._editionStateService.updateIsPrefaceView(!0),this.prefaceData$=this._editionDataService.getEditionPrefaceData()}getGlyph(o){let c=Object.values(this.GLYPHS).find(w=>w.alt===o);return c?c.hex:""}setLanguage(o){this.currentLanguage=o}ngOnDestroy(){this._editionStateService.clearIsPrefaceView()}},t.ctorParameters=()=>[],t);a=e([g({selector:"awg-edition-preface",template:l,styles:[u]})],a);var x=[{path:"",component:a,data:{title:"AWG Online Edition \u2013 Preface"}}],h=[a],i=class{};i=e([r({imports:[p.forChild(x)],exports:[p]})],i);var _=class{};_=e([r({imports:[m,i],declarations:[h]})],_);export{_ as EditionPrefaceModule};
