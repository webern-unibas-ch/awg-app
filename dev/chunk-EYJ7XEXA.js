import{a as w}from"./chunk-L7SU7BB5.js";import{D as h,Fb as S,K as t,La as $,M as r,Na as C,Nb as O,Pb as F,R as k,S as a,Tb as L,U as n,V as i,X as u,i as E,j as o,pb as m,qc as R,s as I,y as q}from"./chunk-JKPLDYIE.js";var N=`<div class="awg-source-description-corrections">
    <p class="no-para"><span class="smallcaps">Korrekturen:</span></p>
    @for (correction of corrections; track correction.id) {
        <details class="half-para awg-source-description-correction-details" [id]="correction.id">
            <summary
                class="half-para awg-source-description-correction-summary"
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
`;var A="";var b=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={corrections:[{type:n}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};b=o([a({selector:"awg-source-description-corrections",template:N,changeDetection:r.OnPush,standalone:!1,styles:[A]})],b);var G=`@if (details?.length) {
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
`;var W="";var y=class{constructor(){this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[]}static{this.propDecorators={details:[{type:n}],detailsClass:[{type:n}],detailsLabel:[{type:n}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};y=o([a({selector:"awg-source-description-details",template:G,changeDetection:r.OnPush,standalone:!1,styles:[W]})],y);var j=`@if (sourceDescriptionListData) {
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
                            <!-- content -->
                            @if (sourceDescription?.description?.contents?.length) {
                                <div class="awg-source-description-contents">
                                    <p class="no-para"><span class="smallcaps">Inhalt:</span></p>
                                    @for (content of sourceDescription.description.contents; track $index) {
                                        <p class="half-para">
                                            <!-- content.itemDescription -->
                                            @if (content.item || content.itemDescription) {
                                                <span class="awg-source-description-content-item">
                                                    @if (content.item && utils.isNotEmptyObject(content.itemLinkTo)) {
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
                                                    @if (content.item && !utils.isNotEmptyObject(content.itemLinkTo)) {
                                                        <strong>{{ content.item }}</strong>
                                                    }
                                                    @if (content.item && content.itemDescription) {
                                                        <span>&nbsp;</span>
                                                    }
                                                    @if (content.itemDescription) {
                                                        <span class="awg-source-description-content-item-description"
                                                            ><span
                                                                [compile-html]="content.itemDescription"
                                                                [compile-html-ref]="ref"></span
                                                        ></span>
                                                    }
                                                    <span>:</span><br />
                                                </span>
                                            }
                                            <!-- content.folios -->
                                            @if (content?.folios?.length) {
                                                @for (folio of content.folios; track $index; let lastFolio = $last) {
                                                    @if (folio.folio) {
                                                        <span
                                                            class="awg-source-description-content-item-folio"
                                                            [ngClass]="{
                                                                tab: content.item || content.itemDescription,
                                                            }">
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
                                                                        *ngTemplateOutlet="
                                                                            folioTemplate;
                                                                            context: { $implicit: folio }
                                                                        "></ng-template
                                                                ></a>
                                                            }
                                                            @if (!folio.folioLinkTo) {
                                                                <ng-template
                                                                    *ngTemplateOutlet="
                                                                        folioTemplate;
                                                                        context: { $implicit: folio }
                                                                    "></ng-template>
                                                            }
                                                            @if (folio.folioDescription) {
                                                                <span
                                                                    class="awg-source-description-content-item-folio-description"
                                                                    >&nbsp;&nbsp;<span
                                                                        [compile-html]="folio.folioDescription"
                                                                        [compile-html-ref]="ref"></span
                                                                ></span>
                                                            }
                                                        </span>
                                                    }
                                                    <ng-template #folioTemplate let-folio>
                                                        <span>
                                                            @if (folio.isPage) {
                                                                <span><span [awgAbbr]="'S.'"></span>&nbsp;</span>
                                                            } @else {
                                                                <span><span [awgAbbr]="'Bl.'"></span>&nbsp;</span>
                                                            }
                                                            @if (
                                                                folio.folio.endsWith('v') || folio.folio.endsWith('r')
                                                            ) {
                                                                <span
                                                                    class="awg-source-description-content-item-folio-number"
                                                                    >{{ folio.folio.slice(0, -1)
                                                                    }}<sup
                                                                        class="awg-source-description-content-item-folio-side"
                                                                        >{{ folio.folio.slice(-1) }}</sup
                                                                    ></span
                                                                >
                                                            } @else {
                                                                <span>{{ folio.folio }}</span>
                                                            }
                                                        </span>
                                                    </ng-template>
                                                    <!-- content.folios.systemGroups -->
                                                    @if (utils.isNotEmptyArray(folio.systemGroups)) {
                                                        @for (
                                                            systemGroup of folio.systemGroups;
                                                            track $index;
                                                            let firstSystemGroup = $first;
                                                            let lastSystemGroup = $last
                                                        ) {
                                                            @for (
                                                                system of systemGroup;
                                                                track $index;
                                                                let systemIndex = $index;
                                                                let firstSystem = $first;
                                                                let lastSystem = $last
                                                            ) {
                                                                @if (system.system) {
                                                                    <span
                                                                        class="awg-source-description-content-item-system"
                                                                        [ngClass]="{
                                                                            tab: system.row && !firstSystem,
                                                                            singletab:
                                                                                (system.row &&
                                                                                    !firstSystemGroup &&
                                                                                    firstSystem &&
                                                                                    folio.folio.length === 1) ||
                                                                                (system.measure &&
                                                                                    !firstSystemGroup &&
                                                                                    folio.folio.length === 1),
                                                                            tab: system.row && !firstSystem,
                                                                            doubletab:
                                                                                (system.row &&
                                                                                    !firstSystemGroup &&
                                                                                    firstSystem &&
                                                                                    folio.folio.length === 2) ||
                                                                                (system.measure &&
                                                                                    !firstSystemGroup &&
                                                                                    folio.folio.length === 2),
                                                                            doubletab_extended:
                                                                                (system.row &&
                                                                                    !firstSystemGroup &&
                                                                                    firstSystem &&
                                                                                    folio.folio.length > 2) ||
                                                                                (system.measure &&
                                                                                    !firstSystemGroup &&
                                                                                    folio.folio.length > 2),
                                                                        }"
                                                                        ><ng-template
                                                                            *ngTemplateOutlet="
                                                                                systemTemplate;
                                                                                context: { $implicit: system.system }
                                                                            "></ng-template
                                                                    ></span>
                                                                }
                                                                <ng-template #systemTemplate let-system
                                                                    >&nbsp;&nbsp;System&nbsp;{{ system }}</ng-template
                                                                >
                                                                @if (
                                                                    system.systemDescription ||
                                                                    system.measure ||
                                                                    system.row
                                                                ) {
                                                                    <span>:&nbsp;</span>
                                                                }
                                                                @if (system.systemDescription) {
                                                                    <span
                                                                        class="awg-source-description-content-item-system-description">
                                                                        <span
                                                                            [compile-html]="system.systemDescription"
                                                                            [compile-html-ref]="ref"></span>
                                                                        @if (system.measure) {
                                                                            <span>&nbsp;</span>
                                                                        }
                                                                    </span>
                                                                }
                                                                @if (system.measure) {
                                                                    <span
                                                                        class="awg-source-description-content-item-measure">
                                                                        @if (system.linkTo) {
                                                                            <a
                                                                                (click)="
                                                                                    selectSvgSheet({
                                                                                        complexId:
                                                                                            content.itemLinkTo
                                                                                                .complexId,
                                                                                        sheetId: system.linkTo,
                                                                                    })
                                                                                "
                                                                                (keyup.enter)="
                                                                                    selectSvgSheet({
                                                                                        complexId:
                                                                                            content.itemLinkTo
                                                                                                .complexId,
                                                                                        sheetId: system.linkTo,
                                                                                    })
                                                                                "
                                                                                role="link"
                                                                                tabindex="0"
                                                                                ><ng-template
                                                                                    *ngTemplateOutlet="
                                                                                        measureTemplate;
                                                                                        context: {
                                                                                            $implicit: system.measure,
                                                                                        }
                                                                                    "></ng-template
                                                                            ></a>
                                                                        }
                                                                        @if (!system.linkTo) {
                                                                            <ng-template
                                                                                *ngTemplateOutlet="
                                                                                    measureTemplate;
                                                                                    context: {
                                                                                        $implicit: system.measure,
                                                                                    }
                                                                                "></ng-template>
                                                                        }
                                                                        <ng-template #measureTemplate let-measure
                                                                            ><span
                                                                                ><span [awgAbbr]="'T.'"></span>&nbsp;{{
                                                                                    measure
                                                                                }}</span
                                                                            ></ng-template
                                                                        ></span
                                                                    >
                                                                }
                                                                @if (utils.isNotEmptyObject(system.row)) {
                                                                    <span
                                                                        class="awg-source-description-content-item-row">
                                                                        @if (system.linkTo) {
                                                                            <a
                                                                                (click)="
                                                                                    selectSvgSheet({
                                                                                        complexId:
                                                                                            content.itemLinkTo
                                                                                                .complexId,
                                                                                        sheetId: system.linkTo,
                                                                                    })
                                                                                "
                                                                                (keyup.enter)="
                                                                                    selectSvgSheet({
                                                                                        complexId:
                                                                                            content.itemLinkTo
                                                                                                .complexId,
                                                                                        sheetId: system.linkTo,
                                                                                    })
                                                                                "
                                                                                role="link"
                                                                                tabindex="0"
                                                                                ><ng-template
                                                                                    *ngTemplateOutlet="
                                                                                        rowTemplate;
                                                                                        context: {
                                                                                            $implicit: system.row,
                                                                                        }
                                                                                    "></ng-template>
                                                                            </a>
                                                                        }
                                                                        @if (!system.linkTo) {
                                                                            <ng-template
                                                                                *ngTemplateOutlet="
                                                                                    rowTemplate;
                                                                                    context: { $implicit: system.row }
                                                                                "></ng-template>
                                                                        }
                                                                        <ng-template #rowTemplate let-row>
                                                                            <span
                                                                                >{{ row.rowType
                                                                                }}<sub>{{ row.rowBase }}</sub> ({{
                                                                                    row.rowNumber
                                                                                }})</span
                                                                            ></ng-template
                                                                        ></span
                                                                    >
                                                                }
                                                                @if (lastFolio && lastSystemGroup && lastSystem) {
                                                                    <span>.</span>
                                                                } @else {
                                                                    <span
                                                                        >;
                                                                        @if (
                                                                            (systemIndex + 1) % systemGroup.length === 0
                                                                        ) {
                                                                            <br />
                                                                        }
                                                                    </span>
                                                                }
                                                            }
                                                        }
                                                    } @else {
                                                        @if (!lastFolio) {
                                                            <br />
                                                        }
                                                    }
                                                }
                                            }
                                        </p>
                                    }
                                </div>
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
`;var U="";var g=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.FIRM_SIGNS=O,this.ref=this}getWritingInstruments(e){let s=e.secondary?.join(", ");return`${s?`${e.main}; ${s}`:e.main}.`}getWritingMaterialFirmSign(e){return e&&this.FIRM_SIGNS[e]?this.FIRM_SIGNS[e]:{route:"",full:"Not a known firm sign.",short:"unknown"}}getWritingMaterialItemLocation(e){if(!this.utils.isNotEmptyObject(e)||!this.utils.isNotEmptyArray(e.folios))return"";let s=e.folios.map(c=>c.endsWith("v")||c.endsWith("r")?`${c.slice(0,-1)}<sup>${c.slice(-1)}</sup>`:c),l=s.length>1?`${s.slice(0,-1).join(", ")} und ${s.slice(-1)}`:s[0],d=e.info?`${e.info} `:"",v=e.position?` ${e.position}`:"";return`${d}auf Bl. ${l}${v}`}getWritingMaterialFormat(e){let{orientation:s,height:l,width:d}=e,v=c=>this.utils.isNotEmptyObject(c)?c.uncertainty?`${c.uncertainty} ${c.value}`:c.value:"";return`Format: ${s} ${v(l)} \xD7 ${v(d)} mm`}getWritingMaterialSystems(e){return[`${e.number} ${e.number===1?"System":"Systeme"}`,e.info&&` (${e.info})`,e.addendum&&`, ${e.addendum}`].filter(Boolean).join("")}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={sourceDescriptionListData:[{type:n}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};g=o([a({selector:"awg-source-description",template:j,changeDetection:r.OnPush,standalone:!1,styles:[U]})],g);var T=class{};T=o([u({imports:[R,w],declarations:[g,y,b],exports:[g]})],T);var P=`@if (sourceEvaluationListData) {
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
`;var B="";var D=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}get editionRouteConstants(){return S}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={editionComplex:[{type:n}],sourceEvaluationListData:[{type:n}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};D=o([a({selector:"awg-source-evaluation",template:P,changeDetection:r.OnPush,standalone:!1,styles:[B]})],D);var H=`<div class="card">
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
`;var z=`table.awg-source-list-sources>tbody>tr>th{white-space:nowrap}
`;var x=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.ref=this}onSourceClick(e){e.hasDescription?this.navigateToReportFragment({complexId:"",fragmentId:e.linkTo}):this._openModal(e.linkTo)}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}_openModal(e){e&&this.openModalRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={sourceListData:[{type:n}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}]}}};x=o([a({selector:"awg-source-list",template:H,changeDetection:r.OnPush,standalone:!1,styles:[z]})],x);var Q=`@if (textcriticsData) {
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
`;var Z="";var _=class{constructor(e){this.utils=e,this.navigateToReportFragmentRequest=new t,this.openModalRequest=new t,this.selectSvgSheetRequest=new t,this.ref=this}isWorkEditionId(e){return e?e.includes("_WE"):!1}navigateToReportFragment(e){e?.fragmentId&&this.navigateToReportFragmentRequest.emit(e)}openModal(e){e&&this.openModalRequest.emit(e)}selectSvgSheet(e){e?.sheetId&&this.selectSvgSheetRequest.emit(e)}static{this.ctorParameters=()=>[{type:m}]}static{this.propDecorators={textcriticsData:[{type:n}],navigateToReportFragmentRequest:[{type:i}],openModalRequest:[{type:i}],selectSvgSheetRequest:[{type:i}]}}};_=o([a({selector:"awg-textcritics-list",template:Q,changeDetection:r.OnPush,standalone:!1,styles:[Z]})],_);var K=`<!-- content: edition report -->
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
`;var V="";var f=class{constructor(){this.errorObject=null,this.titles={sourceList:"1. Quellen\xFCbersicht",sourceDescription:"2. Quellenbeschreibung",sourceEvaluation:"3. Quellenbewertung",tka:"4. Textkritische Anmerkungen"},this._editionDataService=h(F),this._editionStateService=h(L),this._router=h($)}get editionRouteConstants(){return S}ngOnInit(){this.getEditionReportData()}getEditionReportData(){this.editionReportData$=this._editionStateService.getSelectedEditionComplex().pipe(q(e=>(this.editionComplex=e,this._editionDataService.getEditionReportData(this.editionComplex))),I(e=>(this.errorObject=e,E)))}onModalOpen(e){e&&this.modal.open(e)}onReportFragmentNavigate(e){let s=this.editionRouteConstants.EDITION_REPORT.route,l={fragment:e?.fragmentId??""};this._navigateWithComplexId(e?.complexId,s,l)}onSvgSheetSelect(e){let s=this.editionRouteConstants.EDITION_SHEETS.route,l={queryParams:{id:e?.sheetId??""}};this._navigateWithComplexId(e?.complexId,s,l)}_navigateWithComplexId(e,s,l){let d=e?`/edition/complex/${e}/`:this.editionComplex.baseRoute;this._router.navigate([d,s],l)}static{this.propDecorators={modal:[{type:k,args:["modal",{static:!0}]}]}}};f=o([a({selector:"awg-edition-report",template:K,changeDetection:r.OnPush,standalone:!1,styles:[V]})],f);var de=[{path:"",component:f,data:{title:"AWG Online Edition \u2013 Report"}}],Y=[f],M=class{};M=o([u({imports:[C.forChild(de)],exports:[C]})],M);var J=class{};J=o([u({imports:[R,w,T,M],declarations:[_,D,x,Y]})],J);export{J as EditionReportModule};
