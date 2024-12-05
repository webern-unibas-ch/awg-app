import{D as o,Na as n,Pb as g,Rb as f,S as d,Ub as s,X as a,j as e,rc as m}from"./chunk-ZLNGD6UK.js";var l=`@if (prefaceData$ | async; as prefaceData) {
    <div class="awg-preface-view p-5 border rounded-3">
        <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)">
        </awg-language-switcher>
        @for (prefaceParagraph of prefaceData.preface[currentLanguage].content; track $index) {
            <p class="awg-preface-para" [compile-html]="prefaceParagraph" [compile-html-ref]="this"></p>
        }
    </div>
}
`;var u=`.awg-preface-para{margin:0;text-indent:25px;text-align:justify;text-justify:inter-word}.awg-preface-para::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}.awg-preface-para::ng-deep .heading,.awg-preface-para::ng-deep .small,.awg-preface-para::ng-deep .no-indent{text-indent:0}.awg-preface-para::ng-deep .small:not(.spacebreak),.awg-preface-para::ng-deep .no-indent{margin-left:-25px}.awg-preface-para::ng-deep .spacebreak{display:block;margin-top:25px}.awg-preface-para::ng-deep .spacebreak.no-indent{margin-left:0}
`;var t=class{constructor(){this.currentLanguage=0,this.GLYPHS=g,this._editionDataService=o(f),this._editionStateService=o(s),this.ref=this}ngOnInit(){this._editionStateService.updateIsPrefaceView(!0),this.prefaceData$=this._editionDataService.getEditionPrefaceData()}getGlyph(i){let c=Object.values(this.GLYPHS).find(E=>E.alt===i);return c?c.hex:""}setLanguage(i){this.currentLanguage=i}ngOnDestroy(){this._editionStateService.clearIsPrefaceView()}static{this.ctorParameters=()=>[]}};t=e([d({selector:"awg-edition-preface",template:l,styles:[u]})],t);var S=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Preface"}}],h=[t],r=class{};r=e([a({imports:[n.forChild(S)],exports:[n]})],r);var _=class{};_=e([a({imports:[m,r],declarations:[h]})],_);export{_ as EditionPrefaceModule};
