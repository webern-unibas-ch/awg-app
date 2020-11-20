import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { mockSearchResponseJson } from '@testing/mock-data';

import { SearchResponseJson } from '@awg-shared/api-objects';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

import { DataStreamerService } from './data-streamer.service';

describe('DataStreamerService (DONE)', () => {
    let dataStreamerService: DataStreamerService;

    let expectedSearchResponse: SearchResponseWithQuery;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataStreamerService]
        });
        // inject service
        dataStreamerService = TestBed.inject(DataStreamerService);

        // test data (default)
        expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test');
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(dataStreamerService).toBeTruthy();
    });

    it('should have bufferSize = 1', () => {
        expect((dataStreamerService as any).bufferSize).toBeTruthy();
        expect((dataStreamerService as any).bufferSize).toBe(1, 'should be 1');
    });

    it('should have searchResponseWithQuerySubject', () => {
        expect((dataStreamerService as any).searchResponseWithQuerySubject).toBeTruthy();
    });

    it('should have searchResponseWithQueryStream$', () => {
        expect((dataStreamerService as any).searchResponseWithQueryStream$).toBeTruthy();
    });

    it('should have resourceIdSubject', () => {
        expect((dataStreamerService as any).resourceIdSubject).toBeTruthy();
    });

    it('should have resourceIdStream$', () => {
        expect((dataStreamerService as any).resourceIdStream$).toBeTruthy();
    });

    describe('SearchResponseWithQuery', () => {
        describe('#getSearchResponseWithQuery', () => {
            it(`... should return given searchResponse`, done => {
                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // set searchResponse (with default value)
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);
            });

            it(`... should return updated searchResponse`, done => {
                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // set searchResponse (with default value)
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);

                // update searchResponse
                expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test2');
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);
            });
        });

        describe('#updateSearchResponseWithQuery', () => {
            it(`... should emit updated searchResponse`, done => {
                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // set searchResponse (with default value)
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);

                // update searchResponse
                expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test2');
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);
            });
        });

        describe('#clearSearchResults', () => {
            it(`... should update search results with empty SearchResponseWithQuery`, done => {
                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            'should be empty SearchResponseWithQuery object'
                        );
                        done();
                    });

                // clear searchResponse
                expectedSearchResponse = new SearchResponseWithQuery(new SearchResponseJson(), '');
                dataStreamerService.clearSearchResults();
            });

            it(`... should overwrite existing search results`, done => {
                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // set searchResponse with default (value)
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);

                // clear searchResponse
                expectedSearchResponse = new SearchResponseWithQuery(new SearchResponseJson(), '');
                dataStreamerService.clearSearchResults();
            });
        });
    });

    describe('ResourceId', () => {
        describe('#getResourceId', () => {
            it(`... should return given id`, done => {
                // init resource id
                const expectedResourceId = 'Test';

                dataStreamerService.getResourceId().subscribe((id: string) => {
                    expect(id).toBe(expectedResourceId, `should be ${expectedResourceId}`);
                    done();
                });

                // set resource id
                dataStreamerService.updateResourceId(expectedResourceId);
            });

            it(`... should return updated id`, done => {
                // init resource id
                let expectedResourceId = 'Test';

                dataStreamerService.getResourceId().subscribe((id: string) => {
                    expect(id).toBe(expectedResourceId, `should be ${expectedResourceId}`);
                    done();
                });

                // set resource id
                dataStreamerService.updateResourceId(expectedResourceId);

                // update resource id
                expectedResourceId = 'Test2';
                dataStreamerService.updateResourceId(expectedResourceId);
            });
        });

        describe('#updateResourceId', () => {
            it(`... should emit updated id`, done => {
                // init resource id
                let expectedResourceId = 'Test';

                dataStreamerService.getResourceId().subscribe((id: string) => {
                    expect(id).toBe(expectedResourceId, `should be ${expectedResourceId}`);
                    done();
                });

                // set resource id
                dataStreamerService.updateResourceId(expectedResourceId);

                // update resource id
                expectedResourceId = 'Test2';
                dataStreamerService.updateResourceId(expectedResourceId);
            });
        });

        describe('#clearResourceId', () => {
            it(`... should update resource id with empty string`, done => {
                // init resource id
                dataStreamerService.getResourceId().subscribe((id: string) => {
                    expect(id).not.toBeTruthy('should be empty string');
                    done();
                });

                dataStreamerService.clearResourceId();
            });

            it(`... should overwrite existing resource id`, done => {
                // init resource id
                let expectedResourceId = 'Test';

                dataStreamerService.getResourceId().subscribe((id: string) => {
                    expect(id).toBe(expectedResourceId, `should be ${expectedResourceId}`);
                    done();
                });

                // set resource id
                dataStreamerService.updateResourceId(expectedResourceId);

                // clear resource id
                expectedResourceId = '';
                dataStreamerService.clearResourceId();
            });
        });
    });
});
