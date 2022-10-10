/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';
import { SearchResponseJson } from '@awg-shared/api-objects';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';
import { SearchParams, SearchResponseWithQuery } from '@awg-views/data-view/models';

import { SearchResultListComponent } from './search-result-list.component';

@Component({ selector: 'awg-table', template: '' })
class TableStubComponent {
    @Input() tableTitle: string;
    @Input() headerInputData: any;
    @Input() rowInputData: any;
    @Output() clickedTableValueRequest: EventEmitter<string> = new EventEmitter();
    @Output() clickedTableRowRequest: EventEmitter<string> = new EventEmitter();
}

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
    let formBuilder: UntypedFormBuilder;

    let expectedSearchResponseWithQuery: SearchResponseWithQuery;
    let expectedSearchResultText: string;

    let expectedSearchParams: SearchParams;

    beforeEach(waitForAsync(() => {
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
            declarations: [SearchResultListComponent, CompileHtmlComponent, TableStubComponent],
            providers: [
                { provide: DataStreamerService, useValue: mockDataStreamerService },
                { provide: ConversionService, useValue: mockConversionService },
                { provide: SideInfoService, useValue: mockSideInfoService },
                UntypedFormBuilder,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchResultListComponent);
        component = fixture.componentInstance;

        // Inject services from root
        dataStreamerService = TestBed.inject(DataStreamerService);
        conversionService = TestBed.inject(ConversionService);
        sideInfoService = TestBed.inject(SideInfoService);
        formBuilder = TestBed.inject(UntypedFormBuilder);

        // Test data
        expectedSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), '');
        expectedSearchResultText = '';

        expectedSearchParams = new SearchParams('', '5', '0', ViewHandleTypes.TABLE);

        // Spies on service functions
        getSearchResponseWithQuerySpy = spyOn(dataStreamerService, 'getSearchResponseWithQuery').and.returnValue(
            observableOf(expectedSearchResponseWithQuery)
        );
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected conversion service should use provided mockValue', () => {
        expect(conversionService === mockConversionService).toBeTrue();
    });

    it('injected datastreamer service should use provided mockValue', () => {
        expect(dataStreamerService === mockDataStreamerService).toBeTrue();
    });

    it('injected sideinfo service should use provided mockValue', () => {
        expect(sideInfoService === mockSideInfoService).toBeTrue();
    });
});
