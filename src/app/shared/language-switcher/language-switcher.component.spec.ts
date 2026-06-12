import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent (DONE)', () => {
    let component: LanguageSwitcherComponent;
    let fixture: ComponentFixture<LanguageSwitcherComponent>;
    let compDe: DebugElement;

    let setLanguageSpy: Spy;
    let emitLanguageChangeRequestSpy: Spy;

    let expectedLanguage: number;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LanguageSwitcherComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageSwitcherComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLanguage = 0;

        // Spies
        setLanguageSpy = vi.spyOn(component, 'setLanguage');
        emitLanguageChangeRequestSpy = vi.spyOn(component.languageChangeRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `currentLanguage`', () => {
            expect(component.currentLanguage).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 1 language-switcher paragraph', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
            });

            it('... should contain 2 language-switcher anchor elements (DE | EN)', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, 'DE | EN');

                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 2, 2);
                const aEl1: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl2: HTMLAnchorElement = aDes[1].nativeElement;

                expectToBe(aEl1.textContent, 'DE');
                expectToBe(aEl2.textContent, 'EN');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.currentLanguage = expectedLanguage;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `currentLanguage` = 0', () => {
            expectToBe(component.currentLanguage, 0);
        });

        describe('VIEW', () => {
            it('... should trigger `setLanguage` method on anchor click', async () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 2, 2);

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(aDes[0], fixture);

                expectSpyCall(setLanguageSpy, 1);

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(aDes[1], fixture);

                expectSpyCall(setLanguageSpy, 2);
            });

            it('... should trigger setLanguage method with 0 when clicking on first anchor', async () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 2, 2);

                // Click on first anchor
                await clickAndAwaitChanges(aDes[0], fixture);

                expectSpyCall(setLanguageSpy, 1, 0);
            });

            it('... should trigger setLanguage method with 1 when clicking on second anchor', async () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 2, 2);

                // Click on second anchor
                await clickAndAwaitChanges(aDes[1], fixture);

                expectSpyCall(setLanguageSpy, 1, 1);
            });

            it('... should have .active class on first anchor element when currentLanguage is 0', async () => {
                component.currentLanguage = 0;
                await detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 2, 2);

                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expectToContain(aEl0.classList, 'active');
                expect(aEl1.classList).not.toContain('active');
            });

            it('... should have .active class on second anchor element when currentLanguage is 1', async () => {
                component.currentLanguage = 1;
                await detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 2, 2);

                const aEl0: HTMLAnchorElement = aDes[0].nativeElement;
                const aEl1: HTMLAnchorElement = aDes[1].nativeElement;

                expect(aEl0.classList).not.toContain('active');
                expectToContain(aEl1.classList, 'active');
            });
        });

        describe('#setLanguage()', () => {
            it('... should have a method `setLanguage`', () => {
                expect(component.setLanguage).toBeDefined();
            });

            it('... should trigger on click', async () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const aDes = getAndExpectDebugElementByCss(pDes[0], 'a', 2, 2);

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(aDes[0], fixture);

                expectSpyCall(setLanguageSpy, 1);

                // Trigger click with click helper & wait for changes
                await clickAndAwaitChanges(aDes[1], fixture);

                expectSpyCall(setLanguageSpy, 2);
            });

            it('... should emit 0 when called with 0', () => {
                component.setLanguage(0);

                expectSpyCall(setLanguageSpy, 1);
                expectSpyCall(emitLanguageChangeRequestSpy, 1, 0);
            });

            it('... should emit 1 when called with 1', () => {
                component.setLanguage(1);

                expectSpyCall(setLanguageSpy, 1);
                expectSpyCall(emitLanguageChangeRequestSpy, 1, 1);
            });

            it('... should not emit when called with any other number than 0 or 1', () => {
                const invalidLanguageNumbers = [-987654321, -2, -1, 2, 3, 987654321];

                invalidLanguageNumbers.forEach((languageNumber, index) => {
                    component.setLanguage(languageNumber);

                    expectSpyCall(setLanguageSpy, index + 1);
                    expectSpyCall(emitLanguageChangeRequestSpy, 0);
                });
            });
        });
    });
});
