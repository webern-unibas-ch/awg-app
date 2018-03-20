import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionReportSourceListComponent } from './edition-report-source-list.component';

describe('EditionReportSourceListComponent', () => {
    let component: EditionReportSourceListComponent;
    let fixture: ComponentFixture<EditionReportSourceListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionReportSourceListComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportSourceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
