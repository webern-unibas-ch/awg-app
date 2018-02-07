import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionReportTextcriticsComponent } from './edition-report-textcritics.component';

describe('EditionReportTextcriticsComponent', () => {
    let component: EditionReportTextcriticsComponent;
    let fixture: ComponentFixture<EditionReportTextcriticsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionReportTextcriticsComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportTextcriticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
