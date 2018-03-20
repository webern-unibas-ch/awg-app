import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionReportSourceEvaluationComponent } from './edition-report-source-evaluation.component';

describe('EditionReportSourceEvaluationComponent', () => {
    let component: EditionReportSourceEvaluationComponent;
    let fixture: ComponentFixture<EditionReportSourceEvaluationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionReportSourceEvaluationComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportSourceEvaluationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
