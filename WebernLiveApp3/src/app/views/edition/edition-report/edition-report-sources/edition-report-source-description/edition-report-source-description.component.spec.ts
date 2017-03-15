import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionReportSourceDescriptionComponent } from './edition-report-source-description.component';

describe('EditionReportSourceDescriptionComponent', () => {
    let component: EditionReportSourceDescriptionComponent;
    let fixture: ComponentFixture<EditionReportSourceDescriptionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionReportSourceDescriptionComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportSourceDescriptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
