import { HttpClient, HttpClientModule, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Data } from '@angular/router';

import { EMPTY, of as observableOf } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { EDITION_ASSETS_DATA, EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionRowTablesList,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    FolioConvoluteList,
    Graph,
    GraphList,
    Intro,
    IntroList,
    Source,
    SourceDescription,
    SourceDescriptionList,
    SourceEvaluation,
    SourceEvaluationList,
    SourceList,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';

import { mockEditionData } from '@testing/mock-data';
import { EditionDataService } from './edition-data.service';

describe('EditionDataService (DONE)', () => {
    let editionDataService: EditionDataService;

    let consoleSpy: Spy;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let expectedRowTablesData: EditionRowTablesList;

    const expectedEditionComplex: EditionComplex = EDITION_COMPLEXES.OP12;
    const expectedAssetPathBaseRoute = EDITION_ASSETS_DATA.BASE_ROUTE;
    const delimiter = '/';
    const expectedComplexRoute =
        delimiter +
        EDITION_ROUTE_CONSTANTS.SERIES.route +
        delimiter +
        expectedEditionComplex.series.route +
        EDITION_ROUTE_CONSTANTS.SECTION.route +
        expectedEditionComplex.section.route +
        expectedEditionComplex.complexId.route;
    const expectedAssetPath = expectedAssetPathBaseRoute + expectedComplexRoute;
    let regexBase = new RegExp(expectedAssetPath);

    const files = EDITION_ASSETS_DATA.FILES;
    const expectedFolioConvoluteFilePath = `${expectedAssetPath}/${files.folioConvoluteFile}`;
    const expectedGraphFilePath = `${expectedAssetPath}/${files.graphFile}`;
    const expectedIntroFilePath = `${expectedAssetPath}/${files.introFile}`;
    const expectedRowTablesFilePath = `${expectedAssetPathBaseRoute}/${files.rowTablesFile}`;
    const expectedSheetsFilePath = `${expectedAssetPath}/${files.svgSheetsFile}`;
    const expectedSourceListFilePath = `${expectedAssetPath}/${files.sourceListFile}`;
    const expectedSourceDescriptionFilePath = `${expectedAssetPath}/${files.sourceDescriptionListFile}`;
    const expectedSourceEvaluationFilePath = `${expectedAssetPath}/${files.sourceEvaluationListFile}`;
    const expectedTextcriticsFilePath = `${expectedAssetPath}/${files.textcriticsFile}`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [EditionDataService],
        });

        // Inject services and http client handler
        editionDataService = TestBed.inject(EditionDataService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // Test data
        expectedRowTablesData = mockEditionData.mockRowTablesData;

        // Spies on console logs
        consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
    });

    // After every test, assert that there are no more pending requests
    afterEach(() => {
        // Clear mock stores after each test
        mockConsole.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(editionDataService).toBeTruthy();
    });

    it('... should have empty assetPath', () => {
        expectToBe((editionDataService as any)._assetPath, '');
    });

    describe('httpTestingController', () => {
        it('... should issue a mocked http get request', waitForAsync(() => {
            const testData: Data = { name: 'TestData' };

            httpClient.get<Data>('/foo/bar').subscribe({
                next: data => {
                    expectToEqual(data, testData);
                },
            });

            // Match the request url
            const call = httpTestingController.expectOne({
                url: '/foo/bar',
            });

            // Check for GET request
            expectToBe(call.request.method, 'GET');

            // Respond with mocked data
            call.flush(testData);
        }));
    });

    describe('#getEditionSheetsData()', () => {
        it('... should have a method `getEditionSheetsData`', () => {
            expect(editionDataService.getEditionSheetsData).toBeDefined();
        });

        describe('request', () => {
            it('... should set assetPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectToBe((editionDataService as any)._assetPath, expectedAssetPath);
            }));

            it('... should call #getFolioConvoluteData, #getSvgSheetsData, #getTextcriticsListData', waitForAsync(() => {
                // Set spy on private method
                const getFolioConvoluteDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getFolioConvoluteData'
                ).and.callThrough();
                const getSvgSheetsDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getSvgSheetsData'
                ).and.callThrough();
                const getTextcriticsListDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getTextcriticsListData'
                ).and.callThrough();

                // Call service function
                editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getFolioConvoluteDataSpy, 1);
                expectSpyCall(getSvgSheetsDataSpy, 1);
                expectSpyCall(getTextcriticsListDataSpy, 1);
            }));

            it('... should trigger #getJsonData with correct urls', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getJsonDataSpy, 3);
                expectToBe(getJsonDataSpy.calls.allArgs()[0][0], expectedFolioConvoluteFilePath);
                expectToBe(getJsonDataSpy.calls.allArgs()[1][0], expectedSheetsFilePath);
                expectToBe(getJsonDataSpy.calls.allArgs()[2][0], expectedTextcriticsFilePath);
            }));

            it('... should perform an HTTP GET request to convolute, sheets & textcritics file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                // Expect one request to every file with given settings
                const call = httpTestingController.match(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                );

                expectSpyCall(getJsonDataSpy, 3);

                expectToBe(call.length, 3);
                expectToBe(call[0].request.method, 'GET');
                expectToBe(call[1].request.method, 'GET');
                expectToBe(call[2].request.method, 'GET');

                expectToBe(call[0].request.responseType, 'json');
                expectToBe(call[1].request.responseType, 'json');
                expectToBe(call[2].request.responseType, 'json');

                expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                expectToBe(call[1].request.url, expectedSheetsFilePath);
                expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                // Assert that there are no more pending requests
                httpTestingController.verify();
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it('... should return a forkJoined Observable(FolioConvoluteList, EditionSvgSheetList,  TextcriticsList)', waitForAsync(() => {
                    const fcl = new FolioConvoluteList();
                    fcl.convolutes = [];
                    fcl.convolutes.push(new FolioConvolute());
                    fcl.convolutes[0].convoluteId = 'test-convolute-id';

                    const esl = new EditionSvgSheetList();
                    esl.sheets = { workEditions: [], textEditions: [], sketchEditions: [] };
                    esl.sheets.workEditions.push(new EditionSvgSheet());
                    esl.sheets.textEditions.push(new EditionSvgSheet());
                    esl.sheets.sketchEditions.push(new EditionSvgSheet());
                    esl.sheets.workEditions[0].id = 'test-svg-work-sheets-id';
                    esl.sheets.textEditions[0].id = 'test-svg-text-sheets-id';
                    esl.sheets.sketchEditions[0].id = 'test-svg-sketch-sheets-id';

                    const tcl = new TextcriticsList();
                    tcl.textcritics = [];
                    tcl.textcritics.push(new Textcritics());
                    tcl.textcritics[0].id = 'test-textcritics-id';

                    const expectedResult = [fcl, esl, tcl];

                    // Set spy on private method
                    const getFolioConvoluteDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getFolioConvoluteData'
                    ).and.returnValue(observableOf(fcl));
                    const getSvgSheetsDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSvgSheetsData'
                    ).and.returnValue(observableOf(esl));
                    const getTextcriticsListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getTextcriticsListData'
                    ).and.returnValue(observableOf(tcl));

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: res => {
                            const resFcl = res[0] as FolioConvoluteList;
                            const resEsl = res[1] as EditionSvgSheetList;
                            const resTcl = res[2] as TextcriticsList;

                            expectToBe(res.length as number, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(resFcl, expectedResult[0] as FolioConvoluteList);
                            expectToEqual(resEsl, expectedResult[1] as EditionSvgSheetList);
                            expectToEqual(resTcl, expectedResult[2] as TextcriticsList);

                            expectToBe(resFcl.convolutes[0].convoluteId, 'test-convolute-id');
                            expectToBe(resEsl.sheets.workEditions[0].id, 'test-svg-work-sheets-id');
                            expectToBe(resEsl.sheets.textEditions[0].id, 'test-svg-text-sheets-id');
                            expectToBe(resEsl.sheets.sketchEditions[0].id, 'test-svg-sketch-sheets-id');
                            expectToBe(resTcl.textcritics[0].id, 'test-textcritics-id');
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getFolioConvoluteDataSpy, 1);
                    expectSpyCall(getSvgSheetsDataSpy, 1);
                    expectSpyCall(getTextcriticsListDataSpy, 1);
                }));

                it('... should return an empty forkJoined Observable per default', waitForAsync(() => {
                    const expectedResult = [new FolioConvoluteList(), new EditionSvgSheetList(), new TextcriticsList()];

                    // Set spy on private method
                    const getFolioConvoluteDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getFolioConvoluteData'
                    ).and.returnValue(EMPTY.pipe(defaultIfEmpty(new FolioConvoluteList())));
                    const getSvgSheetsDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSvgSheetsData'
                    ).and.returnValue(EMPTY.pipe(defaultIfEmpty(new EditionSvgSheetList())));
                    const getTextcriticsListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getTextcriticsListData'
                    ).and.returnValue(EMPTY.pipe(defaultIfEmpty(new TextcriticsList())));

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: res => {
                            expectToBe(res.length as number, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], expectedResult[0] as FolioConvoluteList);
                            expectToEqual(res[1], expectedResult[1] as EditionSvgSheetList);
                            expectToEqual(res[2], expectedResult[2] as TextcriticsList);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getFolioConvoluteDataSpy, 1);
                    expectSpyCall(getSvgSheetsDataSpy, 1);
                    expectSpyCall(getTextcriticsListDataSpy, 1);
                }));
            });

            describe('fail', () => {
                it('... should log an error for every failed request', waitForAsync(() => {
                    const expectedResult = [[], [], []];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_FOLIOCONVOLUTELIST' })
                    );
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_EDITIONSVGSHEETLIST' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICSLIST' })
                    );

                    expectSpyCall(consoleSpy, 3);
                    expectToBe(
                        consoleSpy.calls.allArgs()[0][0],
                        `_getJsonData failed: Http failure response for ${call[0].request.url}: 400 ERROR_LOADING_FOLIOCONVOLUTELIST`
                    );
                    expectToBe(
                        consoleSpy.calls.allArgs()[1][0],
                        `_getJsonData failed: Http failure response for ${call[1].request.url}: 400 ERROR_LOADING_EDITIONSVGSHEETLIST`
                    );
                    expectToBe(
                        consoleSpy.calls.allArgs()[2][0],
                        `_getJsonData failed: Http failure response for ${call[2].request.url}: 400 ERROR_LOADING_TEXTCRITICSLIST`
                    );

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], [], []] if all requests failed', waitForAsync(() => {
                    const expectedResult = [[], [], []];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_FOLIOCONVOLUTELIST' })
                    );
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_EDITIONSVGSHEETLIST' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICSLIST' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 3);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [folioConvoluteList, [], []] if all but folioConvoluteList request failed', waitForAsync(() => {
                    const expectedResult = [new FolioConvoluteList(), [], []];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], expectedResult[0]);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(expectedResult[0]);
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_EDITIONSVGSHEETLIST' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICSLIST' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 2);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], editionSvgSheetList, []] if all but editionSvgSheetList request failed', waitForAsync(() => {
                    const expectedResult = [[], new EditionSvgSheetList(), []];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], expectedResult[1]);
                            expectToEqual(res[2], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_FOLIOCONVOLUTELIST' })
                    );
                    call[1].flush(expectedResult[1]);
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICSLIST' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 2);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], [], textcriticsList] if all but textcriticsList request failed', waitForAsync(() => {
                    const expectedResult = [[], [], new TextcriticsList()];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], expectedResult[2]);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_FOLIOCONVOLUTELIST' })
                    );
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_EDITIONSVGSHEETLIST' })
                    );
                    call[2].flush(expectedResult[2]);

                    // Check for console output
                    expectSpyCall(consoleSpy, 2);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [folioConvoluteList, editionSvgSheetList, []] if textcriticsList request failed', waitForAsync(() => {
                    const expectedResult = [new FolioConvoluteList(), new EditionSvgSheetList(), []];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], expectedResult[0]);
                            expectToEqual(res[1], expectedResult[1]);
                            expectToEqual(res[2], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(expectedResult[0]);
                    call[1].flush(expectedResult[1]);
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICSLIST' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 1);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [folioConvoluteList, [], textcriticsList] if middle request failed', waitForAsync(() => {
                    const expectedResult = [new FolioConvoluteList(), [], new TextcriticsList()];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], expectedResult[0]);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], expectedResult[2]);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(expectedResult[0]);
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_EDITIONSVGSHEETLIST' })
                    );
                    call[2].flush(expectedResult[2]);

                    // Check for console output
                    expectSpyCall(consoleSpy, 1);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], editionSvgSheetList, textcriticsList] if folioConvoluteList request failed', waitForAsync(() => {
                    const expectedResult = [[], new EditionSvgSheetList(), new TextcriticsList()];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], expectedResult[1]);
                            expectToEqual(res[2], expectedResult[2]);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedFolioConvoluteFilePath);
                    expectToBe(call[1].request.url, expectedSheetsFilePath);
                    expectToBe(call[2].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_FOLIOCONVOLUTELIST' })
                    );
                    call[1].flush(expectedResult[1]);
                    call[2].flush(expectedResult[2]);

                    // Check for console output
                    expectSpyCall(consoleSpy, 1);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));
            });
        });
    });

    describe('#getEditionReportData()', () => {
        it('... should have a method `getEditionReportData`', () => {
            expect(editionDataService.getEditionReportData).toBeDefined();
        });

        describe('request', () => {
            it('... should set assetPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectToBe((editionDataService as any)._assetPath, expectedAssetPath);
            }));

            it('... should call #getSourceListData, #getSourceDescriptionListData, #getSourceEvaluationListData, #getTextcriticsListData', waitForAsync(() => {
                // Set spy on private method
                const getSourceListDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getSourceListData'
                ).and.callThrough();
                const getSourceDescriptionListDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getSourceDescriptionListData'
                ).and.callThrough();
                const getSourceEvaluationListDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getSourceEvaluationListData'
                ).and.callThrough();
                const getTextcriticsListDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getTextcriticsListData'
                ).and.callThrough();

                // Call service function
                editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getSourceListDataSpy, 1);
                expectSpyCall(getSourceDescriptionListDataSpy, 1);
                expectSpyCall(getSourceEvaluationListDataSpy, 1);
                expectSpyCall(getTextcriticsListDataSpy, 1);
            }));

            it('... should trigger #getJsonData with correct urls', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getJsonDataSpy, 4);
                expectToBe(getJsonDataSpy.calls.allArgs()[0][0], expectedSourceListFilePath);
                expectToBe(getJsonDataSpy.calls.allArgs()[1][0], expectedSourceDescriptionFilePath);
                expectToBe(getJsonDataSpy.calls.allArgs()[2][0], expectedSourceEvaluationFilePath);
                expectToBe(getJsonDataSpy.calls.allArgs()[3][0], expectedTextcriticsFilePath);
            }));

            it('... should perform an HTTP GET request to sourceList, sourceDescription, sourceEvaluation & textcritics file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                // Expect one request to to every file with given settings
                const call = httpTestingController.match(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                );

                expectSpyCall(getJsonDataSpy, 4);

                expectToBe(call.length, 4);
                expectToBe(call[0].request.method, 'GET');
                expectToBe(call[1].request.method, 'GET');
                expectToBe(call[2].request.method, 'GET');
                expectToBe(call[3].request.method, 'GET');

                expectToBe(call[0].request.responseType, 'json');
                expectToBe(call[1].request.responseType, 'json');
                expectToBe(call[2].request.responseType, 'json');
                expectToBe(call[3].request.responseType, 'json');

                expectToBe(call[0].request.url, expectedSourceListFilePath);
                expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                // Assert that there are no more pending requests
                httpTestingController.verify();
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it('... should return a forkJoined Observable(SourceList, SourceDescriptionList, SourceEvaluationList,  TextcriticsList)', waitForAsync(() => {
                    const sl = new SourceList();
                    sl.sources = [];
                    sl.sources.push(new Source());
                    sl.sources[0].siglum = 'test-sources-id';

                    const sdl = new SourceDescriptionList();
                    sdl.sources = [];
                    sdl.sources.push(new SourceDescription());
                    sdl.sources[0].id = 'test-source-description-id';

                    const sel = new SourceEvaluationList();
                    sel.sources = [];
                    sel.sources.push(new SourceEvaluation());
                    sel.sources[0].id = 'test-source-evaluation-id';

                    const tcl = new TextcriticsList();
                    tcl.textcritics = [];
                    tcl.textcritics.push(new Textcritics());
                    tcl.textcritics[0].id = 'test-textcritics-id';

                    const expectedResult = [sl, sdl, sel, tcl];

                    // Set spy on private method
                    const getSourceListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSourceListData'
                    ).and.returnValue(observableOf(sl));
                    const getSourceDescriptionListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSourceDescriptionListData'
                    ).and.returnValue(observableOf(sdl));
                    const getSourceEvaluationListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSourceEvaluationListData'
                    ).and.returnValue(observableOf(sel));
                    const getTextcriticsListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getTextcriticsListData'
                    ).and.returnValue(observableOf(tcl));

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: res => {
                            const resSl = res[0] as SourceList;
                            const resSdl = res[1] as SourceDescriptionList;
                            const resSel = res[2] as SourceEvaluationList;
                            const resTcl = res[3] as TextcriticsList;

                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(resSl, expectedResult[0] as SourceList);
                            expectToEqual(resSdl, expectedResult[1] as SourceDescriptionList);
                            expectToEqual(resSel, expectedResult[2] as SourceEvaluationList);
                            expectToEqual(resTcl, expectedResult[3] as TextcriticsList);

                            expectToBe(resSl.sources[0].siglum, 'test-sources-id');
                            expectToBe(resSdl.sources[0].id, 'test-source-description-id');
                            expectToBe(resSel.sources[0].id, 'test-source-evaluation-id');
                            expectToBe(resTcl.textcritics[0].id, 'test-textcritics-id');
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getSourceListDataSpy, 1);
                    expectSpyCall(getSourceDescriptionListDataSpy, 1);
                    expectSpyCall(getSourceEvaluationListDataSpy, 1);
                    expectSpyCall(getTextcriticsListDataSpy, 1);
                }));

                it('... should return an empty forkJoined Observable per default', waitForAsync(() => {
                    const expectedResult = [
                        new SourceList(),
                        new SourceDescriptionList(),
                        new SourceEvaluationList(),
                        new TextcriticsList(),
                    ];

                    // Set spy on private method
                    const getSourceListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSourceListData'
                    ).and.returnValue(EMPTY.pipe(defaultIfEmpty(new SourceList())));
                    const getSourceDescriptionListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSourceDescriptionListData'
                    ).and.returnValue(EMPTY.pipe(defaultIfEmpty(new SourceDescriptionList())));
                    const getSourceEvaluationListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getSourceEvaluationListData'
                    ).and.returnValue(EMPTY.pipe(defaultIfEmpty(new SourceEvaluationList())));
                    const getTextcriticsListDataSpy: Spy = spyOn(
                        editionDataService as any,
                        '_getTextcriticsListData'
                    ).and.returnValue(EMPTY.pipe(defaultIfEmpty(new TextcriticsList())));

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: res => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getSourceListDataSpy, 1);
                    expectSpyCall(getSourceDescriptionListDataSpy, 1);
                    expectSpyCall(getSourceEvaluationListDataSpy, 1);
                    expectSpyCall(getTextcriticsListDataSpy, 1);
                }));
            });

            describe('fail', () => {
                it('... should log an error for every failed request', waitForAsync(() => {
                    const expectedResult = [[], [], [], []];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                            expectToEqual(res[3], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELIST' }));
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTDESCRIPTION' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTEVALUATION' })
                    );
                    call[3].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICS' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 4);
                    expectToBe(
                        consoleSpy.calls.allArgs()[0][0],
                        `_getJsonData failed: Http failure response for ${call[0].request.url}: 400 ERROR_LOADING_SOURCELIST`
                    );
                    expectToBe(
                        consoleSpy.calls.allArgs()[1][0],
                        `_getJsonData failed: Http failure response for ${call[1].request.url}: 400 ERROR_LOADING_SOURCELISTDESCRIPTION`
                    );
                    expectToBe(
                        consoleSpy.calls.allArgs()[2][0],
                        `_getJsonData failed: Http failure response for ${call[2].request.url}: 400 ERROR_LOADING_SOURCELISTEVALUATION`
                    );
                    expectToBe(
                        consoleSpy.calls.allArgs()[3][0],
                        `_getJsonData failed: Http failure response for ${call[3].request.url}: 400 ERROR_LOADING_TEXTCRITICS`
                    );

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], [], [], []] if all requests failed', waitForAsync(() => {
                    const expectedResult = [[], [], [], []];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                            expectToEqual(res[3], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELIST' }));
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTDESCRIPTION' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTEVALUATION' })
                    );
                    call[3].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICS' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 4);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [sourceList, [], [], []] if all but sourceList request failed', waitForAsync(() => {
                    const expectedResult = [new SourceList(), [], [], []];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], expectedResult[0]);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                            expectToEqual(res[3], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(expectedResult[0]);
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTDESCRIPTION' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTEVALUATION' })
                    );
                    call[3].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICS' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 3);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], sourceDescriptionList, [], []] if all but sourceDescriptionList request failed', waitForAsync(() => {
                    const expectedResult = [[], new SourceDescriptionList(), [], []];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], expectedResult[1]);
                            expectToEqual(res[2], []);
                            expectToEqual(res[3], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELIST' }));
                    call[1].flush(expectedResult[1]);
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTEVALUATION' })
                    );
                    call[3].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICS' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 3);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], [], sourceEvaluationList, []] if all but sourceEvaluationList request failed', waitForAsync(() => {
                    const expectedResult = [[], [], new SourceEvaluationList(), []];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], expectedResult[2]);
                            expectToEqual(res[3], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELIST' }));
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELISTDESCRIPTION' })
                    );
                    call[2].flush(expectedResult[2]);
                    call[3].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICS' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 3);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], [], [], textcritics] if all but textcritics request failed', waitForAsync(() => {
                    const expectedResult = [[], [], [], new TextcriticsList()];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                            expectToEqual(res[3], expectedResult[3]);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELIST' }));
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCEDESCRIPTIONLIST' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCEEVALUATIONLIST' })
                    );
                    call[3].flush(expectedResult[3]);

                    // Check for console output
                    expectSpyCall(consoleSpy, 3);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [sourcelist, SourceDescriptionList, SourceEvaluationList, []] if textcritics request failed', waitForAsync(() => {
                    const expectedResult = [
                        new SourceList(),
                        new SourceDescriptionList(),
                        new SourceEvaluationList(),
                        [],
                    ];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], expectedResult[0]);
                            expectToEqual(res[1], expectedResult[1]);
                            expectToEqual(res[2], expectedResult[2]);
                            expectToEqual(res[3], []);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(expectedResult[0]);
                    call[1].flush(expectedResult[1]);
                    call[2].flush(expectedResult[2]);
                    call[3].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_TEXTCRITICS' })
                    );

                    // Check for console output
                    expectSpyCall(consoleSpy, 1);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [sourceList, [], [], textcritics] if middle requests failed', waitForAsync(() => {
                    const expectedResult = [new SourceList(), [], [], new TextcriticsList()];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], expectedResult[0]);
                            expectToEqual(res[1], []);
                            expectToEqual(res[2], []);
                            expectToEqual(res[3], expectedResult[3]);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(expectedResult[0]);
                    call[1].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCEDESCRIPTIONLIST' })
                    );
                    call[2].flush(
                        null,
                        new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCEEVALUATIONLIST' })
                    );
                    call[3].flush(expectedResult[3]);

                    // Check for console output
                    expectSpyCall(consoleSpy, 2);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], descriptionList, evaluationList, textcritics] if sourcelist request failed', waitForAsync(() => {
                    const expectedResult = [
                        [],
                        new SourceDescriptionList(),
                        new SourceEvaluationList(),
                        new TextcriticsList(),
                    ];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToBe(res.length, expectedResult.length);
                            expectToEqual(res, expectedResult);

                            expectToEqual(res[0], []);
                            expectToEqual(res[1], expectedResult[1]);
                            expectToEqual(res[2], expectedResult[2]);
                            expectToEqual(res[3], expectedResult[3]);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedSourceListFilePath);
                    expectToBe(call[1].request.url, expectedSourceDescriptionFilePath);
                    expectToBe(call[2].request.url, expectedSourceEvaluationFilePath);
                    expectToBe(call[3].request.url, expectedTextcriticsFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_SOURCELIST' }));
                    call[1].flush(expectedResult[1]);
                    call[2].flush(expectedResult[2]);
                    call[3].flush(expectedResult[3]);

                    // Check for console output
                    expectSpyCall(consoleSpy, 1);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));
            });
        });
    });

    describe('#getEditionGraphData()', () => {
        it('... should have a method `getEditionGraphData`', () => {
            expect(editionDataService.getEditionGraphData).toBeDefined();
        });

        describe('request', () => {
            it('... should set assetPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectToBe((editionDataService as any)._assetPath, expectedAssetPath);
            }));

            it('... should call #getGraphData', waitForAsync(() => {
                // Set spy on private method
                const getGraphDataSpy: Spy = spyOn(editionDataService as any, '_getGraphData').and.callThrough();

                // Call service function
                editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getGraphDataSpy, 1);
            }));

            it('... should trigger #getJsonData with correct url', waitForAsync(() => {
                // Set spy on private method
                const getGraphDataSpy: Spy = spyOn(editionDataService as any, '_getGraphData').and.callThrough();
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getGraphDataSpy, 1);
                expectSpyCall(getJsonDataSpy, 1, expectedGraphFilePath);
            }));

            it('... should perform an HTTP GET request to graph file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                // Expect one request to every file with given settings
                const call = httpTestingController.match(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                );

                expectSpyCall(getJsonDataSpy, 1, expectedGraphFilePath);

                expectToBe(call.length, 1);
                expectToBe(call[0].request.method, 'GET');
                expectToBe(call[0].request.responseType, 'json');
                expectToBe(call[0].request.url, expectedGraphFilePath);

                // Assert that there are no more pending requests
                httpTestingController.verify();
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it('... should return an Observable(GraphList)', waitForAsync(() => {
                    const gl = new GraphList();
                    gl.graph = [];
                    gl.graph.push(new Graph());
                    gl.graph[0].id = 'test-graph-id';

                    const expectedResult = gl;

                    // Set spy on private method
                    const getGraphDataSpy: Spy = spyOn(editionDataService as any, '_getGraphData').and.returnValue(
                        observableOf(expectedResult)
                    );

                    // Call service function (success)
                    editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                        next: res => {
                            expectToEqual(res, expectedResult);
                            expectToBe(res.graph[0].id, 'test-graph-id');
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getGraphDataSpy, 1);
                }));

                it('... should return an empty GraphList Observable per default', waitForAsync(() => {
                    const expectedResult = new GraphList();

                    // Set spy on private method
                    const getGraphDataSpy: Spy = spyOn(editionDataService as any, '_getGraphData').and.returnValue(
                        EMPTY.pipe(defaultIfEmpty(expectedResult))
                    );

                    // Call service function (success)
                    editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                        next: res => {
                            expectToEqual(res, expectedResult);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getGraphDataSpy, 1);
                }));
            });

            describe('fail', () => {
                it('... should log an error for every failed request', waitForAsync(() => {
                    const expectedResult = [];

                    // Call service function (success)
                    editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToEqual(res, expectedResult);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedGraphFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_GRAPHLIST' }));

                    // Check for console output
                    expectSpyCall(
                        consoleSpy,
                        1,
                        `_getJsonData failed: Http failure response for ${call[0].request.url}: 400 ERROR_LOADING_GRAPHLIST`
                    );

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [] if request failed', waitForAsync(() => {
                    const expectedResult = [];

                    // Call service function (success)
                    editionDataService.getEditionGraphData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToEqual(res, expectedResult);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedGraphFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_GRAPHLIST' }));

                    // Check for console output
                    expectSpyCall(consoleSpy, 1);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));
            });
        });
    });

    describe('#getEditionIntroData', () => {
        it('... should have a method `getEditionIntroData`', () => {
            expect(editionDataService.getEditionIntroData).toBeDefined();
        });

        describe('request', () => {
            it('... should set assetPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectToBe((editionDataService as any)._assetPath, expectedAssetPath);
            }));

            it('... should call #getIntroData', waitForAsync(() => {
                // Set spy on private method
                const getIntroDataSpy: Spy = spyOn(editionDataService as any, '_getIntroData').and.callThrough();

                // Call service function
                editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getIntroDataSpy, 1);
            }));

            it('... should trigger #getJsonData with correct url', waitForAsync(() => {
                // Set spy on private method
                const getIntroDataSpy: Spy = spyOn(editionDataService as any, '_getIntroData').and.callThrough();
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getIntroDataSpy, 1);
                expectSpyCall(getJsonDataSpy, 1, expectedIntroFilePath);
            }));

            it('... should perform an HTTP GET request to intro file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                // Expect one request to every file with given settings
                const call = httpTestingController.match(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                );

                expectSpyCall(getJsonDataSpy, 1, expectedIntroFilePath);

                expectToBe(call.length, 1);
                expectToBe(call[0].request.method, 'GET');
                expectToBe(call[0].request.responseType, 'json');
                expectToBe(call[0].request.url, expectedIntroFilePath);

                // Assert that there are no more pending requests
                httpTestingController.verify();
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it('... should return an Observable(IntroList)', waitForAsync(() => {
                    const il = new IntroList();
                    il.intro = [];
                    il.intro.push(new Intro());
                    il.intro[0].id = 'test-intro-id';

                    const expectedResult = il;

                    // Set spy on private method
                    const getIntroDataSpy: Spy = spyOn(editionDataService as any, '_getIntroData').and.returnValue(
                        observableOf(expectedResult)
                    );

                    // Call service function (success)
                    editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                        next: res => {
                            expectToEqual(res, expectedResult);
                            expectToBe(res.intro[0].id, 'test-intro-id');
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getIntroDataSpy, 1);
                }));

                it('... should return an empty IntroList Observable per default', waitForAsync(() => {
                    const expectedResult = new IntroList();

                    // Set spy on private method
                    const getIntroDataSpy: Spy = spyOn(editionDataService as any, '_getIntroData').and.returnValue(
                        EMPTY.pipe(defaultIfEmpty(expectedResult))
                    );

                    // Call service function (success)
                    editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                        next: res => {
                            expectToEqual(res, expectedResult);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getIntroDataSpy, 1);
                }));
            });

            describe('fail', () => {
                it('... should log an error for every failed request', waitForAsync(() => {
                    const expectedResult = [];

                    // Call service function (success)
                    editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToEqual(res, expectedResult);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedIntroFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_INTROLIST' }));

                    // Check for console output
                    expectSpyCall(
                        consoleSpy,
                        1,
                        `_getJsonData failed: Http failure response for ${call[0].request.url}: 400 ERROR_LOADING_INTROLIST`
                    );

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [] if request failed', waitForAsync(() => {
                    const expectedResult = [];

                    // Call service function (success)
                    editionDataService.getEditionIntroData(expectedEditionComplex).subscribe({
                        next: (res: any) => {
                            expectToEqual(res, expectedResult);
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    // Expect one request to to every file with given settings
                    const call = httpTestingController.match(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                    );

                    expectToBe(call[0].request.url, expectedIntroFilePath);

                    // Resolve request with mocked error
                    call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_INTROLIST' }));

                    // Check for console output
                    expectSpyCall(consoleSpy, 1);

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));
            });
        });
    });

    describe('#getRowTablesData()', () => {
        it('... should have a method `getRowTablesData`', () => {
            expect(editionDataService.getEditionRowTablesData).toBeDefined();
        });

        describe('request', () => {
            it('... should set assetPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionRowTablesData().subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectToBe((editionDataService as any)._assetPath, expectedAssetPathBaseRoute);
            }));

            it('... should call #_getRowTablesData', waitForAsync(() => {
                // Set spy on private method
                const getRowTablesDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getRowTablesData'
                ).and.callThrough();

                // Call service function
                editionDataService.getEditionRowTablesData().subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getRowTablesDataSpy, 1);
            }));

            it('... should trigger #getJsonData with correct url', waitForAsync(() => {
                // Set spy on private method
                const getRowTablesDataSpy: Spy = spyOn(
                    editionDataService as any,
                    '_getRowTablesData'
                ).and.callThrough();
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionRowTablesData().subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getRowTablesDataSpy, 1);
                expectSpyCall(getJsonDataSpy, 1, expectedRowTablesFilePath);
            }));

            it('... should perform an HTTP GET request to rowTables file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionRowTablesData().subscribe({
                    next: res => {
                        expectToEqual(res, new EditionRowTablesList());
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                // Expect one request to every file with given settings
                regexBase = new RegExp(expectedAssetPathBaseRoute);
                const call = httpTestingController.match(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                );

                expectSpyCall(getJsonDataSpy, 1, expectedRowTablesFilePath);

                expectToBe(call.length, 1);
                expectToBe(call[0].request.method, 'GET');
                expectToBe(call[0].request.responseType, 'json');
                expectToBe(call[0].request.url, expectedRowTablesFilePath);

                // Assert that there are no more pending requests
                httpTestingController.verify();
            }));
        });

        describe('success', () => {
            it('... should return an Observable(EditionRowTablesList)', waitForAsync(() => {
                const rt = expectedRowTablesData;

                const expectedResult = rt;

                // Set spy on private method
                const getRowTablesDataSpy: Spy = spyOn(editionDataService as any, '_getRowTablesData').and.returnValue(
                    observableOf(expectedResult)
                );

                // Call service function (success)
                editionDataService.getEditionRowTablesData().subscribe({
                    next: res => {
                        expectToEqual(res, expectedResult);
                        expectToBe(res.rowTables[0].id, 'SkRT');
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getRowTablesDataSpy, 1);
            }));

            it('... should return an empty EditionRowTablesList Observable per default', waitForAsync(() => {
                const expectedResult = new EditionRowTablesList();

                // Set spy on private method
                const getRowTablesDataSpy: Spy = spyOn(editionDataService as any, '_getRowTablesData').and.returnValue(
                    EMPTY.pipe(defaultIfEmpty(expectedResult))
                );

                // Call service function (success)
                editionDataService.getEditionRowTablesData().subscribe({
                    next: res => {
                        expectToEqual(res, expectedResult);
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getRowTablesDataSpy, 1);
            }));
        });

        describe('fail', () => {
            it('... should log an error for every failed request', waitForAsync(() => {
                const expectedResult = [];

                // Call service function (success)
                editionDataService.getEditionRowTablesData().subscribe({
                    next: (res: any) => {
                        expectToEqual(res, expectedResult);
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                // Expect one request to to every file with given settings
                regexBase = new RegExp(expectedAssetPathBaseRoute);
                const call = httpTestingController.match(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                );

                expectToBe(call[0].request.url, expectedRowTablesFilePath);

                // Resolve request with mocked error
                call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_ROWTABLESLIST' }));

                // Check for console output
                expectSpyCall(
                    consoleSpy,
                    1,
                    `_getJsonData failed: Http failure response for ${call[0].request.url}: 400 ERROR_LOADING_ROWTABLESLIST`
                );

                // Assert that there are no more pending requests
                httpTestingController.verify();
            }));

            it('... should return [] if request failed', waitForAsync(() => {
                const expectedResult = [];

                // Call service function (success)
                editionDataService.getEditionRowTablesData().subscribe({
                    next: (res: any) => {
                        expectToEqual(res, expectedResult);
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                // Expect one request to to every file with given settings
                regexBase = new RegExp(expectedAssetPathBaseRoute);
                const call = httpTestingController.match(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url)
                );

                expectToBe(call[0].request.url, expectedRowTablesFilePath);

                // Resolve request with mocked error
                call[0].flush(null, new HttpErrorResponse({ status: 400, statusText: 'ERROR_LOADING_ROWTABLESLIST' }));

                // Check for console output
                expectSpyCall(consoleSpy, 1);

                // Assert that there are no more pending requests
                httpTestingController.verify();
            }));
        });
    });
});
