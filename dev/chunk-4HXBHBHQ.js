import{D as b,H as n,M as i,Rb as k,S as s,U as t,V as r,X as g,a as h,b as f,j as o,qb as u,rc as _}from"./chunk-VB3QTN2A.js";var C=`@for (description of textcriticalDescriptions; track description) {
    <p class="awg-edition-tka-description"><span [compile-html]="description" [compile-html-ref]="ref"></span></p>
}
`;var R="";var l=class{constructor(){this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.selectSvgSheetRequest=new i,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={textcriticalDescriptions:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};l=o([s({selector:"awg-edition-tka-description",template:C,changeDetection:n.OnPush,styles:[R]})],l);var S=`@if (labelType === 'evaluation') {
    <span>{{ utils.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'comment') {
    <span>{{ utils.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var T="";var c=class{constructor(e){this.utils=e}static{this.ctorParameters=()=>[{type:u}]}static{this.propDecorators={id:[{type:t}],labelType:[{type:t}]}}};c=o([s({selector:"awg-edition-tka-label",template:S,changeDetection:n.OnPush,styles:[T]})],c);var y=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
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
`;var w=`.awg-edition-tka-table .measure{width:10%;white-space:nowrap}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%;white-space:nowrap}.awg-edition-tka-table .comment{width:auto}
`;var m=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.selectSvgSheetRequest=new i,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this._editionGlyphService=b(k),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}getTableHeaderStrings(){let{rowTable:e,default:x,corrections:v}=this.tableHeaderStrings,a;return this.isRowTable?a=e:this.isCorrections?a=v:a=x,this.isSketchId&&!this.isCorrections&&(a=a.map(d=>d.reference==="comment"?f(h({},d),{label:"Kommentar"}):d)),a}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={textcriticalCommentBlocks:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};m=o([s({selector:"awg-edition-tka-table",template:y,changeDetection:n.OnPush,styles:[w]})],m);var E=class{};E=o([g({imports:[_],declarations:[l,c,m],exports:[l,c,m]})],E);export{E as a};
