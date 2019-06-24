/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { OrderByPipe } from '@awg-shared/order-by/order-by.pipe';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';

import { SearchParams, SearchResponseWithQuery } from '@awg-views/data-view/models';
import { SearchResponseJson } from '@awg-shared/api-objects';

import { SearchResultListComponent } from './search-result-list.component';

describe('SearchResultListComponent', () => {
    let component: SearchResultListComponent;
    let fixture: ComponentFixture<SearchResultListComponent>;

    let mockConversionService: Partial<ConversionService>;
    let mockSideInfoService: Partial<SideInfoService>;
    let getSearchResponseWithQuerySpy: Observable<SearchResponseWithQuery>;

    let expectedSearchResponseWithQuery: SearchResponseWithQuery;
    let expectedSearchResultText: string;

    let expectedSearchParams: SearchParams;

    beforeEach(async(() => {
        expectedSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), ''); // TODO: provide real test data
        expectedSearchResultText = ''; // TODO: provide real test data

        // create a fake StreamerService object with a `getSearchResponseWithQuery()` spy
        const mockStreamerService = jasmine.createSpyObj('StreamerService', ['getSearchResponseWithQuery']);
        // make the spies return a synchronous Observable with the test data
        getSearchResponseWithQuerySpy = mockStreamerService.getSearchResponseWithQuery.and.returnValue(observableOf()); // TODO: provide real test data

        // mock services
        mockConversionService = {
            prepareFullTextSearchResultText: () => expectedSearchResultText
        };
        mockSideInfoService = { updateSearchInfoData: () => {} }; // TODO: provide real test data

        TestBed.configureTestingModule({
            imports: [FontAwesomeModule, NgbPaginationModule, ReactiveFormsModule, RouterTestingModule],
            declarations: [SearchResultListComponent, CompileHtmlComponent, OrderByPipe],
            providers: [
                { provide: DataStreamerService, useValue: mockStreamerService },
                { provide: ConversionService, useValue: mockConversionService },
                { provide: SideInfoService, useValue: mockSideInfoService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchResultListComponent);
        component = fixture.componentInstance;

        expectedSearchParams = new SearchParams();
        expectedSearchParams.view = 'table';

        component.searchParams = expectedSearchParams;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
