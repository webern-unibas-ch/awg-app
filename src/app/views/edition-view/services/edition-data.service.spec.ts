import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Data } from '@angular/router';

import { forkJoin, Observable, of } from 'rxjs';

import {
    Folio,
    EditionSvgSheet,
    SourceList,
    TextcriticsList,
    Source,
    EditionWorks,
    EditionConstants
} from '@awg-views/edition-view/models';

import { EditionDataService } from './edition-data.service';
import { ApiServiceError } from '@awg-core/services/api-service/api-service-error.model';

describe('EditionDataService', () => {
    let editionDataService: EditionDataService;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const BASE = `${EditionConstants.editionAssets.baseRoot}/series1/section5/op12`; // TODO: generate from EditionWorks
    const regexBase = new RegExp(BASE);
    const folioConvoluteFilePath = `${BASE}/${EditionConstants.editionAssets.folioConvoluteFile}`;
    const sheetsFilePath = `${BASE}/${EditionConstants.editionAssets.svgSheetsFile}`;
    const sourcelistFilePath = `${BASE}/${EditionConstants.editionAssets.sourcelistFile}`;
    const textcriticsFilePath = `${BASE}/${EditionConstants.editionAssets.textcriticsFile}`;
    const expectedEditionWork = EditionWorks.op12;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [EditionDataService]
        });
        // inject services and http client handler
        editionDataService = TestBed.get(EditionDataService);
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    // after every test, assert that there are no more pending requests
    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(editionDataService).toBeTruthy();
    });

    describe('httpTestingController', () => {
        it(`... should issue a mocked http get request`, async(() => {
            const testData: Data = { name: 'TestData' };

            httpClient.get<Data>('/foo/bar').subscribe(data => {
                expect(data).toEqual(testData);
            });

            // match the request url
            const call = httpTestingController.expectOne({
                url: '/foo/bar'
            });

            // check for GET request
            expect(call.request.method).toBe('GET');

            // respond with mocked data
            call.flush(testData);
        }));
    });

    describe('#getEditionDetailData', () => {
        describe('request', () => {
            it(`... should perform an HTTP GET request to convolute, sheets & textcritics file`, async(() => {
                // call service function
                editionDataService.getEditionDetailData(expectedEditionWork).subscribe();

                // expect one request to to every file with given settings
                const call = httpTestingController.match((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                });

                expect(call.length).toBe(3);
                expect(call[0].request.method).toBe('GET', 'should be GET');
                expect(call[1].request.method).toBe('GET', 'should be GET');
                expect(call[2].request.method).toBe('GET', 'should be GET');
                expect(call[0].request.responseType).toBe('json', 'should be json');
                expect(call[1].request.responseType).toBe('json', 'should be json');
                expect(call[2].request.responseType).toBe('json', 'should be json');
                expect(call[0].request.url).toBe(folioConvoluteFilePath, `should be ${folioConvoluteFilePath}`);
                expect(call[1].request.url).toBe(sheetsFilePath, `should be ${sheetsFilePath}`);
                expect(call[2].request.url).toBe(textcriticsFilePath, `should be ${textcriticsFilePath}`);
            }));
        });
    });

    describe('#getEditionReportData', () => {
        describe('request', () => {
            it(`... should perform an HTTP GET request to sourcelist & textcritics file`, async(() => {
                // call service function
                editionDataService.getEditionReportData().subscribe();

                // expect one request to to every file with given settings
                const call = httpTestingController.match((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                });

                expect(call.length).toBe(2);
                expect(call[0].request.method).toBe('GET', 'should be GET');
                expect(call[1].request.method).toBe('GET', 'should be GET');
                expect(call[0].request.responseType).toBe('json', 'should be json');
                expect(call[1].request.responseType).toBe('json', 'should be json');
                expect(call[0].request.url).toBe(sourcelistFilePath, `should be ${sourcelistFilePath}`);
                expect(call[1].request.url).toBe(textcriticsFilePath, `should be ${textcriticsFilePath}`);
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it(`... should return a forkJoined Observable<SourceList, TextcriticsList>`, async(() => {
                    const expectedResult = [new SourceList(), new TextcriticsList()];
                    expectedResult[0].sources = [];
                    expectedResult[0].sources[0] = {
                        siglum: 'A',
                        type: 'Autograph',
                        location: 'CH-Bps',
                        linkTo: 'Textlink'
                    };
                    expectedResult[1]['test'] = [];
                    expectedResult[1]['test'][0] = {
                        measure: '1',
                        system: '1',
                        position: '1. Note',
                        comment: 'Fehler'
                    };

                    // call service function (success)
                    editionDataService.getEditionReportData().subscribe(res => {
                        expect(res).toBeTruthy();
                        expect(res.length).toBe(2);
                        expect(res).toEqual(expectedResult);
                    });

                    // expect one request to to every file with given settings
                    const call = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    expect(call.length).toBe(2);
                    expect(call[0].request.method).toBe('GET', 'should be GET');
                    expect(call[1].request.method).toBe('GET', 'should be GET');
                    expect(call[0].request.responseType).toBe('json', 'should be json');
                    expect(call[1].request.responseType).toBe('json', 'should be json');
                    expect(call[0].request.url).toBe(sourcelistFilePath, `should be ${sourcelistFilePath}`);
                    expect(call[1].request.url).toBe(textcriticsFilePath, `should be ${textcriticsFilePath}`);

                    // mock input from HTTP request
                    call[0].flush(expectedResult[0]);
                    call[1].flush(expectedResult[1]);
                }));
            });

            describe('fail', () => {
                it(`... should return [[], []] if sourcelist & textcritics request failed`, async(() => {
                    const expectedResult = [new SourceList(), new TextcriticsList()];

                    // call service function (success)
                    editionDataService.getEditionReportData().subscribe((res: any) => {
                        expect(res.length).toBe(expectedResult.length, `should be ${expectedResult.length}`);
                        expect(res[0]).toEqual([], `should be empty array`);
                        expect(res[1]).toEqual([], `should be empty array`);
                    });

                    // expect one request to to every file with given settings
                    const call = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    call[0].error(null, new HttpErrorResponse({ error: 'ERROR_LOADING_SOURCELIST' }));
                    call[1].error(new ErrorEvent('ERROR_LOADING_TEXTCRITICS'));
                }));

                it(`... should return [sourcelist, []] if textcritics request failed`, async(() => {
                    const expectedResult = [new SourceList(), new TextcriticsList()];

                    // call service function (success)
                    editionDataService.getEditionReportData().subscribe((res: any) => {
                        expect(res.length).toBe(expectedResult.length, `should be ${expectedResult.length}`);
                        expect(res[0]).toBe(expectedResult[0], `should be ${expectedResult[0]}`);
                        expect(res[1]).toEqual([], `should be empty array`);
                    });

                    // expect one request to to every file with given settings
                    const call = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    call[0].flush(expectedResult[0]);
                    call[1].error(null, new HttpErrorResponse({ error: 'ERROR_LOADING_TEXTCRITICS' }));
                }));

                it(`... should return [[], textcritics] if sourcelist request failed`, async(() => {
                    const expectedResult = [new SourceList(), new TextcriticsList()];

                    // call service function (success)
                    editionDataService.getEditionReportData().subscribe((res: any) => {
                        expect(res.length).toBe(expectedResult.length, `should be ${expectedResult.length}`);
                        expect(res[0]).toEqual([], `should be empty array`);
                        expect(res[1]).toBe(expectedResult[1], `should be ${expectedResult[1]}`);
                    });

                    // expect one request to to every file with given settings
                    const call = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    call[1].flush(expectedResult[1]);
                    call[0].error(null, new HttpErrorResponse({ error: 'ERROR_LOADING_SOURCELIST' }));
                }));
            });
        });
    });
});
