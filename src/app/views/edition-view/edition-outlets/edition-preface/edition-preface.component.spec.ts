import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    AlertErrorStubComponent,
    LanguageSwitcherStubComponent,
    TwelveToneSpinnerStubComponent,
} from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { LanguageId } from '@awg-shared/language-switcher/language.model';

import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { PrefaceList } from '@awg-views/edition-view/models/preface.model';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionPrefaceComponent } from './edition-preface.component';

describe('EditionPrefaceComponent (DONE)', () => {
    let component: EditionPrefaceComponent;
    let fixture: ComponentFixture<EditionPrefaceComponent>;
    let compDe: DebugElement;

    let mockViewDataSignal: WritableSignal<EditionViewData<'preface'>>;
    let expectedViewDataContent: EditionViewDataContent<'preface'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'preface'>;
    let expectedPrefaceData: PrefaceList;
    let expectedSelectedLanguage: LanguageId;

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = { prefaceData: new PrefaceList() };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [
                AlertErrorStubComponent,
                CompileHtmlDirective,
                LanguageSwitcherStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            declarations: [EditionPrefaceComponent],
            providers: [
                { provide: EditionViewService, useValue: { prefaceViewData: mockViewDataSignal.asReadonly() } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedPrefaceData = structuredClone(mockEditionData.mockPrefaceData);
        expectedSelectedLanguage = LanguageId.DE;

        // Create component fixture
        fixture = TestBed.createComponent(EditionPrefaceComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        it('... should have signal `selectedLanguage` to hold the default language (DE)', () => {
            expectToBe(isSignal(component.selectedLanguage), true);

            expectToBe(component.selectedLanguage(), expectedSelectedLanguage);
        });

        describe('VIEW', () => {
            it('... should contain no AlertErrorComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no outer div.awg-preface-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
            });

            it('... should contain no LanguageSwitcherComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, LanguageSwitcherStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set mock view data signal to expected data state
            expectedViewDataContent = { prefaceData: expectedPrefaceData };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        describe('VIEW', () => {
            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'preface',
                    error: { status: 404, statusText: 'Data not found' },
                };

                beforeEach(async () => {
                    // Mock error state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: expectedErrorObject,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain preface view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                beforeEach(async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, { isLoading: true, error: null })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain preface view or alert, but one TwelveToneSpinnerComponent (stubbed)', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(
                        compDe,
                        TwelveToneSpinnerStubComponent,
                        1,
                        1
                    );
                    const spinnerCmp = spinnerDes[0].injector.get(
                        TwelveToneSpinnerStubComponent
                    ) as TwelveToneSpinnerStubComponent;

                    expectToBe(spinnerCmp.spinnerText(), 'loading');
                });
            });

            describe('on view data available', () => {
                beforeEach(async () => {
                    // Mock data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one outer div.awg-preface-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);
                });

                it('... should contain one LanguageSwitcherComponent (stubbed) in div.awg-preface-view', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                    getAndExpectDebugElementByDirective(divDes[0], LanguageSwitcherStubComponent, 1, 1);
                });

                it('... should pass down `selectedLanguage` to LanguageSwitcherComponent', () => {
                    const switcherDes = getAndExpectDebugElementByDirective(
                        compDe,
                        LanguageSwitcherStubComponent,
                        1,
                        1
                    );
                    const switcherCmp = switcherDes[0].injector.get(
                        LanguageSwitcherStubComponent
                    ) as LanguageSwitcherStubComponent;

                    expectToEqual(switcherCmp.selectedLanguage(), expectedSelectedLanguage);
                });

                it('... should update `selectedLanguage` when LanguageSwitcherComponent emits a change', () => {
                    const switcherDes = getAndExpectDebugElementByDirective(
                        compDe,
                        LanguageSwitcherStubComponent,
                        1,
                        1
                    );

                    expectToBe(component.selectedLanguage(), LanguageId.DE);

                    switcherDes[0].triggerEventHandler('selectedLanguageChange', LanguageId.EN);

                    fixture.detectChanges();

                    expectToBe(component.selectedLanguage(), LanguageId.EN);
                });

                describe('... with language specific content', () => {
                    const languageCases = [
                        { desc: 'german', langId: LanguageId.DE, dataIndex: 0 },
                        { desc: 'english', langId: LanguageId.EN, dataIndex: 1 },
                    ];

                    it.each(languageCases)(
                        '... should contain as many preface block elements in div.awg-preface-view as content items in preview data ($desc)',
                        ({ langId, dataIndex }) => {
                            component.selectedLanguage.set(langId);
                            fixture.detectChanges();

                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);

                            const expectedLength = expectedPrefaceData.preface[dataIndex].content.length;
                            getAndExpectDebugElementByCss(
                                divDes[0],
                                'div.awg-edition-preface-block',
                                expectedLength,
                                expectedLength
                            );
                        }
                    );

                    it.each(languageCases)(
                        `... should pass correct content strings to the CompileHtmlDirective ($desc)`,
                        ({ langId, dataIndex }) => {
                            component.selectedLanguage.set(langId);
                            fixture.detectChanges();

                            const expectedContent = expectedPrefaceData.preface[dataIndex].content;
                            const expectedLength = expectedContent.length;

                            const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-preface-view', 1, 1);
                            const allDirectiveDes = getAndExpectDebugElementByDirective(
                                divDes[0],
                                CompileHtmlDirective,
                                expectedLength,
                                expectedLength
                            );

                            expectedContent.forEach((expectedText, contentIndex) => {
                                const currentDirectiveDe = allDirectiveDes[contentIndex];
                                const currentDirectiveIns = currentDirectiveDe.injector.get(CompileHtmlDirective);

                                expectToBe(currentDirectiveIns.htmlContent(), expectedText);
                            });
                        }
                    );
                });
            });
        });
    });
});
