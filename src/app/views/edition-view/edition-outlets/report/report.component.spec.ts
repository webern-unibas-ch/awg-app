/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EditionWorks, SourceDescriptionList, SourceList, TextcriticsList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { ReportComponent } from './report.component';

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

    // TODO: handle output
}

@Component({ selector: 'awg-textcritics', template: '' })
class TextcritisStubComponent {
    @Input()
    textcriticsData: TextcriticsList;

    // TODO: handle output
}

describe('ReportComponent', () => {
    let component: ReportComponent;
    let fixture: ComponentFixture<ReportComponent>;

    let getEditionReportDataSpy: Spy;
    let getEditionWorkSpy: Spy;

    beforeEach(async(() => {
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
                ReportComponent,
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
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportComponent);
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
