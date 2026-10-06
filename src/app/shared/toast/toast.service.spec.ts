import { Component, isSignal, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { Toast, ToastService } from './toast.service';

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
});
