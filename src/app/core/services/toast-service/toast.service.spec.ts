import { TestBed } from '@angular/core/testing';
import { Component, TemplateRef, ViewChild } from '@angular/core';

import { Toast, ToastService } from './toast.service';

// Mock component to get templateRef
@Component({
    template: ` <ng-template #template><h1>Test template</h1></ng-template> `,
})
class MockTemplateComponent {
    @ViewChild('template', { static: true }) public template: TemplateRef<any>;
}

describe('ToastService (DONE)', () => {
    let toastService: ToastService;

    let expectedTextMessage1: string;
    let expectedTextMessage2: string;
    let expectedTplMessage: TemplateRef<any>;
    let expectedOptions: any = {};

    let expectedToast1: Toast;
    let expectedToast2: Toast;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToastService],
            declarations: [MockTemplateComponent],
        });

        // Inject service
        toastService = TestBed.inject(ToastService);

        // Test data
        expectedTextMessage1 = 'Test message 1';
        expectedTextMessage2 = 'Test message 2';
        expectedOptions = { header: 'Test error name', classname: 'bg-danger text-light', delay: 7000 };

        expectedToast1 = new Toast(expectedTextMessage1);
        expectedToast2 = new Toast(expectedTextMessage2, expectedOptions);
    });

    it('should be created', () => {
        expect(toastService).toBeTruthy();
    });

    it('should have empty toast array', () => {
        expect(toastService.toasts).toBeTruthy();
        expect(toastService.toasts).toEqual([], 'should equal empty array []');
    });

    describe('#add', () => {
        it('should add given string to toast array', () => {
            // Call service method
            toastService.add(expectedToast1);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).toBe(1, 'should have one entry');
            expect(toastService.toasts[0]).toEqual(expectedToast1, `should equal ${expectedToast1}`);
        });

        it('should add given template to toast array', () => {
            const fixture = TestBed.createComponent(MockTemplateComponent);
            const mockComponent = fixture.componentInstance;

            expectedTplMessage = mockComponent.template;
            const expectedTplToast = new Toast(expectedTplMessage);

            // Call service method
            toastService.add(expectedTplToast);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).toBe(1, 'should have one entry');
            expect(toastService.toasts[0]).toEqual(expectedTplToast, `should equal ${expectedTplToast}`);
        });

        it('should only add textOrTpl if options not given', () => {
            // Call service method
            toastService.add(expectedToast1);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).toBe(1, 'should have one entry');
            expect(toastService.toasts[0]).toEqual(expectedToast1, `should equal ${expectedToast1}`);
        });

        it('should add options if given with text message', () => {
            // Call service method
            toastService.add(expectedToast2);

            expect(toastService.toasts.length).toBe(1, 'should have one entry');
            expect(toastService.toasts[0]).toEqual(expectedToast2, `should equal ${expectedToast2}`);
        });

        it('should add options if given with template message', () => {
            const fixture = TestBed.createComponent(MockTemplateComponent);
            const mockComponent = fixture.componentInstance;

            expectedTplMessage = mockComponent.template;
            const expectedTplToast = new Toast(expectedTplMessage, expectedOptions);

            // Call service method
            toastService.add(expectedTplToast);

            expect(toastService.toasts.length).toBe(1, 'should have one entry');
            expect(toastService.toasts[0]).toEqual(expectedTplToast, `should equal ${expectedTplToast}`);
        });
    });

    describe('#remove', () => {
        beforeEach(() => {
            toastService.add(expectedToast1);
            toastService.add(expectedToast2);
        });

        it('should do nothing if toast does not exist', () => {
            const expectedOtherToast = new Toast('Test message 3');

            // Call service method
            toastService.remove(expectedOtherToast);

            expect(toastService.toasts.length).toBe(2, 'should have two entries');
            expect(toastService.toasts[0]).toEqual(expectedToast1, `should equal ${expectedToast1}`);
            expect(toastService.toasts[1]).toEqual(expectedToast2, `should equal ${expectedToast2}`);
        });

        it('should do nothing if options do not match', () => {
            const otherOptionsToast = new Toast(expectedTextMessage1, expectedOptions);
            // Call service method
            toastService.remove(otherOptionsToast);

            expect(toastService.toasts.length).toBe(2, 'should have two entries');
            expect(toastService.toasts[0]).toEqual(expectedToast1, `should equal ${expectedToast1}`);
            expect(toastService.toasts[1]).toEqual(expectedToast2, `should equal ${expectedToast2}`);
        });

        it('should remove existing toast from toast array (without options)', () => {
            // Call service method
            toastService.remove(expectedToast1);

            expect(toastService.toasts.length).toBe(1, 'should have one entry');
            expect(toastService.toasts[0]).not.toEqual(expectedToast1, `should not equal ${expectedToast1}`);
            expect(toastService.toasts[0]).toEqual(expectedToast2, `should equal ${expectedToast2}`);
        });

        it('should remove existing toast from toast array (with options)', () => {
            // Call service method
            toastService.remove(expectedToast2);

            expect(toastService.toasts.length).toBe(1, 'should have one entry');
            expect(toastService.toasts[0]).toEqual(expectedToast1, `should equal ${expectedToast1}`);
            expect(toastService.toasts[1]).not.toEqual(expectedToast2, `should not equal ${expectedToast2}`);
        });
    });
});
