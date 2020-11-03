import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { mockSearchResponseJson } from '@testing/mock-data';

import { SearchResponseJson } from '@awg-shared/api-objects';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

import { DataStreamerService } from './data-streamer.service';

describe('DataStreamerService (DONE)', () => {
    let dataStreamerService: DataStreamerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataStreamerService]
        });
        // inject service
        dataStreamerService = TestBed.inject(DataStreamerService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(dataStreamerService).toBeTruthy();
    });

    describe('SearchResponseWithQuery', () => {
        describe('#getSearchResponseWithQuery', () => {
            it(`... should return given searchResponse`, done => {
                // init searchResponse
                const expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test');

                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // set searchResponse
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);
            });

            it(`... should return updated searchResponse`, done => {
                // init searchResponse
                let expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test');

                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // set searchResponse
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);

                // update searchResponse
                expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test2');
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);
            });
        });

        describe('#updateSearchResponseWithQuery', () => {
            it(`... should emit updated searchResponse`, done => {
                // init searchResponse
                let expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test');

                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // set searchResponse
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);

                // update searchResponse
                expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test2');
                dataStreamerService.updateSearchResponseWithQuery(expectedSearchResponse);
            });
        });

        describe('#clearSearchResults', () => {
            it(`... should update search results with empty SearchResponseWithQuery`, done => {
                const expectedSearchResponse = new SearchResponseWithQuery(new SearchResponseJson(), '');

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
                dataStreamerService.clearSearchResults();
            });

            it(`... should overwrite existing search results`, done => {
                let expectedSearchResponse = new SearchResponseWithQuery(new SearchResponseJson(), '');

                dataStreamerService
                    .getSearchResponseWithQuery()
                    .subscribe((searchResponseWithQuery: SearchResponseWithQuery) => {
                        expect(searchResponseWithQuery).toEqual(
                            expectedSearchResponse,
                            `should equal ${expectedSearchResponse}`
                        );
                        done();
                    });

                // update searchResponse
                expectedSearchResponse = new SearchResponseWithQuery(mockSearchResponseJson, 'Test');
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
