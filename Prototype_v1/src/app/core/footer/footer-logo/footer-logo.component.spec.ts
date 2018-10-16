import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLogoComponent } from './footer-logo.component';
import { Logos } from '@awg-core/core-models';

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

        const logos: Logos = {
            unibas: {
                id: 'unibaslogo',
                src: 'assets/img/uni.svg',
                alt: 'Logo Uni Basel',
                href: 'http://www.unibas.ch'
            },
            snf: { id: 'snflogo', src: 'assets/img/snf.jpg', alt: 'Logo SNF', href: 'http://www.snf.ch' }
        };

        component.logo = logos.unibas;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
