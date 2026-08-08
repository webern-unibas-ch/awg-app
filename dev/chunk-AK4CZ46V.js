import{a as f}from"./chunk-42PQWJQS.js";import"./chunk-BKKCRFEM.js";import{h as l,o as g}from"./chunk-PMQAQSI3.js";import"./chunk-3ZWNJ7OJ.js";import{i as a}from"./chunk-NXHZOHPN.js";import"./chunk-WAZ4IYRF.js";import"./chunk-KRODKIFH.js";import"./chunk-CLUTCXYM.js";import{Ua as p,Za as o,da as n,na as d,o as e,xa as c}from"./chunk-N3BOPIZ4.js";var s=`@if (viewData(); as view) {
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
                <div class="awg-edition-preface-block" [awgCompileHtml]="prefaceParagraph"></div>
            }
        </div>
    }
}
`;var m=`@charset "UTF-8";.awg-edition-preface-block{margin:0;text-indent:1.5em;text-align:justify;text-justify:inter-word}.awg-edition-preface-block::ng-deep p{margin-bottom:0!important}.awg-edition-preface-block::ng-deep figure,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{margin-top:1em;margin-left:0}.awg-edition-preface-block::ng-deep ul li,.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive,.awg-edition-preface-block::ng-deep .block-lead{text-indent:0}.awg-edition-preface-block::ng-deep .small,.awg-edition-preface-block::ng-deep div.table-responsive{font-size:.875em}.awg-edition-preface-block::ng-deep img.awg-preface-img{display:block;margin-left:auto;margin-right:auto}.awg-edition-preface-block::ng-deep figure{text-align:center}.awg-edition-preface-block::ng-deep table{white-space:nowrap}.awg-edition-preface-block::ng-deep table th,.awg-edition-preface-block::ng-deep table td{padding-right:20px;font-weight:400}.awg-edition-preface-block::ng-deep ul{padding-left:0;list-style-position:inside;list-style-type:"\\2013  "}
`;var t=class{constructor(){this.viewData=n(f).prefaceViewData,this.selectedLanguage=d(l.DE)}};t=e([p({selector:"awg-edition-preface",template:s,changeDetection:c.OnPush,standalone:!1,styles:[m]})],t);var E=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Preface"}}],w=[t],i=class{};i=e([o({imports:[a.forChild(E)],exports:[a]})],i);var b=class{};b=e([o({imports:[g,i],declarations:[w]})],b);export{b as EditionPrefaceModule};
