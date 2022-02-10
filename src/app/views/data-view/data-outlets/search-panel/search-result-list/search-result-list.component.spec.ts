/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Observable, of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';

import { SearchParams, SearchResultsViewTypes, SearchResponseWithQuery } from '@awg-views/data-view/models';
import { SearchResponseJson } from '@awg-shared/api-objects';

import { SearchResultListComponent } from './search-result-list.component';

describe('SearchResultListComponent', () => {
    let component: SearchResultListComponent;
    let fixture: ComponentFixture<SearchResultListComponent>;

    let mockConversionService: Partial<ConversionService>;
    let mockDataStreamerService: Partial<DataStreamerService>;
    let mockSideInfoService: Partial<SideInfoService>;

    let conversionService: Partial<ConversionService>;
    let dataStreamerService: Partial<DataStreamerService>;
    let sideInfoService: Partial<SideInfoService>;
    let getSearchResponseWithQuerySpy: Spy;
    let formBuilder: FormBuilder;

    let expectedSearchResponseWithQuery: SearchResponseWithQuery;
    let expectedSearchResultText: string;

    let expectedSearchParams: SearchParams;

    beforeEach(
        waitForAsync(() => {
            // Mock services
            mockDataStreamerService = {
                getSearchResponseWithQuery: (): Observable<SearchResponseWithQuery> => observableOf(),
            };
            mockConversionService = {
                prepareFullTextSearchResultText: (
                    searchResponseWithQuery: SearchResponseWithQuery,
                    searchUrl: string
                ): string => expectedSearchResultText,
            };
            mockSideInfoService = {
                updateSearchInfoData: () => {
                    // Intentional empty test override
                },
                clearSearchInfoData: () => {
                    // Intentional empty test override
                },
            };

            TestBed.configureTestingModule({
                imports: [FontAwesomeTestingModule, NgbPaginationModule, ReactiveFormsModule, RouterTestingModule],
                declarations: [SearchResultListComponent, CompileHtmlComponent],
                providers: [
                    { provide: DataStreamerService, useValue: mockDataStreamerService },
                    { provide: ConversionService, useValue: mockConversionService },
                    { provide: SideInfoService, useValue: mockSideInfoService },
                    FormBuilder,
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchResultListComponent);
        component = fixture.componentInstance;

        // Inject services from root
        dataStreamerService = TestBed.inject(DataStreamerService);
        conversionService = TestBed.inject(ConversionService);
        sideInfoService = TestBed.inject(SideInfoService);
        formBuilder = TestBed.inject(FormBuilder);

        // Test data
        expectedSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), '');
        expectedSearchResultText = '';

        expectedSearchParams = new SearchParams();
        expectedSearchParams.view = SearchResultsViewTypes.table;

        // Spies on service functions
        getSearchResponseWithQuerySpy = spyOn(dataStreamerService, 'getSearchResponseWithQuery').and.returnValue(
            observableOf(expectedSearchResponseWithQuery)
        );
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected conversion service should use provided mockValue', () => {
        expect(conversionService === mockConversionService).toBe(true);
    });

    it('injected datastreamer service should use provided mockValue', () => {
        expect(dataStreamerService === mockDataStreamerService).toBe(true);
    });

    it('injected sideinfo service should use provided mockValue', () => {
        expect(sideInfoService === mockSideInfoService).toBe(true);
    });
});
