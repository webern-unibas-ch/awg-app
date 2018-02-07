import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionReportComponent } from './edition-report.component';

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionReportComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
