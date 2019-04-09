import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { Logo } from '@awg-core/core-models';

import { FooterLogoComponent } from './footer-logo.component';

describe('FooterLogoComponent (DONE)', () => {
    let component: FooterLogoComponent;
    let fixture: ComponentFixture<FooterLogoComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedLogo: Logo;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterLogoComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterLogoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedLogo = {
            id: 'unibaslogo',
            src: 'assets/img/logos/uni.svg',
            alt: 'Logo Uni Basel',
            href: 'https://www.unibas.ch'
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have logo', () => {
            expect(component.logo).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one image inside an anchor', () => {
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
            });

            it('... should not render logo yet', () => {
                // find debug elements
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const imageDes = getAndExpectDebugElementByCss(compDe, 'img', 1, 1);

                // find native elements
                const anchorEl = anchorDes[0].nativeElement;
                const imageEl = imageDes[0].nativeElement;

                expect(anchorEl.href).toBeDefined();
                expect(anchorEl.href).toBe('', 'should be empty string');

                expect(imageEl.id).toBeDefined();
                expect(imageEl.id).toBe('', 'should be empty string');

                expect(imageEl.src).toBeDefined();
                expect(imageEl.src).toBe('', 'should be empty string');

                expect(imageEl.alt).toBeDefined();
                expect(imageEl.alt).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.logo = expectedLogo;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have logo', () => {
            expect(component.logo).toBeDefined();
            expect(component.logo).toBe(expectedLogo);
        });

        describe('VIEW', () => {
            it('... should render logo', () => {
                // find debug elements
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const imageDes = getAndExpectDebugElementByCss(compDe, 'img', 1, 1);

                // find native elements
                const anchorEl = anchorDes[0].nativeElement;
                const imageEl = imageDes[0].nativeElement;

                expect(anchorEl.href).toContain(expectedLogo.href);
                expect(imageEl.id).toContain(expectedLogo.id);
                expect(imageEl.src).toContain(expectedLogo.src);
                expect(imageEl.alt).toContain(expectedLogo.alt);
            });
        });
    });
});
