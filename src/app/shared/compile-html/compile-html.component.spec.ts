import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompileHtmlComponent } from './compile-html.component';

describe('CompileHtmlComponent', () => {
    let component: CompileHtmlComponent;
    let fixture: ComponentFixture<CompileHtmlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CompileHtmlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CompileHtmlComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
