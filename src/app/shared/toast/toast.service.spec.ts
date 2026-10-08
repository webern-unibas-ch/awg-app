import { Component, isSignal, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';

import { Toast, ToastMessage, ToastService } from './toast.service';

// Mock component to get a templateRef
@Component({
    template: `<ng-template #template><h1>Test template</h1></ng-template>`,
})
class MockTemplateComponent {
    readonly template = viewChild.required<TemplateRef<unknown>>('template');
}

describe('ToastService (DONE)', () => {
    let toastService: ToastService;

    let expectedTextMessage1: string;
    let expectedTextMessage2: string;
    let expectedOptions: any = {};

    let expectedToast1: Toast;
    let expectedToast2: Toast;

    const getTemplate = (): TemplateRef<unknown> => {
        const fixture = TestBed.createComponent(MockTemplateComponent);
        fixture.detectChanges();

        return fixture.componentInstance.template();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MockTemplateComponent],
            providers: [ToastService],
        });

        // Inject services
        toastService = TestBed.inject(ToastService);

        // Test data
        expectedTextMessage1 = 'Test message 1';
        expectedTextMessage2 = 'Test message 2';
        expectedOptions = { header: 'Test error name', classname: 'bg-danger text-light', delay: 7000 };

        expectedToast1 = new Toast(expectedTextMessage1);
        expectedToast2 = new Toast(expectedTextMessage2, expectedOptions);
    });

    it('... should create', () => {
        expect(toastService).toBeTruthy();
    });

    it('... should have signal `toasts` to hold an empty array', () => {
        expectToBe(isSignal(toastService.toasts), true);
        expectToEqual(toastService.toasts(), []);
    });

    describe('#add()', () => {
        it('... should have a method `add`', () => {
            expect(toastService.add).toBeDefined();
        });

        it('... should add a given text toast without options', () => {
            toastService.add(expectedToast1);

            expectToEqual(toastService.toasts(), [expectedToast1]);
        });

        it('... should add a given text toast with options', () => {
            toastService.add(expectedToast2);

            expectToEqual(toastService.toasts(), [expectedToast2]);
        });

        it('... should add a given template toast without options', () => {
            const expectedTplToast = new Toast(getTemplate());

            toastService.add(expectedTplToast);

            expectToEqual(toastService.toasts(), [expectedTplToast]);
        });

        it('... should add a given template toast with options', () => {
            const expectedTplToast = new Toast(getTemplate(), expectedOptions);

            toastService.add(expectedTplToast);

            expectToEqual(toastService.toasts(), [expectedTplToast]);
        });

        it('... should append further toasts', () => {
            toastService.add(expectedToast1);
            toastService.add(expectedToast2);

            expectToEqual(toastService.toasts(), [expectedToast1, expectedToast2]);
        });
    });

    describe('#remove()', () => {
        beforeEach(() => {
            toastService.add(expectedToast1);
            toastService.add(expectedToast2);
        });

        it('... should have a method `remove`', () => {
            expect(toastService.remove).toBeDefined();
        });

        it('... should do nothing if toast does not exist', () => {
            toastService.remove(new Toast('Test message 3'));

            expectToEqual(toastService.toasts(), [expectedToast1, expectedToast2]);
        });

        it('... should do nothing if toast is only equal, but not identical', () => {
            toastService.remove(new Toast(expectedTextMessage1));

            expectToEqual(toastService.toasts(), [expectedToast1, expectedToast2]);
        });

        it('... should remove an existing toast (without options)', () => {
            toastService.remove(expectedToast1);

            expectToEqual(toastService.toasts(), [expectedToast2]);
        });

        it('... should remove an existing toast (with options)', () => {
            toastService.remove(expectedToast2);

            expectToEqual(toastService.toasts(), [expectedToast1]);
        });
    });

    describe('#showMessage()', () => {
        let addSpy: Spy;
        let consoleErrorSpy: Spy;
        let consoleInfoSpy: Spy;

        beforeEach(() => {
            addSpy = vi.spyOn(toastService, 'add');
            consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
            consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(mockConsole.log);
        });

        afterEach(() => {
            mockConsole.clear();
            vi.restoreAllMocks();
        });

        it('... should have a method `showMessage`', () => {
            expect(toastService.showMessage).toBeDefined();
        });

        it('... should do nothing if no toastMessage.message is provided', () => {
            toastService.showMessage(new ToastMessage('Error1', '', 500), 'error');

            expectSpyCall(addSpy, 0);
            expectSpyCall(consoleErrorSpy, 0);
            expectToEqual(toastService.toasts(), []);
        });

        it('... should use "info" as default type if not provided', () => {
            const toastMessage = new ToastMessage('DefaultInfo', 'Default info message', 2000);
            const expectedToast = new Toast(toastMessage.message, {
                header: toastMessage.name,
                classname: 'bg-info text-light',
                delay: toastMessage.duration,
            });

            toastService.showMessage(toastMessage);

            expectSpyCall(addSpy, 1, expectedToast);
            expectSpyCall(consoleInfoSpy, 1, ['DefaultInfo', ':', 'Default info message']);
        });

        describe('... on error message', () => {
            it('... should log the provided name and error message to console', () => {
                const toastMessage = new ToastMessage('Error1', 'error message', 500);

                toastService.showMessage(toastMessage, 'error');

                expectSpyCall(consoleErrorSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                expectSpyCall(consoleInfoSpy, 0);
            });

            it('... should add an error toast', () => {
                const toastMessage = new ToastMessage('Error1', 'error message', 500);
                const expectedToast = new Toast(toastMessage.message, {
                    header: toastMessage.name,
                    classname: 'bg-danger text-light',
                    delay: toastMessage.duration,
                });

                toastService.showMessage(toastMessage, 'error');

                expectSpyCall(addSpy, 1, expectedToast);
                expectToEqual(toastService.toasts(), [expectedToast]);
            });

            it('... should add an error toast with a delay of 3000 if no duration is given', () => {
                const toastMessage = new ToastMessage('Error1', 'error message');
                const expectedToast = new Toast(toastMessage.message, {
                    header: toastMessage.name,
                    classname: 'bg-danger text-light',
                    delay: 3000,
                });

                toastService.showMessage(toastMessage, 'error');

                expectToEqual(toastService.toasts(), [expectedToast]);
            });
        });

        describe('... on info message', () => {
            it('... should log the provided name and info message to console', () => {
                const toastMessage = new ToastMessage('Info1', 'info message', 500);

                toastService.showMessage(toastMessage, 'info');

                expectSpyCall(consoleInfoSpy, 1, [toastMessage.name, ':', toastMessage.message]);
                expectSpyCall(consoleErrorSpy, 0);
            });

            it('... should add an info toast', () => {
                const toastMessage = new ToastMessage('Info1', 'info message', 500);
                const expectedToast = new Toast(toastMessage.message, {
                    header: toastMessage.name,
                    classname: 'bg-info text-light',
                    delay: toastMessage.duration,
                });

                toastService.showMessage(toastMessage, 'info');

                expectSpyCall(addSpy, 1, expectedToast);
                expectToEqual(toastService.toasts(), [expectedToast]);
            });

            it('... should add an info toast with a delay of 3000 if no duration is given', () => {
                const toastMessage = new ToastMessage('Info1', 'info message');
                const expectedToast = new Toast(toastMessage.message, {
                    header: toastMessage.name,
                    classname: 'bg-info text-light',
                    delay: 3000,
                });

                toastService.showMessage(toastMessage, 'info');

                expectToEqual(toastService.toasts(), [expectedToast]);
            });
        });
    });
});
