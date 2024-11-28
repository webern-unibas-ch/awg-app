import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { of as observableOf } from 'rxjs';

import {
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { ActivatedRouteStub, UrlSegmentStub } from '@testing/router-stubs';

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { SearchParams } from '@awg-views/data-view/models';
import { DataApiService } from '@awg-views/data-view/services';

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
    const mockConversionService = {
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
        it('... should not have `errorMessage`', () => {
            expect(component.errorMessage).toBeUndefined();
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
});
