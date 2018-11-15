import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FooterLogoComponent } from './footer-logo.component';
import { Logo } from '@awg-core/core-models';

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
                const imageDes = fixture.debugElement.queryAll(By.css('a > img'));
                expect(imageDes).toBeTruthy();
                expect(imageDes.length).toBe(1, 'should have 1 image');
            });

            it('... should not render logo yet', () => {
                // find debug elements
                const anchorDe = fixture.debugElement.query(By.css('a'));
                const imageDe = fixture.debugElement.query(By.css('img'));

                // find native elements
                const anchorEl = anchorDe.nativeElement;
                const imageEl = imageDe.nativeElement;

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
            // mock the input values supplied by the parent component
            expectedLogo = {
                id: 'unibaslogo',
                src: 'assets/img/logos/uni.svg',
                alt: 'Logo Uni Basel',
                href: 'http://www.unibas.ch'
            };

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
            it('should render logo', () => {
                // find debug elements
                const anchorDe = fixture.debugElement.query(By.css('a'));
                const imageDe = fixture.debugElement.query(By.css('img'));

                // find native elements
                const anchorEl = anchorDe.nativeElement;
                const imageEl = imageDe.nativeElement;

                expect(anchorEl.href).toContain(expectedLogo.href);
                expect(imageEl.id).toContain(expectedLogo.id);
                expect(imageEl.src).toContain(expectedLogo.src);
                expect(imageEl.alt).toContain(expectedLogo.alt);
            });
        });
    });
});
