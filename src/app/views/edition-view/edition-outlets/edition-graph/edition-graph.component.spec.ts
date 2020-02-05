import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionWorks } from '@awg-views/edition-view/models';

import { EditionGraphComponent } from './edition-graph.component';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

describe('EditionGraphComponent', () => {
    let component: EditionGraphComponent;
    let fixture: ComponentFixture<EditionGraphComponent>;

    let getEditionGraphDataSpy: Spy;
    let getEditionWorkSpy: Spy;

    beforeEach(async(() => {
        // create a fake service object with a `getEditionReportData()` spy
        const mockEditionDataService = jasmine.createSpyObj('EditionDataService', ['getEditionGraphData']);
        // make the spy return a synchronous Observable with the test data
        getEditionGraphDataSpy = mockEditionDataService.getEditionGraphData.and.returnValue(observableOf({})); // TODO: provide real test data

        // create a fake service object with a `getEditionWork()` spy
        const mockEditionService = jasmine.createSpyObj('EditionService', ['getEditionWork']);
        // make the spy return a synchronous Observable with the test data
        getEditionWorkSpy = mockEditionService.getEditionWork.and.returnValue(observableOf(EditionWorks.op12));

        TestBed.configureTestingModule({
            declarations: [EditionGraphComponent, CompileHtmlComponent],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionGraphComponent);
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
            expect(getEditionGraphDataSpy.calls.any()).toBe(true, 'getEditionReportData() called');
        });
    });
});
