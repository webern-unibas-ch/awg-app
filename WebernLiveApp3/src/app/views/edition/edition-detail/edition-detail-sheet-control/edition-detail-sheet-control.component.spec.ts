import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDetailSheetControlComponent } from './edition-detail-sheet-control.component';

describe('EditionDetailSheetControlComponent', () => {
    let component: EditionDetailSheetControlComponent;
    let fixture: ComponentFixture<EditionDetailSheetControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionDetailSheetControlComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailSheetControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
