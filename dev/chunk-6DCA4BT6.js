import{D as b,K as o,M as n,Qb as k,S as l,U as t,V as r,X as u,a as h,b as f,j as a,pb as g,qc as y}from"./chunk-2ZYVYWAG.js";var _=`@for (evaluation of evaluations; track $index) {
    <p class="awg-edition-tka-evaluation no-para-margin">
        <span [compile-html]="evaluation" [compile-html-ref]="ref"></span>
    </p>
}
`;var R="";var s=class{constructor(){this.navigateToReportFragmentRequest=new o,this.openModalRequest=new o,this.selectSvgSheetRequest=new o,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={evaluations:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};s=a([l({selector:"awg-edition-tka-evaluations",template:_,changeDetection:n.OnPush,standalone:!1,styles:[R]})],s);var S=`@if (labelType === 'evaluation') {
    <span>{{ utils.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'commentary') {
    <span>{{ utils.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var T="";var m=class{constructor(e){this.utils=e}static{this.ctorParameters=()=>[{type:g}]}static{this.propDecorators={id:[{type:t}],labelType:[{type:t}]}}};m=a([l({selector:"awg-edition-tka-label",template:S,changeDetection:n.OnPush,standalone:!1,styles:[T]})],m);var C=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
    @if (commentary.preamble) {
        <caption class="awg-edition-tka-table-preamble mb-0">
            <span [compile-html]="commentary.preamble" [compile-html-ref]="ref"> </span>
        </caption>
    }
    @if (commentary.comments.length > 0) {
        <thead>
            <tr>
                @for (tableHeader of getTableHeaderStrings(); track tableHeader.reference) {
                    <th scope="col" class="awg-edition-tka-table-header {{ tableHeader.reference }}">
                        {{ tableHeader.label }}
                    </th>
                }
            </tr>
        </thead>
        <tbody>
            @for (textcriticalCommentBlock of commentary.comments; track $index) {
                @if (textcriticalCommentBlock.blockHeader) {
                    <tr class="table-light table-group-divider">
                        <td colspan="4" class="awg-edition-tka-table-block-header">
                            <span [compile-html]="textcriticalCommentBlock.blockHeader" [compile-html-ref]="ref"></span>
                        </td>
                    </tr>
                }
                @for (
                    textcriticalComment of textcriticalCommentBlock.blockComments;
                    track textcriticalComment.svgGroupId
                ) {
                    <tr>
                        <td [awgAbbr]="textcriticalComment.measure"></td>
                        <td [awgAbbr]="textcriticalComment.system"></td>
                        <td [innerHTML]="textcriticalComment.position"></td>
                        <td><span [compile-html]="textcriticalComment.comment" [compile-html-ref]="ref"></span></td>
                    </tr>
                }
            }
        </tbody>
    }
</table>
`;var v=`.awg-edition-tka-table caption{caption-side:top;text-align:left;color:var(--bs-primary-color)}.awg-edition-tka-table .measure{width:10%;white-space:nowrap}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%;white-space:nowrap}.awg-edition-tka-table .comment{width:auto}
`;var c=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new o,this.openModalRequest=new o,this.selectSvgSheetRequest=new o,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this._editionGlyphService=b(k),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}getTableHeaderStrings(){let{rowTable:e,default:E,corrections:x}=this.tableHeaderStrings,i;return this.isRowTable?i=e:this.isCorrections?i=x:i=E,this.isSketchId&&!this.isCorrections&&(i=i.map(d=>d.reference==="comment"?f(h({},d),{label:"Kommentar"}):d)),i}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={commentary:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};c=a([l({selector:"awg-edition-tka-table",template:C,changeDetection:n.OnPush,standalone:!1,styles:[v]})],c);var w=class{};w=a([u({imports:[y],declarations:[s,m,c],exports:[s,m,c]})],w);export{w as a};
