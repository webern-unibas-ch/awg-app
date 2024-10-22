import{k as d,m as s,p as f}from"./chunk-IQ7DNEOM.js";import{Ca as e,Ra as p,T as c,Z as o,rb as g}from"./chunk-ER7ZVCIX.js";var m=`@if (prefaceData$ | async; as prefaceData) {
    <div class="awg-preface-view p-5 border rounded-3">
        <awg-language-switcher [currentLanguage]="currentLanguage" (languageChangeRequest)="setLanguage($event)">
        </awg-language-switcher>
        @for (prefaceParagraph of prefaceData.preface[currentLanguage].content; track $index) {
            <p class="awg-preface-para" [compile-html]="prefaceParagraph" [compile-html-ref]="this"></p>
        }
    </div>
}
`;var l=`.awg-preface-para{margin:0;text-indent:25px;text-align:justify;text-justify:inter-word}.awg-preface-para::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}.awg-preface-para::ng-deep .heading,.awg-preface-para::ng-deep .small,.awg-preface-para::ng-deep .no-indent{text-indent:0}.awg-preface-para::ng-deep .small:not(.spacebreak),.awg-preface-para::ng-deep .no-indent{margin-left:-25px}.awg-preface-para::ng-deep .spacebreak{display:block;margin-top:25px}.awg-preface-para::ng-deep .spacebreak.no-indent{margin-left:0}
`;var t,r=(t=class{constructor(a,i){this.editionStateService=a,this.editionDataService=i,this.currentLanguage=0,this.GLYPHS=d,this.ref=this}ngOnInit(){this.editionStateService.updateIsPrefaceView(!0),this.prefaceData$=this.editionDataService.getEditionPrefaceData()}getGlyph(a){let i=Object.values(this.GLYPHS).find(w=>w.alt===a);return i?i.hex:""}setLanguage(a){this.currentLanguage=a}ngOnDestroy(){this.editionStateService.clearIsPrefaceView()}},t.ctorParameters=()=>[{type:f},{type:s}],t);r=e([c({selector:"awg-edition-preface",template:m,styles:[l]})],r);var S=[{path:"",component:r,data:{title:"AWG Online Edition \u2013 Preface"}}],u=[r],n=class{};n=e([o({imports:[p.forChild(S)],exports:[p]})],n);var h=class{};h=e([o({imports:[g,n],declarations:[u]})],h);export{h as EditionPrefaceModule};
