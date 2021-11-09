/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import {
    EditionWork,
    EditionWorks,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionReportComponent } from './edition-report.component';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

// Mock components
@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

@Component({ selector: 'awg-sources', template: '' })
class SourcesStubComponent {
    @Input()
    sourceListData: SourceList;
    @Input()
    sourceDescriptionListData: SourceDescriptionList;
    @Input()
    sourceEvaluationListData: SourceEvaluationList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<any> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-textcritics', template: '' })
class TextcritisStubComponent {
    @Input()
    textcriticsData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionService: Partial<EditionService>;
    let editionDataService: Partial<EditionDataService>;
    let editionService: Partial<EditionService>;

    let getEditionReportDataSpy: Spy;
    let getEditionWorkSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            // Mock services
            mockEditionDataService = {
                getEditionReportData: (
                    editionWork: EditionWork
                ): Observable<[SourceList, SourceDescriptionList, SourceEvaluationList, TextcriticsList]> =>
                    observableOf(),
            };
            mockEditionService = {
                getEditionWork: (): Observable<EditionWork> => observableOf(),
            };

            TestBed.configureTestingModule({
                imports: [NgbModalModule, RouterTestingModule],
                declarations: [
                    CompileHtmlComponent,
                    EditionReportComponent,
                    HeadingStubComponent,
                    SourcesStubComponent,
                    TextcritisStubComponent,
                    ModalComponent,
                ],
                providers: [
                    { provide: EditionDataService, useValue: mockEditionDataService },
                    { provide: EditionService, useValue: mockEditionService },
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;

        // Inject services from root
        editionDataService = TestBed.inject(EditionDataService);
        editionService = TestBed.inject(EditionService);

        // Spies on service functions
        getEditionReportDataSpy = spyOn(editionDataService, 'getEditionReportData').and.returnValue(observableOf());
        getEditionWorkSpy = spyOn(editionService, 'getEditionWork').and.returnValue(observableOf(EditionWorks.OP12));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have called `getEditionWork()`', () => {
            // `getEditionReportData()` called immediately after init
            expect(getEditionWorkSpy.calls.any()).toBe(true, 'getEditionWork() called');
        });

        it('should have called `getEditionReportData()`', () => {
            // `getEditionReportData()` called immediately after init
            expect(getEditionReportDataSpy.calls.any()).toBe(true, 'getEditionReportData() called');
        });
    });
});
