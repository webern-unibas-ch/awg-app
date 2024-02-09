import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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

    it('... should create', () => {
        expect(toastService).toBeTruthy();
    });

    it('... should have empty toast array', () => {
        expect(toastService.toasts).toBeTruthy();
        expect(toastService.toasts).withContext('should equal empty array []').toEqual([]);
    });

    describe('#add()', () => {
        it('... should have a method `add`', () => {
            expect(toastService.add).toBeDefined();
        });

        it('... should add given string to toast array', () => {
            // Call service method
            toastService.add(expectedToast1);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have one entry').toBe(1);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedToast1}`).toEqual(expectedToast1);
        });

        it('... should add given template to toast array', () => {
            const fixture = TestBed.createComponent(MockTemplateComponent);
            const mockComponent = fixture.componentInstance;

            expectedTplMessage = mockComponent.template;
            const expectedTplToast = new Toast(expectedTplMessage);

            // Call service method
            toastService.add(expectedTplToast);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have one entry').toBe(1);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedTplToast}`).toEqual(expectedTplToast);
        });

        it('... should only add textOrTpl if options not given', () => {
            // Call service method
            toastService.add(expectedToast1);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have one entry').toBe(1);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedToast1}`).toEqual(expectedToast1);
        });

        it('... should add options if given with text message', () => {
            // Call service method
            toastService.add(expectedToast2);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have one entry').toBe(1);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedToast2}`).toEqual(expectedToast2);
        });

        it('... should add options if given with template message', () => {
            const fixture = TestBed.createComponent(MockTemplateComponent);
            const mockComponent = fixture.componentInstance;

            expectedTplMessage = mockComponent.template;
            const expectedTplToast = new Toast(expectedTplMessage, expectedOptions);

            // Call service method
            toastService.add(expectedTplToast);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have one entry').toBe(1);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedTplToast}`).toEqual(expectedTplToast);
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
            const expectedOtherToast = new Toast('Test message 3');

            // Call service method
            toastService.remove(expectedOtherToast);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have two entries').toBe(2);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedToast1}`).toEqual(expectedToast1);
            expect(toastService.toasts[1]).withContext(`should equal ${expectedToast2}`).toEqual(expectedToast2);
        });

        it('... should do nothing if options do not match', () => {
            const otherOptionsToast = new Toast(expectedTextMessage1, expectedOptions);
            // Call service method
            toastService.remove(otherOptionsToast);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have two entries').toBe(2);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedToast1}`).toEqual(expectedToast1);
            expect(toastService.toasts[1]).withContext(`should equal ${expectedToast2}`).toEqual(expectedToast2);
        });

        it('... should remove existing toast from toast array (without options)', () => {
            // Call service method
            toastService.remove(expectedToast1);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have one entry').toBe(1);
            expect(toastService.toasts[0])
                .withContext(`should not equal ${expectedToast1}`)
                .not.toEqual(expectedToast1);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedToast2}`).toEqual(expectedToast2);
        });

        it('... should remove existing toast from toast array (with options)', () => {
            // Call service method
            toastService.remove(expectedToast2);

            expect(toastService.toasts).toBeTruthy();
            expect(toastService.toasts.length).withContext('should have one entry').toBe(1);
            expect(toastService.toasts[0]).withContext(`should equal ${expectedToast1}`).toEqual(expectedToast1);
            expect(toastService.toasts[1])
                .withContext(`should not equal ${expectedToast2}`)
                .not.toEqual(expectedToast2);
        });
    });
});
