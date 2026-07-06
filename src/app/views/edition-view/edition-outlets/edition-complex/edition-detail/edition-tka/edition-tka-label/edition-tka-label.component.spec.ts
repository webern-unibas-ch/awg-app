import { DebugElement } from '@angular/core';
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
        it('... should not have `id`', () => {
            expect(component.id).toBeUndefined();
        });

        it('... should not have `labelType`', () => {
            expect(component.labelType).toBeUndefined();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.id = expectedId;
            component.labelType = expectedLabelType;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `id`', () => {
            expectToBe(component.id, expectedId);
        });

        it('... should have `labelType`', () => {
            expectToBe(component.labelType, expectedLabelType);
        });

        describe('VIEW', () => {
            describe.each([
                {
                    labelType: 'evaluation' as const,
                    cases: [
                        { id: expectedId, expectedText: 'Quellenbewertung', desc: 'no sketch id is given' },
                        { id: expectedSketchId, expectedText: 'Skizzenkommentar', desc: 'sketch id is given' },
                    ],
                },
                {
                    labelType: 'commentary' as const,
                    cases: [
                        { id: expectedId, expectedText: 'Textkritische Anmerkungen', desc: 'no sketch id is given' },
                        { id: expectedSketchId, expectedText: 'Textkritische Kommentare', desc: 'sketch id is given' },
                    ],
                },
            ])('WHEN `labelType` is $labelType', ({ labelType, cases }) => {
                it.each(cases)('... should display $expectedText in span if $desc', async ({ id, expectedText }) => {
                    component.labelType = labelType;
                    component.id = id;

                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), expectedText);
                });
            });
        });
    });
});
