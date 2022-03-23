import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { of as observableOf } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRouteStub, UrlSegmentStub } from '@testing/router-stubs';

import { DataApiService } from '@awg-views/data-view/services';
import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { SearchParams } from '@awg-views/data-view/models';

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

    // Stub services for test purposes
    const mocConversionService = {
        convertFullTextSearchResults: () => {
            // Intentional empty test override
        },
    };
    const mockDataApiService = { httpGetUrl: '/testUrl', getSearchData: () => observableOf({}) };
    const mockLoadingService = { getLoadingStatus: () => observableOf(false) };
    const mockDataStreamerService = {
        updateSearchResponseWithQuery: () => {
            // Intentional empty test override
        },
    };

    // Router spy object
    const mockRouter = {
        url: '/test-url',
        events: observableOf(new NavigationEnd(0, 'http://localhost:4200/test-url', 'http://localhost:4200/test-url')),
        navigate: jasmine.createSpy('navigate'),
    };

    let mockActivatedRoute: ActivatedRouteStub;
    let expectedRouteUrl: UrlSegmentStub[] = [];
    const expectedPath = 'fulltext';

    beforeEach(waitForAsync(() => {
        // Mocked activated route
        // See https://gist.github.com/benjamincharity/3d25cd2c95b6ecffadb18c3d4dbbd80b
        expectedRouteUrl = [{ path: expectedPath }];

        mockActivatedRoute = new ActivatedRouteStub();
        mockActivatedRoute.testUrl = expectedRouteUrl;

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
                { provide: ConversionService, useValue: mocConversionService },
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

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change urls', () => {
        expect(mockActivatedRoute.snapshot.url[0].path).toBeTruthy();
        expect(mockActivatedRoute.snapshot.url[0].path)
            .withContext(`should equal ${expectedPath}`)
            .toEqual(expectedPath);

        const changedPath = 'other';
        const changedRouteUrl: UrlSegmentStub[] = [{ path: changedPath }];

        mockActivatedRoute.testUrl = changedRouteUrl;

        expect(mockActivatedRoute.snapshot.url[0].path).toBeTruthy();
        expect(mockActivatedRoute.snapshot.url[0].path).withContext(`should equal ${changedPath}`).toEqual(changedPath);
    });
});
