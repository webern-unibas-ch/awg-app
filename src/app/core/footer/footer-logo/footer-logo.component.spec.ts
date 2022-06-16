import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { Logo } from '@awg-core/core-models';
import { LOGOSDATA } from '@awg-core/mock-data';

import { FooterLogoComponent } from './footer-logo.component';

describe('FooterLogoComponent (DONE)', () => {
    let component: FooterLogoComponent;
    let fixture: ComponentFixture<FooterLogoComponent>;
    let compDe: DebugElement;

    let getLogoClassSpy: Spy;

    let expectedLogo: Logo;
    let expectedNonRightMainFooterLogo: Logo;
    let expectedNonMainFooterLogo: Logo;

    const cssClassFloatRight = 'float-end';
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
        expectedLogo = LOGOSDATA['unibas'];
        expectedNonRightMainFooterLogo = LOGOSDATA['sagw'];
        expectedNonMainFooterLogo = LOGOSDATA['angular'];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getLogoClassSpy = spyOn<any>(component, 'getLogoClass').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have logo', () => {
            expect(component.logo).toBeUndefined();
        });

        describe('#getLogoClass', () => {
            it('... should not have been called yet', () => {
                expectSpyCall(getLogoClassSpy, 0);
            });
        });

        describe('VIEW', () => {
            it('... should contain one image inside an anchor a', () => {
                getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);
            });

            it('... should not render logo yet', () => {
                // Find debug elements
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const imageDes = getAndExpectDebugElementByCss(compDe, 'img', 1, 1);

                // Find native elements
                const anchorEl = anchorDes[0].nativeElement;
                const imageEl = imageDes[0].nativeElement;

                expect(anchorEl.href).toBeDefined();
                expect(anchorEl.href).withContext('should be empty string').not.toBeTruthy();

                expect(imageEl.id).toBeDefined();
                expect(imageEl.id).withContext('should be empty string').not.toBeTruthy();

                expect(imageEl.src).toBeDefined();
                expect(imageEl.src).withContext('should be empty string').not.toBeTruthy();

                expect(imageEl.alt).toBeDefined();
                expect(imageEl.alt).withContext('should be empty string').not.toBeTruthy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.logo = LOGOSDATA['unibas'];

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have logo', () => {
            expect(component.logo).toBeDefined();
            expect(component.logo).withContext(`should be ${expectedLogo}`).toBe(expectedLogo);
        });

        it('should change logo if input changes', () => {
            expect(component.logo).toBeDefined();
            expect(component.logo).withContext(`should be ${expectedLogo}`).toBe(expectedLogo);

            // Trigger changes in data binding
            component.logo = LOGOSDATA['sagw'];
            fixture.detectChanges();

            expect(component.logo).toBeDefined();
            expect(component.logo)
                .withContext(`should equal ${expectedNonRightMainFooterLogo}`)
                .toEqual(expectedNonRightMainFooterLogo);

            // Trigger changes in data binding
            component.logo = LOGOSDATA['angular'];
            fixture.detectChanges();

            expect(component.logo).toBeDefined();
            expect(component.logo)
                .withContext(`should equal ${expectedNonMainFooterLogo}`)
                .toEqual(expectedNonMainFooterLogo);
        });

        describe('#getLogoClass', () => {
            it('... should have been called with logo id', () => {
                expectSpyCall(getLogoClassSpy, 1, expectedLogo.id);
            });

            it('... should return class `my-2 float-end` for right main footer logos', () => {
                expectSpyCall(getLogoClassSpy, 1, expectedLogo.id);

                const classList = component.getLogoClass(component.logo.id);

                expect(classList).withContext('should not be empty').toBeTruthy();
                expect(classList).withContext(`should contain ${cssClassFloatRight}`).toContain(cssClassFloatRight);
                expect(classList).withContext(`should contain ${cssClassMarginY2}`).toContain(cssClassMarginY2);
                expect(classList)
                    .withContext(`should be ${cssClassMarginY2} ${cssClassFloatRight}`)
                    .toBe(cssClassMarginY2 + ' ' + cssClassFloatRight);
            });

            it('... should return class `float-right` only for right main footer logos', () => {
                expectSpyCall(getLogoClassSpy, 1, expectedLogo.id);

                let classList = component.getLogoClass(component.logo.id);

                expect(classList).withContext('should not be empty').toBeTruthy();
                expect(classList).withContext(`should contain ${cssClassFloatRight}`).toContain(cssClassFloatRight);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).withContext('should not be empty').toBeTruthy();
                expect(classList)
                    .withContext(`should not contain ${cssClassFloatRight}`)
                    .not.toContain(cssClassFloatRight);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).withContext('should be empty').not.toBeTruthy();
            });

            it('... should return class `my-2` only for main footer logos', () => {
                let classList = component.getLogoClass(component.logo.id);

                expect(classList).withContext('should not be empty').toBeTruthy();
                expect(classList).withContext(`should contain ${cssClassMarginY2}`).toContain(cssClassMarginY2);

                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).withContext('should not be empty').toBeTruthy();
                expect(classList).withContext(`should contain ${cssClassMarginY2}`).toContain(cssClassMarginY2);

                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).withContext('should be empty').not.toBeTruthy();
            });
        });

        describe('VIEW', () => {
            it('... should have correct logo link in anchor', () => {
                // Find debug elements
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);

                // Find native elements
                const anchorEl = anchorDes[0].nativeElement;

                expect(anchorEl.href).toBeTruthy();
                expect(anchorEl.href).withContext(`should contain ${expectedLogo.href}`).toContain(expectedLogo.href);
            });

            it('... should have correct logo id in img', () => {
                // Find debug element
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native element
                const imageEl = imageDes[0].nativeElement;

                expect(imageEl.id).toBeTruthy();
                expect(imageEl.id).withContext(`should be ${expectedLogo.id}`).toBe(expectedLogo.id);
            });

            it('... should have correct logo src and alt in img', () => {
                // Find debug element
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native element
                const imageEl = imageDes[0].nativeElement;

                expect(imageEl.src).withContext(`should contain ${expectedLogo.src}`).toContain(expectedLogo.src);
                expect(imageEl.alt).withContext(`should be ${expectedLogo.alt}`).toBe(expectedLogo.alt);
            });

            it('... should have CSS class `my-2 float-end` applied only to right main footer logos', async () => {
                // For CSS class karma tests cf. https://stackoverflow.com/a/49157894

                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassFloatRight]).withContext('should not be empty').toBeTruthy();
                expect(imageDes[0].classes[cssClassMarginY2]).withContext('should not be empty').toBeTruthy();

                expect(imageEl.classList)
                    .withContext(`should contain ${cssClassFloatRight}`)
                    .toContain(cssClassFloatRight);
                expect(imageEl.classList).withContext(`should contain ${cssClassMarginY2}`).toContain(cssClassMarginY2);
            });

            it('... should have CSS class `float-right` applied only to right main footer logos', async () => {
                // For CSS class karma tests cf. https://stackoverflow.com/a/49157894

                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassFloatRight]).withContext('should not be empty').toBeTruthy();
                expect(imageEl.classList)
                    .withContext(`should contain ${cssClassFloatRight}`)
                    .toContain(cssClassFloatRight);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expect(imageDes[0].classes[cssClassFloatRight]).withContext('should be empty').not.toBeTruthy();
                expect(imageEl.classList)
                    .withContext(`should not contain ${cssClassFloatRight}`)
                    .not.toContain(cssClassFloatRight);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush

                expect(imageDes[0].classes[cssClassFloatRight]).withContext('should be empty').not.toBeTruthy();
                expect(imageEl.classList)
                    .withContext(`should not contain ${cssClassFloatRight}`)
                    .not.toContain(cssClassFloatRight);
            });

            it('... should have CSS class `my-2` applied only to main footer logos', async () => {
                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassMarginY2]).withContext('should not be empty').toBeTruthy();
                expect(imageEl.classList).withContext(`should contain ${cssClassMarginY2}`).toContain(cssClassMarginY2);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expect(imageDes[0].classes[cssClassMarginY2]).withContext('should not be empty').toBeTruthy();
                expect(imageEl.classList).withContext(`should contain ${cssClassMarginY2}`).toContain(cssClassMarginY2);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush

                expect(imageDes[0].classes[cssClassMarginY2]).withContext('should be empty').not.toBeTruthy();
                expect(imageEl.classList)
                    .withContext(`should not contain ${cssClassMarginY2}`)
                    .not.toContain(cssClassMarginY2);
            });

            it('... should have [ngClass] resolve to correct classes', async () => {
                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;
                const imageElAttributes = imageEl.attributes;

                expect(imageDes[0].attributes['ng-reflect-ng-class'])
                    .withContext(`should be ${cssClassMarginY2} ${cssClassFloatRight}`)
                    .toBe(cssClassMarginY2 + ' ' + cssClassFloatRight);
                expect(imageElAttributes['ng-reflect-ng-class'].value)
                    .withContext(`should be ${cssClassMarginY2} ${cssClassFloatRight}`)
                    .toBe(cssClassMarginY2 + ' ' + cssClassFloatRight);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expect(imageDes[0].attributes['ng-reflect-ng-class'])
                    .withContext(`should be ${cssClassMarginY2}`)
                    .toBe(cssClassMarginY2);
                expect(imageElAttributes['ng-reflect-ng-class'].value)
                    .withContext(`should be ${cssClassMarginY2}`)
                    .toBe(cssClassMarginY2);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expect(imageDes[0].attributes['ng-reflect-ng-class'])
                    .withContext('should be empty string')
                    .not.toBeTruthy();
                expect(imageElAttributes['ng-reflect-ng-class'].value)
                    .withContext('should be empty string')
                    .not.toBeTruthy();
            });
        });
    });
});
