import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDetailTkaTableComponent } from './edition-detail-tka-table.component';

describe('EditionDetailTkaTableComponent', () => {
    let component: EditionDetailTkaTableComponent;
    let fixture: ComponentFixture<EditionDetailTkaTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionDetailTkaTableComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailTkaTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
