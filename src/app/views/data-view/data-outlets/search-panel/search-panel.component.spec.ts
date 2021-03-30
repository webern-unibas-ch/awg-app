/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';

import { ActivatedRouteStub } from '@testing/router-stubs';

import { DataApiService } from '@awg-views/data-view/services';
import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { SearchParams } from '@awg-views/data-view/models';

import { SearchPanelComponent } from './search-panel.component';

@Component({ selector: 'awg-search-form', template: '' })
class SearchFormStubComponent {
    @Input()
    searchValue: string;
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
    rowChangeRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    viewChangeRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('SearchPanelComponent', () => {
    let component: SearchPanelComponent;
    let fixture: ComponentFixture<SearchPanelComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;

    // stub services for test purposes
    const mocConversionService = { convertFullTextSearchResults: () => {} };
    const mockDataApiService = { httpGetUrl: '/testUrl', getFulltextSearchData: () => observableOf({}) };
    const mockLoadingService = { getLoadingStatus: () => observableOf(false) };
    const mockDataStreamerService = { updateSearchResponseWithQuery: () => {} };

    // router spy object
    mockRouter = {
        url: '/test-url',
        events: observableOf(new NavigationEnd(0, 'http://localhost:4200/test-url', 'http://localhost:4200/test-url')),
        navigate: jasmine.createSpy('navigate')
    };
    // mocked activated route
    mockActivatedRoute = new ActivatedRouteStub();

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [RouterTestingModule],
                declarations: [
                    SearchPanelComponent,
                    SearchFormStubComponent,
                    SearchResultListStubComponent,
                    TwelveToneSpinnerStubComponent
                ],
                providers: [
                    { provide: ActivatedRoute, useValue: mockActivatedRoute },
                    { provide: Router, useValue: mockRouter },
                    { provide: ConversionService, useValue: mocConversionService },
                    { provide: DataApiService, useValue: mockDataApiService },
                    { provide: DataStreamerService, useValue: mockDataStreamerService },
                    { provide: LoadingService, useValue: mockLoadingService }
                ]
            }).compileComponents();
        })
    );

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
