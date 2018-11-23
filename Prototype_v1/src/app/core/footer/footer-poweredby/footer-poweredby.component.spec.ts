import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPoweredbyComponent } from './footer-poweredby.component';

describe('FooterPoweredbyComponent', () => {
    let component: FooterPoweredbyComponent;
    let fixture: ComponentFixture<FooterPoweredbyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterPoweredbyComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterPoweredbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
