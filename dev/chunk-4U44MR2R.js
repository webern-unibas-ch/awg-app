import{A as n,C as a,G as l,J as s,L as t,M as r,O as u,Ua as d,a as b,b as g,j as o,lb as k,pb as y}from"./chunk-VKXZMJB3.js";var S=`@for (evaluation of evaluations; track $index) {
    <p class="awg-edition-tka-evaluation no-para-margin">
        <span [compile-html]="evaluation" [compile-html-ref]="ref"></span>
    </p>
}
`;var _="";var m=class{constructor(){this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this._editionGlyphService=n(d),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={evaluations:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};m=o([s({selector:"awg-edition-tka-evaluations",template:S,changeDetection:l.OnPush,standalone:!1,styles:[_]})],m);var T=`@if (labelType === 'evaluation') {
    <span>{{ UTILS.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'commentary') {
    <span>{{ UTILS.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var R="";var c=class{constructor(){this.UTILS=n(k)}static{this.propDecorators={id:[{type:t}],labelType:[{type:t}]}}};c=o([s({selector:"awg-edition-tka-label",template:T,changeDetection:l.OnPush,standalone:!1,styles:[R]})],c);var C=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
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
`;var p=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this._editionGlyphService=n(d),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}getTableHeaderStrings(){let{rowTable:e,default:E,corrections:x}=this.tableHeaderStrings,i;return this.isRowTable?i=e:this.isCorrections?i=x:i=E,this.isSketchId&&!this.isCorrections&&(i=i.map(f=>f.reference==="comment"?g(b({},f),{label:"Kommentar"}):f)),i}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={commentary:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};p=o([s({selector:"awg-edition-tka-table",template:C,changeDetection:l.OnPush,standalone:!1,styles:[v]})],p);var w=class{};w=o([u({imports:[y],declarations:[m,c,p],exports:[m,c,p]})],w);export{w as a};
