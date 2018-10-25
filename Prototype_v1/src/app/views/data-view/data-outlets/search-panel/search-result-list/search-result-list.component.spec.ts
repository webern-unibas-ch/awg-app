/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { SearchResultListComponent } from './search-result-list.component';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { OrderByPipe } from '@awg-shared/order-by/order-by.pipe';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';

import { SearchResponseWithQuery } from '@awg-views/data-view/models';
import { SearchResponseJson } from '@awg-shared/api-objects';

describe('SearchResultListComponent', () => {
    let component: SearchResultListComponent;
    let fixture: ComponentFixture<SearchResultListComponent>;

    let mockConversionService: Partial<ConversionService>;
    let mockSideInfoService: Partial<SideInfoService>;
    let getCurrentSearchResultsSpy: Observable<SearchResponseWithQuery>;

    let expectedSearchResponseWithQuery: SearchResponseWithQuery;
    let expectedSearchResultText: string;

    beforeEach(async(() => {
        expectedSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), ''); // TODO: provide real test data
        expectedSearchResultText = ''; // TODO: provide real test data

        // create a fake StreamerService object with a `getCurrentSearchResults()` spy
        const mockStreamerService = jasmine.createSpyObj('StreamerService', ['getCurrentSearchResults']);
        // make the spies return a synchronous Observable with the test data
        getCurrentSearchResultsSpy = mockStreamerService.getCurrentSearchResults.and.returnValue(observableOf()); // TODO: provide real test data

        // mock services
        mockConversionService = {
            prepareFullTextSearchResultText: () => expectedSearchResultText
        };
        mockSideInfoService = { updateSearchInfoData: () => {} }; // TODO: provide real test data

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
