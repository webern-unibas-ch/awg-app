import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import Spy = jasmine.Spy;

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { of as observableOf } from 'rxjs';

import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { ActivatedRouteStub, UrlSegmentStub } from '@testing/router-stubs';

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { ExtendedSearchParams, SearchParams, SearchQuery, SearchResponseWithQuery } from '@awg-views/data-view/models';
import { DataApiService } from '@awg-views/data-view/services';

import { SearchResponseJson } from '@awg-app/shared/api-objects';
import { ViewHandleTypes } from '@awg-app/shared/view-handle-button-group/view-handle.model';
import { SearchPanelComponent } from './search-panel.component';

@Component({ selector: 'awg-fulltext-search-form', template: '' })
class FulltextSearchFormStubComponent {
    @Input()
    searchValue: string;
    @Output()
    searchRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-extended-search-form', template: '' })
class ExtendedSearchFormStubComponent {
    @Output()
    searchRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-search-result-list', template: '' })
class SearchResultListStubComponent {
    @Input()
    searchParams: SearchParams;
    @Input()
    searchUrl: string;
    @Output()
    pageChangeRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    rowNumberChangeRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    viewChangeRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('SearchPanelComponent', () => {
    let component: SearchPanelComponent;
    let fixture: ComponentFixture<SearchPanelComponent>;
    let compDe: DebugElement;

    let dataStreamerServiceUpdateSearchResponseWithQuerySpy: Spy;

    let mockActivatedRoute: ActivatedRouteStub;
    let mockRouter: Partial<Router>;
    let mockConversionService: Partial<ConversionService>;
    let mockDataApiService: Partial<DataApiService>;
    let mockDataStreamerService: Partial<DataStreamerService>;
    let mockLoadingService: Partial<LoadingService>;

    let expectedRouteUrl: UrlSegmentStub[] = [];
    const expectedPath = 'fulltext';

    let expectedSearchTabs: { fulltext: { id: string; title: string }; extended: { id: string; title: string } };

    beforeEach(waitForAsync(() => {
        // Mocked activated route
        // See https://gist.github.com/benjamincharity/3d25cd2c95b6ecffadb18c3d4dbbd80b
        expectedRouteUrl = [{ path: expectedPath }];

        mockActivatedRoute = new ActivatedRouteStub();
        mockActivatedRoute.testUrl = expectedRouteUrl;

        // Mock router
        mockRouter = {
            url: '/test-url',
            events: observableOf(
                new NavigationEnd(0, 'http://localhost:4200/test-url', 'http://localhost:4200/test-url')
            ),
            navigate: jasmine.createSpy('navigate'),
        };

        // Mock services
        mockConversionService = {
            convertFullTextSearchResults: (searchResults: SearchResponseJson) => searchResults,
        };
        mockDataApiService = { httpGetUrl: '/testUrl', getSearchData: () => observableOf(new SearchResponseJson()) };
        mockLoadingService = { getLoadingStatus: () => observableOf(false) };
        mockDataStreamerService = {
            updateSearchResponseWithQuery: () => {
                // Intentional empty test override
            },
        };

        TestBed.configureTestingModule({
            imports: [NgbNavModule],
            declarations: [
                SearchPanelComponent,
                FulltextSearchFormStubComponent,
                ExtendedSearchFormStubComponent,
                SearchResultListStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Router, useValue: mockRouter },
                { provide: ConversionService, useValue: mockConversionService },
                { provide: DataApiService, useValue: mockDataApiService },
                { provide: DataStreamerService, useValue: mockDataStreamerService },
                { provide: LoadingService, useValue: mockLoadingService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchPanelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSearchTabs = {
            fulltext: { id: 'fulltext', title: 'Volltext-Suche' },
            extended: { id: 'extended', title: 'Erweiterte Suche' },
        };

        // Spies
        dataStreamerServiceUpdateSearchResponseWithQuerySpy = spyOn(
            mockDataStreamerService,
            'updateSearchResponseWithQuery'
        ).and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... should change urls', () => {
        expectToEqual(mockActivatedRoute.snapshot.url[0].path, expectedPath);

        const changedPath = 'other';
        const changedRouteUrl: UrlSegmentStub[] = [{ path: changedPath }];

        mockActivatedRoute.testUrl = changedRouteUrl;

        expectToEqual(mockActivatedRoute.snapshot.url[0].path, changedPath);
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `currentQueryParams`', () => {
            expect(component.currentQueryParams).toBeUndefined();
        });

        it('... should not have `errorMessage`', () => {
            expect(component.errorMessage).toBeUndefined();
        });

        it('... should not have `selectedSearchTabId`', () => {
            expect(component.selectedSearchTabId).toBeUndefined();
        });

        it('... should not have `searchParams`', () => {
            expect(component.searchParams).toBeUndefined();
        });

        it('... should not have `searchResponseWithQuery`', () => {
            expect(component.searchResponseWithQuery).toBeUndefined();
        });

        it('... should have `searchTabs`', () => {
            expectToEqual(component.searchTabs, expectedSearchTabs);
        });

        it('... should have `viewChanged === false`', () => {
            expectToBe(component.viewChanged, false);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-search-tabs`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-search-tabs', 1, 1);
            });

            it('... should not display TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no `div.awg-error-message`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-error-message', 0, 0);
            });

            it('... should not display SearchResultListComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SearchResultListStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#getSearchQueryType()', () => {
            it('... should have a method `getSearchQueryType`', () => {
                expect(component.getSearchQueryType).toBeDefined();
            });

            it('... should return a string when the input is a string', () => {
                const query: SearchQuery = 'test query';

                const result = component.getSearchQueryType(query);

                expect(typeof result).toBe('string');
                expectToBe(result, 'test query');
            });

            it('... should return an ExtendedSearchParams object when the input is an object', () => {
                const query: SearchQuery = {
                    filterByRestype: 'test-restype',
                    propertyId: ['test-id'],
                    compop: ['test-op'],
                    searchval: ['test-val'],
                };

                const result = component.getSearchQueryType(query);

                expect(typeof result).toBe('object');
                expectToBe((result as ExtendedSearchParams).filterByRestype, 'test-restype');
                expectToEqual((result as ExtendedSearchParams).propertyId, ['test-id']);
                expectToEqual((result as ExtendedSearchParams).compop, ['test-op']);
                expectToEqual((result as ExtendedSearchParams).searchval, ['test-val']);
                expectToEqual(result, query);
            });

            it('... should return null when the input is neither a string nor an object', () => {
                const query: SearchQuery = 123 as unknown as SearchQuery;

                const result = component.getSearchQueryType(query);

                expectToBe(result, null);
            });
        });

        describe('#getSearchQueryAsString()', () => {
            it('... should have a method `getSearchQueryAsString`', () => {
                expect(component.getSearchQueryAsString).toBeDefined();
            });

            it('... should return a string when the input is a string', () => {
                const query: SearchQuery = 'test query';

                const result = component.getSearchQueryAsString(query);

                expect(typeof result).toBe('string');
                expectToBe(result, 'test query');
            });

            describe('... should return an empty string when', () => {
                it('... the input is an object', () => {
                    const query: SearchQuery = {
                        filterByRestype: 'test-restype',
                        propertyId: ['test-id'],
                        compop: ['test-op'],
                        searchval: ['test-val'],
                    };

                    const result = component.getSearchQueryAsString(query);

                    expectToBe(result, '');
                });

                it('... the input is something else', () => {
                    const query: SearchQuery = 123 as unknown as SearchQuery;

                    const result = component.getSearchQueryAsString(query);

                    expectToBe(result, '');
                });
            });
        });

        describe('#resetSearchParams()', () => {
            it('... should have a method `resetSearchParams`', () => {
                expect(component.resetSearchParams).toBeDefined();
            });

            it('... should reset searchParams for undefined tab', () => {
                const undefinedTabId = undefined;
                const expectedSearchParams = new SearchParams('', '25', '0', ViewHandleTypes.TABLE);

                component.resetSearchParams(undefinedTabId);

                expect(component.searchParams).toEqual(expectedSearchParams);
            });

            it('... should reset searchParams for fulltext tab', () => {
                const fulltextTabId = component.searchTabs.fulltext.id;
                const expectedSearchParams = new SearchParams('', '25', '0', ViewHandleTypes.TABLE);

                component.resetSearchParams(fulltextTabId);

                expectToEqual(component.searchParams, expectedSearchParams);
            });

            it('... should reset searchParams for extended tab', () => {
                const extendedTabId = component.searchTabs.extended.id;
                const expectedExtendedSearchParams = new ExtendedSearchParams();
                expectedExtendedSearchParams.filterByRestype = '';
                expectedExtendedSearchParams.propertyId = [];
                expectedExtendedSearchParams.compop = [];
                expectedExtendedSearchParams.searchval = [];

                const expectedSearchParams = new SearchParams(
                    expectedExtendedSearchParams,
                    '25',
                    '0',
                    ViewHandleTypes.TABLE
                );

                component.resetSearchParams(extendedTabId);

                expect(component.searchParams).toEqual(expectedSearchParams);
            });
        });

        describe('#resetSearchResponse()', () => {
            it('... should have a method `resetSearchResponse`', () => {
                expect(component.resetSearchResponse).toBeDefined();
            });

            it('... should reset the searchResponseWithQuery', () => {
                const previousSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), 'test');
                const resetSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), '');

                component.searchResponseWithQuery = previousSearchResponseWithQuery;

                component.resetSearchResponse();

                expectToEqual(component.searchResponseWithQuery, resetSearchResponseWithQuery);
            });

            it('... should update the dataStreamerService with the reset searchResponseWithQuery', () => {
                const resetSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), '');

                component.resetSearchResponse();

                expectSpyCall(dataStreamerServiceUpdateSearchResponseWithQuerySpy, 1, resetSearchResponseWithQuery);
            });
        });
    });
});
