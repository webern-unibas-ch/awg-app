import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionSectionComponent } from './edition-section.component';

describe('EditionSectionComponent', () => {
    let component: EditionSectionComponent;
    let fixture: ComponentFixture<EditionSectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionSectionComponent, RouterOutletStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
