import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionModalService } from '@awg-views/edition-view/services/edition-modal.service';

import { UsageHintsComponent } from './usage-hints.component';

describe('UsageHintsComponent (DONE)', () => {
    let component: UsageHintsComponent;
    let fixture: ComponentFixture<UsageHintsComponent>;
    let compDe: DebugElement;

    let mockEditionModalService: Partial<EditionModalService>;

    let openUsageHintsSpy: Spy;
    let serviceOpenTextModalSpy: Spy;

    const expectedSnippetKey = 'HINT_EDITION_SHEETS';

    const getButtonDes = () => getAndExpectDebugElementByCss(compDe, 'button.btn.btn-sm.btn-outline-info', 1, 1);

    beforeEach(async () => {
        mockEditionModalService = {
            openTextModal: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [UsageHintsComponent],
            providers: [{ provide: EditionModalService, useValue: mockEditionModalService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UsageHintsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        openUsageHintsSpy = vi.spyOn(component, 'openUsageHints');
        serviceOpenTextModalSpy = vi.spyOn(mockEditionModalService, 'openTextModal');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `snippetKey`', () => {
            expectToBe(isSignal(component.snippetKey), true);

            expect(() => component.snippetKey()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one button with type and label', () => {
                const buttonEl: HTMLButtonElement = getButtonDes()[0].nativeElement;

                expectToBe(buttonEl.type, 'button');
                expectToBe(buttonEl.textContent.trim(), 'Hinweise zur Nutzung');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('snippetKey', expectedSnippetKey);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `snippetKey` to hold the provided snippet key', () => {
            expectToBe(component.snippetKey(), expectedSnippetKey);
        });

        describe('VIEW', () => {
            it('... should trigger `openUsageHints` on click on the button', async () => {
                await clickAndAwaitChanges(getButtonDes()[0], fixture);

                expectSpyCall(openUsageHintsSpy, 1);
            });
        });

        describe('METHODS', () => {
            describe('#openUsageHints()', () => {
                it('... should have a method `openUsageHints`', () => {
                    expect(component.openUsageHints).toBeDefined();
                });

                it('... should trigger `openTextModal` of the EditionModalService with the snippet key', () => {
                    component.openUsageHints();

                    expectSpyCall(serviceOpenTextModalSpy, 1, expectedSnippetKey);
                });
            });
        });
    });
});
