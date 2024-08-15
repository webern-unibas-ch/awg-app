import{b as s,d,p as l}from"./chunk-EJKNBDLD.js";import"./chunk-4N65OIRB.js";import"./chunk-KNTLVCQ7.js";import{Oa as c,R as p,X as o,l as e,ob as g}from"./chunk-3ACQ2C22.js";var f=`@if (prefaceData$ | async; as prefaceData) {
    <div class="awg-preface-view p-5 border rounded-3">
        <p class="awg-language-switcher">
            <a (click)="setLanguage(0)" [class.active]="currentLanguage === 0">DE</a>
            |
            <a (click)="setLanguage(1)" [class.active]="currentLanguage === 1">EN</a>
        </p>
        @for (prefaceParagraph of prefaceData.preface[currentLanguage].content; track $index) {
            <p class="awg-preface-para" [compile-html]="prefaceParagraph" [compile-html-ref]="this"></p>
        }
    </div>
}
`;var m=`.awg-language-switcher{font-family:Montserrat,sans-serif;font-size:small;text-align:end}.awg-language-switcher a{cursor:pointer;text-decoration:none;color:inherit}.awg-language-switcher a.active,.awg-language-switcher a.active:hover{cursor:default;color:inherit}.awg-language-switcher a:not(.active){color:#149b9e}.awg-language-switcher a:hover{border-bottom:none!important}.awg-preface-para{margin:0;text-indent:25px}.awg-preface-para::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}.awg-preface-para::ng-deep .heading,.awg-preface-para::ng-deep .small,.awg-preface-para::ng-deep .no-indent{text-indent:0}.awg-preface-para::ng-deep .small:not(.spacebreak),.awg-preface-para::ng-deep .no-indent{margin-left:-25px}.awg-preface-para::ng-deep .spacebreak{display:block;margin-top:25px}.awg-preface-para::ng-deep .spacebreak.no-indent{margin-left:0}
`;var a,r=(a=class{constructor(t,i){this.editionService=t,this.editionDataService=i,this.currentLanguage=0,this.GLYPHS=s,this.ref=this}ngOnInit(){this.editionService.updateIsPrefaceView(!0),this.prefaceData$=this.editionDataService.getEditionPrefaceData()}getGlyph(t){let i=Object.values(this.GLYPHS).find(E=>E.alt===t);return i?i.hex:""}setLanguage(t){this.currentLanguage=t}ngOnDestroy(){this.editionService.clearIsPrefaceView()}},a.ctorParameters=()=>[{type:l},{type:d}],a);r=e([p({selector:"awg-edition-preface",template:f,styles:[m]})],r);var v=[{path:"",component:r,data:{title:"AWG Online Edition \u2013 Preface"}}],u=[r],n=class{};n=e([o({imports:[c.forChild(v)],exports:[c]})],n);var h=class{};h=e([o({imports:[g,n],declarations:[u]})],h);export{h as EditionPrefaceModule};
