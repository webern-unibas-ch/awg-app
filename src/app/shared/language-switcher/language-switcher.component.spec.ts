import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';

import { LanguageSwitcherComponent } from './language-switcher.component';
import { LanguageId } from './language.model';

describe('LanguageSwitcherComponent (DONE)', () => {
    let component: LanguageSwitcherComponent;
    let fixture: ComponentFixture<LanguageSwitcherComponent>;
    let compDe: DebugElement;

    let expectedSelectedLanguage: LanguageId;
    let expectedLanguages: { id: LanguageId; label: string }[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LanguageSwitcherComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageSwitcherComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedLanguage = LanguageId.DE;
        expectedLanguages = [
            { id: LanguageId.DE, label: 'DE' },
            { id: LanguageId.EN, label: 'EN' },
        ];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input for model signal `selectedLanguage`', () => {
            expectToBe(isSignal(component.selectedLanguage), true);

            expect(() => component.selectedLanguage()).toThrow();
        });

        it('... should have `languages`', () => {
            expectToEqual(component['languages'], expectedLanguages);
        });

        describe('VIEW', () => {
            it('... should contain one language-switcher paragraph', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
            });

            it('... should contain no buttons yet', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, '');
                getAndExpectDebugElementByCss(pDes[0], 'button', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('selectedLanguage', expectedSelectedLanguage);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedLanguage` to hold the expected language', () => {
            expectToBe(component.selectedLanguage(), expectedSelectedLanguage);
        });

        describe('VIEW', () => {
            it('... should contain two buttons (DE | EN)', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent.trim().replace(/\s+/g, ' '), 'DE | EN');

                const btnDes = getAndExpectDebugElementByCss(pDes[0], 'button', 2, 2);
                const btnEl1: HTMLButtonElement = btnDes[0].nativeElement;
                const btnEl2: HTMLButtonElement = btnDes[1].nativeElement;

                expectToBe(btnEl1.textContent.trim(), 'DE');
                expectToBe(btnEl2.textContent.trim(), 'EN');
            });

            it('... should update `selectedLanguage` on button click', async () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const btnDes = getAndExpectDebugElementByCss(pDes[0], 'button', 2, 2);

                await clickAndAwaitChanges(btnDes[0], fixture);

                expectToBe(component.selectedLanguage(), LanguageId.DE);

                await clickAndAwaitChanges(btnDes[1], fixture);

                expectToBe(component.selectedLanguage(), LanguageId.EN);
            });

            it('... should have .active class on first button when `selectedLanguage` is DE', async () => {
                fixture.componentRef.setInput('selectedLanguage', LanguageId.DE);
                await detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const btnDes = getAndExpectDebugElementByCss(pDes[0], 'button', 2, 2);

                const btnEl1: HTMLButtonElement = btnDes[0].nativeElement;
                const btnEl2: HTMLButtonElement = btnDes[1].nativeElement;

                expectToContain(btnEl1.classList, 'active');
                expectToNotContain(btnEl2.classList, 'active');
            });

            it('... should have .active class on second button when `selectedLanguage` is EN', async () => {
                fixture.componentRef.setInput('selectedLanguage', LanguageId.EN);
                await detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-language-switcher', 1, 1);
                const btnDes = getAndExpectDebugElementByCss(pDes[0], 'button', 2, 2);

                const btnEl1: HTMLButtonElement = btnDes[0].nativeElement;
                const btnEl2: HTMLButtonElement = btnDes[1].nativeElement;

                expectToNotContain(btnEl1.classList, 'active');
                expectToContain(btnEl2.classList, 'active');
            });
        });
    });
});
