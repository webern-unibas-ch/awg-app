/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import {
    EditionWorks,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionReportComponent } from './edition-report.component';

// mock components
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

    // TODO: handle output
}

@Component({ selector: 'awg-textcritics', template: '' })
class TextcritisStubComponent {
    @Input()
    textcriticsData: TextcriticsList;

    // TODO: handle output
}

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;

    let getEditionReportDataSpy: Spy;
    let getEditionWorkSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            // create a fake service object with a `getEditionReportData()` spy
            const mockEditionDataService = jasmine.createSpyObj('EditionDataService', ['getEditionReportData']);
            // make the spy return a synchronous Observable with the test data
            getEditionReportDataSpy = mockEditionDataService.getEditionReportData.and.returnValue(observableOf({})); // TODO: provide real test data

            // create a fake service object with a `getEditionWork()` spy
            const mockEditionService = jasmine.createSpyObj('EditionService', ['getEditionWork']);
            // make the spy return a synchronous Observable with the test data
            getEditionWorkSpy = mockEditionService.getEditionWork.and.returnValue(observableOf(EditionWorks.op12)); // TODO: provide real test data

            TestBed.configureTestingModule({
                imports: [NgbModalModule, RouterTestingModule],
                declarations: [
                    CompileHtmlComponent,
                    EditionReportComponent,
                    HeadingStubComponent,
                    SourcesStubComponent,
                    TextcritisStubComponent,
                    ModalComponent
                ],
                providers: [
                    { provide: EditionDataService, useValue: mockEditionDataService },
                    { provide: EditionService, useValue: mockEditionService }
                ]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
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
