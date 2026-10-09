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
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionComplexComponent } from './edition-complex.component';

describe('EditionComplexComponent (DONE)', () => {
    let component: EditionComplexComponent;
    let fixture: ComponentFixture<EditionComplexComponent>;
    let compDe: DebugElement;

    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let updateEditionComplexFromRouteSpy: Spy;
    let complexesServiceGetEditionComplexByIdSpy: Spy;
    let outlineServiceGetEditionSectionByIdSpy: Spy;
    let outlineServiceGetEditionSeriesByIdSpy: Spy;
    let stateServiceUpdateSelectedEditionComplexSpy: Spy;
    let stateServiceUpdateSelectedEditionSeriesSpy: Spy;
    let stateServiceUpdateSelectedEditionSectionSpy: Spy;

    let expectedComplex: EditionComplex;
    let expectedComplexId: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

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
        editionOutlineService = TestBed.inject(EditionOutlineService);
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
        outlineServiceGetEditionSeriesByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSeriesById')
            .mockImplementation((seriesId: string) => {
                try {
                    return EditionStateHelper.getSeries(seriesId);
                } catch {
                    return undefined;
                }
            });
        outlineServiceGetEditionSectionByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSectionById')
            .mockImplementation((seriesId: string, sectionId: string) => {
                try {
                    return EditionStateHelper.getSection(seriesId, sectionId);
                } catch {
                    return undefined;
                }
            });
        stateServiceUpdateSelectedEditionComplexSpy = vi.spyOn(editionStateService, 'updateSelectedEditionComplex');
        stateServiceUpdateSelectedEditionSectionSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSection');
        stateServiceUpdateSelectedEditionSeriesSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSeries');

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
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('complexId', expectedComplexId);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `complexId` to hold the provided id', () => {
            expectToBe(component.complexId(), expectedComplexId);
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });

        describe('#updateEditionComplexFromRoute()', () => {
            it('... should have a method `updateEditionComplexFromRoute`', () => {
                expect(component.updateEditionComplexFromRoute).toBeDefined();
            });

            it('... should have triggered `EditionComplexesService.getEditionComplexById` with the provided id', () => {
                expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 1, expectedComplexId);
            });

            it('... should have triggered `EditionOutlineService.getEditionSeriesById`', () => {
                expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 1, expectedComplex.pubStatement.series.route);
            });

            it('... should have triggered `EditionOutlineService.getEditionSectionById`', () => {
                expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 1, [
                    expectedComplex.pubStatement.series.route,
                    expectedComplex.pubStatement.section.route,
                ]);
            });

            it('... should have updated selectedEditionSeries (via EditionStateService; 1x per series)', () => {
                const series = EditionStateHelper.getSeries(expectedComplex.pubStatement.series.route);

                expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, series);
                expectToEqual(editionStateService.selectedEditionSeries(), series);
            });

            it('... should have updated selectedEditionSection (via EditionStateService; 2x per section)', () => {
                const section = EditionStateHelper.getSection(
                    expectedComplex.pubStatement.series.route,
                    expectedComplex.pubStatement.section.route
                );

                expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, section);
                expectToEqual(editionStateService.selectedEditionSection(), section);
            });

            it('... should have updated selectedEditionComplex (via EditionStateService; 3x per complex)', () => {
                expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, expectedComplex);
                expectToEqual(editionStateService.selectedEditionComplex(), expectedComplex);
            });

            it('... should have signal `selectedEditionComplex` to hold the new complex when complex id changes', () => {
                const newComplexId = 'op25';
                const newComplex = EditionStateHelper.getComplex(newComplexId);

                fixture.componentRef.setInput('complexId', newComplexId);
                fixture.detectChanges();

                expectSpyCall(updateEditionComplexFromRouteSpy, 1);
                expectToEqual(editionStateService.selectedEditionComplex(), newComplex);
                expectToEqual(component.selectedEditionComplex(), newComplex);
            });

            describe('... with a found edition complex of special shape', () => {
                it('... should hold an edition complex with opus number', () => {
                    const opusComplex = new EditionComplex(
                        { title: 'Test Opus Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
                        { editors: [], lastModified: '---' },
                        { series: '1', section: '5' }
                    );
                    mockComplexOnce('op100', opusComplex);

                    fixture.componentRef.setInput('complexId', 'op100');
                    fixture.detectChanges();

                    expectToEqual(editionStateService.selectedEditionComplex(), opusComplex);
                    expectToEqual(component.selectedEditionComplex(), opusComplex);
                });

                it('... should hold an edition complex with M number', () => {
                    const mnrComplex = new EditionComplex(
                        { title: 'Test M Complex', catalogueType: 'MNR', catalogueNumber: '100' },
                        { editors: [], lastModified: '---' },
                        { series: '1', section: '5' }
                    );
                    mockComplexOnce('m100', mnrComplex);

                    fixture.componentRef.setInput('complexId', 'm100');
                    fixture.detectChanges();

                    expectToEqual(editionStateService.selectedEditionComplex(), mnrComplex);
                    expectToEqual(component.selectedEditionComplex(), mnrComplex);
                });

                it('... should hold an edition complex with M* number', () => {
                    const mnrXComplex = new EditionComplex(
                        { title: 'Test M* Complex', catalogueType: 'MNR_X', catalogueNumber: '100' },
                        { editors: [], lastModified: '---' },
                        { series: '1', section: '5' }
                    );
                    mockComplexOnce('mx100', mnrXComplex);

                    fixture.componentRef.setInput('complexId', 'mx100');
                    fixture.detectChanges();

                    expectToEqual(editionStateService.selectedEditionComplex(), mnrXComplex);
                    expectToEqual(component.selectedEditionComplex(), mnrXComplex);
                });

                it('... should hold an edition complex with unknown catalogue type', () => {
                    const unknownCatTypeComplex = new EditionComplex(
                        { title: 'Test BWV Complex', catalogueType: 'BWV', catalogueNumber: '100' },
                        { editors: [], lastModified: '---' },
                        { series: '1', section: '5' }
                    );
                    mockComplexOnce('bwv100', unknownCatTypeComplex);

                    fixture.componentRef.setInput('complexId', 'bwv100');
                    fixture.detectChanges();

                    expectToEqual(editionStateService.selectedEditionComplex(), unknownCatTypeComplex);
                    expectToEqual(component.selectedEditionComplex(), unknownCatTypeComplex);
                    expectToEqual(
                        component.selectedEditionComplex()?.titleStatement.catalogueType,
                        new EditionRouteConstant()
                    );
                });

                it('... should hold an edition complex with missing resp statement', () => {
                    const missingRespComplex = new EditionComplex(
                        { title: 'Test Missing Resp Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
                        null as any,
                        { series: '1', section: '5' }
                    );
                    mockComplexOnce('op100', missingRespComplex);

                    fixture.componentRef.setInput('complexId', 'op100');
                    fixture.detectChanges();

                    expectToEqual(editionStateService.selectedEditionComplex(), missingRespComplex);
                    expectToEqual(component.selectedEditionComplex(), missingRespComplex);
                });

                it('... should hold an edition complex with missing pub statement (and series and section to hold null)', () => {
                    const missingPubComplex = new EditionComplex(
                        { title: 'Test Missing Pub Complex', catalogueType: 'OPUS', catalogueNumber: '100' },
                        { editors: [], lastModified: '---' },
                        null as any
                    );
                    mockComplexOnce('op100', missingPubComplex);

                    fixture.componentRef.setInput('complexId', 'op100');
                    fixture.detectChanges();

                    expectToEqual(editionStateService.selectedEditionSeries(), null);
                    expectToEqual(editionStateService.selectedEditionSection(), null);
                    expectToEqual(editionStateService.selectedEditionComplex(), missingPubComplex);
                    expectToEqual(component.selectedEditionComplex(), missingPubComplex);
                });

                it('... should hold an edition complex with editor $ref not found in PERSONS_DATA', () => {
                    const unknownEditorComplex = new EditionComplex(
                        { title: 'Test Complex', catalogueType: 'OPUS', catalogueNumber: '12' },
                        { editors: [{ $ref: 'PERSON_UNKNOWN' }], lastModified: '2026-08-12' },
                        { series: '1', section: '5' }
                    );
                    mockComplexOnce('op100', unknownEditorComplex);

                    fixture.componentRef.setInput('complexId', 'op100');
                    fixture.detectChanges();

                    expectToEqual(editionStateService.selectedEditionComplex(), unknownEditorComplex);
                    expectToEqual(component.selectedEditionComplex()?.respStatement?.editors, [
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

            describe('... if edition complex is found but series or section are missing', () => {
                beforeEach(() => {
                    // Reset to a state without complex, so that the next id triggers a fresh run without cleanup
                    fixture.componentRef.setInput('complexId', null);
                    fixture.detectChanges();

                    stateServiceUpdateSelectedEditionSeriesSpy.mockClear();
                    stateServiceUpdateSelectedEditionSectionSpy.mockClear();
                    stateServiceUpdateSelectedEditionComplexSpy.mockClear();
                });

                it('... should have updated selectedEditionSeries to hold null if series is missing (undefined)', () => {
                    const expectedSection = EditionStateHelper.getSection(
                        expectedComplex.pubStatement.series.route,
                        expectedComplex.pubStatement.section.route
                    );
                    outlineServiceGetEditionSeriesByIdSpy.mockReturnValue(undefined);
                    outlineServiceGetEditionSectionByIdSpy.mockReturnValue(expectedSection);

                    fixture.componentRef.setInput('complexId', expectedComplexId);
                    fixture.detectChanges();

                    expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, null);
                    expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, expectedSection);
                    expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, expectedComplex);
                });

                it('... should have updated selectedEditionSection to hold null if section is missing (undefined)', () => {
                    const expectedSeries = EditionStateHelper.getSeries(expectedComplex.pubStatement.series.route);
                    outlineServiceGetEditionSeriesByIdSpy.mockReturnValue(expectedSeries);
                    outlineServiceGetEditionSectionByIdSpy.mockReturnValue(undefined);

                    fixture.componentRef.setInput('complexId', expectedComplexId);
                    fixture.detectChanges();

                    expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, expectedSeries);
                    expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, null);
                    expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, expectedComplex);
                });

                it('... should have updated selectedEditionSeries and selectedEditionSection to hold null if series and section are missing (undefined)', () => {
                    outlineServiceGetEditionSeriesByIdSpy.mockReturnValue(undefined);
                    outlineServiceGetEditionSectionByIdSpy.mockReturnValue(undefined);

                    fixture.componentRef.setInput('complexId', expectedComplexId);
                    fixture.detectChanges();

                    expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, null);
                    expectSpyCall(stateServiceUpdateSelectedEditionSectionSpy, 2, null);
                    expectSpyCall(stateServiceUpdateSelectedEditionComplexSpy, 3, expectedComplex);
                });
            });

            describe('... should have updated series, section and complex to hold null', () => {
                beforeEach(() => {
                    outlineServiceGetEditionSeriesByIdSpy.mockClear();
                    outlineServiceGetEditionSectionByIdSpy.mockClear();
                });

                it('... if param `complexId` is missing', () => {
                    complexesServiceGetEditionComplexByIdSpy.mockClear();

                    fixture.componentRef.setInput('complexId', null);
                    fixture.detectChanges();

                    expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 0);
                    expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 0);
                    expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 0);
                    expectToEqual(editionStateService.selectedEditionSeries(), null);
                    expectToEqual(editionStateService.selectedEditionSection(), null);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                    expectToEqual(component.selectedEditionComplex(), null);
                });

                it('... if param `complexId` is empty', () => {
                    complexesServiceGetEditionComplexByIdSpy.mockClear();

                    fixture.componentRef.setInput('complexId', '');
                    fixture.detectChanges();

                    expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 0);
                    expectToEqual(editionStateService.selectedEditionSeries(), null);
                    expectToEqual(editionStateService.selectedEditionSection(), null);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                });

                it('... if edition complex cannot be found', () => {
                    fixture.componentRef.setInput('complexId', 'fail');
                    fixture.detectChanges();

                    expectSpyCall(complexesServiceGetEditionComplexByIdSpy, 2, 'fail');
                    expectSpyCall(outlineServiceGetEditionSeriesByIdSpy, 0);
                    expectSpyCall(outlineServiceGetEditionSectionByIdSpy, 0);
                    expectToEqual(editionStateService.selectedEditionSeries(), null);
                    expectToEqual(editionStateService.selectedEditionSection(), null);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                    expectToEqual(component.selectedEditionComplex(), null);
                });

                it('... on cleanup', () => {
                    stateServiceUpdateSelectedEditionSeriesSpy.mockClear();

                    fixture.destroy();

                    expectSpyCall(stateServiceUpdateSelectedEditionSeriesSpy, 1, null);
                    expectToEqual(editionStateService.selectedEditionSeries(), null);
                    expectToEqual(editionStateService.selectedEditionSection(), null);
                    expectToEqual(editionStateService.selectedEditionComplex(), null);
                });
            });
        });
    });
});
