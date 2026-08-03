import{a as N,b as D}from"./chunk-B77NQ2CI.js";import{a as F}from"./chunk-XRWB3SYN.js";import"./chunk-ZAXB24NU.js";import{a}from"./chunk-GYSG6DRK.js";import"./chunk-GBI2TVDL.js";import"./chunk-3F66QUQP.js";import"./chunk-HSPLQNXS.js";import{n as R}from"./chunk-LKUGNIAA.js";import{F as f,T as O,U}from"./chunk-VO57L6S6.js";import{e as A,i as $}from"./chunk-DX47K3DJ.js";import"./chunk-EAJ52H3N.js";import"./chunk-URVJE2OJ.js";import"./chunk-YAUH37H7.js";import{Ua as r,Wa as i,Xa as o,Za as g,da as y,ka as t,kb as k,o as s,xa as n}from"./chunk-GMYBPKKG.js";var G=`<table class="awg-source-description-content-table half-para-margin" role="presentation">
    @for (folio of content.folios; track $index; let lastFolio = $last) {
        <ng-template #folioCellTemplate let-folio>
            <td
                [attr.colspan]="UTILS.isEmptyArray(folio.systemGroups) ? 2 : 1"
                class="awg-source-description-content-table-datacell">
                @if (folio.folioLinkTo) {
                    @let folioSheetIds = { complexId: content.itemLinkTo.complexId, sheetId: folio.folioLinkTo };
                    <a
                        (click)="selectSvgSheet(folioSheetIds)"
                        (keyup.enter)="selectSvgSheet(folioSheetIds)"
                        role="link"
                        tabindex="0"
                        ><ng-template *ngTemplateOutlet="folioTemplate; context: { $implicit: folio }"
                    /></a>
                } @else {
                    <ng-template *ngTemplateOutlet="folioTemplate; context: { $implicit: folio }" />
                }
                @if (folio.folioDescription) {
                    <span class="awg-source-description-content-item-folio-description"
                        >&nbsp;&nbsp;<span [compile-html]="folio.folioDescription" [compile-html-ref]="ref"></span
                    ></span>
                }
                <ng-template #folioTemplate let-folio>
                    <span class="awg-source-description-content-item-folio">
                        @if (folio.isPage) {
                            <span class="awg-source-description-content-item-folio-type"
                                ><span [awgAbbr]="'S.'"></span>&nbsp;</span
                            >
                        } @else {
                            <span class="awg-source-description-content-item-folio-type"
                                ><span [awgAbbr]="'Bl.'"></span>&nbsp;</span
                            >
                        }
                        @if (folio.folio.endsWith('v') || folio.folio.endsWith('r')) {
                            <span class="awg-source-description-content-item-folio-number"
                                >{{ folio.folio.slice(0, -1)
                                }}<sup class="awg-source-description-content-item-folio-side">{{
                                    folio.folio.slice(-1)
                                }}</sup></span
                            >
                        } @else {
                            <span>{{ folio.folio }}</span>
                        }
                    </span>
                </ng-template>
            </td>
        </ng-template>
        <ng-template #emptyCellTemplate>
            <td class="awg-source-description-content-table-datacell"></td>
        </ng-template>

        @if (UTILS.isEmptyArray(folio.systemGroups)) {
            <!-- no folio system groups, only folio description -->
            <tr class="awg-source-description-content-table-row">
                @if (folio.folio) {
                    <ng-template *ngTemplateOutlet="folioCellTemplate; context: { $implicit: folio }" />
                }
            </tr>
        } @else {
            <!-- folio system groups are present -->
            @for (
                systemGroup of folio.systemGroups;
                track $index;
                let firstSystemGroup = $first;
                let lastSystemGroup = $last
            ) {
                <tr class="awg-source-description-content-table-row">
                    <!-- get folio number in first column -->
                    @if (firstSystemGroup) {
                        @if (folio.folio) {
                            <ng-template *ngTemplateOutlet="folioCellTemplate; context: { $implicit: folio }" />
                        } @else {
                            <ng-template *ngTemplateOutlet="emptyCellTemplate" />
                        }
                    } @else {
                        <ng-template *ngTemplateOutlet="emptyCellTemplate" />
                    }
                    <!-- get systems in other columns -->
                    @for (
                        system of systemGroup;
                        track $index;
                        let systemIndex = $index;
                        let firstSystem = $first;
                        let lastSystem = $last
                    ) {
                        <td class="awg-source-description-content-table-datacell">
                            <ng-template #systemTemplate let-system>&nbsp;&nbsp;System&nbsp;{{ system }}</ng-template>

                            @if (system.system) {
                                <span class="awg-source-description-content-item-system">
                                    <ng-template
                                        *ngTemplateOutlet="systemTemplate; context: { $implicit: system.system }"
                                /></span>
                            }

                            @if (system.systemDescription || system.measure || system.row) {
                                <span>:&nbsp;</span>
                            }

                            @if (system.systemDescription) {
                                <span class="awg-source-description-content-item-system-description">
                                    <span [compile-html]="system.systemDescription" [compile-html-ref]="ref"></span>
                                    @if (system.measure) {
                                        <span>&nbsp;</span>
                                    }
                                </span>
                            }

                            @if (system.measure) {
                                <span class="awg-source-description-content-item-measure">
                                    @if (system.linkTo) {
                                        @let systemSheetIds =
                                            { complexId: content.itemLinkTo.complexId, sheetId: system.linkTo };
                                        <a
                                            (click)="selectSvgSheet(systemSheetIds)"
                                            (keyup.enter)="selectSvgSheet(systemSheetIds)"
                                            role="link"
                                            tabindex="0"
                                            ><ng-template
                                                *ngTemplateOutlet="
                                                    measureTemplate;
                                                    context: { $implicit: system.measure }
                                                "
                                        /></a>
                                    } @else {
                                        <ng-template
                                            *ngTemplateOutlet="
                                                measureTemplate;
                                                context: { $implicit: system.measure }
                                            " />
                                    }
                                    <ng-template #measureTemplate let-measure
                                        ><span><span [awgAbbr]="'T.'"></span>&nbsp;{{ measure }}</span></ng-template
                                    ></span
                                >
                            }

                            @if (!UTILS.isEmptyObject(system.row)) {
                                <span class="awg-source-description-content-item-row">
                                    <ng-template #rowTemplate let-row>
                                        <span
                                            ><span
                                                >{{ row.rowType }}<sub>{{ row.rowBase }}</sub></span
                                            >
                                            @if (row.rowNumber) {
                                                <span> ({{ row.rowNumber }})</span>
                                            }
                                        </span></ng-template
                                    >

                                    @if (system.linkTo) {
                                        @let systemRowSheetIds =
                                            { complexId: content.itemLinkTo.complexId, sheetId: system.linkTo };
                                        <a
                                            (click)="selectSvgSheet(systemRowSheetIds)"
                                            (keyup.enter)="selectSvgSheet(systemRowSheetIds)"
                                            role="link"
                                            tabindex="0"
                                            ><ng-template
                                                *ngTemplateOutlet="rowTemplate; context: { $implicit: system.row }" />
                                        </a>
                                    } @else {
                                        <ng-template
                                            *ngTemplateOutlet="rowTemplate; context: { $implicit: system.row }" />
                                    }
                                </span>
                            }

                            @if (lastFolio && lastSystemGroup && lastSystem) {
                                <span>.</span>
                            } @else {
                                <span>;</span>
                            }
                        </td>
                    }
                </tr>
            }
        }
    }
</table>
`;var P=`.awg-source-description-content-table{margin-left:25px}
`;var b=class{constructor(){this.selectSvgSheetRequest=new t,this.UTILS=a,this.ref=this}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={content:[{type:i}],selectSvgSheetRequest:[{type:o}]}}};b=s([r({selector:"awg-source-description-content-table",template:G,changeDetection:n.OnPush,standalone:!1,styles:[P]})],b);var B=`<div class="awg-source-description-contents">
    <p class="awg-source-description-contents-label no-para-margin">
        <span class="smallcaps">Inhalt:</span>
        <span class="awg-source-description-contents-toggle text-muted small">
            [
            <span
                class="awg-source-description-contents-toggle-text"
                (click)="toggleAllContentDetails(!openAllContentDetails)"
                (keyup.enter)="toggleAllContentDetails(!openAllContentDetails)"
                [attr.aria-expanded]="openAllContentDetails"
                tabindex="0"
                role="button"
                >Alles {{ openAllContentDetails ? 'ein' : 'aus' }}klappen</span
            >
            ]
        </span>
    </p>

    @for (content of contents; track $index) {
        @if (content.item || content.itemDescription) {
            <details
                class="awg-source-description-content-details half-para-margin"
                [id]="$index"
                [attr.open]="openAllContentDetails ? '' : null">
                <!-- content.itemDescription -->

                <summary class="awg-source-description-content-item-summary no-para-margin">
                    <span class="awg-source-description-content-item">
                        @if (content.item) {
                            @if (UTILS.isEmptyObject(content.itemLinkTo)) {
                                <strong>{{ content.item }}</strong>
                            } @else {
                                @let sheetIds =
                                    { complexId: content.itemLinkTo.complexId, sheetId: content.itemLinkTo.sheetId };
                                <a
                                    (click)="selectSvgSheet(sheetIds)"
                                    (keyup.enter)="selectSvgSheet(sheetIds)"
                                    role="link"
                                    tabindex="0"
                                    ><strong>{{ content.item }}</strong></a
                                >
                            }

                            @if (content.itemDescription) {
                                <span>&nbsp;</span>
                            }
                        }

                        @if (content.itemDescription) {
                            <span class="awg-source-description-content-item-description"
                                ><span [compile-html]="content.itemDescription" [compile-html-ref]="ref"></span
                            ></span>
                        }
                        <span>:</span><br />
                    </span>
                </summary>

                <!-- content.folios -->
                @if (!UTILS.isEmptyArray(content?.folios)) {
                    <awg-source-description-content-table
                        [content]="content"
                        (selectSvgSheetRequest)="selectSvgSheet($event)" />
                }
            </details>
        } @else if (!UTILS.isEmptyArray(content?.folios)) {
            <awg-source-description-content-table
                [content]="content"
                (selectSvgSheetRequest)="selectSvgSheet($event)" />
        }
    }
</div>
`;var W=`.awg-source-description-contents{margin-bottom:1rem}.awg-source-description-contents-toggle{margin-left:1em;cursor:pointer}.awg-source-description-contents-toggle.text-muted{transition:color .2s}.awg-source-description-contents-toggle:hover,.awg-source-description-contents-toggle:focus{color:inherit!important}.awg-source-description-contents-toggle-text{text-decoration:underline}
`;var T=class{constructor(){this.selectSvgSheetRequest=new t,this.openAllContentDetails=!0,this.UTILS=a,this.ref=this}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleAllContentDetails(e){this.openAllContentDetails=e}static{this.ctorParameters=()=>[]}static{this.propDecorators={contents:[{type:i}],selectSvgSheetRequest:[{type:o}]}}};T=s([r({selector:"awg-source-description-contents",template:B,changeDetection:n.OnPush,standalone:!1,styles:[W]})],T);var j=`<div class="awg-source-description-corrections">
    <p class="awg-source-description-corrections-label no-para-margin">
        <span class="smallcaps">Korrekturen:</span>
        <span class="awg-source-description-corrections-toggle text-muted small"
            >[
            <span
                class="awg-source-description-corrections-toggle-text"
                (click)="toggleAllCorrectionDetails(!openAllCorrectionDetails)"
                (keyup.enter)="toggleAllCorrectionDetails(!openAllCorrectionDetails)"
                [attr.aria-expanded]="openAllCorrectionDetails"
                tabindex="0"
                role="button"
                >Alles {{ openAllCorrectionDetails ? 'ein' : 'aus' }}klappen</span
            >
            ]</span
        >
    </p>
    @for (correction of corrections; track correction.id) {
        <details
            class="awg-source-description-correction-details half-para-margin"
            [id]="correction.id"
            [attr.open]="openAllCorrectionDetails ? '' : null">
            <summary
                class="awg-source-description-correction-summary no-para-margin"
                [compile-html]="correction.label + ':'"
                [compile-html-ref]="ref"></summary>
            <div class="p-3 border rounded-3">
                @for (evaluation of correction.evaluations; track $index) {
                    <p
                        class="awg-source-description-correction-evaluation mb-0"
                        [compile-html]="evaluation"
                        [compile-html-ref]="ref"></p>
                }
                @if (correction.commentary.comments.length > 0) {
                    <awg-edition-tka-table
                        [commentary]="correction.commentary"
                        [isCorrections]="true"
                        [isRowtable]="correction.rowtable"
                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                        (openModalRequest)="openModal($event)"
                        (selectSvgSheetRequest)="selectSvgSheet($event)" />
                }
            </div>
        </details>
    }
</div>
`;var H=`.awg-source-description-corrections-toggle{margin-left:1em;cursor:pointer}.awg-source-description-corrections-toggle.text-muted{transition:color .2s}.awg-source-description-corrections-toggle:hover,.awg-source-description-corrections-toggle:focus{color:inherit!important}.awg-source-description-corrections-toggle-text{text-decoration:underline}
`;var C=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.openAllCorrectionDetails=!1,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}toggleAllCorrectionDetails(e){this.openAllCorrectionDetails=e}static{this.ctorParameters=()=>[]}static{this.propDecorators={corrections:[{type:i}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}],selectSvgSheetRequest:[{type:o}]}}};C=s([r({selector:"awg-source-description-corrections",template:j,changeDetection:n.OnPush,standalone:!1,styles:[H]})],C);var z=`@if (!UTILS.isEmptyArray(details)) {
    <p class="awg-source-description-{{ detailsClass }}">
        @if (detailsLabel) {
            <span class="awg-source-description-details-label smallcaps">{{ detailsLabel }}:&nbsp;</span>
        }
        <span class="awg-source-description-details-content">
            @for (detail of details; track $index; let lastDetail = $last) {
                <span [compile-html]="detail" [compile-html-ref]="ref"></span>
                @if (detailsClass !== 'conditions') {
                    @if (!lastDetail) {
                        <span>;</span><br />
                    } @else {
                        <span>.</span>
                    }
                }
            }
        </span>
    </p>
}
`;var K=`p{display:flex;align-items:baseline}p .awg-source-description-details-label{flex-shrink:0;white-space:nowrap}p .awg-source-description-details-content{flex:1}
`;var _=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.UTILS=a,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={details:[{type:i}],detailsClass:[{type:i}],detailsLabel:[{type:i}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}],selectSvgSheetRequest:[{type:o}]}}};_=s([r({selector:"awg-source-description-details",template:z,changeDetection:n.OnPush,standalone:!1,styles:[K]})],_);var Q=`<p class="awg-source-description-writing-materials">
    <span class="awg-source-description-writing-materials-label smallcaps">Beschreibstoff:&nbsp;</span>
    <span class="awg-source-description-writing-materials-content">
        @for (writingMaterial of writingMaterials; track $index; let lastWritingMaterial = $last) {
            <span class="awg-source-description-writing-material">
                @if (writingMaterial.materialType) {
                    <span class="awg-source-description-writing-material-type">{{ writingMaterial.materialType }}</span
                    >,
                }
                @if (!UTILS.isEmptyObject(writingMaterial.systems)) {
                    <span class="awg-source-description-writing-material-systems">
                        {{ getSystems(writingMaterial.systems) }}</span
                    >,
                }
                @if (!UTILS.isEmptyObject(writingMaterial.dimensions)) {
                    <span class="awg-source-description-writing-material-dimensions">
                        {{ getDimensions(writingMaterial.dimensions) }}</span
                    >,
                }
                @if (
                    !UTILS.isEmptyObject(writingMaterial.trademark) &&
                    (writingMaterial.trademark?.variant || writingMaterial.trademark?.alt)
                ) {
                    <span class="awg-source-description-writing-material-trademark"
                        ><span>Firmenzeichen: </span>
                        @if (writingMaterial.trademark.variant) {
                            <br /><img
                                class="img-thumbnail"
                                [src]="getTrademark(writingMaterial.trademark.variant)?.route"
                                [title]="getTrademark(writingMaterial.trademark.variant)?.full"
                                [alt]="getTrademark(writingMaterial.trademark.variant)?.short" /><br />
                        } @else {
                            <span [compile-html]="writingMaterial.trademark.alt" [compile-html-ref]="ref"></span>&nbsp;
                        }
                    </span>
                    @for (locus of writingMaterial.trademark.locus; track $index) {
                        <span
                            class="awg-source-description-writing-material-trademark-locus"
                            [innerHTML]="getItemLocus(locus)"></span>
                    }
                } @else {
                    <span class="awg-source-description-writing-material-trademark">kein Firmenzeichen</span>
                }
                @if (!UTILS.isEmptyObject(writingMaterial.watermark) && writingMaterial.watermark?.variant) {
                    <span class="awg-source-description-writing-material-watermark"
                        ><span>, Wasserzeichen: </span>
                        @if (writingMaterial.watermark.variant) {
                            <span
                                ><em>{{ writingMaterial.watermark.variant }}</em></span
                            >&nbsp;
                        }
                    </span>
                    @for (locus of writingMaterial.watermark.locus; track $index) {
                        <span [innerHTML]="getItemLocus(locus)"></span>
                    }
                    <span>&nbsp;lesbar</span>
                }
                @if (writingMaterial.folioAddendum) {
                    <span class="awg-source-description-writing-material-folio-addendum"
                        >&nbsp;(Bl. {{ writingMaterial.folioAddendum }})</span
                    >
                }
                @if (!lastWritingMaterial) {
                    <span>;</span><br />
                } @else {
                    <span>.</span>
                }
            </span>
        }
    </span>
</p>
`;var V=`p{display:flex;align-items:baseline}p .awg-source-description-writing-materials-label{flex-shrink:0;white-space:nowrap}p .awg-source-description-writing-materials-content{flex:1}
`;var x=class{constructor(){this.UTILS=a,this.TRADEMARKS=O,this.ref=this}getTrademark(e){return e&&this.TRADEMARKS[e]?this.TRADEMARKS[e]:{route:"",full:"Not a known trademark.",short:"unknown"}}getItemLocus(e){if(a.isEmptyObject(e))return"";let c=p=>p.endsWith("v")||p.endsWith("r")?`${p.slice(0,-1)}<sup>${p.slice(-1)}</sup>`:p,m=p=>p.length===1?p[0].includes("all")?"auf allen Bl\xE4ttern":`auf Bl. ${p[0]}`:p.length>1?`auf Bl. ${p.slice(0,-1).join(", ")} und ${p.slice(-1)}`:"",d=e.folios.map(c),S=m(d),w=e.preFolioInfo?`${e.preFolioInfo} `:"",u=S?" ":"",ce=e.position?`${u}${e.position}`:"";return`${w}${S}${ce}`}getDimensions(e){let{orientation:c,height:m,width:d,unit:S}=e,w=u=>a.isEmptyObject(u)?"":u.uncertainty?`${u.uncertainty} ${u.value}`:u.value;return`Format: ${c} ${w(m)} \xD7 ${w(d)} ${S}`}getSystems(e){return[`${e.totalSystems} ${e.totalSystems===1?"System":"Systeme"}`,e.totalSystemsAddendum&&` (${e.totalSystemsAddendum})`,e.additionalInfo&&`, ${e.additionalInfo}`].filter(Boolean).join("")}static{this.ctorParameters=()=>[]}static{this.propDecorators={writingMaterials:[{type:i}]}}};x=s([r({selector:"awg-source-description-writing-materials",template:Q,changeDetection:n.OnPush,standalone:!1,styles:[V]})],x);var Z=`@if (sourceDescriptionListData) {
    <div class="awg-source-description-list">
        @for (sourceDescription of sourceDescriptionListData.sources; track sourceDescription.id) {
            <div class="awg-source-description card mb-2" [id]="sourceDescription.id">
                <div class="card-body">
                    <div class="awg-source-description-head">
                        <!-- siglum -->
                        @if (sourceDescription.siglum) {
                            <p class="awg-source-description-siglum-container bold">
                                @if (sourceDescription.missing) {
                                    <span>[</span>
                                }
                                <span class="awg-source-description-siglum">{{ sourceDescription.siglum }}</span>
                                @if (sourceDescription.siglumAddendum) {
                                    <span class="awg-source-description-siglum-addendum"
                                        ><sup>{{ sourceDescription.siglumAddendum }}</sup></span
                                    >
                                }
                                @if (sourceDescription.missing) {
                                    <span>]</span>
                                }
                            </p>
                        }
                        <!-- type -->
                        @if (sourceDescription.type) {
                            <p
                                class="awg-source-description-type"
                                [compile-html]="sourceDescription.type"
                                [compile-html-ref]="ref"></p>
                        }
                        <!-- location -->
                        @if (sourceDescription.location) {
                            <p class="awg-source-description-location" [awgAbbr]="sourceDescription.location"></p>
                        }
                    </div>
                    <!-- physDesc -->
                    @if (!UTILS.isEmptyObject(sourceDescription.physDesc)) {
                        <div class="awg-source-description-phys-desc">
                            <!-- conditions -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.conditions)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.conditions"
                                    detailsLabel=""
                                    detailsClass="conditions"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- writingMaterials -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.writingMaterials)) {
                                <awg-source-description-writing-materials
                                    [writingMaterials]="sourceDescription.physDesc.writingMaterials" />
                            } @else if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.writingMaterialStrings)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.writingMaterialStrings"
                                    detailsLabel="Beschreibstoff"
                                    detailsClass="writing-materials"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- writingInstruments -->
                            @if (!UTILS.isEmptyObject(sourceDescription.physDesc.writingInstruments)) {
                                @if (sourceDescription.physDesc.writingInstruments.main) {
                                    <p class="awg-source-description-writing-instruments">
                                        <span class="smallcaps">Schreibstoff:&nbsp;</span>
                                        <span
                                            [compile-html]="
                                                getWritingInstruments(sourceDescription.physDesc.writingInstruments)
                                            "
                                            [compile-html-ref]="ref"></span>
                                    </p>
                                }
                            }
                            <!-- title -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.titles)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.titles"
                                    detailsLabel="Titel"
                                    detailsClass="titles"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- date -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.dates)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.dates"
                                    detailsLabel="Datierung"
                                    detailsClass="dates"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- pagination -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.paginations)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.paginations"
                                    detailsLabel="Paginierung"
                                    detailsClass="paginations"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- measureNumbers -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.measureNumbers)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.measureNumbers"
                                    detailsLabel="Taktzahlen"
                                    detailsClass="measure-numbers"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- instrumentation -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.instrumentations)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.instrumentations"
                                    detailsLabel="Instrumentenvorsatz"
                                    detailsClass="instrumentations"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- annotations -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.annotations)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.annotations"
                                    detailsLabel="Eintragungen"
                                    detailsClass="annotations"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                            <!-- contents -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.contents)) {
                                <awg-source-description-contents
                                    [contents]="sourceDescription.physDesc.contents"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }

                            <!-- corrections -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.corrections)) {
                                <awg-source-description-corrections
                                    [corrections]="sourceDescription.physDesc.corrections"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)" />
                            }
                        </div>
                    }
                </div>
            </div>
        }
    </div>
}
`;var J="";var h=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.UTILS=a,this.ref=this}getWritingInstruments(e){let c=e.secondary?.join(", ");return`${c?`${e.main}; ${c}`:e.main}.`}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={sourceDescriptionListData:[{type:i}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}],selectSvgSheetRequest:[{type:o}]}}};h=s([r({selector:"awg-source-description",template:Z,changeDetection:n.OnPush,standalone:!1,styles:[J]})],h);var I=class{};I=s([g({imports:[R,D],declarations:[h,T,b,C,_,x],exports:[h]})],I);var X=`@if (sourceEvaluationListData) {
    <div class="awg-source-evaluation-list card">
        <div class="card-body">
            @if (UTILS.isEmptyArray(sourceEvaluationListData.sources?.[0]?.content)) {
                <p class="awg-source-evaluation-empty p-5 border rounded-3">
                    <small class="text-muted"
                        >[Die Quellenbewertung zum Editionskomplex
                        <span [innerHTML]="editionComplex.complexId.full"></span> erscheint im Zusammenhang der
                        vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex.complexId.short"></span> in
                        {{ editionRouteConstants.EDITION.short }} {{ editionComplex.pubStatement.series.short }}/{{
                            editionComplex.pubStatement.section.short
                        }}.]
                    </small>
                </p>
            } @else {
                @for (evaluation of sourceEvaluationListData.sources?.[0]?.content; track evaluation) {
                    <p class="awg-source-evaluation-entry" [compile-html]="evaluation" [compile-html-ref]="this"></p>
                }
            }
        </div>
    </div>
}
`;var Y="";var E=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.UTILS=a,this.ref=this}get editionRouteConstants(){return f}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={editionComplex:[{type:i}],sourceEvaluationListData:[{type:i}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}],selectSvgSheetRequest:[{type:o}]}}};E=s([r({selector:"awg-source-evaluation",template:X,changeDetection:n.OnPush,standalone:!1,styles:[Y]})],E);var ee=`<div class="card">
    <div class="card-body">
        @if (!UTILS.isEmptyArray(sourceListData.sources)) {
            <table aria-label="Table for list of sources" class="table table-hover borderless awg-source-list-sources">
                <tbody>
                    @for (source of sourceListData.sources; track $index; let sourceIndex = $index) {
                        <tr>
                            <th scope="row" [id]="source.siglum + (source.siglumAddendum ?? '')" class="text-nowrap">
                                <span class="awg-source-list-siglum-container">
                                    <ng-template #siglum>
                                        <span class="awg-source-list-siglum">{{ source.siglum }}</span>
                                        @if (source.siglumAddendum) {
                                            <span class="awg-source-list-siglum-addendum">
                                                <sup>{{ source.siglumAddendum }}</sup>
                                            </span>
                                        }
                                    </ng-template>
                                    <ng-template #siglumMissingOrNot>
                                        @if (source.missing) {
                                            <span>[</span>
                                        }
                                        <ng-container *ngTemplateOutlet="siglum" />
                                        @if (source.missing) {
                                            <span>]</span>
                                        }
                                    </ng-template>

                                    @if (source.hasDescription || source.linkTo) {
                                        <a
                                            (click)="onSourceClick(source)"
                                            (keyup.enter)="onSourceClick(source)"
                                            role="link"
                                            tabindex="0">
                                            <ng-container *ngTemplateOutlet="siglumMissingOrNot" />
                                        </a>
                                    } @else {
                                        <ng-container *ngTemplateOutlet="siglumMissingOrNot" />
                                    }
                                </span>
                            </th>
                            <td>
                                <span [compile-html]="source.type" [compile-html-ref]="ref"></span> <br />
                                <span class="text-muted" [awgAbbr]="source.location"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        }
        @if (!UTILS.isEmptyArray(sourceListData.textSources)) {
            <table
                aria-label="Table for list of text sources"
                class="table table-hover borderless awg-source-list-text-sources">
                <tbody>
                    <tr>
                        <td colspan="2">Zum vertonten Text:</td>
                    </tr>
                    @for (textSource of sourceListData.textSources; track textSource.id; let textIndex = $index) {
                        <tr>
                            <th scope="row" [id]="textSource.id">
                                <span class="awg-source-list-text-siglum-container"
                                    ><span class="awg-source-list-text-siglum">{{ textSource.siglum }}</span>
                                    @if (textSource.siglumAddendum) {
                                        <span class="awg-source-list-text-siglum-addendum"
                                            ><sup>{{ textSource.siglumAddendum }}</sup></span
                                        >
                                    }
                                </span>
                            </th>
                            <td>
                                <span [compile-html]="textSource.type" [compile-html-ref]="ref"></span> <br />
                                <span class="text-muted" [innerHTML]="textSource.location"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        }
    </div>
</div>
`;var te="";var L=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.UTILS=a,this.ref=this}onSourceClick(e){e.hasDescription?this.navigateToReportFragment({complexId:"",fragmentId:e.linkTo}):this._openModal(e.linkTo)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}_openModal(e){e&&this.openModalRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={sourceListData:[{type:i}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}]}}};L=s([r({selector:"awg-source-list",template:ee,changeDetection:n.OnPush,standalone:!1,styles:[te]})],L);var oe=`@if (textcriticsListData) {
    <div ngbAccordion>
        @for (textcritics of textcriticsListData.textcritics; track textcritics.id) {
            <div [ngbAccordionItem]="textcritics.id" [collapsed]="true">
                <div
                    ngbAccordionHeader
                    class="accordion-button awg-accordion-button-custom-header justify-content-between">
                    <button ngbAccordionToggle class="btn btn-link text-start p-0">
                        <span [compile-html]="textcritics.label" [compile-html-ref]="ref"></span>
                    </button>
                    <div class="btn-group" role="group" aria-label="Button to sheets">
                        @if (EDITION_UTILS.isWorkEditionId(textcritics.id)) {
                            <button type="button" class="btn btn-sm btn-outline-info">
                                <awg-disclaimer-workeditions />
                            </button>
                        }
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-info"
                            [disabled]="EDITION_UTILS.isWorkEditionId(textcritics.id)"
                            (click)="selectSvgSheet({ complexId: '', sheetId: textcritics.id })">
                            Zum edierten Notentext
                        </button>
                    </div>
                </div>
                <div ngbAccordionCollapse>
                    <div ngbAccordionBody>
                        <ng-template>
                            <div class="mb-4">
                                <p class="smallcaps">
                                    <awg-edition-tka-label [id]="textcritics.id" [labelType]="'evaluation'" />:
                                </p>
                                @if (UTILS.isEmptyArray(textcritics.evaluations)) {
                                    <ng-container *ngTemplateOutlet="noContent" />
                                } @else {
                                    <awg-edition-tka-evaluations
                                        [evaluations]="textcritics.evaluations"
                                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                        (openModalRequest)="openModal($event)"
                                        (selectSvgSheetRequest)="selectSvgSheet($event)" />
                                }
                            </div>
                            <div>
                                <p class="smallcaps">
                                    <awg-edition-tka-label [id]="textcritics.id" [labelType]="'commentary'" />:
                                </p>
                                @if (UTILS.isEmptyArray(textcritics.commentary?.comments)) {
                                    <ng-container *ngTemplateOutlet="noContent" />
                                } @else {
                                    <awg-edition-tka-table
                                        [commentary]="textcritics.commentary"
                                        [id]="textcritics.id"
                                        [isRowtable]="textcritics.rowtable"
                                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                        (openModalRequest)="openModal($event)"
                                        (selectSvgSheetRequest)="selectSvgSheet($event)" />
                                }
                            </div>
                            <ng-template #noContent>
                                <p>
                                    <small class="text-muted">[Nicht vorhanden.]</small>
                                </p>
                            </ng-template>
                        </ng-template>
                    </div>
                </div>
            </div>
        }
    </div>
}
`;var se="";var M=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.EDITION_UTILS=N,this.UTILS=a,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={textcriticsListData:[{type:i}],navigateToReportFragmentRequest:[{type:o}],openModalRequest:[{type:o}],selectSvgSheetRequest:[{type:o}]}}};M=s([r({selector:"awg-textcritics-list",template:oe,changeDetection:n.OnPush,standalone:!1,styles:[se]})],M);var ie=`<!-- content: edition report -->
<div>
    <!-- modal -->
    <awg-modal #modal />

    <!-- report -->
    @if (viewData(); as view) {
        @if (view.error; as errorObject) {
            <awg-alert-error [errorObject]="errorObject" />
        } @else if (view.isLoading) {
            <awg-twelve-tone-spinner />
        } @else {
            <div class="awg-edition-report-view" ngbAccordion>
                <!-- source list -->
                <div ngbAccordionItem="awg-source-list" [collapsed]="false">
                    <div ngbAccordionHeader>
                        <button ngbAccordionButton>{{ titles.sourceList }}</button>
                    </div>
                    <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                            <ng-template>
                                @if (view.data.sourceListData; as sourceListData) {
                                    <awg-source-list
                                        [sourceListData]="sourceListData"
                                        (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                        (openModalRequest)="onModalOpen($event)" />
                                }
                            </ng-template>
                        </div>
                    </div>
                </div>
                <!-- source description -->
                <div ngbAccordionItem="awg-source-desc" [collapsed]="false">
                    <div ngbAccordionHeader>
                        <button ngbAccordionButton>{{ titles.sourceDescription }}</button>
                    </div>
                    <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                            <ng-template>
                                @if (view.data.sourceDescriptionData; as sourceDescriptionListData) {
                                    <awg-source-description
                                        [sourceDescriptionListData]="sourceDescriptionListData"
                                        (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                        (openModalRequest)="onModalOpen($event)"
                                        (selectSvgSheetRequest)="onSvgSheetSelect($event)" />
                                }
                            </ng-template>
                        </div>
                    </div>
                </div>
                <!-- source evaluation -->
                <div ngbAccordionItem="awg-source-evaluation" [collapsed]="false">
                    <div ngbAccordionHeader>
                        <button ngbAccordionButton>{{ titles.sourceEvaluation }}</button>
                    </div>
                    <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                            <ng-template>
                                @if (view.data.sourceEvaluationData; as sourceEvaluationListData) {
                                    <awg-source-evaluation
                                        [editionComplex]="selectedEditionComplex()"
                                        [sourceEvaluationListData]="sourceEvaluationListData"
                                        (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                        (openModalRequest)="onModalOpen($event)"
                                        (selectSvgSheetRequest)="onSvgSheetSelect($event)" />
                                }
                            </ng-template>
                        </div>
                    </div>
                </div>
                <!-- text critics -->
                <div ngbAccordionItem="awg-tka-panel" [collapsed]="false">
                    <div ngbAccordionHeader>
                        <button ngbAccordionButton>{{ titles.tka }}</button>
                    </div>
                    <div ngbAccordionCollapse>
                        <div ngbAccordionBody>
                            <ng-template>
                                @if (view.data.textcriticsData; as textcriticsData) {
                                    <awg-textcritics-list
                                        [textcriticsListData]="textcriticsData"
                                        (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                        (openModalRequest)="onModalOpen($event)"
                                        (selectSvgSheetRequest)="onSvgSheetSelect($event)" />
                                }
                            </ng-template>
                        </div>
                    </div>
                </div>
            </div>
        }
    }
</div>
`;var ne="";var v=class{constructor(){this._router=y(A),this.selectedEditionComplex=y(U).selectedEditionComplex,this.viewData=y(F).reportViewData,this.titles={sourceList:"1. Quellen\xFCbersicht",sourceDescription:"2. Quellenbeschreibung",sourceEvaluation:"3. Quellenbewertung",tka:"4. Textkritische Anmerkungen"}}onModalOpen(e){e&&this.modal.open(e)}onReportFragmentNavigate(e){let c=f.EDITION_REPORT.route,m={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,c,m)}onSvgSheetSelect(e){let c=f.EDITION_SHEETS.route,m={queryParams:{id:e?.sheetId??""}};this._navigateWithComplexId(e?.complexId,c,m)}_navigateWithComplexId(e,c,m){let d=e?`/edition/complex/${e}`:this.selectedEditionComplex()?.baseRoute??"/edition/series";this._router.navigate([d,c],m)}static{this.propDecorators={modal:[{type:k,args:["modal",{static:!0}]}]}}};v=s([r({selector:"awg-edition-report",template:ie,changeDetection:n.OnPush,standalone:!1,styles:[ne]})],v);var Ee=[{path:"",component:v,data:{title:"AWG Online Edition \u2013 Report"}}],re=[v],q=class{};q=s([g({imports:[$.forChild(Ee)],exports:[$]})],q);var ae=class{};ae=s([g({imports:[R,D,I,q],declarations:[M,E,L,re]})],ae);export{ae as EditionReportModule};
