import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionReportSourcesComponent } from './edition-report-sources.component';

describe('EditionReportSourcesComponent', () => {
    let component: EditionReportSourcesComponent;
    let fixture: ComponentFixture<EditionReportSourcesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionReportSourcesComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportSourcesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
