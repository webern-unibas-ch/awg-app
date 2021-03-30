/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav.component';

describe('EditionSvgSheetNavComponent', () => {
    let component: EditionSvgSheetNavComponent;
    let fixture: ComponentFixture<EditionSvgSheetNavComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [EditionSvgSheetNavComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSvgSheetNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
