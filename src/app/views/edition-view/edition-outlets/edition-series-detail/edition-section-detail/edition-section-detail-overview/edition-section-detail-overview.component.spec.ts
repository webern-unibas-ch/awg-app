import { Component, DebugElement, Input, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionOutlineComplexItem, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSectionDetailOverviewComponent } from './edition-section-detail-overview.component';

// Mock components
@Component({
    selector: 'awg-edition-section-detail-complex-card',
    template: '',
    standalone: false,
})
class EditionSectionDetailComplexCardStubComponent {
    @Input()
    complexes: EditionOutlineComplexItem[];
}

@Component({
    selector: 'awg-edition-section-detail-disclaimer',
    template: '',
    standalone: false,
})
class EditionSectionDetailDisclaimerStubComponent {}

@Component({
    selector: 'awg-edition-section-detail-intro-card',
    template: '',
    standalone: false,
})
class EditionSectionDetailIntroCardStubComponent {
    @Input()
    selectedSeries: EditionOutlineSeries;
    @Input()
    selectedSection: EditionOutlineSection;
}

@Component({
    selector: 'awg-edition-section-detail-placeholder',
    template: '',
    standalone: false,
})
class EditionSectionDetailPlaceholderStubComponent {
    @Input()
    selectedSeries: EditionOutlineSeries;
    @Input()
    selectedSection: EditionOutlineSection;
}

describe('EditionSectionDetailOverviewComponent', () => {
    let component: EditionSectionDetailOverviewComponent;
    let fixture: ComponentFixture<EditionSectionDetailOverviewComponent>;
    let compDe: DebugElement;

    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let expectedEditionData: { series: EditionOutlineSeries; section: EditionOutlineSection };
    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                EditionSectionDetailOverviewComponent,
                EditionSectionDetailComplexCardStubComponent,
                EditionSectionDetailDisclaimerStubComponent,
                EditionSectionDetailIntroCardStubComponent,
                EditionSectionDetailPlaceholderStubComponent,
                RouterLinkStubDirective,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();
        editionOutlineService.initializeEditionOutline();

        // Test data
        expectedSelectedSeries = structuredClone(editionOutlineService.editionOutline()[0]);
        expectedSelectedSection = structuredClone(expectedSelectedSeries.sections[4]);
        expectedEditionData = { series: expectedSelectedSeries, section: expectedSelectedSection };

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailOverviewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `editionData` to hold empty data', () => {
            expectToBe(isSignal(component.editionData), true);

            expectToEqual(component.editionData(), { series: null, section: null });
        });

        describe('VIEW', () => {
            it('... should contain no outer div.awg-edition-section-detail yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 0, 0);
            });

            it('... should contain no EditionSectionDisclaimer (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSectionDetailDisclaimerStubComponent, 0, 0);
            });

            it('... should contain no EditionSectionDetailIntroCard (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSectionDetailIntroCardStubComponent, 0, 0);
            });

            it('... should contain no EditionSectionDetailComplexCard (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSectionDetailComplexCardStubComponent, 0, 0);
            });

            it('... should contain no EditionSectionDetailPlaceholder (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
            editionStateService.updateSelectedEditionSection(expectedSelectedSection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have signal `editionData` to hold the expected data', () => {
            expectToEqual(component.editionData(), expectedEditionData);
        });

        describe('VIEW', () => {
            it('... should contain one outer div.awg-edition-section-detail', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
            });

            it('... should contain one EditionSectionDisclaimer (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSectionDetailDisclaimerStubComponent, 1, 1);
            });

            it('... should contain no EditionSectionDetailPlaceholder (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
            });

            describe('... with given intro', () => {
                it('... should contain one div.awg-edition-section-detail-intro', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail-intro', 1, 1);
                });

                it('... should contain one EditionSectionDetailIntroCardComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail-intro', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], EditionSectionDetailIntroCardStubComponent, 1, 1);
                });

                it('... should pass down selectedSeries and selectedSection to EditionSectionDetailIntroCardComponent', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail-intro', 1, 1);
                    const introCardDes = getAndExpectDebugElementByDirective(
                        divDes[0],
                        EditionSectionDetailIntroCardStubComponent,
                        1,
                        1
                    );
                    const introCardCmp = introCardDes[0].injector.get(
                        EditionSectionDetailIntroCardStubComponent
                    ) as EditionSectionDetailIntroCardStubComponent;

                    expectToEqual(introCardCmp.selectedSeries, expectedSelectedSeries);
                    expectToEqual(introCardCmp.selectedSection, expectedSelectedSection);
                });
            });

            describe('... with intro disabled', () => {
                it('... should contain no div.awg-edition-section-detail-intro', () => {
                    const expectedSectionWithDisabledIntro = {
                        ...expectedSelectedSection,
                        content: {
                            ...expectedSelectedSection.content,
                            intro: {
                                ...expectedSelectedSection.content?.intro,
                                disabled: true,
                            },
                        },
                    };

                    editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
                    editionStateService.updateSelectedEditionSection(expectedSectionWithDisabledIntro);

                    fixture.detectChanges();

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail-intro', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, EditionSectionDetailIntroCardStubComponent, 0, 0);
                });
            });

            describe('... with given complexes', () => {
                describe('... should contain one outer div.awg-edition-section-detail, but no EditionSectionDetailPlaceholder ...', () => {
                    it('... if selected section is given and not empty', () => {
                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
                    });

                    it('... if selected section has empty opus complexes, but given mnr complexes', async () => {
                        const currentMnr = expectedSelectedSection.content?.complexTypes?.mnr ?? [];

                        const expectedSectionWithEmptyOpusComplexes = {
                            ...expectedSelectedSection,
                            content: {
                                ...expectedSelectedSection.content,
                                complexTypes: {
                                    ...expectedSelectedSection.content?.complexTypes,
                                    opus: undefined,
                                },
                                sectionComplexes: [...currentMnr],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyOpusComplexes);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
                    });

                    it('... if selected section has empty mnr complexes, but given opus complexes', async () => {
                        const currentOpus = expectedSelectedSection.content?.complexTypes?.opus ?? [];

                        const expectedSectionWithEmptyMnrComplexes = {
                            ...expectedSelectedSection,
                            content: {
                                ...expectedSelectedSection.content,
                                complexTypes: {
                                    ...expectedSelectedSection.content?.complexTypes,
                                    mnr: undefined,
                                },
                                sectionComplexes: [...currentOpus],
                            },
                        };
                        editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyMnrComplexes);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
                    });
                });

                describe('... opus complexes', () => {
                    it('... should contain one inner div.awg-edition-section-detail-opus if opus complexes are given', () => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-section-detail-opus', 1, 1);
                    });

                    it('... should contain no inner div.awg-edition-section-detail-opus if no opus complexes are given', async () => {
                        const currentMnr = expectedSelectedSection.content?.complexTypes?.mnr ?? [];

                        const expectedSectionWithEmptyOpusComplexes = {
                            ...expectedSelectedSection,
                            content: {
                                ...expectedSelectedSection.content,
                                complexTypes: {
                                    ...expectedSelectedSection.content?.complexTypes,
                                    opus: undefined,
                                },
                                sectionComplexes: [...currentMnr],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyOpusComplexes);
                        await detectChangesOnPush(fixture);

                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-section-detail-opus', 0, 0);
                    });

                    it('... should display heading (h5) in div.awg-edition-section-detail-opus', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-detail-opus',
                            1,
                            1
                        );
                        const hDes = getAndExpectDebugElementByCss(divDes[0], 'h5', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedHeaderText = 'nach Opusnummer:';

                        expectToBe(hEl.textContent, expectedHeaderText);
                    });

                    it('... should contain one EditionSectionDetailComplexCardComponent (stubbed)', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-detail-opus',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            divDes[0],
                            EditionSectionDetailComplexCardStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should pass down opus complexes to EditionSectionDetailComplexCardComponent', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-detail-opus',
                            1,
                            1
                        );
                        const complexCardDes = getAndExpectDebugElementByDirective(
                            divDes[0],
                            EditionSectionDetailComplexCardStubComponent,
                            1,
                            1
                        );
                        const complexCardCmp = complexCardDes[0].injector.get(
                            EditionSectionDetailComplexCardStubComponent
                        ) as EditionSectionDetailComplexCardStubComponent;

                        expectToEqual(complexCardCmp.complexes, expectedSelectedSection.content.complexTypes.opus);
                    });
                });

                describe('... mnr complexes', () => {
                    it('... should contain one inner div.awg-edition-section-detail-mnr if mnr complexes are given', () => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-section-detail-mnr', 1, 1);
                    });

                    it('... should contain no inner div.awg-edition-section-detail-mnr if no mnr complexes are given', async () => {
                        const currentOpus = expectedSelectedSection.content?.complexTypes?.opus ?? [];

                        const expectedSectionWithEmptyMnrComplexes = {
                            ...expectedSelectedSection,
                            content: {
                                ...expectedSelectedSection.content,
                                complexTypes: {
                                    ...expectedSelectedSection.content?.complexTypes,
                                    mnr: undefined,
                                },
                                sectionComplexes: [...currentOpus],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyMnrComplexes);
                        await detectChangesOnPush(fixture);

                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-section-detail-mnr', 0, 0);
                    });

                    it('... should display header (h5) in div.awg-edition-section-detail-mnr', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-detail-mnr',
                            1,
                            1
                        );
                        const hDes = getAndExpectDebugElementByCss(divDes[0], 'h5', 1, 1);
                        const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                        const expectedHeaderText = 'nach Moldenhauer-Nummer:';

                        expectToBe(hEl.textContent, expectedHeaderText);
                    });

                    it('... should contain one EditionSectionDetailComplexCardComponent (stubbed)', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-detail-mnr',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(
                            divDes[0],
                            EditionSectionDetailComplexCardStubComponent,
                            1,
                            1
                        );
                    });

                    it('... should pass down mnr complexes to EditionSectionDetailComplexCardComponent', () => {
                        const divDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-detail-mnr',
                            1,
                            1
                        );
                        const complexCardDes = getAndExpectDebugElementByDirective(
                            divDes[0],
                            EditionSectionDetailComplexCardStubComponent,
                            1,
                            1
                        );
                        const complexCardCmp = complexCardDes[0].injector.get(
                            EditionSectionDetailComplexCardStubComponent
                        ) as EditionSectionDetailComplexCardStubComponent;

                        expectToEqual(complexCardCmp.complexes, expectedSelectedSection.content.complexTypes.mnr);
                    });
                });
            });

            describe('... with no complexes', () => {
                describe('... should contain no outer div.awg-edition-section-detail, but one EditionSectionDetailPlaceholder ...', () => {
                    it('... if selectedSection has no complexTypes...', async () => {
                        const expectedSectionWithNoComplexTypes = {
                            ...expectedSelectedSection,
                            content: {
                                ...expectedSelectedSection.content,
                                complexTypes: undefined,
                                sectionComplexes: [],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithNoComplexTypes);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 1, 1);
                    });

                    it('... if selectedSection has empty opus and mnr complexTypes', async () => {
                        const expectedSectionWithEmptyComplexTypes = {
                            ...expectedSelectedSection,
                            content: {
                                ...expectedSelectedSection.content,
                                complexTypes: {
                                    ...expectedSelectedSection.content.complexTypes,
                                    opus: undefined,
                                    mnr: undefined,
                                },
                                sectionComplexes: [],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyComplexTypes);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 1, 1);
                    });
                });

                it('... should pass down selectedSeries and selectedSection to EditionSectionDetailPlaceholder', async () => {
                    const targetSection = expectedSelectedSeries.sections[4];
                    const expectedSectionWithNoComplexTypes = {
                        ...targetSection,
                        content: {
                            ...targetSection.content,
                            complexTypes: undefined,
                            sectionComplexes: [],
                        },
                    };

                    const expectedSeriesWithSectionWithNoComplexTypes = {
                        ...expectedSelectedSeries,
                        sections: expectedSelectedSeries.sections.map((sec, idx) =>
                            idx === 4 ? expectedSectionWithNoComplexTypes : sec
                        ),
                    };

                    editionStateService.updateSelectedEditionSeries(expectedSeriesWithSectionWithNoComplexTypes);
                    editionStateService.updateSelectedEditionSection(expectedSectionWithNoComplexTypes);
                    await detectChangesOnPush(fixture);

                    const placeholderDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSectionDetailPlaceholderStubComponent,
                        1,
                        1
                    );
                    const placeholderCmp = placeholderDes[0].injector.get(
                        EditionSectionDetailPlaceholderStubComponent
                    ) as EditionSectionDetailPlaceholderStubComponent;

                    expectToEqual(placeholderCmp.selectedSeries, expectedSeriesWithSectionWithNoComplexTypes);
                    expectToEqual(placeholderCmp.selectedSection, expectedSectionWithNoComplexTypes);
                });
            });
        });
    });
});
