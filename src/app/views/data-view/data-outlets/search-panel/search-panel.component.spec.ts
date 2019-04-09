/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SearchPanelComponent } from './search-panel.component';
import { DataApiService } from '@awg-views/data-view/services';
import { ConversionService, DataStreamerService } from '@awg-core/services';
import { SearchParams } from '@awg-views/data-view/models';

@Component({ selector: 'awg-search-form', template: '' })
class SearchFormStubComponent {
    @Input()
    searchValue: string;

    // TODO: handle outputs
}

@Component({ selector: 'awg-search-result-list', template: '' })
class SearchResultListStubComponent {
    @Input()
    searchParams: SearchParams;
    @Input()
    searchUrl: string;
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('SearchPanelComponent', () => {
    let component: SearchPanelComponent;
    let fixture: ComponentFixture<SearchPanelComponent>;
    let compDe: DebugElement;
    let compEl: any;

    // stub services for test purposes
    const mocConversionService = { convertFullTextSearchResults: () => {} };
    const mockdataApiService = { httpGetUrl: '/testUrl', getFulltextSearchData: () => {} };
    const mockStreamerService = { updateSearchResponseStream: () => {} };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [
                SearchPanelComponent,
                SearchFormStubComponent,
                SearchResultListStubComponent,
                TwelveToneSpinnerStubComponent
            ],
            providers: [
                { provide: ConversionService, useValue: mocConversionService },
                { provide: DataApiService, useValue: mockdataApiService },
                { provide: DataStreamerService, useValue: mockStreamerService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchPanelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
