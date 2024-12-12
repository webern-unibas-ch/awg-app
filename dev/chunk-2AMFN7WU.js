import{H as n,M as r,Pb as _,S as s,U as t,V as i,X as g,a as b,b as u,j as o,qb as k,rc as C}from"./chunk-RKCG7LJ6.js";var T=`@for (description of textcriticalDescriptions; track description) {
    <p class="awg-edition-tka-description" [compile-html]="description" [compile-html-ref]="ref"></p>
}
`;var R="";var l=class{constructor(){this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={textcriticalDescriptions:[{type:t}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};l=o([s({selector:"awg-edition-tka-description",template:T,changeDetection:n.OnPush,styles:[R]})],l);var S=`@if (labelType === 'evaluation') {
    <span>{{ utils.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'comment') {
    <span>{{ utils.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var y="";var c=class{constructor(e){this.utils=e}static{this.ctorParameters=()=>[{type:k}]}static{this.propDecorators={id:[{type:t}],labelType:[{type:t}]}}};c=o([s({selector:"awg-edition-tka-label",template:S,changeDetection:n.OnPush,styles:[y]})],c);var w=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
    <thead>
        <tr>
            @for (header of getTableHeaderStrings(); track header.reference) {
                <th scope="col" class="awg-edition-tka-table-header {{ header.reference }}">
                    {{ header.label }}
                </th>
            }
        </tr>
    </thead>
    @if (textcriticalCommentBlocks) {
        <tbody>
            @for (textcriticalCommentBlock of textcriticalCommentBlocks; track $index) {
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
`;var x=`.awg-edition-tka-table .measure{width:10%;white-space:nowrap}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%;white-space:nowrap}.awg-edition-tka-table .comment{width:auto}
`;var m=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.GLYPHS=_,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this.ref=this}getGlyph(e){let p=Object.values(this.GLYPHS).find(h=>h.alt===e);return p?p.hex:""}getTableHeaderStrings(){let{rowTable:e,default:p,corrections:h}=this.tableHeaderStrings,a;return this.isRowTable?a=e:this.isCorrections?a=h:a=p,this.isSketchId&&!this.isCorrections&&(a=a.map(f=>f.reference==="comment"?u(b({},f),{label:"Kommentar"}):f)),a}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={textcriticalCommentBlocks:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};m=o([s({selector:"awg-edition-tka-table",template:w,changeDetection:n.OnPush,styles:[x]})],m);var E=class{};E=o([g({imports:[C],declarations:[l,c,m],exports:[l,c,m]})],E);export{E as a};
