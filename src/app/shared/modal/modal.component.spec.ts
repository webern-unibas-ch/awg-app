import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { ModalComponent } from './modal.component';
import { ModalData } from './modal.model';

describe('ModalComponent (DONE)', () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockActiveModal: Partial<NgbActiveModal>;

    let modalCloseSpy: Spy;
    let modalDismissSpy: Spy;

    let expectedTextData: ModalData;
    let expectedImageData: ModalData;

    beforeEach(async () => {
        mockActiveModal = {
            close: vi.fn(),
            dismiss: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [ModalComponent],
            providers: [
                {
                    provide: NgbActiveModal,
                    useValue: mockActiveModal,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);
        mockActiveModal = TestBed.inject(NgbActiveModal);

        // Spies
        modalCloseSpy = vi.spyOn(mockActiveModal, 'close');
        modalDismissSpy = vi.spyOn(mockActiveModal, 'dismiss');

        // Test data
        expectedTextData = {
            type: 'text',
            id: 'TEST_KEY',
            title: 'Test title',
            content: '<p>Test content HTML</p>',
        };

        expectedImageData = {
            type: 'image',
            id: 'TEST_IMG',
            title: 'Abbildung: TEST_IMG',
            content: 'assets/img/test.png',
        };

        // Create component fixture
        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.debugElement.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `modalData`', () => {
            expect(component.modalData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should have no div.modal-header', () => {
                getAndExpectDebugElementByCss(compDe, 'div.modal-header', 0, 0);
            });

            it('... should have no div.modal-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.modal-body', 0, 0);
            });

            it('... should have no div.modal-footer', () => {
                getAndExpectDebugElementByCss(compDe, 'div.modal-footer', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('modalData', expectedTextData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `modalData`', () => {
            expectToBe(component.modalData, expectedTextData);
        });

        describe('VIEW', () => {
            it('... should have one div.modal-header', () => {
                getAndExpectDebugElementByCss(compDe, 'div.modal-header', 1, 1);
            });

            it('... should have h5.modal-title in div.modal-header', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.modal-header', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'h5.modal-title', 1, 1);
            });

            it('... should have dismiss button without label in div.modal-header', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.modal-header', 1, 1);
                const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn-close', 1, 1);
                const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                expectToBe(btnEl.textContent, '');
                expectToBe(btnEl.getAttribute('aria-label'), 'Close modal');
            });

            it('... should call activeModal.dismiss when clicking the header dismiss button', async () => {
                const dismissBtnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.modal-header > button.btn-close',
                    1,
                    1
                );
                await clickAndAwaitChanges(dismissBtnDes[0], fixture);

                expectSpyCall(modalDismissSpy, 1);
            });

            it('... should have one div.modal-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.modal-body', 1, 1);
            });

            it('... should have one div.modal-footer', () => {
                getAndExpectDebugElementByCss(compDe, 'div.modal-footer', 1, 1);
            });

            it('... should have one close button.awg-modal-button in div.modal-footer', () => {
                const footerDes = getAndExpectDebugElementByCss(compDe, 'div.modal-footer', 1, 1);
                getAndExpectDebugElementByCss(footerDes[0], 'button.awg-modal-button', 1, 1);
            });

            it('... should render the modal close label in footer', () => {
                const closeBtnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.modal-footer > button.awg-modal-button',
                    1,
                    1
                );
                const closeBtnEl: HTMLButtonElement = closeBtnDes[0].nativeElement;

                expectToBe(closeBtnEl.textContent.trim(), 'Schließen');
            });

            it('... should call activeModal.close when clicking the footer close button', async () => {
                const closeBtnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.modal-footer > button.awg-modal-button',
                    1,
                    1
                );
                await clickAndAwaitChanges(closeBtnDes[0], fixture);

                expectSpyCall(modalCloseSpy, 1);
            });

            describe('with text content', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('modalData', expectedTextData);

                    fixture.detectChanges();
                });

                it('... should render the modal title label', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.modal-header', 1, 1);
                    const hDes = getAndExpectDebugElementByCss(divDes[0], 'h5.modal-title', 1, 1); // H5 an dein neues Template angepasst
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    expectToBe(hEl.textContent.trim(), expectedTextData.title);
                });

                it('... should render the modal content in div.modal-body', () => {
                    const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.modal-body', 1, 1);
                    const innerDivDes = getAndExpectDebugElementByCss(bodyDes[0], 'div.text-start', 1, 1);
                    const innerDivEl: HTMLDivElement = innerDivDes[0].nativeElement;

                    const htmlSnippet = mockDocument.createElement('p');
                    htmlSnippet.innerHTML = expectedTextData.content;

                    expectToBe(innerDivEl.textContent.trim(), htmlSnippet.textContent.trim());
                });

                it('... should not render an image tag when type is text', () => {
                    const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.modal-body', 1, 1);

                    getAndExpectDebugElementByCss(bodyDes[0], 'img.img-fluid', 0, 0);
                });
            });

            describe('with image content', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('modalData', expectedImageData);

                    fixture.detectChanges();
                });

                it('... should render the dynamic image title label', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.modal-header', 1, 1);
                    const hDes = getAndExpectDebugElementByCss(divDes[0], 'h5.modal-title', 1, 1);
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    expectToBe(hEl.textContent.trim(), expectedImageData.title);
                });

                it('... should render the image tag with correct src and alt attributes', () => {
                    const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.modal-body', 1, 1);
                    const imgDes = getAndExpectDebugElementByCss(bodyDes[0], 'img.img-fluid', 1, 1);
                    const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                    expectToBe(imgEl.getAttribute('src'), expectedImageData.content);
                    expectToBe(imgEl.getAttribute('alt'), expectedImageData.title);
                });

                it('... should not render the text container when type is image', () => {
                    const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.modal-body', 1, 1);

                    getAndExpectDebugElementByCss(bodyDes[0], 'div.text-start', 0, 0);
                });
            });
        });
    });
});
