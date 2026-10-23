import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AbbrDirective } from '@awg-views/edition-view/shared/abbr/abbr.directive';

import { SourceDescContentFolioComponent } from './source-desc-content-folio.component';

describe('SourceDescContentFolioComponent (DONE)', () => {
    let component: SourceDescContentFolioComponent;
    let fixture: ComponentFixture<SourceDescContentFolioComponent>;
    let compDe: DebugElement;

    let expectedFolioLabel: string;
    let expectedIsPage: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SourceDescContentFolioComponent, AbbrDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedFolioLabel = '12r';
        expectedIsPage = false;

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescContentFolioComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `folioLabel`', () => {
            expectToBe(isSignal(component.folioLabel), true);

            expect(() => component.folioLabel()).toThrow();
        });

        it('... should have input signal `isPage` to hold the default value', () => {
            expectToBe(isSignal(component.isPage), true);

            expectToBe(component.isPage(), false);
        });

        it('... should throw when accessing computed signal `hasFolioSuffix` due to missing input', () => {
            expectToBe(isSignal(component.hasFolioSuffix), true);

            expect(() => component.hasFolioSuffix()).toThrow();
        });

        it('... should throw when accessing computed signal `folioNumber` due to missing input', () => {
            expectToBe(isSignal(component.folioNumber), true);

            expect(() => component.folioNumber()).toThrow();
        });

        it('... should throw when accessing computed signal `folioSuffix` due to missing input', () => {
            expectToBe(isSignal(component.folioSuffix), true);

            expect(() => component.folioSuffix()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one outer span', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-folio', 1, 1);
            });

            it('... should contain one span for the folio type in the outer span', () => {
                const folioSpanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-folio', 1, 1);
                getAndExpectDebugElementByCss(folioSpanDes[0], 'span.awg-source-desc-content-folio-type', 1, 1);
            });

            it('... should display no text for the folio type yet', () => {
                const folioTypeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-folio-type',
                    1,
                    1
                );
                const folioTypeEl: HTMLSpanElement = folioTypeDes[0].nativeElement;
                expectToBe(folioTypeEl.textContent.trim(), '');
            });

            it('... should contain no span for the folio number in the outer span yet', () => {
                const folioSpanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-folio', 1, 1);
                getAndExpectDebugElementByCss(folioSpanDes[0], 'span.awg-source-desc-content-folio-number', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('folioLabel', expectedFolioLabel);
            fixture.componentRef.setInput('isPage', expectedIsPage);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `folioLabel` to hold the provided value', () => {
            expectToBe(component.folioLabel(), expectedFolioLabel);
        });

        it('... should have input signal `isPage` to hold the provided value', () => {
            expectToBe(component.isPage(), expectedIsPage);
        });

        it('... should have computed signal `hasFolioSuffix` to hold the expected value', () => {
            expectToBe(component.hasFolioSuffix(), true);
        });

        it('... should have computed signal `folioNumber` to hold the expected value', () => {
            expectToBe(component.folioNumber(), '12');
        });

        it('... should have computed signal `folioSuffix` to hold the expected value', () => {
            expectToBe(component.folioSuffix(), 'r');
        });

        describe('... with a folio label ending on v', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('folioLabel', '24v');

                fixture.detectChanges();
            });

            it('... should have recomputed signal `hasFolioSuffix` to hold true', () => {
                expectToBe(component.hasFolioSuffix(), true);
            });

            it('... should have recomputed signal `folioNumber` to hold the expected number', () => {
                expectToBe(component.folioNumber(), '24');
            });

            it('... should have recomputed signal `folioSuffix` to hold the expected suffix', () => {
                expectToBe(component.folioSuffix(), 'v');
            });
        });

        describe('... with a folio label without suffix', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('folioLabel', '36');

                fixture.detectChanges();
            });

            it('... should have recomputed signal `hasFolioSuffix` to hold false', () => {
                expectToBe(component.hasFolioSuffix(), false);
            });

            it('... should have recomputed signal `folioNumber` to hold the expected number', () => {
                expectToBe(component.folioNumber(), '36');
            });

            it('... should have recomputed signal `folioSuffix` to hold an empty string', () => {
                expectToBe(component.folioSuffix(), '');
            });
        });

        describe('VIEW', () => {
            it('... should display the correct folio type in the folio type span', () => {
                const folioTypeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-folio-type',
                    1,
                    1
                );
                const folioTypeEl: HTMLSpanElement = folioTypeDes[0].nativeElement;

                expectToBe(folioTypeEl.textContent.trim(), 'Bl.');
            });

            it('... should contain one span for the folio number in the outer span', () => {
                const folioSpanDes = getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-folio', 1, 1);
                getAndExpectDebugElementByCss(folioSpanDes[0], 'span.awg-source-desc-content-folio-number', 1, 1);
            });

            it('... should contain one superscript for the folio suffix in the folio number span', () => {
                const folioNumberDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-folio-number',
                    1,
                    1
                );
                const superDes = getAndExpectDebugElementByCss(folioNumberDes[0], 'sup', 1, 1);
                const superEl: HTMLElement = superDes[0].nativeElement;

                expectToBe(superEl.textContent.trim(), 'r');
            });

            it('... should display the expected text for the folio number', () => {
                const folioNumberDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-folio-number',
                    1,
                    1
                );
                const folioNumberEl: HTMLSpanElement = folioNumberDes[0].nativeElement;

                expectToBe(folioNumberEl.textContent.trim(), '12r');
            });

            describe('... with no suffix', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('folioLabel', '12');

                    fixture.detectChanges();
                });

                it('... should display the expected text for the folio number', () => {
                    const folioNumberDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-folio-number',
                        1,
                        1
                    );
                    const folioNumberEl: HTMLSpanElement = folioNumberDes[0].nativeElement;

                    expectToBe(folioNumberEl.textContent.trim(), '12');
                });
            });

            describe('... with isPage = true', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('isPage', true);

                    fixture.detectChanges();
                });

                it('... should display the correct folio type in the folio type span', () => {
                    const folioTypeDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-folio-type',
                        1,
                        1
                    );
                    const folioTypeEl: HTMLSpanElement = folioTypeDes[0].nativeElement;

                    expectToBe(folioTypeEl.textContent.trim(), 'S.');
                });
            });
        });
    });
});
