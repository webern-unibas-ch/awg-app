import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { UtilityService } from '@awg-core/services';

import { EditionTkaLabelComponent } from './edition-tka-label.component';

describe('EditionTkaLabelComponent (DONE)', () => {
    let component: EditionTkaLabelComponent;
    let fixture: ComponentFixture<EditionTkaLabelComponent>;
    let compDe: DebugElement;

    let utils: UtilityService;

    let isSketchIdSpy: Spy;

    let expectedId: string;
    let expectedLabelType: 'evaluation' | 'commentary';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionTkaLabelComponent],
            providers: [UtilityService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionTkaLabelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        utils = TestBed.inject(UtilityService);

        // Test data
        expectedId = 'test-1';
        expectedLabelType = 'evaluation';

        // Spies on component functions
        isSketchIdSpy = vi.spyOn(utils, 'isSketchId');
    });

    afterEach(() => {
        vi.restoreAllMocks();
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

        it('... should have called `isSketchId` from UtilityService with given id', () => {
            expectSpyCall(isSketchIdSpy, 1, expectedId);
        });

        describe('VIEW', () => {
            describe('WHEN `labelType` is `evaluation`', () => {
                beforeEach(async () => {
                    component.labelType = 'evaluation';

                    await detectChangesOnPush(fixture);
                });

                it('... should display `Quellenbewertung` in span if no sketch id is given', async () => {
                    component.id = 'test-1';

                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Quellenbewertung');
                });

                it('... should display `Skizzenkommentar` in span if sketch id is given', async () => {
                    component.id = 'test-1_Sk1';

                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Skizzenkommentar');
                });
            });

            describe('WHEN `labelType` is `commentary`', () => {
                beforeEach(async () => {
                    component.labelType = 'commentary';

                    await detectChangesOnPush(fixture);
                });

                it('... should display `Textkritische Anmerkungen` in span if no sketch id is given', async () => {
                    component.id = 'test-1';

                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Textkritische Anmerkungen');
                });

                it('... should display `Textkritische Kommentare` in span if sketch id is given', async () => {
                    component.id = 'test-1_Sk1';

                    await detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Textkritische Kommentare');
                });
            });
        });
    });
});
