import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS, EditionRouteConstant } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let editionComplexesService: EditionComplexesService;
    let editionStateService: EditionStateService;

    let updateEditionComplexFromRouteSpy: Spy;
    let complexesServiceGetEditionComplexByIdSpy: Spy;
    let stateServiceUpdateSelectedEditionComplexSpy: Spy;

    let expectedComplex: EditionComplex;
    let expectedComplexId: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    /**
     * Helper function: setComplexId.
     *
     * It sets the given complex id as input and triggers change detection.
     */
    const setComplexId = (complexId: string | null): void => {
        fixture.componentRef.setInput('complexId', complexId);
        fixture.detectChanges();
    };

    /**
     * Helper function: mockComplexOnce.
     *
     * It lets the next lookup of the given complex id resolve to the given complex.
     */
    const mockComplexOnce = (complexId: string, complex: EditionComplex): void => {
        complexesServiceGetEditionComplexByIdSpy.mockImplementationOnce((id: string) =>
            id.toLowerCase() === complexId.toLowerCase() ? complex : undefined
        );
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionComplexComponent, RouterOutlet],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        complexesServiceGetEditionComplexByIdSpy = vi
            .spyOn(editionComplexesService, 'getEditionComplexById')
            .mockImplementation((complexId: string) => {
                try {
                    return EditionStateHelper.getComplex(complexId);
                } catch {
                    return undefined;
                }
            });
        stateServiceUpdateSelectedEditionComplexSpy = vi.spyOn(editionStateService, 'updateSelectedEditionComplex');

        // Prototype spies (to catch calls in constructor)
        updateEditionComplexFromRouteSpy = vi.spyOn(EditionComplexComponent.prototype, 'updateEditionComplexFromRoute');

        // Test data
        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `complexId` to hold null initially', () => {
            expectToBe(isSignal(component.complexId), true);

            expectToBe(component.complexId(), null);
        });

        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have computed signal `_complexFromRoute` to hold null', () => {
            expectToBe(isSignal(component['_complexFromRoute']), true);

            expectToBe(component['_complexFromRoute'](), null);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have triggered method `updateEditionComplexFromRoute`', () => {
            expectSpyCall(updateEditionComplexFromRouteSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutlet, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs and trigger initial data binding
            setComplexId(expectedComplexId);
        });

        it('... should have input signal `complexId` to hold the provided id', () => {
            expectToBe(component.complexId(), expectedComplexId);
        });

        it('... should have computed signal `_complexFromRoute` to hold the expected complex', () => {
            expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 1, expectedComplexId);
            expectToEqual(component['_complexFromRoute'](), expectedComplex);
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });

        describe('... computed signal `_complexFromRoute`', () => {
            describe('... should hold null if', () => {
                it.each([
                    { desc: 'param `complexId` is missing', complexId: null, expectedLookupCalls: 0 },
                    { desc: 'param `complexId` is empty', complexId: '', expectedLookupCalls: 0 },
                    { desc: 'edition complex cannot be found', complexId: 'fail', expectedLookupCalls: 1 },
                ])('... $desc', ({ complexId, expectedLookupCalls }) => {
                    complexesServiceGetEditionComplexByIdSpy.mockClear();

                    setComplexId(complexId);

                    expectSpyCall(complexesServiceGetEditionComplexByIdSpy, expectedLookupCalls);
                    expectToBe(component['_complexFromRoute'](), null);
                });
            });

            describe('... should hold an edition complex with', () => {
                const defaultResp = { editors: [], lastModified: '---' };
                const defaultPub = { series: '1', section: '5' };

                it.each([
                    {
                        desc: 'opus number',
                        complexId: 'op100',
                        title: { title: 'Test Opus Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
                        resp: defaultResp,
                        pub: defaultPub,
                    },
                    {
                        desc: 'M number',
                        complexId: 'm100',
                        title: { title: 'Test M Complex', catalogueType: 'MNR', catalogueNumber: '100' },
                        resp: defaultResp,
                        pub: defaultPub,
                    },
                    {
                        desc: 'M* number',
                        complexId: 'mx100',
                        title: { title: 'Test M* Complex', catalogueType: 'MNR_X', catalogueNumber: '100' },
                        resp: defaultResp,
                        pub: defaultPub,
                    },
                    {
                        desc: 'unknown catalogue type',
                        complexId: 'bwv100',
                        title: { title: 'Test BWV Complex', catalogueType: 'BWV', catalogueNumber: '100' },
                        resp: defaultResp,
                        pub: defaultPub,
                    },
                    {
                        desc: 'missing resp statement',
                        complexId: 'op100',
                        title: { title: 'Test Missing Resp Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
                        resp: null as any,
                        pub: defaultPub,
                    },
                    {
                        desc: 'missing pub statement',
                        complexId: 'op100',
                        title: { title: 'Test Missing Pub Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
                        resp: defaultResp,
                        pub: null as any,
                    },
                ])('... $desc', ({ complexId, title, resp, pub }) => {
                    const complex = new EditionComplex(title, resp, pub);
                    mockComplexOnce(complexId, complex);

                    setComplexId(complexId);

                    expectToEqual(component['_complexFromRoute'](), complex);
                });
            });

            it('... should hold an edition complex with unknown catalogue type as empty route constant', () => {
                const unknownCatTypeComplex = new EditionComplex(
                    { title: 'Test BWV Complex', catalogueType: 'BWV', catalogueNumber: '100' },
                    { editors: [], lastModified: '---' },
                    { series: '1', section: '5' }
                );
                mockComplexOnce('bwv100', unknownCatTypeComplex);

                setComplexId('bwv100');

                expectToEqual(
                    component['_complexFromRoute']()?.titleStatement.catalogueType,
                    new EditionRouteConstant()
                );
            });

            it('... should hold an edition complex with editor $ref not found in PERSONS_DATA', () => {
                const unknownEditorComplex = new EditionComplex(
                    { title: 'Test Complex', catalogueType: 'OPUS', catalogueNumber: '12' },
                    { editors: [{ $ref: 'PERSON_UNKNOWN' }], lastModified: '2026-08-12' },
                    { series: '1', section: '5' }
                );
                mockComplexOnce('op100', unknownEditorComplex);

                setComplexId('op100');

                expectToEqual(component['_complexFromRoute']()?.respStatement?.editors, [
                    { name: 'PERSON_UNKNOWN', homepage: '', identifiers: {} },
                ]);
            });

            it('... should throw when instantiating an edition complex with missing title statement', () => {
                const createIncompleteComplex = () =>
                    new EditionComplex(
                        null as any,
                        { editors: [], lastModified: '---' },
                        { series: '1', section: '5' }
                    );

                expect(createIncompleteComplex).toThrow(
                    '[EditionComplexModel] Cannot instantiate complex: Missing catalogueType or catalogueNumber.'
                );
            });
        });

        describe('#updateEditionComplexFromRoute()', () => {
            it('... should have a method `updateEditionComplexFromRoute`', () => {
                expect(component.updateEditionComplexFromRoute).toBeDefined();
            });

            it('... should have updated selectedEditionComplex to hold the expected complex (via EditionStateService)', () => {
                expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 1, expectedComplex);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
            });

            it('... should have updated selectedEditionComplex to hold the new complex when complex id changes', () => {
                const newComplex = EditionStateHelper.getComplex('op25');
                stateServiceUpdateSelectedEditionComplexSpy.mockClear();

                setComplexId('op25');

                // 2 calls because of onCleanup
                expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 2, newComplex);
                expect(stateServiceUpdateSelectedEditionComplexSpy).toHaveBeenNthCalledWith(1, null);
                expectToEqual(editionStateService.selectedEditionComplex(), newComplex);
                expectToEqual(component.selectedEditionComplex(), newComplex);
            });

            it('... should have updated selectedEditionComplex to hold null if edition complex cannot be found', () => {
                stateServiceUpdateSelectedEditionComplexSpy.mockClear();

                setComplexId('fail');

                // 2 calls because of onCleanup
                expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 2, null);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
                expectToEqual(component.selectedEditionComplex(), null);
            });

            it('... should have updated selectedEditionComplex to hold null on cleanup', () => {
                stateServiceUpdateSelectedEditionComplexSpy.mockClear();

                fixture.destroy();

                expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 1, null);
                expectToEqual(editionStateService.selectedEditionComplex(), null);
            });
        });
    });
});
