import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { Toast, ToastService } from '@awg-core/services/toast-service';
import { ToastComponent } from './toast.component';

// Mock component to get templateRef
@Component({
    template: ` <ng-template #template><h1>Test template</h1></ng-template> `,
})
class MockTemplateComponent {
    @ViewChild('template', { static: true }) public template: TemplateRef<any>;
}

// Mock ngb-toast component
@Component({ selector: 'ngb-toast', template: '' })
class NgbToastStubComponent {
    @Input()
    header: string;
    @Input()
    class: string;
    @Input()
    autohide: string;
    @Input()
    delay: string;
    @Output()
    hide: EventEmitter<Toast> = new EventEmitter();
}

describe('ToastComponent (DONE)', () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let compDe: DebugElement;

    let toastService: ToastService;

    let expectedToast: Toast;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ToastComponent, MockTemplateComponent, NgbToastStubComponent],
            providers: [ToastService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToastComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject service from root
        toastService = TestBed.inject(ToastService);

        // Test data
        const expectedTextMessage = 'Test message 1';
        const expectedOptions = { header: 'Test error name', classname: 'bg-danger text-light', delay: 7000 };
        expectedToast = new Toast(expectedTextMessage, expectedOptions);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should not contain any ngb-toast component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            toastService.add(expectedToast);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have added one toast to toast service', () => {
            expect(toastService.toasts).toBeDefined('should be defined');
            expect(toastService.toasts.length).toBe(1, `should be 1`);
            expect(toastService.toasts[0]).toEqual(expectedToast, `should equal ${expectedToast}`);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-toast component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 1, 1);
            });

            it('... should pass down header to ngb-toast component (stubbed) if given', () => {
                const toastDes = getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 1, 1);
                const toastCmp = toastDes[0].injector.get(NgbToastStubComponent) as NgbToastStubComponent;

                expect(toastCmp.header).toBeDefined('should be defined');
                expect(toastCmp.header).toBe(expectedToast.options.header, `should be ${expectedToast.options.header}`);
            });

            it('... should pass down classname to ngb-toast component (stubbed) if given', () => {
                const toastDes = getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 1, 1);
                const toastCmp = toastDes[0].injector.get(NgbToastStubComponent) as NgbToastStubComponent;

                expect(toastCmp.class).toBeDefined('should be defined');
                expect(toastCmp.class).toBe(
                    expectedToast.options.classname,
                    `should be ${expectedToast.options.classname}`
                );
            });

            it('... should pass down autohide=true to ngb-toast component (stubbed)', () => {
                const toastDes = getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 1, 1);
                const toastCmp = toastDes[0].injector.get(NgbToastStubComponent) as NgbToastStubComponent;

                expect(toastCmp.autohide).toBeDefined('should be defined');
                expect(toastCmp.autohide).toBeTrue();
            });

            it('... should pass down delay to ngb-toast component (stubbed)', () => {
                const toastDes = getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 1, 1);
                const toastCmp = toastDes[0].injector.get(NgbToastStubComponent) as NgbToastStubComponent;

                expect(toastCmp.delay).toBeDefined('should be defined');
                expect(toastCmp.delay).toBe(expectedToast.options.delay, `should be ${expectedToast.options.delay}`);
            });

            it('... should pass down default delay (=5000) to ngb-toast component (stubbed) if no delay is given', () => {
                toastService.remove(expectedToast);
                const otherToast = new Toast('Other message', { header: 'header', className: 'bg-danger' });
                toastService.add(otherToast);

                // Apply changes
                fixture.detectChanges();

                const toastDes = getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 1, 1);
                const toastCmp = toastDes[0].injector.get(NgbToastStubComponent) as NgbToastStubComponent;

                expect(toastCmp.delay).toBeDefined('should be defined');
                expect<any>(toastCmp.delay).toBe(5000, `should be 5000`);
            });

            it('... should remove toast from service on hide', () => {
                const toastDes = getAndExpectDebugElementByDirective(compDe, NgbToastStubComponent, 1, 1);
                const toastCmp = toastDes[0].injector.get(NgbToastStubComponent) as NgbToastStubComponent;

                toastCmp.hide.emit();

                expect(toastService.toasts).toBeDefined('should be defined');
                expect(toastService.toasts.length).toBe(0, `should be 0`);
            });
        });

        describe('#isTemplate', () => {
            it('... should return false if given toast is not a template, but string', () => {
                const check = component.isTemplate(expectedToast);

                expect(check).toBeFalse();
            });

            it('... should return true if given toast is a template', () => {
                const mockFixture = TestBed.createComponent(MockTemplateComponent);
                const mockComponent = mockFixture.componentInstance;
                const expectedTplMessage = mockComponent.template;
                const expectedTplToast = new Toast(expectedTplMessage);

                const check = component.isTemplate(expectedTplToast);

                expect(check).toBeTrue();
            });
        });
    });
});
