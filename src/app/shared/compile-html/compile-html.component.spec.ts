import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { CompileHtmlComponent } from './compile-html.component';

describe('CompileHtmlComponent', () => {
    let component: CompileHtmlComponent;
    let fixture: ComponentFixture<CompileHtmlComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CompileHtmlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CompileHtmlComponent);
        component = fixture.componentInstance;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
