import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { EditionComplex, EditionSvgSheetList, GraphList, SourceList } from '../models';

import { EditionRdfGeneratorService } from './edition-rdf-generator.service';

describe('EditionRdfGeneratorService', () => {
    let service: EditionRdfGeneratorService;
    let httpTestingController: HttpTestingController;

    const expectedAssetPath = 'assets/data/edition/series/1/section/5/op23';
    const expectedEditionComplex = {
        pubStatement: {
            series: { route: '1' },
            section: { route: '5' },
        },
        complexId: { route: 'op23' },
    } as EditionComplex;

    const expectedGraphData = {
        graph: [
            {
                id: 'op23',
                title: 'Skizzengraph Opus 23',
                description: [],
                rdfData: {
                    queryList: [],
                    triples: '',
                },
            },
        ],
    } as GraphList;

    const expectedSheetsData = {
        sheets: {
            workEditions: [],
            textEditions: [],
            sketchEditions: [
                {
                    id: 'M312_Sk1',
                    label: 'M 312 Sk1',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op23/M312_Sk1-1von1-final.svg',
                            image: '',
                            partial: '',
                            convolute: 'A',
                        },
                    ],
                },
            ],
        },
    } as EditionSvgSheetList;

    const expectedSourceListData = {
        sources: [
            {
                siglum: 'A',
                siglumAddendum: '',
                type: 'Skizzen (in: Skizzenbuch 3).',
                location: 'CH-Bps, Sammlung Anton Webern.',
                hasDescription: true,
                linkTo: 'source_A',
            },
        ],
    } as SourceList;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionRdfGeneratorService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        service = TestBed.inject(EditionRdfGeneratorService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('... should generate source-aware RDF triples from svg sheets and source list', waitForAsync(() => {
        let generatedGraphData: GraphList;

        service.generateRdfTriples(expectedEditionComplex).subscribe({
            next: graphData => {
                generatedGraphData = graphData;
            },
        });

        httpTestingController.expectOne(`${expectedAssetPath}/svg-sheets.json`).flush(expectedSheetsData);
        httpTestingController.expectOne(`${expectedAssetPath}/source-list.json`).flush(expectedSourceListData);
        httpTestingController.expectOne(`${expectedAssetPath}/graph.json`).flush(expectedGraphData);

        const triples = generatedGraphData.graph[0].rdfData.triples;
        const queryList = generatedGraphData.graph[0].rdfData.queryList;

        expect(triples).toContain('rdfs:label "M 312 Sk1 [A]"');
        expect(triples).toContain('awg:hasSource awg:source_A');
        expect(triples).toContain('awg:source_A rdfs:label "A"');
        expect(triples).toContain('awg:sourceType "Skizzen (in: Skizzenbuch 3)."');
        expect(triples).toContain('awg:sourceLocation "CH-Bps, Sammlung Anton Webern."');
        expect(queryList.some(query => query.queryLabel === 'Finde alle Quellenbezuege')).toBeTrue();
        expect(queryList.some(query => query.queryString.includes('awg:hasSource'))).toBeTrue();
    }));

    it('... should fall back to plain sheet labels if source list loading fails', waitForAsync(() => {
        let generatedGraphData: GraphList;

        service.generateRdfTriples(expectedEditionComplex).subscribe({
            next: graphData => {
                generatedGraphData = graphData;
            },
        });

        httpTestingController.expectOne(`${expectedAssetPath}/svg-sheets.json`).flush(expectedSheetsData);
        httpTestingController.expectOne(`${expectedAssetPath}/source-list.json`).flush(null, {
            status: 404,
            statusText: 'NOT FOUND',
        });
        httpTestingController.expectOne(`${expectedAssetPath}/graph.json`).flush(expectedGraphData);

        const triples = generatedGraphData.graph[0].rdfData.triples;

        expect(triples).toContain('rdfs:label "M 312 Sk1" .');
        expect(triples).not.toContain('awg:hasSource');
    }));
});
