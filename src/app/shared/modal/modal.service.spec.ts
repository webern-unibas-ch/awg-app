import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { ModalComponent } from './modal.component';
import { ModalData } from './modal.model';
import { ModalService } from './modal.service';

describe('ModalService (DONE)', () => {
    let service: ModalService;

    let mockModal: Partial<NgbModal>;
    let mockModalRef: Partial<NgbModalRef>;

    let openSpy: Spy;
    let openModalSpy: Spy;

    let expectedTextId: string;
    let expectedTextContent: string;
    let expectedTextModalData: ModalData;
    let expectedImageModalData: ModalData;

    let expectedImgId: string;
    let expectedImgSrc: string;

    beforeEach(() => {
        // Mock NgbModal and NgbModalRef
        mockModalRef = {
            componentInstance: {},
            result: new Promise(() => {}),
        };

        mockModal = {
            open: vi.fn().mockReturnValue(mockModalRef),
        };

        TestBed.configureTestingModule({
            providers: [ModalService, { provide: NgbModal, useValue: mockModal }],
        });

        // Inject services
        service = TestBed.inject(ModalService);

        // Spies
        openSpy = vi.spyOn(service, '_open' as any);
        openModalSpy = vi.spyOn(mockModal, 'open');

        // Test data
        expectedTextId = 'TEXT_ID';
        expectedTextContent = '<p>Test text content</p>';
        expectedTextModalData = {
            type: 'text',
            id: expectedTextId,
            title: 'Hinweis',
            content: expectedTextContent,
        };

        expectedImgId = 'snip-123';
        expectedImgSrc = 'assets/img/test.png';
        expectedImageModalData = {
            type: 'image',
            id: expectedImgId,
            title: `Abbildung: ${expectedImgId}`,
            content: expectedImgSrc,
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be created', () => {
        expect(service).toBeTruthy();
    });

    it('... should have signal `closeResult` to hold empty string initially', () => {
        expect(isSignal(service.closeResult)).toBe(true);

        expectToBe(service.closeResult(), '');
    });

    describe('METHODS', () => {
        describe('#openTextModal()', () => {
            it('... should have a method `openTextModal`', () => {
                expect(service.openTextModal).toBeDefined();
            });

            it('... should prepare correct ModalData with the given id and content and trigger `_open`', () => {
                service.openTextModal(expectedTextId, expectedTextContent);

                expectSpyCall(openSpy, 1, [expectedTextModalData]);
            });
        });

        describe('#openImageModal()', () => {
            it('... should have a method `openImageModal`', () => {
                expect(service.openImageModal).toBeDefined();
            });

            it('... should prepare correct ModalData for images and call `_open`', () => {
                service.openImageModal(expectedImgId, expectedImgSrc);

                expectSpyCall(openSpy, 1, [expectedImageModalData]);
            });
        });

        describe('#_open()', () => {
            it('... should have a method `_open`', () => {
                expect(service['_open']).toBeDefined();
            });

            const modalCases = [{ type: 'text' }, { type: 'image' }];

            describe('... should open the ModalComponent via NgbModal for', () => {
                it.each(modalCases)('...  $type modal', ({ type }) => {
                    const expectedData = type === 'text' ? expectedTextModalData : expectedImageModalData;

                    service['_open'](expectedData);

                    expectSpyCall(openModalSpy, 1, [
                        ModalComponent,
                        {
                            size: 'xl',
                            centered: true,
                            ariaLabelledBy: 'awg-modal',
                        },
                    ]);
                });
            });

            describe('... should pass modalData to componentInstance for', () => {
                it.each(modalCases)('... $type modal', ({ type }) => {
                    const expectedData = type === 'text' ? expectedTextModalData : expectedImageModalData;

                    service['_open'](expectedData);

                    expectToEqual(mockModalRef.componentInstance.modalData, expectedData);
                });
            });

            it('... should set signal `closeResult` when modal is closed successfully', async () => {
                mockModalRef.result = Promise.resolve('Save click');

                service.openTextModal(expectedTextId, expectedTextContent);

                await new Promise(process.nextTick);

                expectToBe(service.closeResult(), 'Closed with: Save click');
            });
        });

        describe('#_getDismissReason()', () => {
            it('... should have a method `_getDismissReason`', () => {
                expect(service['_getDismissReason']).toBeDefined();
            });

            it.each([
                { reason: ModalDismissReasons.ESC, expected: 'by pressing ESC' },
                { reason: ModalDismissReasons.BACKDROP_CLICK, expected: 'by clicking on a backdrop' },
                { reason: 'any other reason', expected: 'with: any other reason' },
            ])('... should return "$expected" when reason is $reason', async ({ reason, expected }) => {
                mockModalRef.result = Promise.reject(reason);

                service.openTextModal(expectedTextId, expectedTextContent);

                await new Promise(process.nextTick);

                expectToBe(service.closeResult(), `Dismissed ${expected}`);
            });
        });
    });
});
