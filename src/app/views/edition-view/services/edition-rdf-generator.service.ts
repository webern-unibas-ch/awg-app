import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, forkJoin, of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EDITION_ASSETS_DATA } from '../data';
import { EditionComplex, EditionSvgSheet, EditionSvgSheetList, GraphList, Source, SourceList } from '../models';
import { EditionDataService } from './edition-data.service';

@Injectable({
    providedIn: 'root',
})
export class EditionRdfGeneratorService extends EditionDataService {
    private _assetsPath = 'assets/data/edition/series/1/section/5/op23';

    constructor(private http: HttpClient) {
        super();
    }

    generateRdfTriples(editionComplex: EditionComplex): Observable<GraphList> {
        this._assetsPath = this._setAssetPathForEditionComplex(editionComplex);

        const sheetsUrl = `${this._assetsPath}/${EDITION_ASSETS_DATA.FILES.svgSheetsFile}`;
        const sourceListUrl = `${this._assetsPath}/${EDITION_ASSETS_DATA.FILES.sourceListFile}`;

        return forkJoin({
            sheetsData: this.http.get<EditionSvgSheetList>(sheetsUrl),
            sourceListData: this.http
                .get<SourceList>(sourceListUrl)
                .pipe(catchError(() => observableOf(new SourceList()))),
            graphData: this.getEditionGraphData(editionComplex),
        }).pipe(
            map(({ sheetsData, sourceListData, graphData }) => {
                const rdfTriples = this._createRdfTriples(sheetsData, sourceListData);
                const queryList = this._createQueryList();

                graphData.graph[0].rdfData.triples = rdfTriples;
                graphData.graph[0].rdfData.queryList = queryList;

                return graphData;
            })
        );
    }

    private _createRdfTriples(sheetsData: EditionSvgSheetList, sourceListData: SourceList): string {
        let rdfTriples = `
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix awg: <https://edition.anton-webern.ch/webern-onto#> .

`;

        const sourceLookup = this._createSourceLookup(sourceListData);
        const referencedSources = new Map<string, Source>();

        const appendTriplesForSheets = (sheets: EditionSvgSheet[], editionType: string) => {
            sheets?.forEach((sheet: EditionSvgSheet) => {
                rdfTriples += this._createSheetTriples(sheet, editionType, sourceLookup, referencedSources) + '\n\n';
            });
        };

        appendTriplesForSheets(sheetsData.sheets.workEditions, 'WorkEdition');
        appendTriplesForSheets(sheetsData.sheets.textEditions, 'TextEdition');
        appendTriplesForSheets(sheetsData.sheets.sketchEditions, 'SketchEdition');

        referencedSources.forEach(source => {
            rdfTriples += this._createSourceTriples(source) + '\n\n';
        });

        return rdfTriples.trim();
    }

    private _createSheetTriples(
        sheet: EditionSvgSheet,
        editionType: string,
        sourceLookup: Map<string, Source>,
        referencedSources: Map<string, Source>
    ): string {
        const sources = this._collectSourcesForSheet(sheet, sourceLookup);
        const displayLabel = this._createSheetDisplayLabel(sheet.label, sources);
        const triples = [`awg:${sheet.id} a awg:${editionType} ;`, `\trdfs:label "${this._escapeLiteral(displayLabel)}"`];

        sources.forEach(source => {
            const sourceNodeId = this._getSourceNodeId(source);

            referencedSources.set(sourceNodeId, source);
            triples.push(`\tawg:hasSource awg:${sourceNodeId}`);
        });

        return triples
            .map((line, index) => {
                if (index === 0) {
                    return line;
                }

                const terminator = index === triples.length - 1 ? ' .' : ' ;';
                return `${line}${terminator}`;
            })
            .join('\n');
    }

    private _createSourceLookup(sourceListData: SourceList): Map<string, Source> {
        const lookup = new Map<string, Source>();

        sourceListData?.sources?.forEach(source => {
            const combinedKey = this._normalizeSourceKey(this._formatSourceSiglum(source));
            const plainKey = this._normalizeSourceKey(source.siglum);

            if (combinedKey) {
                lookup.set(combinedKey, source);
            }
            if (plainKey && !lookup.has(plainKey)) {
                lookup.set(plainKey, source);
            }
        });

        return lookup;
    }

    private _collectSourcesForSheet(sheet: EditionSvgSheet, sourceLookup: Map<string, Source>): Source[] {
        const sources = new Map<string, Source>();

        sheet.content?.forEach(content => {
            const sourceKey = this._normalizeSourceKey(content.convolute);

            if (!sourceKey) {
                return;
            }

            const source = sourceLookup.get(sourceKey);

            if (source) {
                sources.set(this._getSourceNodeId(source), source);
            }
        });

        return Array.from(sources.values());
    }

    private _createSheetDisplayLabel(sheetLabel: string, sources: Source[]): string {
        if (!sources.length) {
            return sheetLabel;
        }

        const sourceSigla = sources.map(source => this._formatSourceSiglum(source)).join(', ');
        return `${sheetLabel} [${sourceSigla}]`;
    }

    private _createSourceTriples(source: Source): string {
        const sourceNodeId = this._getSourceNodeId(source);
        const sourceLabel = this._formatSourceSiglum(source);
        const triples = [`awg:${sourceNodeId} rdfs:label "${this._escapeLiteral(sourceLabel)}"`];

        if (source?.type?.trim()) {
            triples.push(`\tawg:sourceType "${this._escapeLiteral(source.type.trim())}"`);
        }

        if (source?.location?.trim()) {
            triples.push(`\tawg:sourceLocation "${this._escapeLiteral(source.location.trim())}"`);
        }

        return triples.map((line, index) => `${line}${index === triples.length - 1 ? ' .' : ' ;'}`).join('\n');
    }

    private _formatSourceSiglum(source: Source): string {
        return `${source?.siglum ?? ''}${source?.siglumAddendum ?? ''}`.trim();
    }

    private _getSourceNodeId(source: Source): string {
        if (source?.linkTo?.trim()) {
            return this._sanitizeNodeId(source.linkTo);
        }

        return this._sanitizeNodeId(`source_${this._formatSourceSiglum(source)}`);
    }

    private _normalizeSourceKey(sourceKey?: string): string {
        return sourceKey?.replace(/\s+/g, '').trim() ?? '';
    }

    private _sanitizeNodeId(value: string): string {
        return value.replace(/[^A-Za-z0-9_]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    }

    private _escapeLiteral(value: string): string {
        return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ');
    }

    private _createQueryList() {
        return [
            {
                queryType: 'construct',
                queryLabel: 'Finde alle RDF-Triples',
                queryString:
                    'PREFIX dc: <http://purl.org/dc/elements/1.1/> \nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \nPREFIX owl: <http://www.w3.org/2002/07/owl#> \nPREFIX awg: <https://edition.anton-webern.ch/webern-onto#> \n\n CONSTRUCT \n WHERE { \n\t ?subject ?predicate ?object . \n }',
            },
            {
                queryType: 'construct',
                queryLabel: 'Finde alle Editionskomplexe',
                queryString:
                    'PREFIX dc: <http://purl.org/dc/elements/1.1/> \nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \nPREFIX owl: <http://www.w3.org/2002/07/owl#> \nPREFIX awg: <https://edition.anton-webern.ch/webern-onto#> \n\n CONSTRUCT \n WHERE { \n\t ?complex a awg:EditionComplex; rdfs:label ?label .  \n }',
            },
            {
                queryType: 'construct',
                queryLabel: 'Finde alle Quellenbezuege',
                queryString:
                    'PREFIX dc: <http://purl.org/dc/elements/1.1/> \nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \nPREFIX owl: <http://www.w3.org/2002/07/owl#> \nPREFIX awg: <https://edition.anton-webern.ch/webern-onto#> \n\n CONSTRUCT { \n\t ?sheet awg:hasSource ?source .\n\t ?sheet rdfs:label ?sheetLabel .\n\t ?source rdfs:label ?sourceLabel .\n\t ?source awg:sourceType ?sourceType .\n\t ?source awg:sourceLocation ?sourceLocation .\n }\n WHERE { \n\t ?sheet awg:hasSource ?source ; rdfs:label ?sheetLabel .\n\t ?source rdfs:label ?sourceLabel .\n\t OPTIONAL { ?source awg:sourceType ?sourceType . }\n\t OPTIONAL { ?source awg:sourceLocation ?sourceLocation . }\n }',
            },
        ];
    }
}
