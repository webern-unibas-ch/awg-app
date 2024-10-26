import{f as _}from"./chunk-CRXYCNPQ.js";import{j as C}from"./chunk-DOOWV3P7.js";import{Ca as i,I as c,N as r,T as m,V as t,W as o,Z as R,a as b,b as k,tb as S}from"./chunk-XXWOVZJP.js";var T=`@for (description of textcriticalDescriptions; track description) {
    <p class="awg-edition-tka-description" [compile-html]="description" [compile-html-ref]="ref"></p>
}
`;var y="";var a,p=(a=class{constructor(){this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},a.ctorParameters=()=>[],a.propDecorators={textcriticalDescriptions:[{type:t}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}],selectSvgSheetRequest:[{type:o}]},a);p=i([m({selector:"awg-edition-tka-description",template:T,changeDetection:c.OnPush,styles:[y]})],p);var w=`@if (labelType === 'evaluation') {
    <span>{{ utils.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'comment') {
    <span>{{ utils.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var x="";var s,h=(s=class{constructor(e){this.utils=e}},s.ctorParameters=()=>[{type:_}],s.propDecorators={id:[{type:t}],labelType:[{type:t}]},s);h=i([m({selector:"awg-edition-tka-label",template:w,changeDetection:c.OnPush,styles:[x]})],h);var v=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
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
                @for (textcriticalComment of textcriticalCommentBlock.blockComments; track $index) {
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
`;var E=`.awg-edition-tka-table .measure{width:10%;white-space:nowrap}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%;white-space:nowrap}.awg-edition-tka-table .comment{width:auto}
`;var n,d=(n=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new r,this.openModalRequest=new r,this.selectSvgSheetRequest=new r,this.GLYPHS=C,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this.ref=this}getGlyph(e){let f=Object.values(this.GLYPHS).find(u=>u.alt===e);return f?f.hex:""}getTableHeaderStrings(){let{rowTable:e,default:f,corrections:u}=this.tableHeaderStrings,l;return this.isRowTable?l=e:this.isCorrections?l=u:l=f,this.isSketchId&&!this.isCorrections&&(l=l.map(g=>g.reference==="comment"?k(b({},g),{label:"Kommentar"}):g)),l}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},n.ctorParameters=()=>[],n.propDecorators={textcriticalCommentBlocks:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}],selectSvgSheetRequest:[{type:o}]},n);d=i([m({selector:"awg-edition-tka-table",template:v,changeDetection:c.OnPush,styles:[E]})],d);var q=class{};q=i([R({imports:[S],declarations:[p,h,d],exports:[p,h,d]})],q);export{q as a};
