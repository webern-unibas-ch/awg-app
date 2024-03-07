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

import { LOGOSDATA } from '@awg-core/core-data';
import { Logo } from '@awg-core/core-models';

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
                // Find debug elements
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const imageDes = getAndExpectDebugElementByCss(compDe, 'img', 1, 1);

                // Find native elements
                const anchorEl = anchorDes[0].nativeElement;
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
            component.logo = LOGOSDATA['unibas'];

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have logo', () => {
            expectToEqual(component.logo, expectedLogo);
        });

        it('... should change logo if input changes', () => {
            expectToEqual(component.logo, expectedLogo);

            // Trigger changes in data binding
            component.logo = LOGOSDATA['sagw'];
            fixture.detectChanges();

            expectToEqual(component.logo, expectedNonRightMainFooterLogo);

            // Trigger changes in data binding
            component.logo = LOGOSDATA['angular'];
            fixture.detectChanges();

            expectToEqual(component.logo, expectedNonMainFooterLogo);
        });

        describe('#getLogoClass()', () => {
            it('... should have been called with logo id', () => {
                expectSpyCall(getLogoClassSpy, 1, expectedLogo.id);
            });

            it('... should return class `my-2 float-end` for right main footer logos', () => {
                expectSpyCall(getLogoClassSpy, 1, expectedLogo.id);

                const classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassFloatRight);
                expectToContain(classList, cssClassMarginY2);
                expectToBe(classList, cssClassMarginY2 + ' ' + cssClassFloatRight);
            });

            it('... should return class `float-right` only for right main footer logos', () => {
                expectSpyCall(getLogoClassSpy, 1, expectedLogo.id);

                let classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassFloatRight);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).toBeTruthy();
                expect(classList).not.toContain(cssClassFloatRight);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).not.toBeTruthy();
            });

            it('... should return class `my-2` only for main footer logos', () => {
                let classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassMarginY2);

                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expectToContain(classList, cssClassMarginY2);

                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                fixture.detectChanges();

                classList = component.getLogoClass(component.logo.id);

                expect(classList).not.toBeTruthy();
            });
        });

        describe('VIEW', () => {
            it('... should have correct logo link in anchor', () => {
                // Find debug elements
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);

                // Find native elements
                const anchorEl = anchorDes[0].nativeElement;

                expectToContain(anchorEl.href, expectedLogo.href);
            });

            it('... should have correct logo id in img', () => {
                // Find debug element
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native element
                const imageEl = imageDes[0].nativeElement;

                expectToBe(imageEl.id, expectedLogo.id);
            });

            it('... should have correct logo src and alt in img', () => {
                // Find debug element
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native element
                const imageEl = imageDes[0].nativeElement;

                expectToContain(imageEl.src, expectedLogo.src);
                expectToBe(imageEl.alt, expectedLogo.alt);
            });

            it('... should have CSS class `my-2 float-end` applied only to right main footer logos', async () => {
                // For CSS class karma tests cf. https://stackoverflow.com/a/49157894

                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassFloatRight]).toBeTruthy();
                expect(imageDes[0].classes[cssClassMarginY2]).toBeTruthy();

                expectToContain(imageEl.classList, cssClassFloatRight);
                expectToContain(imageEl.classList, cssClassMarginY2);
            });

            it('... should have CSS class `float-right` applied only to right main footer logos', async () => {
                // For CSS class karma tests cf. https://stackoverflow.com/a/49157894

                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassFloatRight]).toBeTruthy();
                expectToContain(imageEl.classList, cssClassFloatRight);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expect(imageDes[0].classes[cssClassFloatRight]).not.toBeTruthy();
                expect(imageEl.classList).not.toContain(cssClassFloatRight);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush

                expect(imageDes[0].classes[cssClassFloatRight]).not.toBeTruthy();
                expect(imageEl.classList).not.toContain(cssClassFloatRight);
            });

            it('... should have CSS class `my-2` applied only to main footer logos', async () => {
                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;

                expect(imageDes[0].classes[cssClassMarginY2]).toBeTruthy();
                expectToContain(imageEl.classList, cssClassMarginY2);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expect(imageDes[0].classes[cssClassMarginY2]).toBeTruthy();
                expectToContain(imageEl.classList, cssClassMarginY2);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush

                expect(imageDes[0].classes[cssClassMarginY2]).not.toBeTruthy();
                expect(imageEl.classList).not.toContain(cssClassMarginY2);
            });

            it('... should have [ngClass] resolve to correct classes', async () => {
                // Right main footer logo
                // Find debug elements
                const imageDes = getAndExpectDebugElementByCss(compDe, 'a > img', 1, 1);

                // Find native elements
                const imageEl = imageDes[0].nativeElement;
                const imageElAttributes = imageEl.attributes;

                expectToBe(imageDes[0].attributes['ng-reflect-ng-class'], cssClassMarginY2 + ' ' + cssClassFloatRight);
                expectToBe(imageElAttributes['ng-reflect-ng-class'].value, cssClassMarginY2 + ' ' + cssClassFloatRight);

                // Main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['sagw'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expectToBe(imageDes[0].attributes['ng-reflect-ng-class'], cssClassMarginY2);
                expectToBe(imageElAttributes['ng-reflect-ng-class'].value, cssClassMarginY2);

                // Not main footer logo
                // Trigger changes in data binding
                component.logo = LOGOSDATA['angular'];
                await detectChangesOnPush(fixture); // Fixture.detectChanges with onPush strategy

                expect(imageDes[0].attributes['ng-reflect-ng-class']).not.toBeTruthy();
                expect(imageElAttributes['ng-reflect-ng-class'].value).not.toBeTruthy();
            });
        });
    });
});
