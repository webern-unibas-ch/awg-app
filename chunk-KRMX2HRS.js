import{b as y,j as _,n as v}from"./chunk-RDLG764Q.js";import{Bc as h,Ca as k,Dc as C,M as i,R as a,a as f,aa as l,b as u,k as o,na as s,pa as t,qa as r,ta as S}from"./chunk-AX2RAKOO.js";var T=`@for (evaluation of evaluations; track $index) {
    <p class="awg-edition-tka-evaluation no-para-margin">
        <span [compile-html]="evaluation" [compile-html-ref]="ref"></span>
    </p>
}
`;var R="";var c=class{constructor(){this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this._editionGlyphService=i(h),this.ref=this}getGlyph(e){return this._editionGlyphService.getGlyph(e)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={evaluations:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}]}}};c=o([s({selector:"awg-edition-tka-evaluations",template:T,changeDetection:l.OnPush,standalone:!1,styles:[R]})],c);var w=`@if (labelType === 'evaluation') {
    <span>{{ UTILS.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'commentary') {
    <span>{{ UTILS.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var E="";var p=class{constructor(){this.UTILS=i(_)}static{this.propDecorators={id:[{type:t}],labelType:[{type:t}]}}};p=o([s({selector:"awg-edition-tka-label",template:w,changeDetection:l.OnPush,standalone:!1,styles:[E]})],p);var x=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
    @if (commentary.preamble) {
        <caption class="awg-edition-tka-table-preamble mb-0">
            <span [compile-html]="commentary.preamble" [compile-html-ref]="ref"> </span>
        </caption>
    }
    @if (commentary.comments.length > 0) {
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
`;var I=`.awg-edition-tka-table caption{caption-side:top;text-align:left;color:var(--bs-primary-color)}.awg-edition-tka-table .measure{width:10%}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%}.awg-edition-tka-table .comment{width:auto}
`;var d=class{constructor(){this.isCorrections=!1,this.isRowTable=!1,this.isSketchId=!1,this.navigateToReportFragmentRequest=new a,this.openModalRequest=new a,this.selectSvgSheetRequest=new a,this.snippetId="",this.snippetSrc="",this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowTable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]},this._editionGlyphService=i(h),this._editionSnippetService=i(C),this._ngbModal=i(y),this.ref=this}getComment(e,m){return this._editionSnippetService.getComment(e,m)}openSnippet(e,m=""){e&&(this.snippetSrc=e,this.snippetId=m,this._ngbModal.open(this.snippetModalTemplate,{size:"xl",centered:!0}))}getGlyph(e){return this._editionGlyphService.getGlyph(e)}getTableHeaderStrings(){let{rowTable:e,default:m,corrections:M}=this.tableHeaderStrings,n;return this.isRowTable?n=e:this.isCorrections?n=M:n=m,this.isSketchId&&!this.isCorrections&&(n=n.map(b=>b.reference==="comment"?u(f({},b),{label:"Kommentar"}):b)),n}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={commentary:[{type:t}],isCorrections:[{type:t}],isRowTable:[{type:t}],isSketchId:[{type:t}],navigateToReportFragmentRequest:[{type:r}],openModalRequest:[{type:r}],selectSvgSheetRequest:[{type:r}],snippetModalTemplate:[{type:k,args:["snippetModalTemplate"]}]}}};d=o([s({selector:"awg-edition-tka-table",template:x,changeDetection:l.OnPush,standalone:!1,styles:[I]})],d);var G=class{};G=o([S({imports:[v],declarations:[c,p,d],exports:[c,p,d]})],G);export{G as a};
