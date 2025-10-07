import{E as s,J as m,Kb as b,N as o,P as c,R as t,S as r,U as S,a as u,b as y,j as a,jb as k,kc as R}from"./chunk-2Q23ABF4.js";var _=`@for (evaluation of evaluations; track $index) {
    <p class="awg-edition-tka-evaluation no-para-margin">
        <span [compile-html]="evaluation" [compile-html-ref]="ref"></span>
    </p>
}
`;var T="";var i,d=(i=class{constructor(){this.navigateToReportFragmentRequest=new o,this.openModalRequest=new o,this.selectSvgSheetRequest=new o,this._editionGlyphService=s(b),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},i.ctorParameters=()=>[],i.propDecorators={evaluations:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]},i);d=a([c({selector:"awg-edition-tka-evaluations",template:_,changeDetection:m.OnPush,standalone:!1,styles:[T]})],d);var v=`@if (labelType === 'evaluation') {
    <span>{{ UTILS.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'commentary') {
    <span>{{ UTILS.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var C="";var p,h=(p=class{constructor(){this.UTILS=s(k)}},p.propDecorators={id:[{type:t}],labelType:[{type:t}]},p);h=a([c({selector:"awg-edition-tka-label",template:v,changeDetection:m.OnPush,standalone:!1,styles:[C]})],h);var w=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
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
`;var E=`.awg-edition-tka-table caption{caption-side:top;text-align:left;color:var(--bs-primary-color)}.awg-edition-tka-table .measure{width:10%;white-space:nowrap}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%;white-space:nowrap}.awg-edition-tka-table .comment{width:auto}
`;var n,f=(n=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new o,this.openModalRequest=new o,this.selectSvgSheetRequest=new o,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this._editionGlyphService=s(b),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}getTableHeaderStrings(){let{rowTable:e,default:q,corrections:I}=this.tableHeaderStrings,l;return this.isRowTable?l=e:this.isCorrections?l=I:l=q,this.isSketchId&&!this.isCorrections&&(l=l.map(g=>g.reference==="comment"?y(u({},g),{label:"Kommentar"}):g)),l}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},n.ctorParameters=()=>[],n.propDecorators={commentary:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]},n);f=a([c({selector:"awg-edition-tka-table",template:w,changeDetection:m.OnPush,standalone:!1,styles:[E]})],f);var x=class{};x=a([S({imports:[R],declarations:[d,h,f],exports:[d,h,f]})],x);export{x as a};
