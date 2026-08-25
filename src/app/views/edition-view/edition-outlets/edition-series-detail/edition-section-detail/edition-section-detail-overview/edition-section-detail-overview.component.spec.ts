import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    EditionSectionDetailComplexCardStubComponent,
    EditionSectionDetailDisclaimerStubComponent,
    EditionSectionDetailIntroCardStubComponent,
    EditionSectionDetailPlaceholderStubComponent,
} from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionStateService } from '@awg-views/edition-view/services';

import { EditionSectionDetailOverviewComponent } from './edition-section-detail-overview.component';

describe('EditionSectionDetailOverviewComponent', () => {
    let component: EditionSectionDetailOverviewComponent;
    let fixture: ComponentFixture<EditionSectionDetailOverviewComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let expectedSeries: EditionOutlineSeries;
    let expectedSection: EditionOutlineSection;

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
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedSeries = EditionStateHelper.getSeries('1');
        expectedSection = EditionStateHelper.getSection('1', '5');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailOverviewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedSection` to hold null', () => {
            expectToBe(isSignal(component.selectedSection), true);

            expectToEqual(component.selectedSection(), null);
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
            editionStateService.updateSelectedEditionSeries(expectedSeries);
            editionStateService.updateSelectedEditionSection(expectedSection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have signal `selectedSection` to hold the expected data', () => {
            expectToEqual(component.selectedSection(), expectedSection);
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

                it('... should pass down selectedSection to EditionSectionDetailIntroCardComponent', () => {
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

                    expectToEqual(introCardCmp.selectedSection(), expectedSection);
                });
            });

            describe('... with intro disabled', () => {
                it('... should contain no div.awg-edition-section-detail-intro', () => {
                    const expectedSectionWithDisabledIntro = {
                        ...expectedSection,
                        content: {
                            ...expectedSection.content,
                            intro: {
                                ...expectedSection.content?.intro,
                                disabled: true,
                            },
                        },
                    };

                    editionStateService.updateSelectedEditionSeries(expectedSeries);
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
                        const currentMnr = expectedSection.content?.complexTypes?.mnr ?? [];

                        const expectedSectionWithEmptyOpusComplexes: EditionOutlineSection = {
                            ...expectedSection,
                            content: {
                                ...expectedSection.content,
                                complexTypes: {
                                    ...expectedSection.content?.complexTypes,
                                    opus: [],
                                },
                                sectionComplexes: [...currentMnr],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyOpusComplexes);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
                    });

                    it('... if selected section has empty mnr complexes, but given opus complexes', async () => {
                        const currentOpus = expectedSection.content?.complexTypes?.opus ?? [];

                        const expectedSectionWithEmptyMnrComplexes: EditionOutlineSection = {
                            ...expectedSection,
                            content: {
                                ...expectedSection.content,
                                complexTypes: {
                                    ...expectedSection.content?.complexTypes,
                                    mnr: [],
                                },
                                sectionComplexes: [...currentOpus],
                            },
                        };
                        editionStateService.updateSelectedEditionSeries(expectedSeries);
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
                        const currentMnr = expectedSection.content?.complexTypes?.mnr ?? [];

                        const expectedSectionWithEmptyOpusComplexes: EditionOutlineSection = {
                            ...expectedSection,
                            content: {
                                ...expectedSection.content,
                                complexTypes: {
                                    ...expectedSection.content?.complexTypes,
                                    opus: [],
                                },
                                sectionComplexes: [...currentMnr],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSeries);
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

                        expectToEqual(complexCardCmp.complexes, expectedSection.content.complexTypes.opus);
                    });
                });

                describe('... mnr complexes', () => {
                    it('... should contain one inner div.awg-edition-section-detail-mnr if mnr complexes are given', () => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-section-detail-mnr', 1, 1);
                    });

                    it('... should contain no inner div.awg-edition-section-detail-mnr if no mnr complexes are given', async () => {
                        const currentOpus = expectedSection.content?.complexTypes?.opus ?? [];

                        const expectedSectionWithEmptyMnrComplexes: EditionOutlineSection = {
                            ...expectedSection,
                            content: {
                                ...expectedSection.content,
                                complexTypes: {
                                    ...expectedSection.content?.complexTypes,
                                    mnr: [],
                                },
                                sectionComplexes: [...currentOpus],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSeries);
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

                        expectToEqual(complexCardCmp.complexes, expectedSection.content.complexTypes.mnr);
                    });
                });
            });

            describe('... with no complexes', () => {
                describe('... should contain no outer div.awg-edition-section-detail, but one EditionSectionDetailPlaceholder ...', () => {
                    it('... if selectedSection has empty opus and mnr complexTypes', async () => {
                        const expectedSectionWithEmptyComplexTypes: EditionOutlineSection = {
                            ...expectedSection,
                            content: {
                                ...expectedSection.content,
                                complexTypes: {
                                    ...expectedSection.content.complexTypes,
                                    opus: [],
                                    mnr: [],
                                },
                                sectionComplexes: [],
                            },
                        };

                        editionStateService.updateSelectedEditionSeries(expectedSeries);
                        editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyComplexTypes);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 1, 1);
                    });
                });

                it('... should pass down selectedSection to EditionSectionDetailPlaceholder', async () => {
                    const expectedSectionWithEmptyComplexTypes: EditionOutlineSection = {
                        ...expectedSection,
                        content: {
                            ...expectedSection.content,
                            complexTypes: {
                                ...expectedSection.content.complexTypes,
                                opus: [],
                                mnr: [],
                            },
                            sectionComplexes: [],
                        },
                    };

                    editionStateService.updateSelectedEditionSeries(expectedSeries);
                    editionStateService.updateSelectedEditionSection(expectedSectionWithEmptyComplexTypes);
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

                    expectToEqual(placeholderCmp.selectedSection(), expectedSectionWithEmptyComplexTypes);
                });
            });
        });
    });
});
