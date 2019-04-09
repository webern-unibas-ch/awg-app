/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionTkaTableComponent } from './edition-tka-table.component';
import { CompileHtmlComponent } from '@awg-shared/compile-html';

describe('EditionTkaTableComponent', () => {
    let component: EditionTkaTableComponent;
    let fixture: ComponentFixture<EditionTkaTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionTkaTableComponent, CompileHtmlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
