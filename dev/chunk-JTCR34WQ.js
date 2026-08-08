import{c as _}from"./chunk-NSCSV7HB.js";import{a as C}from"./chunk-GYSG6DRK.js";import{o as u}from"./chunk-VWGHXSL6.js";import{Ua as i,Wa as t,Za as k,a as b,b as f,da as g,o,xa as r}from"./chunk-CMSQ57S3.js";var T=`@for (evaluation of evaluations; track $index) {
    <p class="awg-edition-tka-evaluation no-para-margin">
        <span [awgCompileHtml]="evaluation"></span>
    </p>
}
`;var h="";var n=class{static{this.propDecorators={evaluations:[{type:t}]}}};n=o([i({selector:"awg-edition-tka-evaluations",template:T,changeDetection:r.OnPush,standalone:!1,styles:[h]})],n);var I=`@if (labelType === 'evaluation') {
    <span>{{ EDITION_UTILS.isSketchId(id) ? 'Skizzenkommentar' : 'Quellenbewertung' }}</span>
} @else if (labelType === 'commentary') {
    <span>{{ EDITION_UTILS.isSketchId(id) ? 'Textkritische Kommentare' : 'Textkritische Anmerkungen' }}</span>
}
`;var S="";function D(e){return e?e.includes("_Sk")||e.includes("SkRT"):!1}function H(e){return e?e.includes("_WE"):!1}var l={isSketchId:D,isWorkEditionId:H};var m=class{constructor(){this.EDITION_UTILS=l}static{this.propDecorators={id:[{type:t}],labelType:[{type:t}]}}};m=o([i({selector:"awg-edition-tka-label",template:I,changeDetection:r.OnPush,standalone:!1,styles:[S]})],m);var E=`<table aria-label="Table for text-critical comments" class="table table-hover table-condensed awg-edition-tka-table">
    @if (commentary.preamble) {
        <caption class="awg-edition-tka-table-preamble mb-0">
            <span [awgCompileHtml]="commentary.preamble"> </span>
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
                            <span [awgCompileHtml]="textcriticalCommentBlock.blockHeader"></span>
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
                                [awgCompileHtml]="
                                    getComment(textcriticalComment.comment, textcriticalComment.svgGroupId)
                                "></span>
                        </td>
                    </tr>
                }
            }
        </tbody>
    }
</table>
`;var y=`.awg-edition-tka-table caption{caption-side:top;text-align:left;color:var(--bs-primary-color)}.awg-edition-tka-table .measure{width:10%}.awg-edition-tka-table .system{width:8%}.awg-edition-tka-table .location{width:15%}.awg-edition-tka-table .comment{width:auto}
`;var s=class{constructor(){this._editionSnippetService=g(_),this.isCorrections=!1,this.isRowtable=!1,this.EDITION_UTILS=l,this.UTILS=C,this.tableHeaderStrings={default:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Anmerkung"}],corrections:[{reference:"measure",label:"Takt"},{reference:"system",label:"System"},{reference:"location",label:"Ort im Takt"},{reference:"comment",label:"Korrektur"}],rowtable:[{reference:"measure",label:"Folio"},{reference:"system",label:"System"},{reference:"location",label:"Reihe/Reihenton"},{reference:"comment",label:"Anmerkung"}]}}getComment(c,p){return this._editionSnippetService.getComment(c,p)}getTableHeaderStrings(){let{rowtable:c,default:p,corrections:x}=this.tableHeaderStrings,a;return this.isRowtable?a=c:this.isCorrections?a=x:a=p,l.isSketchId(this.id)&&!this.isCorrections&&(a=a.map(d=>d.reference==="comment"?f(b({},d),{label:"Kommentar"}):d)),a}static{this.propDecorators={commentary:[{type:t}],id:[{type:t}],isCorrections:[{type:t}],isRowtable:[{type:t}]}}};s=o([i({selector:"awg-edition-tka-table",template:E,changeDetection:r.OnPush,standalone:!1,styles:[y]})],s);var w=class{};w=o([k({imports:[u],declarations:[n,m,s],exports:[n,m,s]})],w);export{l as a,w as b};
