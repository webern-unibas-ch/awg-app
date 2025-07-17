import{D as r,Ha as p,I as c,Jb as d,Kb as s,Nb as f,O as g,T as i,j as e,kc as l}from"./chunk-N6I6YDRN.js";var m=`@if (prefaceData$ | async; as prefaceData) {
    <div class="awg-preface-view p-5 border rounded-3">
        <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)">
        </awg-language-switcher>
        @for (prefaceParagraph of prefaceData.preface[currentLanguage].content; track $index) {
            <p class="awg-preface-para" [compile-html]="prefaceParagraph" [compile-html-ref]="this"></p>
        }
    </div>
}
`;var u=`.awg-preface-para{margin:0;text-indent:25px;text-align:justify;text-justify:inter-word}.awg-preface-para::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}.awg-preface-para::ng-deep .heading,.awg-preface-para::ng-deep .small,.awg-preface-para::ng-deep .no-indent{text-indent:0}.awg-preface-para::ng-deep .small:not(.spacebreak),.awg-preface-para::ng-deep .no-indent{margin-left:-25px}.awg-preface-para::ng-deep .spacebreak{display:block;margin-top:25px}.awg-preface-para::ng-deep .spacebreak.no-indent{margin-left:0}.awg-preface-para::ng-deep img.awg-preface-img{display:block;margin-left:auto;margin-right:auto}
`;var a,t=(a=class{constructor(){this.currentLanguage=0,this._editionDataService=r(d),this._editionGlyphService=r(s),this._editionStateService=r(f),this.ref=this}ngOnInit(){this._editionStateService.updateIsPrefaceView(!0),this.prefaceData$=this._editionDataService.getEditionPrefaceData()}getGlyph(n){return this._editionGlyphService.getGlyph(n)}setLanguage(n){this.currentLanguage=n}ngOnDestroy(){this._editionStateService.clearIsPrefaceView()}},a.ctorParameters=()=>[],a);t=e([g({selector:"awg-edition-preface",template:m,changeDetection:c.OnPush,standalone:!1,styles:[u]})],t);var P=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Preface"}}],h=[t],o=class{};o=e([i({imports:[p.forChild(P)],exports:[p]})],o);var _=class{};_=e([i({imports:[l,o],declarations:[h]})],_);export{_ as EditionPrefaceModule};
