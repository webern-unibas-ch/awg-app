import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Data } from '@angular/router';

import { EMPTY, of as observableOf } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { EDITION_ROW_TABLES_DATA, EditionWorks } from '@awg-views/edition-view/data';
import {
    EditionConstants,
    EditionRowTables,
    EditionSvgSheet,
    EditionSvgSheetList,
    EditionWork,
    FolioConvoluteList,
    FolioConvolute,
    GraphList,
    Graph,
    IntroList,
    Intro,
    Source,
    SourceList,
    SourceDescription,
    SourceDescriptionList,
    SourceEvaluation,
    SourceEvaluationList,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';

import { EditionDataService } from './edition-data.service';

describe('EditionDataService (DONE)', () => {
    let editionDataService: EditionDataService;

    let consoleSpy: Spy;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let expectedRowTablesData: EditionRowTables[];

    const expectedEditionWork: EditionWork = EditionWorks.OP12;
    const assets = EditionConstants.EDITION_ASSETS;
    const expectedAssetWorkPathBaseRoute = assets.baseRoute;
    const expectedWorkRoute =
        EditionConstants.SERIES.route +
        expectedEditionWork.series.route +
        EditionConstants.SECTION.route +
        expectedEditionWork.section.route +
        expectedEditionWork.work.route;
    const expectedAssetWorkPath = expectedAssetWorkPathBaseRoute + expectedWorkRoute;
    const regexBase = new RegExp(expectedAssetWorkPath);

    const expectedIntroFilePath = `${expectedAssetWorkPath}/${assets.introFile}`;
    const expectedFolioConvoluteFilePath = `${expectedAssetWorkPath}/${assets.folioConvoluteFile}`;
    const expectedSheetsFilePath = `${expectedAssetWorkPath}/${assets.svgSheetsFile}`;
    const expectedSourceListFilePath = `${expectedAssetWorkPath}/${assets.sourceListFile}`;
    const expectedSourceDescriptionFilePath = `${expectedAssetWorkPath}/${assets.sourceDescriptionListFile}`;
    const expectedSourceEvaluationFilePath = `${expectedAssetWorkPath}/${assets.sourceEvaluationListFile}`;
    const expectedTextcriticsFilePath = `${expectedAssetWorkPath}/${assets.textcriticsFile}`;
    const expectedGraphFilePath = `${expectedAssetWorkPath}/${assets.graphFile}`;

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
        expectedRowTablesData = EDITION_ROW_TABLES_DATA;

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

    it('should be created', () => {
        expect(editionDataService).toBeTruthy();
    });

    it('should have empty assetWorkPath', () => {
        expect((editionDataService as any)._assetWorkPath).not.toBeTruthy();
    });

    describe('httpTestingController', () => {
        it('... should issue a mocked http get request', waitForAsync(() => {
            const testData: Data = { name: 'TestData' };

            httpClient.get<Data>('/foo/bar').subscribe({
                next: data => {
                    expect(data).toBeTruthy();
                    expect(data).withContext(`should equal ${testData}`).toEqual(testData);
                },
            });

            // Match the request url
            const call = httpTestingController.expectOne({
                url: '/foo/bar',
            });

            // Check for GET request
            expect(call.request.method).withContext(`should be GET`).toBe('GET');

            // Respond with mocked data
            call.flush(testData);
        }));
    });

    describe('#getEditionSheetsData', () => {
        describe('request', () => {
            it('... should set assetWorkPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expect((editionDataService as any)._assetWorkPath).toBeTruthy();
                expect((editionDataService as any)._assetWorkPath)
                    .withContext(`should be ${expectedAssetWorkPath}`)
                    .toBe(expectedAssetWorkPath);
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
                editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
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
                editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getJsonDataSpy, 3);
                expect(getJsonDataSpy.calls.allArgs()[0][0])
                    .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                    .toBe(expectedFolioConvoluteFilePath);
                expect(getJsonDataSpy.calls.allArgs()[1][0])
                    .withContext(`should be ${expectedSheetsFilePath}`)
                    .toBe(expectedSheetsFilePath);
                expect(getJsonDataSpy.calls.allArgs()[2][0])
                    .withContext(`should be ${expectedTextcriticsFilePath}`)
                    .toBe(expectedTextcriticsFilePath);
            }));

            it('... should perform an HTTP GET request to convolute, sheets & textcritics file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
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

                expect(call.length).toBe(3);
                expect(call[0].request.method).withContext('should be GET').toBe('GET');
                expect(call[1].request.method).withContext('should be GET').toBe('GET');
                expect(call[2].request.method).withContext('should be GET').toBe('GET');

                expect(call[0].request.responseType).withContext('should be json').toBe('json');
                expect(call[1].request.responseType).withContext('should be json').toBe('json');
                expect(call[2].request.responseType).withContext('should be json').toBe('json');

                expect(call[0].request.url)
                    .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                    .toBe(expectedFolioConvoluteFilePath);
                expect(call[1].request.url)
                    .withContext(`should be ${expectedSheetsFilePath}`)
                    .toBe(expectedSheetsFilePath);
                expect(call[2].request.url)
                    .withContext(`should be ${expectedTextcriticsFilePath}`)
                    .toBe(expectedTextcriticsFilePath);

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
                    esl.sheets = [];
                    esl.sheets.push(new EditionSvgSheet());
                    esl.sheets[0].id = 'test-svg-sheets-id';

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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: res => {
                            const resFcl = res[0] as FolioConvoluteList;
                            const resEsl = res[1] as EditionSvgSheetList;
                            const resTcl = res[2] as TextcriticsList;

                            expect(res).toBeTruthy();
                            expect(res.length as number)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(resFcl)
                                .withContext(`should equal ${expectedResult[0]}`)
                                .toEqual(expectedResult[0] as FolioConvoluteList);
                            expect(resEsl)
                                .withContext(`should equal ${expectedResult[1]}`)
                                .toEqual(expectedResult[1] as EditionSvgSheetList);
                            expect(resTcl)
                                .withContext(`should equal ${expectedResult[2]}`)
                                .toEqual(expectedResult[2] as TextcriticsList);

                            expect(resFcl.convolutes[0].convoluteId)
                                .withContext('should be test-convolute-id')
                                .toBe('test-convolute-id');
                            expect(resEsl.sheets[0].id)
                                .withContext('should be test-svg-sheet-id')
                                .toBe('test-svg-sheets-id');
                            expect(resTcl.textcritics[0].id)
                                .withContext('should be test-textcritics-id')
                                .toBe('test-textcritics-id');
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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: res => {
                            expect(res).toBeTruthy();
                            expect(res.length as number)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0])
                                .withContext(`should equal ${expectedResult[0]}`)
                                .toEqual(expectedResult[0] as FolioConvoluteList);
                            expect(res[1])
                                .withContext(`should equal ${expectedResult[1]}`)
                                .toEqual(expectedResult[1] as EditionSvgSheetList);
                            expect(res[2])
                                .withContext(`should equal ${expectedResult[2]}`)
                                .toEqual(expectedResult[2] as TextcriticsList);
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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    expect(consoleSpy.calls.allArgs()[0][0]).toBe(
                        `_getJsonData failed: Http failure response for ${call[0].request.url}: 400 ERROR_LOADING_FOLIOCONVOLUTELIST`
                    );
                    expect(consoleSpy.calls.allArgs()[1][0]).toBe(
                        `_getJsonData failed: Http failure response for ${call[1].request.url}: 400 ERROR_LOADING_EDITIONSVGSHEETLIST`
                    );
                    expect(consoleSpy.calls.allArgs()[2][0]).toBe(
                        `_getJsonData failed: Http failure response for ${call[2].request.url}: 400 ERROR_LOADING_TEXTCRITICSLIST`
                    );

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], [], []] if all requests failed', waitForAsync(() => {
                    const expectedResult = [[], [], []];

                    // Call service function (success)
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext(`should equal ${expectedResult[0]}`).toEqual(expectedResult[0]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext(`should equal ${expectedResult[1]}`).toEqual(expectedResult[1]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext(`should equal ${expectedResult[2]}`).toEqual(expectedResult[2]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext(`should equal ${expectedResult[0]}`).toEqual(expectedResult[0]);
                            expect(res[1]).withContext(`should equal ${expectedResult[1]}`).toEqual(expectedResult[1]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext(`should equal ${expectedResult[0]}`).toEqual(expectedResult[0]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext(`should equal ${expectedResult[2]}`).toEqual(expectedResult[2]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionSheetsData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext(`should equal ${expectedResult[1]}`).toEqual(expectedResult[1]);
                            expect(res[2]).withContext(`should equal ${expectedResult[2]}`).toEqual(expectedResult[2]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedFolioConvoluteFilePath}`)
                        .toBe(expectedFolioConvoluteFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSheetsFilePath}`)
                        .toBe(expectedSheetsFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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

    describe('#getEditionReportData', () => {
        describe('request', () => {
            it('... should set assetWorkPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expect((editionDataService as any)._assetWorkPath).toBeTruthy();
                expect((editionDataService as any)._assetWorkPath)
                    .withContext(`should be ${expectedAssetWorkPath}`)
                    .toBe(expectedAssetWorkPath);
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
                editionDataService.getEditionReportData(expectedEditionWork).subscribe({
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
                editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expectSpyCall(getJsonDataSpy, 4);
                expect(getJsonDataSpy.calls.allArgs()[0][0])
                    .withContext(`should be ${expectedSourceListFilePath}`)
                    .toBe(expectedSourceListFilePath);
                expect(getJsonDataSpy.calls.allArgs()[1][0])
                    .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                    .toBe(expectedSourceDescriptionFilePath);
                expect(getJsonDataSpy.calls.allArgs()[2][0])
                    .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                    .toBe(expectedSourceEvaluationFilePath);
                expect(getJsonDataSpy.calls.allArgs()[3][0])
                    .withContext(`should be ${expectedTextcriticsFilePath}`)
                    .toBe(expectedTextcriticsFilePath);
            }));

            it('... should perform an HTTP GET request to sourceList, sourceDescription, sourceEvaluation & textcritics file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionReportData(expectedEditionWork).subscribe({
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

                expect(call.length).toBe(4);
                expect(call[0].request.method).withContext(`should be GET`).toBe('GET');
                expect(call[1].request.method).withContext(`should be GET`).toBe('GET');
                expect(call[2].request.method).withContext(`should be GET`).toBe('GET');
                expect(call[3].request.method).withContext(`should be GET`).toBe('GET');

                expect(call[0].request.responseType).withContext(`should be json`).toBe('json');
                expect(call[1].request.responseType).withContext(`should be json`).toBe('json');
                expect(call[2].request.responseType).withContext(`should be json`).toBe('json');
                expect(call[3].request.responseType).withContext(`should be json`).toBe('json');

                expect(call[0].request.url)
                    .withContext(`should be ${expectedSourceListFilePath}`)
                    .toBe(expectedSourceListFilePath);
                expect(call[1].request.url)
                    .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                    .toBe(expectedSourceDescriptionFilePath);
                expect(call[2].request.url)
                    .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                    .toBe(expectedSourceEvaluationFilePath);
                expect(call[3].request.url)
                    .withContext(`should be ${expectedTextcriticsFilePath}`)
                    .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: res => {
                            const resSl = res[0] as SourceList;
                            const resSdl = res[1] as SourceDescriptionList;
                            const resSel = res[2] as SourceEvaluationList;
                            const resTcl = res[3] as TextcriticsList;

                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(resSl)
                                .withContext(`should equal ${expectedResult[0]}`)
                                .toEqual(expectedResult[0] as SourceList);
                            expect(resSdl)
                                .withContext(`should equal ${expectedResult[1]}`)
                                .toEqual(expectedResult[1] as SourceDescriptionList);
                            expect(resSel)
                                .withContext(`should equal ${expectedResult[2]}`)
                                .toEqual(expectedResult[2] as SourceEvaluationList);
                            expect(resTcl)
                                .withContext(`should equal ${expectedResult[3]}`)
                                .toEqual(expectedResult[3] as TextcriticsList);

                            expect(resSl.sources[0].siglum)
                                .withContext('should be test-sources-id')
                                .toBe('test-sources-id');
                            expect(resSdl.sources[0].id)
                                .withContext('should be test-source-description-id')
                                .toBe('test-source-description-id');
                            expect(resSel.sources[0].id)
                                .withContext('should be test-source-evaluation-id')
                                .toBe('test-source-evaluation-id');
                            expect(resTcl.textcritics[0].id)
                                .withContext('should be test-textcritics-id')
                                .toBe('test-textcritics-id');
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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: res => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
                            expect(res[3]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    expect(consoleSpy.calls.allArgs()[0][0]).toBe(
                        `_getJsonData failed: Http failure response for ${call[0].request.url}: 400 ERROR_LOADING_SOURCELIST`
                    );
                    expect(consoleSpy.calls.allArgs()[1][0]).toBe(
                        `_getJsonData failed: Http failure response for ${call[1].request.url}: 400 ERROR_LOADING_SOURCELISTDESCRIPTION`
                    );
                    expect(consoleSpy.calls.allArgs()[2][0]).toBe(
                        `_getJsonData failed: Http failure response for ${call[2].request.url}: 400 ERROR_LOADING_SOURCELISTEVALUATION`
                    );
                    expect(consoleSpy.calls.allArgs()[3][0]).toBe(
                        `_getJsonData failed: Http failure response for ${call[3].request.url}: 400 ERROR_LOADING_TEXTCRITICS`
                    );

                    // Assert that there are no more pending requests
                    httpTestingController.verify();
                }));

                it('... should return [[], [], [], []] if all requests failed', waitForAsync(() => {
                    const expectedResult = [[], [], [], []];

                    // Call service function (success)
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
                            expect(res[3]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext(`should equal ${expectedResult[0]}`).toEqual(expectedResult[0]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
                            expect(res[3]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext(`should equal ${expectedResult[1]}`).toEqual(expectedResult[1]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
                            expect(res[3]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext(`should equal ${expectedResult[2]}`).toEqual(expectedResult[2]);
                            expect(res[3]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
                            expect(res[3]).withContext(`should equal ${expectedResult[3]}`).toEqual(expectedResult[3]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext(`should equal ${expectedResult[0]}`).toEqual(expectedResult[0]);
                            expect(res[1]).withContext(`should equal ${expectedResult[1]}`).toEqual(expectedResult[1]);
                            expect(res[2]).withContext(`should equal ${expectedResult[2]}`).toEqual(expectedResult[2]);
                            expect(res[3]).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext(`should equal ${expectedResult[0]}`).toEqual(expectedResult[0]);
                            expect(res[1]).withContext('should equal empty array').toEqual([]);
                            expect(res[2]).withContext('should equal empty array').toEqual([]);
                            expect(res[3]).withContext(`should equal ${expectedResult[3]}`).toEqual(expectedResult[3]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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
                    editionDataService.getEditionReportData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res.length)
                                .withContext(`should be ${expectedResult.length}`)
                                .toBe(expectedResult.length);
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res[0]).withContext('should equal empty array').toEqual([]);
                            expect(res[1]).withContext(`should equal ${expectedResult[1]}`).toEqual(expectedResult[1]);
                            expect(res[2]).withContext(`should equal ${expectedResult[2]}`).toEqual(expectedResult[2]);
                            expect(res[3]).withContext(`should equal ${expectedResult[3]}`).toEqual(expectedResult[3]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedSourceListFilePath}`)
                        .toBe(expectedSourceListFilePath);
                    expect(call[1].request.url)
                        .withContext(`should be ${expectedSourceDescriptionFilePath}`)
                        .toBe(expectedSourceDescriptionFilePath);
                    expect(call[2].request.url)
                        .withContext(`should be ${expectedSourceEvaluationFilePath}`)
                        .toBe(expectedSourceEvaluationFilePath);
                    expect(call[3].request.url)
                        .withContext(`should be ${expectedTextcriticsFilePath}`)
                        .toBe(expectedTextcriticsFilePath);

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

    describe('#getEditionGraphData', () => {
        describe('request', () => {
            it('... should set assetWorkPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expect((editionDataService as any)._assetWorkPath).toBeTruthy();
                expect((editionDataService as any)._assetWorkPath)
                    .withContext(`should be ${expectedAssetWorkPath}`)
                    .toBe(expectedAssetWorkPath);
            }));

            it('... should call #getGraphData', waitForAsync(() => {
                // Set spy on private method
                const getGraphDataSpy: Spy = spyOn(editionDataService as any, '_getGraphData').and.callThrough();

                // Call service function
                editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
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
                editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
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
                editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
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

                expect(call.length).withContext(`should be 1`).toBe(1);
                expect(call[0].request.method).withContext(`should be GET`).toBe('GET');
                expect(call[0].request.responseType).withContext(`should be json`).toBe('json');
                expect(call[0].request.url)
                    .withContext(`should be ${expectedGraphFilePath}`)
                    .toBe(expectedGraphFilePath);

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
                    editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
                        next: res => {
                            expect(res).toBeTruthy();
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res.graph[0].id).withContext('should be test-graph-id').toBe('test-graph-id');
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
                    editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
                        next: res => {
                            expect(res).toBeTruthy();
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
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
                    editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res).toEqual(expectedResult, `should equal ${expectedResult}`);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedGraphFilePath}`)
                        .toBe(expectedGraphFilePath);

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
                    editionDataService.getEditionGraphData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedGraphFilePath}`)
                        .toBe(expectedGraphFilePath);

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
        describe('request', () => {
            it('... should set assetWorkPath', waitForAsync(() => {
                // Call service function
                editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
                    next: res => {
                        expect(res).toBeTruthy();
                    },
                    error: () => {
                        fail('should not call error');
                    },
                });

                expect((editionDataService as any)._assetWorkPath).toBeTruthy();
                expect((editionDataService as any)._assetWorkPath)
                    .withContext(`should be ${expectedAssetWorkPath}`)
                    .toBe(expectedAssetWorkPath);
            }));

            it('... should call #getIntroData', waitForAsync(() => {
                // Set spy on private method
                const getIntroDataSpy: Spy = spyOn(editionDataService as any, '_getIntroData').and.callThrough();

                // Call service function
                editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
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
                editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
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

            it('... should perform an HTTP GET request to graph file', waitForAsync(() => {
                // Set spy on private method
                const getJsonDataSpy: Spy = spyOn(editionDataService as any, '_getJsonData').and.callThrough();

                // Call service function
                editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
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

                expect(call.length).withContext(`should be 1`).toBe(1);
                expect(call[0].request.method).withContext(`should be GET`).toBe('GET');
                expect(call[0].request.responseType).withContext(`should be json`).toBe('json');
                expect(call[0].request.url)
                    .withContext(`should be ${expectedIntroFilePath}`)
                    .toBe(expectedIntroFilePath);

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
                    editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
                        next: res => {
                            expect(res).toBeTruthy();
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);

                            expect(res.intro[0].id).withContext('should be test-intro-id').toBe('test-intro-id');
                        },
                        error: () => {
                            fail('should not call error');
                        },
                    });

                    expectSpyCall(getIntroDataSpy, 1);
                }));

                it('... should return an empty GraphList Observable per default', waitForAsync(() => {
                    const expectedResult = new IntroList();

                    // Set spy on private method
                    const getIntroDataSpy: Spy = spyOn(editionDataService as any, '_getIntroData').and.returnValue(
                        EMPTY.pipe(defaultIfEmpty(expectedResult))
                    );

                    // Call service function (success)
                    editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
                        next: res => {
                            expect(res).toBeTruthy();
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
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
                    editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res).withContext(`should equal ${expectedResult}`).toEqual(expectedResult);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedIntroFilePath}`)
                        .toBe(expectedIntroFilePath);

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
                    editionDataService.getEditionIntroData(expectedEditionWork).subscribe({
                        next: (res: any) => {
                            expect(res).toBeTruthy();
                            expect(res).withContext('should equal empty array').toEqual([]);
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

                    expect(call[0].request.url)
                        .withContext(`should be ${expectedIntroFilePath}`)
                        .toBe(expectedIntroFilePath);

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

    describe('#getRowTables', () => {
        it('... should return EDITION_ROW_TABLES_DATA', () => {
            // Call service function
            expect(editionDataService.getRowTables())
                .withContext(`should be ${expectedRowTablesData}`)
                .toBe(expectedRowTablesData);
        });
    });
});
