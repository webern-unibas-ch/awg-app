import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { ModalService } from './modal.service';

describe('ModalService (DONE)', () => {
    let service: ModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ModalService],
        });
        // Inject services
        service = TestBed.inject(ModalService);
    });

    it('... should be created', () => {
        expect(service).toBeTruthy();
    });

    it('... should have signal `_selectedModalId` to hold null initially', () => {
        expectToBe(isSignal((service as any)._selectedModalId), true);

        expectToBe((service as any)._selectedModalId(), null);
    });

    it('... should have signal `selectedModalId` to hold null initially', () => {
        expectToBe(isSignal(service.selectedModalId), true);

        expectToBe(service.selectedModalId(), null);
    });

    describe('METHODS', () => {
        describe('#updateModalId()', () => {
            it('... should have a method `updateModalId`', () => {
                expect(service.updateModalId).toBeDefined();
            });

            it('... should set the `selectedModalId` signal to the given id', () => {
                const expectedId = 'snippet_123';

                service.updateModalId(expectedId);

                expectToBe(service.selectedModalId(), expectedId);
            });

            it('... should set the `_selectedModalId` signal to null if null is given', () => {
                service.updateModalId('snippet_abc');
                expectToBe(service.selectedModalId(), 'snippet_abc');

                service.updateModalId(null);

                expectToBe(service.selectedModalId(), null);
            });
        });
    });
});
