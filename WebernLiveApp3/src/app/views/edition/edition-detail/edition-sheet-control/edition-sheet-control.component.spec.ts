import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSheetControlComponent } from './edition-sheet-control.component';

describe('EditionSheetControlComponent', () => {
    let component: EditionSheetControlComponent;
    let fixture: ComponentFixture<EditionSheetControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionSheetControlComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSheetControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
