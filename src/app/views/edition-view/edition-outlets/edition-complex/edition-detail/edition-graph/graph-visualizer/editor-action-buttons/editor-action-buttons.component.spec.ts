import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditorActionButtonsComponent } from './editor-action-buttons.component';

describe('EditorActionButtonsComponent (DONE)', () => {
    let component: EditorActionButtonsComponent;
    let fixture: ComponentFixture<EditorActionButtonsComponent>;
    let compDe: DebugElement;

    let emitQueryRequestSpy: Spy;
    let emitResetRequestSpy: Spy;
    let emitClearRequestSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorActionButtonsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorActionButtonsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        emitQueryRequestSpy = vi.spyOn(component.queryRequest, 'emit');
        emitResetRequestSpy = vi.spyOn(component.resetRequest, 'emit');
        emitClearRequestSpy = vi.spyOn(component.clearRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have output `queryRequest`', () => {
            expect(component.queryRequest).toBeDefined();
        });

        it('... should have output `resetRequest`', () => {
            expect(component.resetRequest).toBeDefined();
        });

        it('... should have output `clearRequest`', () => {
            expect(component.clearRequest).toBeDefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-graph-visualizer-editor-action-buttons with 3 buttons', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-editor-action-buttons',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDes[0], 'button.btn', 3, 3);
            });

            it.each([
                { index: 0, label: 'Query', cssClass: 'btn-outline-info' },
                { index: 1, label: 'Reset', cssClass: 'btn-warning' },
                { index: 2, label: 'Clear', cssClass: 'btn-danger' },
            ])('... should display the $label button with class $cssClass', ({ index, label, cssClass }) => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-graph-visualizer-editor-action-buttons > button.btn',
                    3,
                    3
                );
                const btnEl: HTMLButtonElement = btnDes[index].nativeElement;

                expectToBe(btnEl.textContent, label);
                expectToContain(btnEl.classList, cssClass);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        let btnDes: DebugElement[];

        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();

            btnDes = getAndExpectDebugElementByCss(
                compDe,
                'div.awg-graph-visualizer-editor-action-buttons > button.btn',
                3,
                3
            );
        });

        describe('VIEW', () => {
            it('... should emit only `queryRequest` on click of the Query button', async () => {
                await clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(emitQueryRequestSpy, 1);
                expectSpyCall(emitResetRequestSpy, 0);
                expectSpyCall(emitClearRequestSpy, 0);
            });

            it('... should emit only `resetRequest` on click of the Reset button', async () => {
                await clickAndAwaitChanges(btnDes[1], fixture);

                expectSpyCall(emitQueryRequestSpy, 0);
                expectSpyCall(emitResetRequestSpy, 1);
                expectSpyCall(emitClearRequestSpy, 0);
            });

            it('... should emit only `clearRequest` on click of the Clear button', async () => {
                await clickAndAwaitChanges(btnDes[2], fixture);

                expectSpyCall(emitQueryRequestSpy, 0);
                expectSpyCall(emitResetRequestSpy, 0);
                expectSpyCall(emitClearRequestSpy, 1);
            });
        });
    });
});
