import{a as $,b}from"./chunk-MEKY2OAZ.js";import{a as M}from"./chunk-SNWKSKVN.js";import"./chunk-7TQAZGIK.js";import"./chunk-KUQIJKAS.js";import"./chunk-3F66QUQP.js";import{a as n}from"./chunk-GYSG6DRK.js";import{m as R,n as l,o as S}from"./chunk-P624EQH4.js";import{I as O,L as U}from"./chunk-JMYFCBOW.js";import{i as A}from"./chunk-EPXWPMQS.js";import"./chunk-NX26MSJG.js";import"./chunk-BDCTX6XT.js";import"./chunk-5WBNOFSC.js";import{Ua as s,Wa as i,Za as d,da as c,o as e,xa as o}from"./chunk-NNW6KWLG.js";var N=`<table class="awg-source-description-content-table half-para-margin" role="presentation">
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
                        >&nbsp;&nbsp;<span [awgCompileHtml]="folio.folioDescription"></span
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
                                    <span [awgCompileHtml]="system.systemDescription"></span>
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
`;var G=`.awg-source-description-content-table{margin-left:25px}
`;var D=class{constructor(){this._navigationService=c(l),this.UTILS=n}selectSvgSheet(t){t?.sheetId&&this._navigationService.navigateToSvgSheet(t)}static{this.propDecorators={content:[{type:i}]}}};D=e([s({selector:"awg-source-description-content-table",template:N,changeDetection:o.OnPush,standalone:!1,styles:[G]})],D);var H=`<div class="awg-source-description-contents">
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
                                ><span [awgCompileHtml]="content.itemDescription"></span
                            ></span>
                        }
                        <span>:</span><br />
                    </span>
                </summary>

                <!-- content.folios -->
                @if (!UTILS.isEmptyArray(content?.folios)) {
                    <awg-source-description-content-table [content]="content" />
                }
            </details>
        } @else if (!UTILS.isEmptyArray(content?.folios)) {
            <awg-source-description-content-table [content]="content" />
        }
    }
</div>
`;var j=`.awg-source-description-contents{margin-bottom:1rem}.awg-source-description-contents-toggle{margin-left:1em;cursor:pointer}.awg-source-description-contents-toggle.text-muted{transition:color .2s}.awg-source-description-contents-toggle:hover,.awg-source-description-contents-toggle:focus{color:inherit!important}.awg-source-description-contents-toggle-text{text-decoration:underline}
`;var h=class{constructor(){this._navigationService=c(l),this.openAllContentDetails=!0,this.UTILS=n}selectSvgSheet(t){t?.sheetId&&this._navigationService.navigateToSvgSheet(t)}toggleAllContentDetails(t){this.openAllContentDetails=t}static{this.propDecorators={contents:[{type:i}]}}};h=e([s({selector:"awg-source-description-contents",template:H,changeDetection:o.OnPush,standalone:!1,styles:[j]})],h);var B=`<div class="awg-source-description-corrections">
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
                [awgCompileHtml]="correction.label + ':'"></summary>
            <div class="p-3 border rounded-3">
                @for (evaluation of correction.evaluations; track $index) {
                    <p class="awg-source-description-correction-evaluation mb-0" [awgCompileHtml]="evaluation"></p>
                }
                @if (correction.commentary.comments.length > 0) {
                    <awg-edition-tka-table
                        [commentary]="correction.commentary"
                        [isCorrections]="true"
                        [isRowtable]="correction.rowtable" />
                }
            </div>
        </details>
    }
</div>
`;var W=`.awg-source-description-corrections-toggle{margin-left:1em;cursor:pointer}.awg-source-description-corrections-toggle.text-muted{transition:color .2s}.awg-source-description-corrections-toggle:hover,.awg-source-description-corrections-toggle:focus{color:inherit!important}.awg-source-description-corrections-toggle-text{text-decoration:underline}
`;var v=class{constructor(){this.openAllCorrectionDetails=!1}toggleAllCorrectionDetails(t){this.openAllCorrectionDetails=t}static{this.propDecorators={corrections:[{type:i}]}}};v=e([s({selector:"awg-source-description-corrections",template:B,changeDetection:o.OnPush,standalone:!1,styles:[W]})],v);var F=`@if (!UTILS.isEmptyArray(details)) {
    <p class="awg-source-description-{{ detailsClass }}">
        @if (detailsLabel) {
            <span class="awg-source-description-details-label smallcaps">{{ detailsLabel }}:&nbsp;</span>
        }
        <span class="awg-source-description-details-content">
            @for (detail of details; track $index; let lastDetail = $last) {
                <span [awgCompileHtml]="detail"></span>
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
`;var P=`p{display:flex;align-items:baseline}p .awg-source-description-details-label{flex-shrink:0;white-space:nowrap}p .awg-source-description-details-content{flex:1}
`;var C=class{constructor(){this.UTILS=n}static{this.propDecorators={details:[{type:i}],detailsClass:[{type:i}],detailsLabel:[{type:i}]}}};C=e([s({selector:"awg-source-description-details",template:F,changeDetection:o.OnPush,standalone:!1,styles:[P]})],C);var z=`<p class="awg-source-description-writing-materials">
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
                            <span [awgCompileHtml]="writingMaterial.trademark.alt"></span>&nbsp;
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
`;var K=`p{display:flex;align-items:baseline}p .awg-source-description-writing-materials-label{flex-shrink:0;white-space:nowrap}p .awg-source-description-writing-materials-content{flex:1}
`;var _=class{constructor(){this.UTILS=n,this.TRADEMARKS=O}getTrademark(t){return t&&this.TRADEMARKS[t]?this.TRADEMARKS[t]:{route:"",full:"Not a known trademark.",short:"unknown"}}getItemLocus(t){if(n.isEmptyObject(t))return"";let p=a=>a.endsWith("v")||a.endsWith("r")?`${a.slice(0,-1)}<sup>${a.slice(-1)}</sup>`:a,f=a=>a.length===1?a[0].includes("all")?"auf allen Bl\xE4ttern":`auf Bl. ${a[0]}`:a.length>1?`auf Bl. ${a.slice(0,-1).join(", ")} und ${a.slice(-1)}`:"",k=t.folios.map(p),w=f(k),y=t.preFolioInfo?`${t.preFolioInfo} `:"",m=w?" ":"",nt=t.position?`${m}${t.position}`:"";return`${y}${w}${nt}`}getDimensions(t){let{orientation:p,height:f,width:k,unit:w}=t,y=m=>n.isEmptyObject(m)?"":m.uncertainty?`${m.uncertainty} ${m.value}`:m.value;return`Format: ${p} ${y(f)} \xD7 ${y(k)} ${w}`}getSystems(t){return[`${t.totalSystems} ${t.totalSystems===1?"System":"Systeme"}`,t.totalSystemsAddendum&&` (${t.totalSystemsAddendum})`,t.additionalInfo&&`, ${t.additionalInfo}`].filter(Boolean).join("")}static{this.propDecorators={writingMaterials:[{type:i}]}}};_=e([s({selector:"awg-source-description-writing-materials",template:z,changeDetection:o.OnPush,standalone:!1,styles:[K]})],_);var Q=`@if (sourceDescriptionListData) {
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
                            <p class="awg-source-description-type" [awgCompileHtml]="sourceDescription.type"></p>
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
                                    detailsClass="conditions" />
                            }
                            <!-- writingMaterials -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.writingMaterials)) {
                                <awg-source-description-writing-materials
                                    [writingMaterials]="sourceDescription.physDesc.writingMaterials" />
                            } @else if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.writingMaterialStrings)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.writingMaterialStrings"
                                    detailsLabel="Beschreibstoff"
                                    detailsClass="writing-materials" />
                            }
                            <!-- writingInstruments -->
                            @if (!UTILS.isEmptyObject(sourceDescription.physDesc.writingInstruments)) {
                                @if (sourceDescription.physDesc.writingInstruments.main) {
                                    <p class="awg-source-description-writing-instruments">
                                        <span class="smallcaps">Schreibstoff:&nbsp;</span>
                                        <span
                                            [awgCompileHtml]="
                                                getWritingInstruments(sourceDescription.physDesc.writingInstruments)
                                            "></span>
                                    </p>
                                }
                            }
                            <!-- title -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.titles)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.titles"
                                    detailsLabel="Titel"
                                    detailsClass="titles" />
                            }
                            <!-- date -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.dates)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.dates"
                                    detailsLabel="Datierung"
                                    detailsClass="dates" />
                            }
                            <!-- pagination -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.paginations)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.paginations"
                                    detailsLabel="Paginierung"
                                    detailsClass="paginations" />
                            }
                            <!-- measureNumbers -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.measureNumbers)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.measureNumbers"
                                    detailsLabel="Taktzahlen"
                                    detailsClass="measure-numbers" />
                            }
                            <!-- instrumentation -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.instrumentations)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.instrumentations"
                                    detailsLabel="Instrumentenvorsatz"
                                    detailsClass="instrumentations" />
                            }
                            <!-- annotations -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.annotations)) {
                                <awg-source-description-details
                                    [details]="sourceDescription.physDesc.annotations"
                                    detailsLabel="Eintragungen"
                                    detailsClass="annotations" />
                            }
                            <!-- contents -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.contents)) {
                                <awg-source-description-contents [contents]="sourceDescription.physDesc.contents" />
                            }

                            <!-- corrections -->
                            @if (!UTILS.isEmptyArray(sourceDescription?.physDesc?.corrections)) {
                                <awg-source-description-corrections
                                    [corrections]="sourceDescription.physDesc.corrections" />
                            }
                        </div>
                    }
                </div>
            </div>
        }
    </div>
}
`;var Z="";var u=class{constructor(){this.UTILS=n}getWritingInstruments(t){let p=t.secondary?.join(", ");return`${p?`${t.main}; ${p}`:t.main}.`}static{this.propDecorators={sourceDescriptionListData:[{type:i}]}}};u=e([s({selector:"awg-source-description",template:Q,changeDetection:o.OnPush,standalone:!1,styles:[Z]})],u);var x=class{};x=e([d({imports:[S,b],declarations:[u,h,D,v,C,_],exports:[u]})],x);var V=`@if (sourceEvaluationListData) {
    <div class="awg-source-evaluation-list card">
        <div class="card-body">
            @let content = sourceEvaluationListData.sources?.[0]?.content || [];
            @if (UTILS.isEmptyArray(content)) {
                <p class="awg-source-evaluation-empty p-5 border rounded-3">
                    <small class="text-muted"
                        >[Die Quellenbewertung zum Editionskomplex
                        <span [innerHTML]="editionComplex.complexId.full"></span> erscheint im Zusammenhang der
                        vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex.complexId.short"></span> in
                        {{ editionComplex.pubStatement.labeledSectionRoute.label }}.]
                    </small>
                </p>
            } @else {
                @for (evaluation of content; track evaluation) {
                    <p class="awg-source-evaluation-entry" [awgCompileHtml]="evaluation"></p>
                }
            }
        </div>
    </div>
}
`;var q="";var T=class{constructor(){this.UTILS=n}static{this.propDecorators={editionComplex:[{type:i}],sourceEvaluationListData:[{type:i}]}}};T=e([s({selector:"awg-source-evaluation",template:V,changeDetection:o.OnPush,standalone:!1,styles:[q]})],T);var J=`<div class="card">
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
                                <span [awgCompileHtml]="source.type"></span> <br />
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
                                <span [awgCompileHtml]="textSource.type"></span> <br />
                                <span class="text-muted" [innerHTML]="textSource.location"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        }
    </div>
</div>
`;var X="";var I=class{constructor(){this._navigationService=c(l),this._modalService=c(R),this.UTILS=n}onSourceClick(t){t.hasDescription?this._navigateToReportFragment({complexId:"",fragmentId:t.linkTo}):this._openModal(t.linkTo)}_navigateToReportFragment(t){t?.fragmentId&&this._navigationService.navigateToReportFragment(t)}_openModal(t){t&&this._modalService.openTextModal(t)}static{this.propDecorators={sourceListData:[{type:i}]}}};I=e([s({selector:"awg-source-list",template:J,changeDetection:o.OnPush,standalone:!1,styles:[X]})],I);var Y=`@if (textcriticsListData) {
    <div ngbAccordion>
        @for (textcritics of textcriticsListData.textcritics; track textcritics.id) {
            <div [ngbAccordionItem]="textcritics.id" [collapsed]="true">
                <div
                    ngbAccordionHeader
                    class="accordion-button awg-accordion-button-custom-header justify-content-between">
                    <button ngbAccordionToggle class="btn btn-link text-start p-0">
                        <span [awgCompileHtml]="textcritics.label"></span>
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
                                    <awg-edition-tka-evaluations [evaluations]="textcritics.evaluations" />
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
                                        [isRowtable]="textcritics.rowtable" />
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
`;var tt="";var L=class{constructor(){this._navigationService=c(l),this.EDITION_UTILS=$,this.UTILS=n}selectSvgSheet(t){t?.sheetId&&this._navigationService.navigateToSvgSheet(t)}static{this.propDecorators={textcriticsListData:[{type:i}]}}};L=e([s({selector:"awg-textcritics-list",template:Y,changeDetection:o.OnPush,standalone:!1,styles:[tt]})],L);var et=`<!-- content: edition report -->
<div>
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
                                    <awg-source-list [sourceListData]="sourceListData" />
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
                                    <awg-source-description [sourceDescriptionListData]="sourceDescriptionListData" />
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
                                        [sourceEvaluationListData]="sourceEvaluationListData" />
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
                                    <awg-textcritics-list [textcriticsListData]="textcriticsData" />
                                }
                            </ng-template>
                        </div>
                    </div>
                </div>
            </div>
        }
    }
</div>
`;var it="";var g=class{constructor(){this.selectedEditionComplex=c(U).selectedEditionComplex,this.viewData=c(M).reportViewData,this.titles={sourceList:"1. Quellen\xFCbersicht",sourceDescription:"2. Quellenbeschreibung",sourceEvaluation:"3. Quellenbewertung",tka:"4. Textkritische Anmerkungen"}}};g=e([s({selector:"awg-edition-report",template:et,changeDetection:o.OnPush,standalone:!1,styles:[it]})],g);var Tt=[{path:"",component:g,data:{title:"AWG Online Edition \u2013 Report"}}],ot=[g],E=class{};E=e([d({imports:[A.forChild(Tt)],exports:[A]})],E);var st=class{};st=e([d({imports:[S,b,x,E],declarations:[L,T,I,ot]})],st);export{st as EditionReportModule};
