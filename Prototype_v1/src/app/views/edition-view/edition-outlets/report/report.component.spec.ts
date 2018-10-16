/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of as observableOf } from 'rxjs';

import { ReportComponent } from './report.component';
import { SharedModule } from '@awg-shared/shared.module';
import { ReportModule } from '@awg-views/edition-view/edition-outlets/report/report.module';
import { SourceList, TextcriticsList } from '@awg-views/edition-view/models';
import { DataService } from '@awg-views/edition-view/services';

describe('ReportComponent', () => {
    let component: ReportComponent;
    let fixture: ComponentFixture<ReportComponent>;
    let testData: [SourceList, TextcriticsList];
    let getDataSpy;

    beforeEach(async(() => {
        testData = [new SourceList(), new TextcriticsList()]; // TODO: provide real test data

        // create a fake DataService object with a `getData()` spy
        const dataService = jasmine.createSpyObj('DataService', ['getEditionReportData']);
        // make the spy return a synchronous Observable with the test data
        getDataSpy = dataService.getEditionReportData.and.returnValue(observableOf(testData));

        TestBed.configureTestingModule({
            imports: [SharedModule, ReportModule, RouterTestingModule],
            declarations: [ReportComponent],
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
