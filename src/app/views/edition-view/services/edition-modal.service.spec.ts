import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data/mockEditionData';

import { ModalService } from '@awg-shared/modal/modal.service';

import { EDITION_MODAL_SNIPPETS } from '../data/edition-modal-snippets.data';
import { EditionModalService } from './edition-modal.service';

describe('EditionModalService (DONE)', () => {
    let service: EditionModalService;

    let mockModalService: Partial<ModalService>;
    let modalServiceOpenImageModalSpy: Spy;
    let modalServiceOpenTextModalSpy: Spy;

    let expectedSnippetKey: string;

    beforeEach(() => {
        mockModalService = {
            openTextModal: vi.fn(),
            openImageModal: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [EditionModalService, { provide: ModalService, useValue: mockModalService }],
        });

        // Inject services
        service = TestBed.inject(EditionModalService);

        // Spies
        modalServiceOpenImageModalSpy = vi.spyOn(mockModalService, 'openImageModal');
        modalServiceOpenTextModalSpy = vi.spyOn(mockModalService, 'openTextModal');

        // Test data
        expectedSnippetKey = structuredClone(mockEditionData.mockModalSnippet);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('METHODS', () => {
        describe('#openTextModal()', () => {
            it('... should have a method `openTextModal`', () => {
                expect(service.openTextModal).toBeDefined();
            });

            it('... should trigger `ModalService.openTextModal` with the snippet key and its text', () => {
                service.openTextModal(expectedSnippetKey);

                expectSpyCall(modalServiceOpenTextModalSpy, 1, [
                    expectedSnippetKey,
                    EDITION_MODAL_SNIPPETS[expectedSnippetKey as keyof typeof EDITION_MODAL_SNIPPETS],
                ]);
            });

            describe('... should trigger `ModalService.openTextModal` with the default snippet', () => {
                it.each([
                    { desc: 'undefined', snippetKey: undefined },
                    { desc: 'null', snippetKey: null },
                    { desc: 'empty', snippetKey: '' },
                ])('... if snippet key is $desc', ({ snippetKey }) => {
                    service.openTextModal(snippetKey);

                    expectSpyCall(modalServiceOpenTextModalSpy, 1, [
                        'CONTENTS_NOT_AVAILABLE',
                        EDITION_MODAL_SNIPPETS.CONTENTS_NOT_AVAILABLE,
                    ]);
                });
            });

            describe('... should trigger `ModalService.openTextModal` with empty content', () => {
                it.each([
                    { desc: 'unknown', snippetKey: 'NON_EXISTING_KEY' },
                    { desc: 'a prototype property', snippetKey: 'toString' },
                ])('... if snippet key is $desc', ({ snippetKey }) => {
                    service.openTextModal(snippetKey);

                    expectSpyCall(modalServiceOpenTextModalSpy, 1, [snippetKey, '']);
                });
            });
        });

        describe('#openImageModal()', () => {
            it('... should have a method `openImageModal`', () => {
                expect(service.openImageModal).toBeDefined();
            });

            it('... should trigger `ModalService.openImageModal` with the given image id and source', () => {
                const expectedImgId = 'snip-123';
                const expectedImgSrc = 'assets/img/test.png';

                service.openImageModal(expectedImgId, expectedImgSrc);

                expectSpyCall(modalServiceOpenImageModalSpy, 1, [expectedImgId, expectedImgSrc]);
            });
        });
    });
});
