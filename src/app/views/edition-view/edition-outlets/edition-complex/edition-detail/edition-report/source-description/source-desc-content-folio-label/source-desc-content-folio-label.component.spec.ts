import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';

import { SourceDescContentFolioLabelComponent } from './source-desc-content-folio-label.component';

describe('SourceDescContentFolioLabelComponent (DONE)', () => {
    let component: SourceDescContentFolioLabelComponent;
    let fixture: ComponentFixture<SourceDescContentFolioLabelComponent>;
    let compDe: DebugElement;

    let expectedFolioLabel: string;
    let expectedIsPage: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SourceDescContentFolioLabelComponent, AbbrDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedFolioLabel = '12r';
        expectedIsPage = false;

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescContentFolioLabelComponent);
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

            expect(component.isPage()).toBe(false);
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
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-content-item-folio', 1, 1);
            });

            it('... should contain one span for the folio type in the outer span', () => {
                const folioSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-item-folio',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(folioSpanDes[0], 'span.awg-source-desc-content-item-folio-type', 1, 1);
            });

            it('... should display no text for the folio type yet', () => {
                const folioTypeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-item-folio-type',
                    1,
                    1
                );
                const folioTypeEl: HTMLSpanElement = folioTypeDes[0].nativeElement;
                expect(folioTypeEl.textContent.trim()).toBe('');
            });

            it('... should contain no span for the folio number in the outer span yet', () => {
                const folioSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-item-folio',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(folioSpanDes[0], 'span.awg-source-desc-content-item-folio-number', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('folioLabel', expectedFolioLabel);
            fixture.componentRef.setInput('isPage', expectedIsPage);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `folioLabel` to hold the provided value', () => {
            expect(component.folioLabel()).toBe(expectedFolioLabel);
        });

        it('... should have input signal `isPage` to hold the provided value', () => {
            expect(component.isPage()).toBe(expectedIsPage);
        });

        it('... should have computed signal `hasFolioSuffix` to hold the expected value', () => {
            expect(component.hasFolioSuffix()).toBe(true);
        });

        it('... should have computed signal `folioNumber` to hold the expected value', () => {
            expect(component.folioNumber()).toBe('12');
        });

        it('... should have computed signal `folioSuffix` to hold the expected value', () => {
            expect(component.folioSuffix()).toBe('r');
        });

        describe('... with a folio label ending on v', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('folioLabel', '24v');

                fixture.detectChanges();
            });

            it('... should have recomputed signal `hasFolioSuffix` to hold true', () => {
                expect(component.hasFolioSuffix()).toBe(true);
            });

            it('... should have recomputed signal `folioNumber` to hold the expected number', () => {
                expect(component.folioNumber()).toBe('24');
            });

            it('... should have recomputed signal `folioSuffix` to hold the expected suffix', () => {
                expect(component.folioSuffix()).toBe('v');
            });
        });

        describe('... with a folio label without suffix', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('folioLabel', '36');

                fixture.detectChanges();
            });

            it('... should have recomputed signal `hasFolioSuffix` to hold false', () => {
                expect(component.hasFolioSuffix()).toBe(false);
            });

            it('... should have recomputed signal `folioNumber` to hold the expected number', () => {
                expect(component.folioNumber()).toBe('36');
            });

            it('... should have recomputed signal `folioSuffix` to hold an empty string', () => {
                expect(component.folioSuffix()).toBe('');
            });
        });

        describe('VIEW', () => {
            it('... should display the correct folio type in the folio type span', () => {
                const folioTypeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-item-folio-type',
                    1,
                    1
                );
                const folioTypeEl: HTMLSpanElement = folioTypeDes[0].nativeElement;

                expect(folioTypeEl.textContent.trim()).toBe('Bl.');
            });

            it('... should contain one span for the folio number in the outer span', () => {
                const folioSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-item-folio',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(folioSpanDes[0], 'span.awg-source-desc-content-item-folio-number', 1, 1);
            });

            it('... should contain one superscript for the folio suffix in the folio number span', () => {
                const folioNumberDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-item-folio-number',
                    1,
                    1
                );
                const superDes = getAndExpectDebugElementByCss(folioNumberDes[0], 'sup', 1, 1);
                const superEl: HTMLElement = superDes[0].nativeElement;

                expect(superEl.textContent.trim()).toBe('r');
            });

            it('... should display the expected text for the folio number', () => {
                const folioNumberDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-content-item-folio-number',
                    1,
                    1
                );
                const folioNumberEl: HTMLSpanElement = folioNumberDes[0].nativeElement;

                expect(folioNumberEl.textContent.trim()).toBe('12r');
            });

            describe('... with no suffix', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('folioLabel', '12');

                    fixture.detectChanges();
                });

                it('... should display the expected text for the folio number', () => {
                    const folioNumberDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-content-item-folio-number',
                        1,
                        1
                    );
                    const folioNumberEl: HTMLSpanElement = folioNumberDes[0].nativeElement;

                    expect(folioNumberEl.textContent.trim()).toBe('12');
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
                        'span.awg-source-desc-content-item-folio-type',
                        1,
                        1
                    );
                    const folioTypeEl: HTMLSpanElement = folioTypeDes[0].nativeElement;

                    expect(folioTypeEl.textContent.trim()).toBe('S.');
                });
            });
        });
    });
});
