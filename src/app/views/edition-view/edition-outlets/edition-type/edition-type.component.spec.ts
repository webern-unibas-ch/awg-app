import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionTypeComponent } from './edition-type.component';

describe('EditionTypeComponent', () => {
    let component: EditionTypeComponent;
    let fixture: ComponentFixture<EditionTypeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionTypeComponent, RouterOutletStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
