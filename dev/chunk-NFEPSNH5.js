import{f as T}from"./chunk-FBEBBQXB.js";import{w as y}from"./chunk-LPVQ2PFJ.js";import{G as c,L as o,R as m,T as t,U as i,X as S,a as b,b as R,l as r,ob as _}from"./chunk-4DUUYM7V.js";var k=`@for (description of textcriticalDescriptions; track description) {
    <p class="awg-edition-tka-description" [compile-html]="description" [compile-html-ref]="ref"></p>
}
`;var C="";var a,p=(a=class{constructor(){this.navigateToReportFragmentRequest=new o,this.openModalRequest=new o,this.selectSvgSheetRequest=new o,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},a.ctorParameters=()=>[],a.propDecorators={textcriticalDescriptions:[{type:t}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]},a);p=r([m({selector:"awg-edition-tka-description",template:k,changeDetection:c.OnPush,styles:[C]})],p);var w=`@if (labelType === 'evaluation') {
    <span>{{ utils.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'comment') {
    <span>{{ utils.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var x="";var n,h=(n=class{constructor(e){this.utils=e}},n.ctorParameters=()=>[{type:T}],n.propDecorators={id:[{type:t}],labelType:[{type:t}]},n);h=r([m({selector:"awg-edition-tka-label",template:w,changeDetection:c.OnPush,styles:[x]})],h);var v=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
    <thead>
        <tr>
            @for (header of getTableHeaderStrings(); track header.reference) {
                <th scope="col" class="awg-edition-tka-table-header {{ header.reference }}">
                    {{ header.label }}
                </th>
            }
        </tr>
    </thead>
    @if (textcriticalComments) {
        <tbody>
            @for (textcriticalComment of textcriticalComments; track $index) {
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
`;var s,d=(s=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new o,this.openModalRequest=new o,this.selectSvgSheetRequest=new o,this.GLYPHS=y,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this.ref=this}getGlyph(e){let f=Object.values(this.GLYPHS).find(u=>u.alt===e);return f?f.hex:""}getTableHeaderStrings(){let{rowTable:e,default:f,corrections:u}=this.tableHeaderStrings,l;return this.isRowTable?l=e:this.isCorrections?l=u:l=f,this.isSketchId&&!this.isCorrections&&(l=l.map(g=>g.reference==="comment"?R(b({},g),{label:"Kommentar"}):g)),l}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}},s.ctorParameters=()=>[],s.propDecorators={textcriticalComments:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]},s);d=r([m({selector:"awg-edition-tka-table",template:v,changeDetection:c.OnPush,styles:[E]})],d);var q=class{};q=r([S({imports:[_],declarations:[p,h,d],exports:[p,h,d]})],q);export{q as a};
