import{a as v}from"./chunk-GYSG6DRK.js";import{g as k,n as y}from"./chunk-X5EKVSPE.js";import{N as u,P as C}from"./chunk-BVP7LOO2.js";import{Ua as m,Wa as o,Xa as r,Za as T,a as b,b as S,da as l,ka as a,kb as _,o as i,xa as s}from"./chunk-DNEORQCU.js";var I=`@for (evaluation of evaluations; track $index) {
    <p class="awg-edition-tka-evaluation no-para-margin">
        <span [compile-html]="evaluation" [compile-html-ref]="ref"></span>
    </p>
}
`;var R="";var p=class{constructor(){this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this._editionGlyphService=l(u),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={evaluations:[{type:o}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};p=i([m({selector:"awg-edition-tka-evaluations",template:I,changeDetection:s.OnPush,standalone:!1,styles:[R]})],p);var E=`@if (labelType === 'evaluation') {
    <span>{{ EDITION_UTILS.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'commentary') {
    <span>{{ EDITION_UTILS.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var w="";function N(t){return t?t.includes("_Sk")||t.includes("SkRT"):!1}function H(t){return t?t.includes("_WE"):!1}var d={isSketchId:N,isWorkEditionId:H};var h=class{constructor(){this.EDITION_UTILS=d}static{this.propDecorators={id:[{type:o}],labelType:[{type:o}]}}};h=i([m({selector:"awg-edition-tka-label",template:E,changeDetection:s.OnPush,standalone:!1,styles:[w]})],h);var x=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
    @if (commentary.preamble) {
        <caption class="awg-edition-tka-table-preamble mb-0">
            <span [compile-html]="commentary.preamble" [compile-html-ref]="ref"> </span>
        </caption>
    }
    @if (!UTILS.isEmptyArray(commentary.comments)) {
        <thead>
            <tr>
                @for (tableHeader of getTableHeaderStrings(); track tableHeader.reference) {
                    <th scope="col" class="awg-edition-tka-table-header {{ tableHeader.reference }} text-nowrap">
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
                    <tr
                        [id]="textcriticalComment.svgGroupId + '-entry'"
                        [attr.data-svg-group-id]="textcriticalComment.svgGroupId"
                        [ngbTooltip]="textcriticalComment.svgGroupId"
                        tooltipClass="awg-group-id-tooltip"
                        placement="left"
                        class="awg-edition-tka-table-comment">
                        <td [awgAbbr]="textcriticalComment.measure"></td>
                        <td [awgAbbr]="textcriticalComment.system"></td>
                        <td [innerHTML]="textcriticalComment.position"></td>
                        <td>
                            <span
                                [compile-html]="
                                    ref.getComment(textcriticalComment.comment, textcriticalComment.svgGroupId)
                                "
                                [compile-html-ref]="ref"></span>
                        </td>
                    </tr>
                }
            }
        </tbody>
    }
</table>

<ng-template #snippetModalTemplate let-modal>
    <div class="modal-header">
        <h5 class="modal-title">Abbildung: {{ snippetId }}</h5>
        <button type="button" class="btn-close" aria-label="Close modal" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body text-center">
        <img [src]="snippetSrc" alt="Abbildung: {{ snippetId }}" class="img-fluid" />
    </div>
</ng-template>
`;var G=`.awg-edition-tka-table caption{caption-side:top;text-align:left;color:var(--bs-primary-color)}.awg-edition-tka-table .measure{width:10%}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%}.awg-edition-tka-table .comment{width:auto}
`;var f=class{constructor(){this._editionGlyphService=l(u),this._editionSnippetService=l(C),this._ngbModal=l(k),this.isCorrections=!1,this.isRowTable=!1,this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.snippetId="",this.snippetSrc="",this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this.EDITION_UTILS=d,this.UTILS=v,this.ref=this}getComment(e,c){return this._editionSnippetService.getComment(e,c)}openSnippet(e,c=""){e&&(this.snippetSrc=e,this.snippetId=c,this._ngbModal.open(this.snippetModalTemplate,{size:"xl",centered:!0}))}getGlyph(e){return this._editionGlyphService.getGlyph(e)}getTableHeaderStrings(){let{rowTable:e,default:c,corrections:M}=this.tableHeaderStrings,n;return this.isRowTable?n=e:this.isCorrections?n=M:n=c,d.isSketchId(this.id)&&!this.isCorrections&&(n=n.map(g=>g.reference==="comment"?S(b({},g),{label:"Kommentar"}):g)),n}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={commentary:[{type:o}],id:[{type:o}],isCorrections:[{type:o}],isRowTable:[{type:o}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}],snippetModalTemplate:[{type:_,args:["snippetModalTemplate"]}]}}};f=i([m({selector:"awg-edition-tka-table",template:x,changeDetection:s.OnPush,standalone:!1,styles:[G]})],f);var L=class{};L=i([T({imports:[y],declarations:[p,h,f],exports:[p,h,f]})],L);export{d as a,L as b};
