import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';

import { LOGOS_DATA } from '@awg-core/core-data';
import { Logo } from '@awg-core/core-models';

import { FooterLogoComponent } from './footer-logo.component';

describe('FooterLogoComponent (DONE)', () => {
    let component: FooterLogoComponent;
    let fixture: ComponentFixture<FooterLogoComponent>;
    let compDe: DebugElement;

    let getLogoClassSpy: Spy;

    let expectedLeftMainFooterLogo: Logo;
    let expectedRightMainFooterLogo: Logo;
    let expectedNonMainFooterLogo: Logo;

    const cssClassFloatEnd = 'float-end';
    const cssClassMarginY2 = 'my-2';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FooterLogoComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterLogoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLeftMainFooterLogo = LOGOS_DATA['unibas'];
        expectedRightMainFooterLogo = LOGOS_DATA['sagw'];
        expectedNonMainFooterLogo = LOGOS_DATA['angular'];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getLogoClassSpy = spyOn<any>(component, 'getLogoClass').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have logo', () => {
            expect(component.logo).toBeUndefined();
        });

        describe('#getLogoClass()', () => {
            it('... should have a method `getLogoClass`', () => {
                expect(component.getLogoClass).toBeDefined();
            });

            it('... should not have been called yet', () => {
                expectSpyCall(getLogoClassSpy, 0);
            });
        });

        describe('VIEW', () => {
            it('... should contain one image inside an anchor a', () => {
                getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
            });

            it('... should not render logo yet', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const anchorEl = anchorDes[0].nativeElement;

                const imageDes = getAndExpectDebugElementByCss(compDe, 'img', 1, 1);
                const imageEl = imageDes[0].nativeElement;

                expectToBe(anchorEl.href, '');
                expectToBe(imageEl.id, '');
                expectToBe(imageEl.src, '');
                expectToBe(imageEl.alt, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.logo = LOGOS_DATA['sagw'];

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have logo', () => {
            expectToEqual(component.logo, expectedRightMainFooterLogo);
        });

        it('... should change logo if input changes', () => {
            expectToEqual(component.logo, expectedRightMainFooterLogo);

            // Trigger changes in data binding
            component.logo = expectedLeftMainFooterLogo;
            detectChangesOnPush(fixture);

            expectToEqual(component.logo, expectedLeftMainFooterLogo);

            // Trigger changes in data binding
            component.logo = expectedNonMainFooterLogo;
            detectChangesOnPush(fixture);

            expectToEqual(component.logo, expectedNonMainFooterLogo);
        });

        describe('VIEW', () => {
            it('... should have correct logo link in anchor', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const anchorEl = anchorDes[0].nativeElement;

                expectToContain(anchorEl.href, expectedRightMainFooterLogo.href);
            });

            it('... should contain the logo img in anchor', () => {
                getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
            });

            it('... should have correct logo id in img', () => {
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
                const imageEl = imageDes[0].nativeElement;

                expectToBe(imageEl.id, expectedRightMainFooterLogo.id);
            });

            it('... should have correct logo src and alt in img', () => {
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
                const imageEl = imageDes[0].nativeElement;

                expectToContain(imageEl.src, expectedRightMainFooterLogo.src);
                expectToBe(imageEl.alt, expectedRightMainFooterLogo.alt);
            });

            it('... should have CSS class `my-2 float-end` applied only to right main footer logos', () => {
                // Right main footer logo
                component.logo = expectedRightMainFooterLogo;
                detectChangesOnPush(fixture);

                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassFloatEnd]).toBeTruthy();
                expect(imageDes[0].classes[cssClassMarginY2]).toBeTruthy();

                expectToContain(imageEl.classList, cssClassFloatEnd);
                expectToContain(imageEl.classList, cssClassMarginY2);
            });

            it('... should have CSS class `float-end` applied only to right main footer logos', () => {
                // Right main footer logo
                component.logo = expectedRightMainFooterLogo;
                detectChangesOnPush(fixture);

                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassFloatEnd]).toBeTruthy();
                expectToContain(imageEl.classList, cssClassFloatEnd);

                // Left main footer logo
                // Trigger changes in data binding
                component.logo = expectedLeftMainFooterLogo;
                detectChangesOnPush(fixture);

                expect(imageDes[0].classes[cssClassFloatEnd]).not.toBeTruthy();
                expect(imageEl.classList).not.toContain(cssClassFloatEnd);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = expectedNonMainFooterLogo;
                detectChangesOnPush(fixture);

                expect(imageDes[0].classes[cssClassFloatEnd]).not.toBeTruthy();
                expect(imageEl.classList).not.toContain(cssClassFloatEnd);
            });

            it('... should have CSS class `my-2` applied only to main footer logos', () => {
                // Right main footer logo
                component.logo = expectedRightMainFooterLogo;
                detectChangesOnPush(fixture);

                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassMarginY2]).toBeTruthy();
                expectToContain(imageEl.classList, cssClassMarginY2);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = expectedLeftMainFooterLogo;
                detectChangesOnPush(fixture);

                expect(imageDes[0].classes[cssClassMarginY2]).toBeTruthy();
                expectToContain(imageEl.classList, cssClassMarginY2);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = expectedNonMainFooterLogo;
                detectChangesOnPush(fixture);

                expect(imageDes[0].classes[cssClassMarginY2]).not.toBeTruthy();
                expect(imageEl.classList).not.toContain(cssClassMarginY2);
            });

            it('... should have [ngClass] resolve to correct classes', () => {
                // Right main footer logo
                component.logo = expectedRightMainFooterLogo;
                detectChangesOnPush(fixture);

                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
                const imageEl = imageDes[0].nativeElement;

                expectToBe(imageDes[0].attributes['ng-reflect-ng-class'], cssClassMarginY2 + ' ' + cssClassFloatEnd);
                expectToBe(imageEl.attributes['ng-reflect-ng-class'].value, cssClassMarginY2 + ' ' + cssClassFloatEnd);

                // Left main footer logo
                // Trigger changes in data binding
                component.logo = expectedLeftMainFooterLogo;
                detectChangesOnPush(fixture);

                expectToBe(imageDes[0].attributes['ng-reflect-ng-class'], cssClassMarginY2);
                expectToBe(imageEl.attributes['ng-reflect-ng-class'].value, cssClassMarginY2);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = expectedNonMainFooterLogo;
                detectChangesOnPush(fixture);

                expect(imageDes[0].attributes['ng-reflect-ng-class']).not.toBeTruthy();
                expect(imageEl.attributes['ng-reflect-ng-class'].value).not.toBeTruthy();
            });
        });

        describe('#getLogoClass()', () => {
            it('... should have been called with logo id', () => {
                expectSpyCall(getLogoClassSpy, 1, expectedRightMainFooterLogo.id);
            });

            it('... should return class `my-2 float-end` for right main footer logos', () => {
                component.logo = expectedRightMainFooterLogo;
                fixture.detectChanges();

                const classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassFloatEnd);
                expectToContain(classList, cssClassMarginY2);
                expectToBe(classList, cssClassMarginY2 + ' ' + cssClassFloatEnd);
            });

            it('... should return class `float-end` only for right main footer logos', () => {
                component.logo = expectedRightMainFooterLogo;
                fixture.detectChanges();

                let classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassFloatEnd);

                // Left main footer logo
                // Trigger changes in data binding
                component.logo = expectedLeftMainFooterLogo;
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).toBeTruthy();
                expect(classList).not.toContain(cssClassFloatEnd);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = expectedNonMainFooterLogo;
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).not.toBeTruthy();
            });

            it('... should return class `my-2` only for main footer logos', () => {
                component.logo = expectedRightMainFooterLogo;
                fixture.detectChanges();

                let classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassMarginY2);

                // Trigger changes in data binding
                component.logo = expectedLeftMainFooterLogo;
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassMarginY2);

                // Trigger changes in data binding
                component.logo = expectedNonMainFooterLogo;
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).not.toBeTruthy();
            });
        });
    });
});
