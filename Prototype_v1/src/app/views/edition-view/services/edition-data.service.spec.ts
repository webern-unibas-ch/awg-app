import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Data } from '@angular/router';

import { forkJoin, Observable, of } from 'rxjs';

import { ConvoluteFolio, EditionSvgFile, SourceList, TextcriticsList } from '@awg-views/edition-view/models';

import { EditionDataService } from './edition-data.service';
import { ApiServiceError } from '@awg-core/services/api-service/api-service-error.model';

describe('EditionDataService', () => {
    let editionDataService: EditionDataService;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const BASE = 'assets/data';
    const regexBase = new RegExp(BASE);
    const convoluteFilePath = `${BASE}/convolute.json`;
    const sheetsFilePath = `${BASE}/sheets.json`;
    const sourcelistFilePath = `${BASE}/sourcelist.json`;
    const textcriticsFilePath = `${BASE}/textcritics.json`;

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
            const r = httpTestingController.expectOne({
                url: '/foo/bar'
            });

            // check for GET request
            expect(r.request.method).toEqual('GET');

            // respond with mocked data
            r.flush(testData);
        }));
    });

    describe('#getEditionDetailData', () => {
        describe('request', () => {
            it(`... should perform an HTTP GET request to convolute, sheets & textcritics file`, async(() => {
                // call service function
                editionDataService.getEditionDetailData().subscribe();

                // expect one request to to every file with given settings
                const r = httpTestingController.match((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                });

                expect(r.length).toEqual(3);
                expect(r[0].request.url).toEqual(convoluteFilePath, `should be ${convoluteFilePath}`);
                expect(r[1].request.url).toEqual(sheetsFilePath, `should be ${sheetsFilePath}`);
                expect(r[2].request.url).toEqual(textcriticsFilePath, `should be ${textcriticsFilePath}`);
            }));
        });
    });

    describe('#getEditionReportData', () => {
        describe('request', () => {
            it(`... should perform an HTTP GET request to sourcelist & textcritics file`, async(() => {
                // call service function
                editionDataService.getEditionReportData().subscribe();

                // expect one request to to every file with given settings
                const r = httpTestingController.match((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                });

                expect(r.length).toEqual(2);
                expect(r[0].request.url).toEqual(sourcelistFilePath, `should be ${sourcelistFilePath}`);
                expect(r[1].request.url).toEqual(textcriticsFilePath, `should be ${textcriticsFilePath}`);
            }));
        });

        describe('response', () => {
            describe('success', () => {
                xit(`... should return a forkJoined Observable<SourceList, TextcriticsList>`, async(() => {
                    const expectedResult = [new SourceList(), new TextcriticsList()];

                    console.log('expectedResult', expectedResult);

                    // call service function (success)
                    editionDataService.getEditionReportData().subscribe(res => {
                        expect(res).toBeTruthy();

                        console.log('res', res, res[0], res[1]);
                        expect(res).toEqual(expectedResult);

                        // expect(res[0]).toEqual(expectedResult[0]);
                        // expect(res[1]).toEqual(expectedResult[1]);
                    });

                    // expect one request to to every file with given settings
                    const r = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    // mock input from HTTP request
                    r[0].flush(of(expectedResult[0]));
                    r[1].flush(of(expectedResult[1]));
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
                    const r = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    r[0].error(null, new HttpErrorResponse({ error: 'ERROR_LOADING_SOURCELIST' }));
                    r[1].error(new ErrorEvent('ERROR_LOADING_TEXTCRITICS'));
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
                    const r = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    r[0].flush(expectedResult[0]);
                    r[1].error(null, new HttpErrorResponse({ error: 'ERROR_LOADING_TEXTCRITICS' }));
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
                    const r = httpTestingController.match((req: HttpRequest<any>) => {
                        return req.method === 'GET' && req.responseType === 'json' && regexBase.test(req.url);
                    });

                    r[1].flush(expectedResult[1]);
                    r[0].error(null, new HttpErrorResponse({ error: 'ERROR_LOADING_SOURCELIST' }));
                }));
            });
        });
    });
});
