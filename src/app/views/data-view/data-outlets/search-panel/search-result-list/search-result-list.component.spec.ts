import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { expectToBe } from '@testing/expect-helper';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

import { SearchResultListComponent } from './search-result-list.component';

@Component({
    selector: 'awg-table',
    template: '',
    standalone: false,
})
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

    let expectedSearchResultText: string;

    beforeEach(waitForAsync(() => {
        // Mock services
        mockDataStreamerService = {
            getSearchResponseWithQuery: (): Observable<SearchResponseWithQuery> => observableOf(),
        };
        mockConversionService = {
            prepareFullTextSearchResultText: (): string => expectedSearchResultText,
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
            imports: [FontAwesomeTestingModule, NgbPaginationModule, ReactiveFormsModule, RouterModule],
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

        // Test data
        expectedSearchResultText = '';
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected conversion service should use provided mockValue', () => {
        expectToBe(conversionService === mockConversionService, true);
    });

    it('... injected datastreamer service should use provided mockValue', () => {
        expectToBe(dataStreamerService === mockDataStreamerService, true);
    });

    it('... injected sideinfo service should use provided mockValue', () => {
        expectToBe(sideInfoService === mockSideInfoService, true);
    });
});
