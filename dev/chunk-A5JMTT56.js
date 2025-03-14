import{D as t,M as c,Na as n,Pb as d,Qb as f,S as g,Tb as s,X as r,j as e,qc as m}from"./chunk-75KJ3TEY.js";var l=`@if (prefaceData$ | async; as prefaceData) {
    <div class="awg-preface-view p-5 border rounded-3">
        <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)">
        </awg-language-switcher>
        @for (prefaceParagraph of prefaceData.preface[currentLanguage].content; track $index) {
            <p class="awg-preface-para" [compile-html]="prefaceParagraph" [compile-html-ref]="this"></p>
        }
    </div>
}
`;var u=`.awg-preface-para{margin:0;text-indent:25px;text-align:justify;text-justify:inter-word}.awg-preface-para::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}.awg-preface-para::ng-deep .heading,.awg-preface-para::ng-deep .small,.awg-preface-para::ng-deep .no-indent{text-indent:0}.awg-preface-para::ng-deep .small:not(.spacebreak),.awg-preface-para::ng-deep .no-indent{margin-left:-25px}.awg-preface-para::ng-deep .spacebreak{display:block;margin-top:25px}.awg-preface-para::ng-deep .spacebreak.no-indent{margin-left:0}.awg-preface-para::ng-deep img.awg-preface-img{display:block;margin-left:auto;margin-right:auto}
`;var a=class{constructor(){this.currentLanguage=0,this._editionDataService=t(d),this._editionGlyphService=t(f),this._editionStateService=t(s),this.ref=this}ngOnInit(){this._editionStateService.updateIsPrefaceView(!0),this.prefaceData$=this._editionDataService.getEditionPrefaceData()}getGlyph(o){return this._editionGlyphService.getGlyph(o)}setLanguage(o){this.currentLanguage=o}ngOnDestroy(){this._editionStateService.clearIsPrefaceView()}static{this.ctorParameters=()=>[]}};a=e([g({selector:"awg-edition-preface",template:l,changeDetection:c.OnPush,standalone:!1,styles:[u]})],a);var P=[{path:"",component:a,data:{title:"AWG Online Edition \u2013 Preface"}}],h=[a],i=class{};i=e([r({imports:[n.forChild(P)],exports:[n]})],i);var _=class{};_=e([r({imports:[m,i],declarations:[h]})],_);export{_ as EditionPrefaceModule};
