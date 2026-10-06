import { Component, DebugElement, isSignal, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ToastComponent } from './toast.component';
import { Toast, ToastService } from './toast.service';

// Mock component to get a templateRef
@Component({
    template: `<ng-template #template><h1>Test template</h1></ng-template>`,
})
class MockTemplateComponent {
    readonly template = viewChild.required<TemplateRef<unknown>>('template');
}

describe('ToastComponent (DONE)', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let compDe: DebugElement;

    let toastService: ToastService;

    let onHiddenSpy: Spy;
    let serviceRemoveSpy: Spy;

    let expectedTextMessage: string;
    let expectedToast: Toast;

    /**
     * Helper function: createTemplateToast.
     *
     * It creates a toast with a template from the MockTemplateComponent.
     *
     * @returns {Toast} The created template toast.
     */
    const createTemplateToast = (): Toast => {
        const mockFixture = TestBed.createComponent(MockTemplateComponent);
        mockFixture.detectChanges();

        return new Toast(mockFixture.componentInstance.template());
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MockTemplateComponent, ToastComponent],
        }).compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        // Inject services
        toastService = TestBed.inject(ToastService);

        // Service spies
        serviceRemoveSpy = vi.spyOn(toastService, 'remove');

        // Test data
        expectedTextMessage = 'Test message 1';
        const expectedOptions = { header: 'Test error name', classname: 'bg-danger text-light', delay: 7000 };
        expectedToast = new Toast(expectedTextMessage, expectedOptions);

        // Create component fixture
        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        onHiddenSpy = vi.spyOn(component, 'onHidden');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `toasts` to hold an empty array', () => {
            expectToBe(isSignal(component.toasts), true);
            expectToEqual(component.toasts(), []);
        });

        describe('VIEW', () => {
            it('... should contain no ngb-toast component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbToast, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const getToastCmp = (): NgbToast => {
            const toastDes = getAndExpectDebugElementByDirective(compDe, NgbToast, 1, 1);

            return toastDes[0].injector.get(NgbToast);
        };

        beforeEach(() => {
            toastService.add(expectedToast);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `toasts` to hold the added toast', () => {
            expectToEqual(component.toasts(), [expectedToast]);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-toast component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbToast, 1, 1);
            });

            it('... should pass down header to ngb-toast component', () => {
                expectToBe(getToastCmp().header, expectedToast.options.header);
            });

            it('... should pass down autohide=true to ngb-toast component', () => {
                expectToBe(getToastCmp().autohide, true);
            });

            it('... should pass down delay to ngb-toast component', () => {
                expectToBe(getToastCmp().delay, expectedToast.options.delay);
            });

            it('... should pass down default delay (=5000) to ngb-toast component if no delay is given', async () => {
                toastService.remove(expectedToast);
                toastService.add(new Toast('Other message', { header: 'header', classname: 'bg-danger' }));
                await detectChangesOnPush(fixture);

                expectToBe(getToastCmp().delay, 5000);
            });

            it('... should set the given classname on ngb-toast', () => {
                const toastDes = getAndExpectDebugElementByCss(compDe, 'ngb-toast', 1, 1);
                const toastEl: HTMLElement = toastDes[0].nativeElement;

                expectToContain(toastEl.classList, 'bg-danger');
                expectToContain(toastEl.classList, 'text-light');
            });

            it('... should display the text of a text toast', () => {
                const bodyDes = getAndExpectDebugElementByCss(compDe, 'ngb-toast .toast-body', 1, 1);
                const bodyEl: HTMLDivElement = bodyDes[0].nativeElement;

                expectToBe(bodyEl.textContent.trim(), expectedTextMessage);
            });

            it('... should display the template of a template toast', async () => {
                toastService.remove(expectedToast);
                toastService.add(createTemplateToast());
                await detectChangesOnPush(fixture);

                const h1Des = getAndExpectDebugElementByCss(compDe, 'ngb-toast .toast-body h1', 1, 1);
                const h1El: HTMLHeadingElement = h1Des[0].nativeElement;

                expectToBe(h1El.textContent, 'Test template');
            });

            describe('... output `hidden`', () => {
                it('... should trigger `onHidden()` with the toast', () => {
                    getToastCmp().hidden.emit();

                    expectSpyCall(onHiddenSpy, 1, expectedToast);
                });

                it('... should remove the toast from signal `toasts` and the view', async () => {
                    getToastCmp().hidden.emit();
                    await detectChangesOnPush(fixture);

                    expectToEqual(component.toasts(), []);
                    getAndExpectDebugElementByDirective(compDe, NgbToast, 0, 0);
                });
            });
        });

        describe('METHODS', () => {
            describe('#isTemplate()', () => {
                it('... should have a method `isTemplate`', () => {
                    expect(component.isTemplate).toBeDefined();
                });

                it('... should be false if the given toast value is a string', () => {
                    expectToBe(component.isTemplate(expectedToast.textOrTpl), false);
                });

                it('... should be true if the given toast value is a template', () => {
                    expectToBe(component.isTemplate(createTemplateToast().textOrTpl), true);
                });
            });

            describe('#onHidden()', () => {
                it('... should have a method `onHidden`', () => {
                    expect(component.onHidden).toBeDefined();
                });

                it('... should remove the given toast via the ToastService', () => {
                    component.onHidden(expectedToast);

                    expectSpyCall(serviceRemoveSpy, 1, expectedToast);
                    expectToEqual(component.toasts(), []);
                });
            });
        });
    });
});
