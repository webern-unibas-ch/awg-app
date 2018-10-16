import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLogoComponent } from './footer-logo.component';

describe('FooterLogoComponent', () => {
    let component: FooterLogoComponent;
    let fixture: ComponentFixture<FooterLogoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterLogoComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterLogoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
