/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SourceList, TextcriticsList } from '@awg-views/edition-view/models';
import { DataService } from '@awg-views/edition-view/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';

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

    let getDataSpy;

    beforeEach(async(() => {
        // create a fake DataService object with a `getData()` spy
        const dataService = jasmine.createSpyObj('DataService', ['getEditionReportData']);
        // make the spy return a synchronous Observable with the test data
        getDataSpy = dataService.getEditionReportData.and.returnValue(observableOf({})); // TODO: provide real test data

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
            providers: [{ provide: DataService, useValue: dataService }]
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

        it('should have called `getData()`', () => {
            // `getEditionReportData()` called immediately after init
            expect(getDataSpy.calls.any()).toBe(true, 'getData called');
        });
    });
});
