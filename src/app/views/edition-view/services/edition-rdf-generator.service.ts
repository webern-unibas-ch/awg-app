import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { EditionComplex, EditionSvgSheet, EditionSvgSheetList, GraphList } from '../models';
import { EditionDataService } from './edition-data.service';

@Injectable({
    providedIn: 'root',
})
export class EditionRdfGeneratorService extends EditionDataService {
    private _assetsPath = 'assets/data/edition/series/1/section/5/op23/';

    constructor(private http: HttpClient) {
        super();
    }

    generateRdfTriples(editionComplex: EditionComplex): Observable<GraphList> {
        this._assetsPath = this._setAssetPathForEditionComplex(editionComplex);

        const sheetsUrl = this._assetsPath + '/svg-sheets.json';

        return forkJoin({
            sheetsData: this.http.get<EditionSvgSheetList>(sheetsUrl),
            graphData: this.getEditionGraphData(editionComplex),
        }).pipe(
            map(({ sheetsData, graphData }) => {
                const rdfTriples = this._createRdfTriples(sheetsData);
                const queryList = this._createQueryList();

                graphData.graph[0].rdfData.triples = rdfTriples;
                graphData.graph[0].rdfData.queryList = queryList;

                return graphData;
            })
        );
    }

    private _createRdfTriples(sheetsData: EditionSvgSheetList): string {
        let rdfTriples = `
@prefix dc: <http://purl.org/dc/elements/1.1/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix awg: <https://edition.anton-webern.ch/webern-onto#> .

`;

        const generateTriplesForSheet = (sheet: EditionSvgSheet, editionType: string) => {
            const triples = [];
            const sheetId = sheet.id;
            const sheetLabel = sheet.label;
            triples.push(`awg:${sheetId} a awg:${editionType} ;`);
            triples.push(`\trdfs:label "${sheetLabel}" .`);
            return triples.join('\n');
        };

        sheetsData.sheets.textEditions?.forEach((sheet: EditionSvgSheet) => {
            rdfTriples += generateTriplesForSheet(sheet, 'TextEdition') + '\n\n';
        });

        sheetsData.sheets.sketchEditions?.forEach((sheet: EditionSvgSheet) => {
            rdfTriples += generateTriplesForSheet(sheet, 'SketchEdition') + '\n\n';
        });

        return rdfTriples.trim();
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
        ];
    }
}
