import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { Logo, Logos } from '@awg-core/core-models';
import { LOGOSDATA } from '@awg-core/mock-data';

import { FooterPoweredbyComponent } from './footer-poweredby.component';

@Component({ selector: 'awg-footer-logo', template: '' })
class FooterLogoStubComponent {
    @Input()
    logo: Logo;
}

describe('FooterPoweredbyComponent (DONE)', () => {
    let component: FooterPoweredbyComponent;
    let fixture: ComponentFixture<FooterPoweredbyComponent>;
    let compDe: DebugElement;

    let expectedLogos: Logos;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [FooterPoweredbyComponent, FooterLogoStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterPoweredbyComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOSDATA;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have logos', () => {
            expect(component.logos).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-powered-by', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-powered-by', 1, 1);
            });

            it('... should contain 3 footer logo components (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.logos = expectedLogos;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have logos', () => {
            expect(component.logos).toBeDefined();
            expect(component.logos).toBe(expectedLogos);
        });

        describe('VIEW', () => {
            it('... should pass down logos to footer logo components', () => {
                const footerLogoDes = getAndExpectDebugElementByDirective(compDe, FooterLogoStubComponent, 3, 3);
                const footerLogoCmps = footerLogoDes.map(
                    de => de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent
                );

                expect(footerLogoCmps.length).toBe(3, 'should have 3 logo components');

                expect(footerLogoCmps[0].logo).toBeTruthy();
                expect(footerLogoCmps[0].logo).toEqual(expectedLogos.github, 'should have github logo');

                expect(footerLogoCmps[1].logo).toBeTruthy();
                expect(footerLogoCmps[1].logo).toEqual(expectedLogos.angular, 'should have angular logo');

                expect(footerLogoCmps[2].logo).toBeTruthy();
                expect(footerLogoCmps[2].logo).toEqual(expectedLogos.bootstrap, 'should have bootstrap logo');
            });
        });
    });
});
