/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of as observableOf } from 'rxjs';

import { SearchResultListComponent } from './search-result-list.component';
import { SharedModule } from '@awg-shared/shared.module';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';

import { SearchResponseWithQuery } from '@awg-views/data-view/models';
import { SearchResponseJson } from '@awg-shared/api-objects';

describe('SearchResultListComponent', () => {
    let component: SearchResultListComponent;
    let fixture: ComponentFixture<SearchResultListComponent>;
    let conversionServiceStub: Partial<ConversionService>;
    let getCurrentSearchResultsSpy: Observable<SearchResponseWithQuery>;
    let expectedSearchResponseWithQuery: SearchResponseWithQuery;
    let expectedSearchResultText: string;

    beforeEach(async(() => {
        expectedSearchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), ''); // TODO: provide real test data
        expectedSearchResultText = ''; // TODO: provide real test data

        // create a fake StreamerService object with a `getCurrentSearchResults()` spy
        const streamerService = jasmine.createSpyObj('StreamerService', ['getCurrentSearchResults']);
        // make the spies return a synchronous Observable with the test data
        getCurrentSearchResultsSpy = streamerService.getCurrentSearchResults.and.returnValue(
            observableOf(expectedSearchResponseWithQuery)
        );

        // stub conversionService to return searchResultText
        conversionServiceStub = {
            prepareFullTextSearchResultText: () => expectedSearchResultText
        };

        TestBed.configureTestingModule({
            imports: [SharedModule, RouterTestingModule],
            declarations: [SearchResultListComponent],
            providers: [
                { provide: DataStreamerService, useValue: streamerService },
                { provide: ConversionService, useValue: conversionServiceStub },
                SideInfoService
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
