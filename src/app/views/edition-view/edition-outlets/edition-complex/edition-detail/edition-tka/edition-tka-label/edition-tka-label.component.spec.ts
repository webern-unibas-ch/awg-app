import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Spy = jasmine.Spy;

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
    let expectedLabelType: 'evaluation' | 'comment';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionTkaLabelComponent],
            providers: [UtilityService],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionTkaLabelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        utils = TestBed.inject(UtilityService);

        // Test data
        expectedId = 'test-1';
        expectedLabelType = 'evaluation';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        isSketchIdSpy = spyOn(utils, 'isSketchId').and.callThrough();
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
                beforeEach(() => {
                    component.labelType = 'evaluation';

                    detectChangesOnPush(fixture);
                });

                it('... should display `Quellenbewertung` in span if no sketch id is given', () => {
                    component.id = 'test-1';

                    detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Quellenbewertung');
                });

                it('... should display `Skizzenkommentar` in span if sketch id is given', () => {
                    component.id = 'test-1_Sk1';

                    detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Skizzenkommentar');
                });
            });

            describe('WHEN `labelType` is `comment`', () => {
                beforeEach(() => {
                    component.labelType = 'comment';

                    detectChangesOnPush(fixture);
                });

                it('... should display `Textkritische Anmerkungen` in span if no sketch id is given', () => {
                    component.id = 'test-1';

                    detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Textkritische Anmerkungen');
                });

                it('... should display `Textkritische Kommentare` in span if sketch id is given', () => {
                    component.id = 'test-1_Sk1';

                    detectChangesOnPush(fixture);

                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span', 1, 1);
                    const spanEl = spanDes[0].nativeElement;

                    expectToBe(spanEl.textContent.trim(), 'Textkritische Kommentare');
                });
            });
        });
    });
});
