import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionTkaLabelComponent } from './edition-tka-label.component';

// Global constants (used for parameterized tests)
const expectedId = 'test-1';
const expectedSketchId = 'test-1_Sk1';

describe('EditionTkaLabelComponent (DONE)', () => {
    let component: EditionTkaLabelComponent;
    let fixture: ComponentFixture<EditionTkaLabelComponent>;
    let compDe: DebugElement;

    let expectedLabelType: 'evaluation' | 'commentary';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionTkaLabelComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedLabelType = 'evaluation';

        // Create component fixture
        fixture = TestBed.createComponent(EditionTkaLabelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `id`', () => {
            expectToBe(isSignal(component.id), true);

            expect(() => component.id()).toThrow();
        });

        it('... should throw due to missing required input signal `labelType`', () => {
            expectToBe(isSignal(component.labelType), true);

            expect(() => component.labelType()).toThrow();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('id', expectedId);
            fixture.componentRef.setInput('labelType', expectedLabelType);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `id` to hold the expected id', () => {
            expectToBe(component.id(), expectedId);
        });

        it('... should have signal `labelType` to hold the expected type', () => {
            expectToBe(component.labelType(), expectedLabelType);
        });

        describe('VIEW', () => {
            describe('... should display the correct label text in span when labelType is `evaluation` if', () => {
                it.each([
                    { desc: 'no sketch id is given', id: expectedId, expectedText: 'Quellenbewertung' },
                    { desc: 'sketch id is given', id: expectedSketchId, expectedText: 'Skizzenkommentar' },
                ])('... $desc', async ({ id, expectedText }) => {
                    fixture.componentRef.setInput('id', id);
                    fixture.componentRef.setInput('labelType', 'evaluation');

                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), expectedText);
                });
            });

            describe('... should display the correct label text in span when labelType is `commentary` if', () => {
                it.each([
                    { desc: 'no sketch id is given', id: expectedId, expectedText: 'Textkritische Anmerkungen' },
                    { desc: 'sketch id is given', id: expectedSketchId, expectedText: 'Textkritische Kommentare' },
                ])('... $desc', async ({ id, expectedText }) => {
                    fixture.componentRef.setInput('id', id);
                    fixture.componentRef.setInput('labelType', 'commentary');

                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), expectedText);
                });
            });
        });
    });
});
