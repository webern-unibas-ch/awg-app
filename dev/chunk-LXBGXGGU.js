import{a as q}from"./chunk-E65UDQNI.js";import{f as p}from"./chunk-XKJH5Y7E.js";import{a as $,m as A}from"./chunk-3JB5RXT6.js";import{c as b,v as N}from"./chunk-6ORQPU4V.js";import"./chunk-YRW3G4TW.js";import{G as r,L as i,Ma as I,Oa as M,Q as C,R as a,T as c,U as s,X as w,k as E,l as o,ob as O,t as _,z as k}from"./chunk-L2YCISRN.js";var F=`@if (sourceDescriptionListData) {
    <div class="awg-source-description-list">
        @for (sourceDescription of sourceDescriptionListData.sources; track sourceDescription) {
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
                            <p
                                class="awg-source-description-location"
                                [compile-html]="sourceDescription.location"
                                [compile-html-ref]="ref"></p>
                        }
                    </div>
                    @if (utils.isNotEmptyObject(sourceDescription.description)) {
                        <div class="awg-source-description-body">
                            <!-- description -->
                            @if (utils.isNotEmptyArray(sourceDescription.description.desc)) {
                                <p class="awg-source-description-desc">
                                    @for (
                                        description of sourceDescription.description.desc;
                                        track description;
                                        let lastDesc = $last
                                    ) {
                                        <span [compile-html]="description" [compile-html-ref]="ref"></span>
                                        @if (!lastDesc) {
                                            <br />
                                        }
                                    }
                                </p>
                            }
                            <!-- writingMaterial -->
                            @if (
                                sourceDescription.description.writingMaterialString &&
                                !sourceDescription.description.writingMaterial
                            ) {
                                <p class="awg-source-description-writing-material">
                                    <span class="smallcaps">Beschreibstoff:&nbsp;</span>
                                    <span
                                        [compile-html]="sourceDescription.description.writingMaterialString"
                                        [compile-html-ref]="ref"></span>
                                </p>
                            }
                            @if (sourceDescription.description.writingMaterial) {
                                <p class="awg-source-description-writing-material">
                                    <span class="smallcaps">Beschreibstoff:&nbsp;</span>

                                    @for (
                                        writingMaterial of sourceDescription?.description?.writingMaterial;
                                        track writingMaterial;
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
                                            @for (location of writingMaterial.firmSign.location; track location) {
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
                                            @for (location of writingMaterial.watermark.location; track location) {
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
                            @if (sourceDescription.description.title) {
                                <p class="awg-source-description-title">
                                    <span class="smallcaps">Titel:&nbsp;</span>
                                    <span
                                        [compile-html]="sourceDescription.description.title"
                                        [compile-html-ref]="ref"></span>
                                </p>
                            }
                            <!-- date -->
                            @if (sourceDescription.description.date) {
                                <p class="awg-source-description-date">
                                    <span class="smallcaps">Datierung:&nbsp;</span>
                                    <span
                                        [compile-html]="sourceDescription.description.date"
                                        [compile-html-ref]="ref"></span>
                                </p>
                            }
                            <!-- pagination -->
                            @if (sourceDescription.description.pagination) {
                                <p class="awg-source-description-pagination">
                                    <span class="smallcaps">Paginierung:&nbsp;</span>
                                    <span
                                        [compile-html]="sourceDescription.description.pagination"
                                        [compile-html-ref]="ref"></span>
                                </p>
                            }
                            <!-- measureNumbers -->
                            @if (sourceDescription.description.measureNumbers) {
                                <p class="awg-source-description-measure-numbers">
                                    <span class="smallcaps">Taktzahlen:&nbsp;</span>
                                    <span
                                        [compile-html]="sourceDescription.description.measureNumbers"
                                        [compile-html-ref]="ref"></span>
                                </p>
                            }
                            <!-- instrumentation -->
                            @if (sourceDescription.description.instrumentation) {
                                <p class="awg-source-description-instrumentation">
                                    <span class="smallcaps">Instrumentenvorsatz:&nbsp;</span>
                                    <span
                                        [compile-html]="sourceDescription.description.instrumentation"
                                        [compile-html-ref]="ref"></span>
                                </p>
                            }
                            <!-- annotations -->
                            @if (sourceDescription.description.annotations) {
                                <p class="awg-source-description-annotations">
                                    <span class="smallcaps">Eintragungen:&nbsp;</span>
                                    <span
                                        [compile-html]="sourceDescription.description.annotations"
                                        [compile-html-ref]="ref"></span>
                                </p>
                            }
                            <!-- content -->
                            @if (utils.isNotEmptyArray(sourceDescription.description.content)) {
                                <div class="awg-source-description-content">
                                    <p class="no-para"><span class="smallcaps">Inhalt:</span></p>
                                    @for (content of sourceDescription.description.content; track content) {
                                        <p class="half-para">
                                            <!-- content.itemDescription -->
                                            @if (content.item || content.itemDescription) {
                                                <span class="awg-source-description-content-item">
                                                    @if (content.item && utils.isNotEmptyObject(content.itemLinkTo)) {
                                                        <a
                                                            (click)="
                                                                selectSvgSheet(
                                                                    content.itemLinkTo.complexId,
                                                                    content.itemLinkTo.sheetId
                                                                )
                                                            "
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
                                            @if (utils.isNotEmptyArray(content.folios)) {
                                                @for (folio of content.folios; track folio; let lastFolio = $last) {
                                                    @if (folio.folio) {
                                                        <span
                                                            class="awg-source-description-content-item-folio"
                                                            [ngClass]="{
                                                                tab: content.item || content.itemDescription
                                                            }">
                                                            @if (folio.folioLinkTo) {
                                                                <a
                                                                    (click)="
                                                                        selectSvgSheet(
                                                                            content.itemLinkTo.complexId,
                                                                            folio.folioLinkTo
                                                                        )
                                                                    "
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
                                                                <span>S.&nbsp;</span>
                                                            } @else {
                                                                <span>Bl.&nbsp;</span>
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
                                                            track systemGroup;
                                                            let firstSystemGroup = $first;
                                                            let lastSystemGroup = $last
                                                        ) {
                                                            @for (
                                                                system of systemGroup;
                                                                track system;
                                                                let i = $index;
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
                                                                            doubletab_two:
                                                                                (system.row &&
                                                                                    !firstSystemGroup &&
                                                                                    firstSystem &&
                                                                                    folio.folio.length > 2) ||
                                                                                (system.measure &&
                                                                                    !firstSystemGroup &&
                                                                                    folio.folio.length > 2)
                                                                        }"
                                                                        ><ng-template
                                                                            *ngTemplateOutlet="
                                                                                systemTemplate;
                                                                                context: { $implicit: system.system }
                                                                            "></ng-template
                                                                    ></span>
                                                                }
                                                                <ng-template #systemTemplate let-system
                                                                    >&nbsp;&nbsp;System&nbsp;{{
                                                                        system
                                                                    }}:&nbsp;</ng-template
                                                                >
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
                                                                                    selectSvgSheet(
                                                                                        content.itemLinkTo.complexId,
                                                                                        system.linkTo
                                                                                    )
                                                                                "
                                                                                ><ng-template
                                                                                    *ngTemplateOutlet="
                                                                                        measureTemplate;
                                                                                        context: {
                                                                                            $implicit: system.measure
                                                                                        }
                                                                                    "></ng-template
                                                                            ></a>
                                                                        }
                                                                        @if (!system.linkTo) {
                                                                            <ng-template
                                                                                *ngTemplateOutlet="
                                                                                    measureTemplate;
                                                                                    context: {
                                                                                        $implicit: system.measure
                                                                                    }
                                                                                "></ng-template>
                                                                        }
                                                                        <ng-template #measureTemplate let-measure
                                                                            ><span
                                                                                >T.&nbsp;{{ measure }}</span
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
                                                                                    selectSvgSheet(
                                                                                        content.itemLinkTo.complexId,
                                                                                        system.linkTo
                                                                                    )
                                                                                "
                                                                                ><ng-template
                                                                                    *ngTemplateOutlet="
                                                                                        rowTemplate;
                                                                                        context: {
                                                                                            $implicit: system.row
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
                                                                        @if ((i + 1) % systemGroup.length === 0) {
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
                        </div>
                    }
                </div>
            </div>
        }
    </div>
}
`;var L="";var m,R=(m=class{constructor(t){this.utils=t,this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.selectSvgSheetRequest=new i,this.FIRM_SIGNS=N,this.ref=this}getWritingInstruments(t){let e=t.secondary?.join(", ");return`${e?`${t.main}; ${e}`:t.main}.`}getWritingMaterialFirmSign(t){return t&&this.FIRM_SIGNS[t]?this.FIRM_SIGNS[t]:{route:"",full:"Not a known firm sign.",short:"unknown"}}getWritingMaterialItemLocation(t){if(!this.utils.isNotEmptyObject(t)||!this.utils.isNotEmptyArray(t.folios))return"";let e=t.folios.map(n=>n.endsWith("v")||n.endsWith("r")?`${n.slice(0,-1)}<sup>${n.slice(-1)}</sup>`:n),l=e.length>1?`${e.slice(0,-1).join(", ")} und ${e.slice(-1)}`:e[0],h=t.info?`${t.info} `:"",y=t.position?` ${t.position}`:"";return`${h}auf Bl. ${l}${y}`}getWritingMaterialFormat(t){let{orientation:e,height:l,width:h}=t,y=n=>this.utils.isNotEmptyObject(n)?n.uncertainty?`${n.uncertainty} ${n.value}`:n.value:"";return`Format: ${e} ${y(l)} \xD7 ${y(h)} mm`}getWritingMaterialSystems(t){return[`${t.number} ${t.number===1?"System":"Systeme"}`,t.info&&` (${t.info})`,t.addendum&&`, ${t.addendum}`].filter(Boolean).join("")}navigateToReportFragment(t){t&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t,e){e&&this.selectSvgSheetRequest.emit({complexId:t,sheetId:e})}},m.ctorParameters=()=>[{type:p}],m.propDecorators={sourceDescriptionListData:[{type:c}],navigateToReportFragmentRequest:[{type:s}],openModalRequest:[{type:s}],selectSvgSheetRequest:[{type:s}]},m);R=o([a({selector:"awg-source-description",template:F,changeDetection:r.OnPush,styles:[L]})],R);var G=`@if (sourceEvaluationListData) {
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
                        vollsta\u0308ndigen Edition von {{ editionComplex.complexId.short }} in
                        {{ editionRouteConstants.EDITION.short }} {{ editionComplex.series.short }}/{{
                            editionComplex.section.short
                        }}.]
                    </small>
                </p>
            }
        </div>
    </div>
}
`;var W="";var u,S=(u=class{constructor(t){this.utils=t,this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.selectSvgSheetRequest=new i,this.ref=this}get editionRouteConstants(){return b}navigateToReportFragment(t){t&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t,e){e&&this.selectSvgSheetRequest.emit({complexId:t,sheetId:e})}},u.ctorParameters=()=>[{type:p}],u.propDecorators={editionComplex:[{type:c}],sourceEvaluationListData:[{type:c}],navigateToReportFragmentRequest:[{type:s}],openModalRequest:[{type:s}],selectSvgSheetRequest:[{type:s}]},u);S=o([a({selector:"awg-source-evaluation",template:G,changeDetection:r.OnPush,styles:[W]})],S);var j=`<div class="card">
    <div class="card-body">
        <table aria-label="Table for list of sources" class="table table-hover borderless awg-source-list-sources">
            <tbody>
                @for (source of sourceListData.sources; track source; let sourceIndex = $index) {
                    <tr>
                        <th scope="row" id="{{ source.siglum }}{{ source.siglumAddendum }}">
                            @if (source.hasDescription === true) {
                                <a (click)="navigateToReportFragment(source.linkTo)">
                                    @if (source.missing) {
                                        <span>[</span>
                                    }
                                    <span class="awg-source-list-siglum">{{ source.siglum }}</span>
                                    @if (source.siglumAddendum) {
                                        <span class="awg-source-list-siglum-addendum">
                                            <sup>{{ source.siglumAddendum }}</sup>
                                        </span>
                                    }
                                    @if (source.missing) {
                                        <span>]</span>
                                    }
                                </a>
                            } @else {
                                <a (click)="openModal(source.linkTo)">
                                    @if (source.missing) {
                                        <span>[</span>
                                    }
                                    <span class="awg-source-list-siglum">{{ source.siglum }}</span>
                                    @if (source.siglumAddendum) {
                                        <span class="awg-source-list-siglum-addendum">
                                            <sup>{{ source.siglumAddendum }}</sup>
                                        </span>
                                    }
                                    @if (source.missing) {
                                        <span>]</span>
                                    }
                                </a>
                            }
                        </th>
                        <td>
                            <span [compile-html]="source.type" [compile-html-ref]="ref"></span> <br />
                            <span class="text-muted" [innerHTML]="source.location"></span>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
        @if (utils.isNotEmptyArray(sourceListData.textSources)) {
            <table
                aria-label="Table for list of text sources"
                class="table table-hover borderless awg-source-list-text-sources">
                <tbody>
                    <tr>
                        <td colspan="2">Zum vertonten Text:</td>
                    </tr>
                    @for (text of sourceListData.textSources; track text; let textIndex = $index) {
                        <tr>
                            <th scope="row" id="{{ text.id }}">
                                <span class="awg-source-list-text-siglum-container"
                                    ><span class="awg-source-list-text-siglum">{{ text.siglum }}</span>
                                    @if (text.siglumAddendum) {
                                        <span class="awg-source-list-text-siglum-addendum"
                                            ><sup>{{ text.siglumAddendum }}</sup></span
                                        >
                                    }
                                </span>
                            </th>
                            <td>
                                <span [compile-html]="text.type" [compile-html-ref]="ref"></span> <br />
                                <span class="text-muted" [innerHTML]="text.location"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        }
    </div>
</div>
`;var U=`table.awg-source-list-sources>tbody>tr>th{white-space:nowrap}
`;var d,D=(d=class{constructor(t){this.utils=t,this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.ref=this}navigateToReportFragment(t){t&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}},d.ctorParameters=()=>[{type:p}],d.propDecorators={sourceListData:[{type:c}],navigateToReportFragmentRequest:[{type:s}],openModalRequest:[{type:s}]},d);D=o([a({selector:"awg-source-list",template:j,changeDetection:r.OnPush,styles:[U]})],D);var B=`@if (textcriticsData) {
    <div ngbAccordion>
        @for (textcritics of textcriticsData.textcritics; track textcritics) {
            <div [ngbAccordionItem]="textcritics.id" [collapsed]="true">
                <div
                    ngbAccordionHeader
                    class="accordion-button awg-accordion-button-custom-header justify-content-between">
                    <button ngbAccordionToggle class="btn btn-link text-start p-0">{{ textcritics.label }}</button>
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-info"
                        (click)="selectSvgSheet({ complexId: '', sheetId: textcritics.id })">
                        Zum edierten Notentext
                    </button>
                </div>
                <div ngbAccordionCollapse>
                    <div ngbAccordionBody>
                        <ng-template>
                            @if (utils.isNotEmptyArray(textcritics.description)) {
                                <div>
                                    <p class="smallcaps">
                                        <awg-edition-tka-label
                                            [id]="textcritics.id"
                                            [labelType]="'evaluation'"></awg-edition-tka-label
                                        >:
                                    </p>
                                    <awg-edition-tka-description
                                        [textcriticalDescriptions]="textcritics.description"
                                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                        (openModalRequest)="openModal($event)"
                                        (selectSvgSheetRequest)="selectSvgSheet($event)"></awg-edition-tka-description>
                                </div>
                            }
                            @if (utils.isNotEmptyArray(textcritics.comments)) {
                                <div>
                                    <p class="smallcaps">
                                        <awg-edition-tka-label
                                            [id]="textcritics.id"
                                            [labelType]="'comment'"></awg-edition-tka-label
                                        >:
                                    </p>
                                    <awg-edition-tka-table
                                        [textcriticalComments]="textcritics.comments"
                                        [isRowTable]="textcritics.rowtable"
                                        [isSketchId]="utils.isSketchId(textcritics.id)"
                                        (navigateToReportFragmentRequest)="navigateToReportFragment($event)"
                                        (openModalRequest)="openModal($event)"
                                        (selectSvgSheetRequest)="selectSvgSheet($event)">
                                    </awg-edition-tka-table>
                                </div>
                            }
                        </ng-template>
                    </div>
                </div>
            </div>
        }
    </div>
}
`;var P="";var g,x=(g=class{constructor(t){this.utils=t,this.navigateToReportFragmentRequest=new i,this.openModalRequest=new i,this.selectSvgSheetRequest=new i,this.ref=this}navigateToReportFragment(t){t&&this.navigateToReportFragmentRequest.emit(t)}openModal(t){t&&this.openModalRequest.emit(t)}selectSvgSheet(t){t?.sheetId&&this.selectSvgSheetRequest.emit(t)}},g.ctorParameters=()=>[{type:p}],g.propDecorators={textcriticsData:[{type:c}],navigateToReportFragmentRequest:[{type:s}],openModalRequest:[{type:s}],selectSvgSheetRequest:[{type:s}]},g);x=o([a({selector:"awg-textcritics-list",template:B,changeDetection:r.OnPush,styles:[P]})],x);var H=`<!-- content: edition report -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

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
    }
</div>
`;var z="";var f,v=(f=class{constructor(t,e,l){this.editionDataService=t,this.editionService=e,this.router=l,this.errorObject=null,this.titles={sourceList:"1. Quellen\xFCbersicht",sourceDescription:"2. Quellenbeschreibung",sourceEvaluation:"3. Quellenbewertung",tka:"4. Textkritische Anmerkungen"}}get editionRouteConstants(){return b}ngOnInit(){this.getEditionReportData()}getEditionReportData(){this.editionReportData$=this.editionService.getEditionComplex().pipe(k(t=>(this.editionComplex=t,this.editionDataService.getEditionReportData(this.editionComplex))),_(t=>(this.errorObject=t,E)))}onModalOpen(t){t&&this.modal.open(t)}onReportFragmentNavigate(t){t||(t="");let e={fragment:t};this.router.navigate([this.editionComplex.baseRoute,this.editionRouteConstants.EDITION_REPORT.route],e)}onSvgSheetSelect(t){let e=t?.complexId?`/edition/complex/${t?.complexId}/`:this.editionComplex.baseRoute,h={queryParams:{id:t?.sheetId??""}};this.router.navigate([e,this.editionRouteConstants.EDITION_SHEETS.route],h)}},f.ctorParameters=()=>[{type:$},{type:A},{type:I}],f.propDecorators={modal:[{type:C,args:["modal",{static:!0}]}]},f);v=o([a({selector:"awg-edition-report",template:H,changeDetection:r.OnPush,styles:[z]})],v);var rt=[{path:"",component:v,data:{title:"AWG Online Edition \u2013 Report"}}],Q=[v],T=class{};T=o([w({imports:[M.forChild(rt)],exports:[M]})],T);var Z=class{};Z=o([w({imports:[O,q,T],declarations:[x,R,S,D,Q]})],Z);export{Z as EditionReportModule};
