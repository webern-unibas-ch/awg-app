import{a as w}from"./chunk-HCNO52F2.js";import{D as u,Fb as S,K as t,La as O,M as r,Na as E,Nb as L,Pb as F,R as k,S as a,Tb as N,U as s,V as i,X as d,i as I,j as o,pb as m,qc as R,s as q,y as $}from"./chunk-NREOMU4S.js";var A=`<div class="awg-source-description-contents">
    <p class="awg-source-description-contents-label no-para-margin"><span class="smallcaps">Inhalt:</span></p>
    @for (content of contents; track $index) {
        <!-- content.itemDescription -->
        @if (content.item || content.itemDescription) {
            <p class="awg-source-description-content-item-para no-para-margin">
                <span class="awg-source-description-content-item">
                    @if (content.item && UTILS.isNotEmptyObject(content.itemLinkTo)) {
                        <a
                            (click)="
                                selectSvgSheet({
                                    complexId: content.itemLinkTo.complexId,
                                    sheetId: content.itemLinkTo.sheetId,
                                })
                            "
                            (keyup.enter)="
                                selectSvgSheet({
                                    complexId: content.itemLinkTo.complexId,
                                    sheetId: content.itemLinkTo.sheetId,
                                })
                            "
                            role="link"
                            tabindex="0"
                            ><strong>{{ content.item }}</strong></a
                        >
                    }
                    @if (content.item && !UTILS.isNotEmptyObject(content.itemLinkTo)) {
                        <strong>{{ content.item }}</strong>
                    }
                    @if (content.item && content.itemDescription) {
                        <span>&nbsp;</span>
                    }
                    @if (content.itemDescription) {
                        <span class="awg-source-description-content-item-description"
                            ><span [compile-html]="content.itemDescription" [compile-html-ref]="ref"></span
                        ></span>
                    }
                    <span>:</span><br />
                </span>
            </p>
        }

        <!-- content.folios -->
        @if (content?.folios?.length) {
            <table class="awg-source-description-content-table half-para-margin" role="presentation">
                @for (folio of content.folios; track $index; let lastFolio = $last) {
                    <ng-template #folioCellTemplate let-folio>
                        <td
                            [attr.colspan]="!UTILS.isNotEmptyArray(folio.systemGroups) ? 2 : 1"
                            class="awg-source-description-content-table-datacell">
                            @if (folio.folioLinkTo) {
                                <a
                                    (click)="
                                        selectSvgSheet({
                                            complexId: content.itemLinkTo.complexId,
                                            sheetId: folio.folioLinkTo,
                                        })
                                    "
                                    (keyup.enter)="
                                        selectSvgSheet({
                                            complexId: content.itemLinkTo.complexId,
                                            sheetId: folio.folioLinkTo,
                                        })
                                    "
                                    role="link"
                                    tabindex="0"
                                    ><ng-template
                                        *ngTemplateOutlet="folioTemplate; context: { $implicit: folio }"></ng-template
                                ></a>
                            } @else {
                                <ng-template
                                    *ngTemplateOutlet="folioTemplate; context: { $implicit: folio }"></ng-template>
                            }
                            @if (folio.folioDescription) {
                                <span class="awg-source-description-content-item-folio-description"
                                    >&nbsp;&nbsp;<span
                                        [compile-html]="folio.folioDescription"
                                        [compile-html-ref]="ref"></span
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

                    @if (UTILS.isNotEmptyArray(folio.systemGroups)) {
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
                                        <ng-template
                                            *ngTemplateOutlet="
                                                folioCellTemplate;
                                                context: { $implicit: folio }
                                            "></ng-template>
                                    } @else {
                                        <ng-template *ngTemplateOutlet="emptyCellTemplate"></ng-template>
                                    }
                                } @else {
                                    <ng-template *ngTemplateOutlet="emptyCellTemplate"></ng-template>
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
                                        <ng-template #systemTemplate let-system
                                            >&nbsp;&nbsp;System&nbsp;{{ system }}</ng-template
                                        >

                                        @if (system.system) {
                                            <span class="awg-source-description-content-item-system">
                                                <ng-template
                                                    *ngTemplateOutlet="
                                                        systemTemplate;
                                                        context: { $implicit: system.system }
                                                    "></ng-template
                                            ></span>
                                        }

                                        @if (system.systemDescription || system.measure || system.row) {
                                            <span>:&nbsp;</span>
                                        }

                                        @if (system.systemDescription) {
                                            <span class="awg-source-description-content-item-system-description">
                                                <span
                                                    [compile-html]="system.systemDescription"
                                                    [compile-html-ref]="ref"></span>
                                                @if (system.measure) {
                                                    <span>&nbsp;</span>
                                                }
                                            </span>
                                        }

                                        @if (system.measure) {
                                            <span class="awg-source-description-content-item-measure">
                                                @if (system.linkTo) {
                                                    <a
                                                        (click)="
                                                            selectSvgSheet({
                                                                complexId: content.itemLinkTo.complexId,
                                                                sheetId: system.linkTo,
                                                            })
                                                        "
                                                        (keyup.enter)="
                                                            selectSvgSheet({
                                                                complexId: content.itemLinkTo.complexId,
                                                                sheetId: system.linkTo,
                                                            })
                                                        "
                                                        role="link"
                                                        tabindex="0"
                                                        ><ng-template
                                                            *ngTemplateOutlet="
                                                                measureTemplate;
                                                                context: { $implicit: system.measure }
                                                            "></ng-template
                                                    ></a>
                                                } @else {
                                                    <ng-template
                                                        *ngTemplateOutlet="
                                                            measureTemplate;
                                                            context: { $implicit: system.measure }
                                                        "></ng-template>
                                                }
                                                <ng-template #measureTemplate let-measure
                                                    ><span
                                                        ><span [awgAbbr]="'T.'"></span>&nbsp;{{ measure }}</span
                                                    ></ng-template
                                                ></span
                                            >
                                        }

                                        @if (UTILS.isNotEmptyObject(system.row)) {
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
                                                    <a
                                                        (click)="
                                                            selectSvgSheet({
                                                                complexId: content.itemLinkTo.complexId,
                                                                sheetId: system.linkTo,
                                                            })
                                                        "
                                                        (keyup.enter)="
                                                            selectSvgSheet({
                                                                complexId: content.itemLinkTo.complexId,
                                                                sheetId: system.linkTo,
                                                            })
                                                        "
                                                        role="link"
                                                        tabindex="0"
                                                        ><ng-template
                                                            *ngTemplateOutlet="
                                                                rowTemplate;
                                                                context: { $implicit: system.row }
                                                            "></ng-template>
                                                    </a>
                                                } @else {
                                                    <ng-template
                                                        *ngTemplateOutlet="
                                                            rowTemplate;
                                                            context: { $implicit: system.row }
                                                        "></ng-template>
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
                    } @else {
                        <!-- no folio system groups, only folio description -->
                        <tr class="awg-source-description-content-table-row">
                            @if (folio.folio) {
                                <ng-template
                                    *ngTemplateOutlet="folioCellTemplate; context: { $implicit: folio }"></ng-template>
                            }
                        </tr>
                    }
                }
            </table>
        }
    }
</div>
`;var G=`.awg-source-description-content-table{margin-left:25px}
`;var b=class{constructor(){this.selectSvgSheetRequest=new t,this.UTILS=u(m),this.ref=this}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={contents:[{type:s}],selectSvgSheetRequest:[{type:i}]}}};b=o([a({selector:"awg-source-description-contents",template:A,changeDetection:r.OnPush,standalone:!1,styles:[G]})],b);var U=`<div class="awg-source-description-corrections">
    <p class="no-para-margin"><span class="smallcaps">Korrekturen:</span></p>
    @for (correction of corrections; track correction.id) {
        <details class="awg-source-description-correction-details half-para-margin" [id]="correction.id">
            <summary
                class="awg-source-description-correction-summary half-para-margin"
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
                        [isRowTable]="correction.rowtable"
                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                        (openModalRequest)="openModal($event)"
                        (selectSvgSheetRequest)="selectSvgSheet($event)">
                    </awg-edition-tka-table>
                }
            </div>
        </details>
    }
</div>
`;var W="";var y=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={corrections:[{type:s}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};y=o([a({selector:"awg-source-description-corrections",template:U,changeDetection:r.OnPush,standalone:!1,styles:[W]})],y);var j=`@if (details?.length) {
    <p class="awg-source-description-{{ detailsClass }}">
        @if (detailsLabel) {
            <span class="smallcaps">{{ detailsLabel }}:&nbsp;</span>
        }
        @for (detail of details; track $index; let lastDetail = $last) {
            <span [compile-html]="detail" [compile-html-ref]="ref"></span>
            @if (detailsClass !== 'desc') {
                @if (!lastDetail) {
                    <span>;</span><br />
                } @else {
                    <span>.</span>
                }
            }
        }
    </p>
}
`;var P="";var T=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={details:[{type:s}],detailsClass:[{type:s}],detailsLabel:[{type:s}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};T=o([a({selector:"awg-source-description-details",template:j,changeDetection:r.OnPush,standalone:!1,styles:[P]})],T);var B=`@if (sourceDescriptionListData) {
    <div class="awg-source-description-list">
        @for (sourceDescription of sourceDescriptionListData.sources; track sourceDescription.id) {
            <div class="awg-source-description card mb-2" [id]="sourceDescription.id">
                <div class="card-body">
                    <div class="awg-source-description-head">
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
                        @if (sourceDescription.type) {
                            <p
                                class="awg-source-description-type"
                                [compile-html]="sourceDescription.type"
                                [compile-html-ref]="ref"></p>
                        }
                        @if (sourceDescription.location) {
                            <p class="awg-source-description-location" [awgAbbr]="sourceDescription.location"></p>
                        }
                    </div>
                    @if (utils.isNotEmptyObject(sourceDescription.description)) {
                        <div class="awg-source-description-body">
                            <!-- description -->
                            @if (sourceDescription?.description?.desc?.length) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.desc"
                                    detailsLabel=""
                                    detailsClass="desc"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            <!-- writingMaterial -->
                            @if (
                                sourceDescription.description.writingMaterialStrings &&
                                !sourceDescription.description.writingMaterials
                            ) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.writingMaterialStrings"
                                    detailsLabel="Beschreibstoff"
                                    detailsClass="writing-materials"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            @if (sourceDescription.description.writingMaterials) {
                                <p class="awg-source-description-writing-materials">
                                    <span class="smallcaps">Beschreibstoff:&nbsp;</span>

                                    @for (
                                        writingMaterial of sourceDescription?.description?.writingMaterials;
                                        track $index;
                                        let lastWritingMaterial = $last
                                    ) {
                                        @if (writingMaterial.paperType) {
                                            <span class="awg-source-description-writing-material-paper-type">{{
                                                writingMaterial.paperType
                                            }}</span
                                            >,
                                        }
                                        @if (utils.isNotEmptyObject(writingMaterial.systems)) {
                                            <span class="awg-source-description-writing-material-systems">
                                                {{ getWritingMaterialSystems(writingMaterial.systems) }},
                                            </span>
                                        }
                                        @if (utils.isNotEmptyObject(writingMaterial.format)) {
                                            <span class="awg-source-description-writing-material-format">
                                                {{ getWritingMaterialFormat(writingMaterial.format) }}</span
                                            >,
                                        }
                                        @if (
                                            utils.isNotEmptyObject(writingMaterial.firmSign) &&
                                            (writingMaterial.firmSign?.variant || writingMaterial.firmSign?.alt)
                                        ) {
                                            <span class="awg-source-description-writing-material-firm-sign"
                                                ><span>Firmenzeichen: </span>
                                                @if (writingMaterial.firmSign.variant) {
                                                    <br /><img
                                                        class="img-thumbnail"
                                                        [src]="
                                                            getWritingMaterialFirmSign(writingMaterial.firmSign.variant)
                                                                ?.route
                                                        "
                                                        [title]="
                                                            getWritingMaterialFirmSign(writingMaterial.firmSign.variant)
                                                                ?.full
                                                        "
                                                        [alt]="
                                                            getWritingMaterialFirmSign(writingMaterial.firmSign.variant)
                                                                ?.short
                                                        " /><br />
                                                } @else {
                                                    <span
                                                        [compile-html]="writingMaterial.firmSign.alt"
                                                        [compile-html-ref]="ref"></span
                                                    >&nbsp;
                                                }
                                            </span>
                                            @for (location of writingMaterial.firmSign.location; track $index) {
                                                <span [innerHTML]="getWritingMaterialItemLocation(location)"></span>
                                            }
                                        } @else {
                                            <span>kein Firmenzeichen</span>
                                        }
                                        @if (
                                            utils.isNotEmptyObject(writingMaterial.watermark) &&
                                            writingMaterial.watermark?.variant
                                        ) {
                                            <span class="awg-source-description-writing-material-watermark"
                                                ><span>, Wasserzeichen: </span>
                                                @if (writingMaterial.watermark.variant) {
                                                    <span
                                                        ><em>{{ writingMaterial.watermark.variant }}</em></span
                                                    >&nbsp;
                                                }
                                            </span>
                                            @for (location of writingMaterial.watermark.location; track $index) {
                                                <span [innerHTML]="getWritingMaterialItemLocation(location)"></span>
                                            }
                                            <span>&nbsp;lesbar</span>
                                        }
                                        @if (writingMaterial.folioAddendum) {
                                            <span>&nbsp;(Bl. {{ writingMaterial.folioAddendum }})</span>
                                        }
                                        @if (!lastWritingMaterial) {
                                            <span>;</span><br />
                                        } @else {
                                            <span>.</span>
                                        }
                                    }
                                </p>
                            }
                            <!-- writingInstruments -->
                            @if (utils.isNotEmptyObject(sourceDescription.description.writingInstruments)) {
                                @if (sourceDescription.description.writingInstruments.main) {
                                    <p class="awg-source-description-writing-instruments">
                                        <span class="smallcaps">Schreibstoff:&nbsp;</span>
                                        <span
                                            [compile-html]="
                                                getWritingInstruments(sourceDescription.description.writingInstruments)
                                            "
                                            [compile-html-ref]="ref"></span>
                                    </p>
                                }
                            }
                            <!-- title -->
                            @if (sourceDescription?.description?.titles?.length) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.titles"
                                    detailsLabel="Titel"
                                    detailsClass="titles"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            <!-- date -->
                            @if (sourceDescription?.description?.dates?.length) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.dates"
                                    detailsLabel="Datierung"
                                    detailsClass="dates"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            <!-- pagination -->
                            @if (sourceDescription?.description?.paginations?.length) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.paginations"
                                    detailsLabel="Paginierung"
                                    detailsClass="paginations"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            <!-- measureNumbers -->
                            @if (sourceDescription?.description?.measureNumbers?.length) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.measureNumbers"
                                    detailsLabel="Taktzahlen"
                                    detailsClass="measure-numbers"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            <!-- instrumentation -->
                            @if (sourceDescription?.description?.instrumentations?.length) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.instrumentations"
                                    detailsLabel="Instrumentenvorsatz"
                                    detailsClass="instrumentations"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            <!-- annotations -->
                            @if (sourceDescription?.description?.annotations?.length) {
                                <awg-source-description-details
                                    [details]="sourceDescription.description.annotations"
                                    detailsLabel="Eintragungen"
                                    detailsClass="annotations"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-details>
                            }
                            <!-- contents -->
                            @if (sourceDescription?.description?.contents?.length) {
                                <awg-source-description-contents
                                    [contents]="sourceDescription.description.contents"
                                    (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-source-description-contents>
                            }

                            <!-- corrections -->
                            @if (sourceDescription?.description?.corrections?.length) {
                                <awg-source-description-corrections
                                    [corrections]="sourceDescription.description.corrections"
                                    (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                    (openModalRequest)="openModal($event)"
                                    (selectSvgSheetRequest)="
                                        selectSvgSheet($event)
                                    "></awg-source-description-corrections>
                            }
                        </div>
                    }
                </div>
            </div>
        }
    </div>
}
`;var H="";var f=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.FIRM_SIGNS=L,this.ref=this}getWritingInstruments(e){let n=e.secondary?.join(", ");return`${n?`${e.main}; ${n}`:e.main}.`}getWritingMaterialFirmSign(e){return e&&this.FIRM_SIGNS[e]?this.FIRM_SIGNS[e]:{route:"",full:"Not a known firm sign.",short:"unknown"}}getWritingMaterialItemLocation(e){if(!this.utils.isNotEmptyObject(e)||!this.utils.isNotEmptyArray(e.folios))return"";let n=e.folios.map(c=>c.endsWith("v")||c.endsWith("r")?`${c.slice(0,-1)}<sup>${c.slice(-1)}</sup>`:c),p=n.length>1?`${n.slice(0,-1).join(", ")} und ${n.slice(-1)}`:n[0],g=e.info?`${e.info} `:"",h=e.position?` ${e.position}`:"";return`${g}auf Bl. ${p}${h}`}getWritingMaterialFormat(e){let{orientation:n,height:p,width:g}=e,h=c=>this.utils.isNotEmptyObject(c)?c.uncertainty?`${c.uncertainty} ${c.value}`:c.value:"";return`Format: ${n} ${h(p)} \xD7 ${h(g)} mm`}getWritingMaterialSystems(e){return[`${e.number} ${e.number===1?"System":"Systeme"}`,e.info&&` (${e.info})`,e.addendum&&`, ${e.addendum}`].filter(Boolean).join("")}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={sourceDescriptionListData:[{type:s}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};f=o([a({selector:"awg-source-description",template:B,changeDetection:r.OnPush,standalone:!1,styles:[H]})],f);var D=class{};D=o([d({imports:[R,w],declarations:[f,b,y,T],exports:[f]})],D);var z=`@if (sourceEvaluationListData) {
    <div class="awg-source-evaluation-list card">
        <div class="card-body">
            @if (utils.isNotEmptyArray(sourceEvaluationListData.sources?.[0]?.content)) {
                @for (evaluation of sourceEvaluationListData.sources?.[0]?.content; track evaluation) {
                    <p class="awg-source-evaluation-entry" [compile-html]="evaluation" [compile-html-ref]="this"></p>
                }
            } @else {
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
            }
        </div>
    </div>
}
`;var Q="";var _=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}get editionRouteConstants(){return S}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={editionComplex:[{type:s}],sourceEvaluationListData:[{type:s}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};_=o([a({selector:"awg-source-evaluation",template:z,changeDetection:r.OnPush,standalone:!1,styles:[Q]})],_);var Z=`<div class="card">
    <div class="card-body">
        @if (utils.isNotEmptyArray(sourceListData.sources)) {
            <table aria-label="Table for list of sources" class="table table-hover borderless awg-source-list-sources">
                <tbody>
                    @for (source of sourceListData.sources; track $index; let sourceIndex = $index) {
                        <tr>
                            <th scope="row" id="{{ source.siglum }}{{ source.siglumAddendum }}">
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
                                        <ng-container *ngTemplateOutlet="siglum"></ng-container>
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
                                            <ng-container *ngTemplateOutlet="siglumMissingOrNot"></ng-container>
                                        </a>
                                    } @else {
                                        <ng-container *ngTemplateOutlet="siglumMissingOrNot"></ng-container>
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
        @if (utils.isNotEmptyArray(sourceListData.textSources)) {
            <table
                aria-label="Table for list of text sources"
                class="table table-hover borderless awg-source-list-text-sources">
                <tbody>
                    <tr>
                        <td colspan="2">Zum vertonten Text:</td>
                    </tr>
                    @for (textSource of sourceListData.textSources; track textSource.id; let textIndex = $index) {
                        <tr>
                            <th scope="row" id="{{ textSource.id }}">
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
`;var K=`table.awg-source-list-sources>tbody>tr>th{white-space:nowrap}
`;var x=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.ref=this}onSourceClick(e){e.hasDescription?this.navigateToReportFragment({complexId:"",fragmentId:e.linkTo}):this._openModal(e.linkTo)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}_openModal(e){e&&this.openModalRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={sourceListData:[{type:s}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}]}}};x=o([a({selector:"awg-source-list",template:Z,changeDetection:r.OnPush,standalone:!1,styles:[K]})],x);var V=`@if (textcriticsData) {
    <div ngbAccordion>
        @for (textcritics of textcriticsData.textcritics; track textcritics.id) {
            <div [ngbAccordionItem]="textcritics.id" [collapsed]="true">
                <div
                    ngbAccordionHeader
                    class="accordion-button awg-accordion-button-custom-header justify-content-between">
                    <button ngbAccordionToggle class="btn btn-link text-start p-0">
                        <span [compile-html]="textcritics.label" [compile-html-ref]="ref"></span>
                    </button>
                    <div class="btn-group" role="group" aria-label="Button to sheets">
                        @if (isWorkEditionId(textcritics.id)) {
                            <button type="button" class="btn btn-sm btn-outline-info">
                                <awg-disclaimer-workeditions></awg-disclaimer-workeditions>
                            </button>
                        }
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-info"
                            [disabled]="isWorkEditionId(textcritics.id)"
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
                                    <awg-edition-tka-label
                                        [id]="textcritics.id"
                                        [labelType]="'evaluation'"></awg-edition-tka-label
                                    >:
                                </p>
                                @if (utils.isNotEmptyArray(textcritics.evaluations)) {
                                    <awg-edition-tka-evaluations
                                        [evaluations]="textcritics.evaluations"
                                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                        (openModalRequest)="openModal($event)"
                                        (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-edition-tka-evaluations>
                                } @else {
                                    <ng-container *ngTemplateOutlet="noContent"></ng-container>
                                }
                            </div>
                            <div>
                                <p class="smallcaps">
                                    <awg-edition-tka-label
                                        [id]="textcritics.id"
                                        [labelType]="'commentary'"></awg-edition-tka-label
                                    >:
                                </p>
                                @if (
                                    utils.isNotEmptyObject(textcritics.commentary) &&
                                    utils.isNotEmptyArray(textcritics.commentary.comments)
                                ) {
                                    <awg-edition-tka-table
                                        [commentary]="textcritics.commentary"
                                        [isRowTable]="textcritics.rowtable"
                                        [isSketchId]="utils.isSketchId(textcritics.id)"
                                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                        (openModalRequest)="openModal($event)"
                                        (selectSvgSheetRequest)="selectSvgSheet($event)">
                                    </awg-edition-tka-table>
                                } @else {
                                    <ng-container *ngTemplateOutlet="noContent"></ng-container>
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
`;var Y="";var C=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}isWorkEditionId(e){return e?e.includes("_WE"):!1}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={textcriticsData:[{type:s}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};C=o([a({selector:"awg-textcritics-list",template:V,changeDetection:r.OnPush,standalone:!1,styles:[Y]})],C);var J=`<!-- content: edition report -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- report -->
    @if (editionReportData$ | async; as editionReportData) {
        <div ngbAccordion>
            <!-- source list -->
            <div ngbAccordionItem="awg-source-list" [collapsed]="false">
                <div ngbAccordionHeader>
                    <button ngbAccordionButton>{{ titles.sourceList }}</button>
                </div>
                <div ngbAccordionCollapse>
                    <div ngbAccordionBody>
                        <ng-template>
                            @if (editionReportData[0]) {
                                <awg-source-list
                                    [sourceListData]="editionReportData[0]"
                                    (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                    (openModalRequest)="onModalOpen($event)">
                                </awg-source-list>
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
                            @if (editionReportData[1]) {
                                <awg-source-description
                                    [sourceDescriptionListData]="editionReportData[1]"
                                    (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                    (openModalRequest)="onModalOpen($event)"
                                    (selectSvgSheetRequest)="onSvgSheetSelect($event)">
                                </awg-source-description>
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
                            @if (editionReportData[2]) {
                                <awg-source-evaluation
                                    [editionComplex]="editionComplex"
                                    [sourceEvaluationListData]="editionReportData[2]"
                                    (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                    (openModalRequest)="onModalOpen($event)"
                                    (selectSvgSheetRequest)="onSvgSheetSelect($event)">
                                </awg-source-evaluation>
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
                            @if (editionReportData[3]) {
                                <awg-textcritics-list
                                    [textcriticsData]="editionReportData[3]"
                                    (navigateToReportFragmentRequest)="onReportFragmentNavigate($event)"
                                    (openModalRequest)="onModalOpen($event)"
                                    (selectSvgSheetRequest)="onSvgSheetSelect($event)">
                                </awg-textcritics-list>
                            }
                        </ng-template>
                    </div>
                </div>
            </div>
        </div>
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <awg-alert-error [errorObject]="errorObject"></awg-alert-error>
        } @else {
            <!-- loading spinner -->
            <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
        }
    }
</div>
`;var X="";var v=class{constructor(){this.errorObject=null,this.titles={sourceList:"1. Quellen\xFCbersicht",sourceDescription:"2. Quellenbeschreibung",sourceEvaluation:"3. Quellenbewertung",tka:"4. Textkritische Anmerkungen"},this._editionDataService=u(F),this._editionStateService=u(N),this._router=u(O)}get editionRouteConstants(){return S}ngOnInit(){this.getEditionReportData()}getEditionReportData(){this.editionReportData$=this._editionStateService.getSelectedEditionComplex().pipe($(e=>(this.editionComplex=e,this._editionDataService.getEditionReportData(this.editionComplex))),q(e=>(this.errorObject=e,I)))}onModalOpen(e){e&&this.modal.open(e)}onReportFragmentNavigate(e){let n=this.editionRouteConstants.EDITION_REPORT.route,p={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,n,p)}onSvgSheetSelect(e){let n=this.editionRouteConstants.EDITION_SHEETS.route,p={queryParams:{id:e?.sheetId??""}};this._navigateWithComplexId(e?.complexId,n,p)}_navigateWithComplexId(e,n,p){let g=e?`/edition/complex/${e}/`:this.editionComplex.baseRoute;this._router.navigate([g,n],p)}static{this.propDecorators={modal:[{type:k,args:["modal",{static:!0}]}]}}};v=o([a({selector:"awg-edition-report",template:J,changeDetection:r.OnPush,standalone:!1,styles:[X]})],v);var Se=[{path:"",component:v,data:{title:"AWG Online Edition \u2013 Report"}}],ee=[v],M=class{};M=o([d({imports:[E.forChild(Se)],exports:[E]})],M);var te=class{};te=o([d({imports:[R,w,D,M],declarations:[C,_,x,ee]})],te);export{te as EditionReportModule};
