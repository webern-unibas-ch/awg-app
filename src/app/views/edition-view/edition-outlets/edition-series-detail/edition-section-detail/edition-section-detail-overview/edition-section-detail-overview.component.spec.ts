import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { lastValueFrom, Observable, of as observableOf } from 'rxjs';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
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

    let mockEditionStateService: Partial<EditionStateService>;

    let editionStateServiceGetSelectedEditionSeriesSpy: Spy;
    let editionStateServiceGetSelectedEditionSectionSpy: Spy;
    let setupSectionDetailOverviewSpy: Spy;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        // Mock edition state service
        mockEditionStateService = {
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> => observableOf(expectedSelectedSeries),
            getSelectedEditionSection: (): Observable<EditionOutlineSection> => observableOf(expectedSelectedSection),
        };

        await TestBed.configureTestingModule({
            declarations: [
                EditionSectionDetailOverviewComponent,
                EditionSectionDetailComplexCardStubComponent,
                EditionSectionDetailDisclaimerStubComponent,
                EditionSectionDetailIntroCardStubComponent,
                EditionSectionDetailPlaceholderStubComponent,
                RouterLinkStubDirective,
            ],
            providers: [{ provide: EditionStateService, useValue: mockEditionStateService }],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSectionDetailOverviewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedSeries = JSON.parse(JSON.stringify(EditionOutlineService.getEditionOutline()[0]));
        expectedSelectedSection = JSON.parse(JSON.stringify(expectedSelectedSeries.sections[4]));

        // Spies
        editionStateServiceGetSelectedEditionSeriesSpy = vi.spyOn(mockEditionStateService, 'getSelectedEditionSeries');
        editionStateServiceGetSelectedEditionSectionSpy = vi.spyOn(
            mockEditionStateService,
            'getSelectedEditionSection'
        );
        setupSectionDetailOverviewSpy = vi.spyOn(component, 'setupSectionDetailOverview');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedSeries$`', () => {
            expect(component.selectedSeries$).toBeUndefined();
        });

        it('... should not have `selectedSection$`', () => {
            expect(component.selectedSection$).toBeUndefined();
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
            // Mock the parent component input
            component.selectedSeries$ = observableOf(expectedSelectedSeries);
            component.selectedSection$ = observableOf(expectedSelectedSection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `selectedSeries$`', async () => {
            expect(component.selectedSeries$).toBeDefined();
            await expect(lastValueFrom(component.selectedSeries$)).resolves.toEqual(expectedSelectedSeries);
        });

        it('should have `selectedSection$`', async () => {
            expect(component.selectedSection$).toBeDefined();
            await expect(lastValueFrom(component.selectedSection$)).resolves.toEqual(expectedSelectedSection);
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
                    expectedSelectedSection.content.intro.disabled = true;
                    component.selectedSection$ = observableOf(expectedSelectedSection);
                    detectChangesOnPush(fixture);

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

                    it('... if selected section has empty opus complexes, but given mnr complexes', () => {
                        expectedSelectedSection.content.complexTypes.opus = undefined;
                        component.selectedSection$ = observableOf(expectedSelectedSection);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
                    });

                    it('... if selected section has empty mnr complexes, but given opus complexes', () => {
                        expectedSelectedSection.content.complexTypes.mnr = undefined;
                        component.selectedSection$ = observableOf(expectedSelectedSection);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 0, 0);
                    });
                });

                describe('... opus complexes', () => {
                    it('... should contain one inner div.awg-edition-section-detail-opus if opus complexes are given', () => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 1, 1);
                        getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-section-detail-opus', 1, 1);
                    });

                    it('... should contain no inner div.awg-edition-section-detail-opus if no opus complexes are given', () => {
                        expectedSelectedSection.content.complexTypes.opus = undefined;
                        component.selectedSection$ = observableOf(expectedSelectedSection);
                        detectChangesOnPush(fixture);

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

                    it('... should contain no inner div.awg-edition-section-detail-mnr if no mnr complexes are given', () => {
                        expectedSelectedSection.content.complexTypes.mnr = undefined;
                        component.selectedSection$ = observableOf(expectedSelectedSection);
                        detectChangesOnPush(fixture);

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
                    it('... if selectedSection has no complexTypes...', () => {
                        expectedSelectedSection.content.complexTypes = undefined;
                        component.selectedSection$ = observableOf(expectedSelectedSection);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 1, 1);
                    });

                    it('... if selectedSection has empty opus and mnr complexTypes', () => {
                        expectedSelectedSection.content.complexTypes.opus = undefined;
                        expectedSelectedSection.content.complexTypes.mnr = undefined;
                        component.selectedSection$ = observableOf(expectedSelectedSection);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, EditionSectionDetailPlaceholderStubComponent, 1, 1);
                    });
                });

                it('... should pass down selectedSeries and selectedSection to EditionSectionDetailPlaceholder', () => {
                    expectedSelectedSection.content.complexTypes = undefined;
                    component.selectedSection$ = observableOf(expectedSelectedSection);
                    detectChangesOnPush(fixture);

                    const placeholderDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSectionDetailPlaceholderStubComponent,
                        1,
                        1
                    );
                    const placeholderCmp = placeholderDes[0].injector.get(
                        EditionSectionDetailPlaceholderStubComponent
                    ) as EditionSectionDetailPlaceholderStubComponent;

                    expectToEqual(placeholderCmp.selectedSeries, expectedSelectedSeries);
                    expectToEqual(placeholderCmp.selectedSection, expectedSelectedSection);
                });
            });
        });

        describe('#setupSectionDetailOverview()', () => {
            it('... should have a method `setupSectionDetailOverview`', () => {
                expect(component.setupSectionDetailOverview).toBeDefined();
            });

            it('... should have been called', () => {
                expectSpyCall(setupSectionDetailOverviewSpy, 1);
            });

            it('... should have triggered `editionStateService.getSelectedEditionSeries`', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 1);
            });

            it('... should have set selectedSeries (via EditionStateService)', async () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 1);
                await expect(lastValueFrom(component.selectedSeries$)).resolves.toEqual(expectedSelectedSeries);
            });

            it('... should have triggered `editionStateService.getSelectedEditionSection`', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 1);
            });

            it('... should have set selectedSection (via EditionStateService)', async () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 1);
                await expect(lastValueFrom(component.selectedSection$)).resolves.toEqual(expectedSelectedSection);
            });
        });
    });
});
