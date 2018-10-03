import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionConvoluteComponent } from './edition-convolute.component';

describe('EditionConvoluteComponent', () => {
    let component: EditionConvoluteComponent;
    let fixture: ComponentFixture<EditionConvoluteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionConvoluteComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
