import{f as T}from"./chunk-2FZNARJZ.js";import{w as y}from"./chunk-HZD2HADH.js";import{G as m,L as i,R as p,T as r,U as a,X as S,a as b,b as R,l as o,ob as _}from"./chunk-VS32STRN.js";var k=`@for (description of textcriticalDescriptions; track description) {
    <p class="awg-edition-tka-description" [compile-html]="description" [compile-html-ref]="ref"></p>
}
`;var C="";var s,h=(s=class{constructor(){this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.selectSvgSheetRequest=new i,this.ref=this}navigateToReportFragment(e){e&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e,t){t&&this.selectSvgSheetRequest.emit({complexId:e,sheetId:t})}},s.ctorParameters=()=>[],s.propDecorators={textcriticalDescriptions:[{type:r}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},s);h=o([p({selector:"awg-edition-tka-description",template:k,changeDetection:m.OnPush,styles:[C]})],h);var w=`@if (labelType === 'evaluation') {
    <span>{{ utils.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'comment') {
    <span>{{ utils.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var x="";var n,d=(n=class{constructor(e){this.utils=e}},n.ctorParameters=()=>[{type:T}],n.propDecorators={id:[{type:r}],labelType:[{type:r}]},n);d=o([p({selector:"awg-edition-tka-label",template:w,changeDetection:m.OnPush,styles:[x]})],d);var v=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
    <thead>
        <tr>
            @for (header of getTableHeaderStrings(); track header) {
                <th scope="col" class="awg-edition-tka-table-header {{ header.reference }}">
                    {{ header.label }}
                </th>
            }
        </tr>
    </thead>
    @if (textcriticalComments) {
        <tbody>
            @for (textcriticalComment of textcriticalComments; track textcriticalComment) {
                <tr>
                    <td [innerHTML]="textcriticalComment.measure"></td>
                    <td [innerHTML]="textcriticalComment.system"></td>
                    <td [innerHTML]="textcriticalComment.position"></td>
                    <td><span [compile-html]="textcriticalComment.comment" [compile-html-ref]="ref"></span></td>
                </tr>
            }
        </tbody>
    }
</table>
`;var E=`.awg-edition-tka-table .measure{width:10%;white-space:nowrap}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%;white-space:nowrap}.awg-edition-tka-table .comment{width:auto}
`;var l,f=(l=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.selectSvgSheetRequest=new i,this.GLYPHS=y,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this.ref=this}getGlyph(e){let t=Object.values(this.GLYPHS).find(u=>u.alt===e);return t?t.hex:""}getTableHeaderStrings(){let{rowTable:e,default:t,corrections:u}=this.tableHeaderStrings,c;return this.isRowTable?c=e:this.isCorrections?c=u:c=t,this.isSketchId&&!this.isCorrections&&(c=c.map(g=>g.reference==="comment"?R(b({},g),{label:"Kommentar"}):g)),c}navigateToReportFragment(e){e&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e,t){t&&this.selectSvgSheetRequest.emit({complexId:e,sheetId:t})}},l.ctorParameters=()=>[],l.propDecorators={textcriticalComments:[{type:r}],isCorrections:[{type:r}],isRowTable:[{type:r}],isSketchId:[{type:r}],navigateToReportFragmentRequest:[{type:a}],openModalRequest:[{type:a}],selectSvgSheetRequest:[{type:a}]},l);f=o([p({selector:"awg-edition-tka-table",template:v,changeDetection:m.OnPush,styles:[E]})],f);var q=class{};q=o([S({imports:[_],declarations:[h,d,f],exports:[h,d,f]})],q);export{q as a};
