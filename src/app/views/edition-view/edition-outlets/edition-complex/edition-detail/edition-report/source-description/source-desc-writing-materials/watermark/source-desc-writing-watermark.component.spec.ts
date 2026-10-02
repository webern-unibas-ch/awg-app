import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { SourceDescriptionWritingMaterialWatermark } from '@awg-views/edition-view/models/source-description.model';

import { getItemLocus } from '../source-desc-writing-materials.utils';
import { SourceDescWritingWatermarkComponent } from './source-desc-writing-watermark.component';

describe('SourceDescWritingWatermarkComponent', () => {
    let component: SourceDescWritingWatermarkComponent;
    let fixture: ComponentFixture<SourceDescWritingWatermarkComponent>;
    let compDe: DebugElement;

    let expectedWatermark: SourceDescriptionWritingMaterialWatermark;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, SourceDescWritingWatermarkComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedWatermark = {
            variant: 'Test watermark',
            locus: [{ preFolioInfo: '', folios: ['2v'], position: 'oben rechts' }],
        };

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescWritingWatermarkComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `watermark` to hold the default value', () => {
            expectToBe(isSignal(component.watermark), true);

            expect(component.watermark()).toBeUndefined();
        });

        it('... should have computed signals to hold the default values', () => {
            expectToBe(component.variant(), '');
            expectToBe(component.hasWatermark(), false);
            expectToEqual(component.loci(), []);
        });

        describe('VIEW', () => {
            it('... should contain no watermark span yet', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-material-watermark', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('watermark', expectedWatermark);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `watermark` to hold the provided watermark', () => {
            expectToEqual(component.watermark(), expectedWatermark);
        });

        it('... should have computed signal `variant` to hold the variant of the watermark', () => {
            expectToBe(component.variant(), expectedWatermark.variant);
        });

        describe('... should have recomputed signal `variant` to hold an empty string if', () => {
            it.each([
                { desc: 'variant is undefined', watermark: {} },
                { desc: 'watermark is undefined', watermark: undefined },
            ])('... $desc', ({ watermark }) => {
                fixture.componentRef.setInput('watermark', watermark);

                expectToBe(component.variant(), '');
            });
        });

        it('... should have computed signal `hasWatermark` to hold true', () => {
            expectToBe(component.hasWatermark(), true);
        });

        describe('... should have recomputed signal `hasWatermark` to hold false if', () => {
            it.each([
                { desc: 'watermark is empty', watermark: {} },
                { desc: 'watermark is undefined', watermark: undefined },
            ])('... $desc', ({ watermark }) => {
                fixture.componentRef.setInput('watermark', watermark);

                expectToBe(component.hasWatermark(), false);
            });
        });

        it('... should have computed signal `loci` to hold the formatted loci of the watermark', () => {
            expectToEqual(component.loci(), (expectedWatermark.locus ?? []).map(getItemLocus));
        });

        describe('... should have recomputed signal `loci` to hold an empty array if', () => {
            it.each([
                { desc: 'locus is undefined', watermark: { variant: 'Test watermark' } },
                { desc: 'watermark is undefined', watermark: undefined },
            ])('... $desc', ({ watermark }) => {
                fixture.componentRef.setInput('watermark', watermark);

                expectToEqual(component.loci(), []);
            });
        });

        describe('VIEW', () => {
            it('... should contain a watermark span displaying the variant in italics', () => {
                const watermarkSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material-watermark',
                    1,
                    1
                );
                const emDes = getAndExpectDebugElementByCss(watermarkSpanDes[0], 'em', 1, 1);

                expectToBe(emDes[0].nativeElement.textContent.trim(), expectedWatermark.variant);
            });

            it('... should start the watermark statement with a comma', () => {
                const watermarkSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material-watermark',
                    1,
                    1
                );

                expectToBe(watermarkSpanDes[0].nativeElement.textContent.startsWith(', Wasserzeichen:'), true);
            });

            it('... should contain a span for each watermark locus', () => {
                const expectedLoci = expectedWatermark.locus ?? [];

                const locusDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material-watermark-locus',
                    expectedLoci.length,
                    expectedLoci.length
                );

                locusDes.forEach((locusDe, index) => {
                    const directiveIns = locusDe.injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expectToBe(directiveIns.htmlContent(), getItemLocus(expectedLoci[index]));
                });
            });

            it('... should contain no watermark locus span if no locus is given', async () => {
                fixture.componentRef.setInput('watermark', { variant: expectedWatermark.variant });
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-material-watermark', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-material-watermark-locus', 0, 0);
            });

            it('... should end the watermark statement with `lesbar`', () => {
                expectToBe(compDe.nativeElement.textContent.trimEnd().endsWith(' lesbar'), true);
            });

            describe('... should render nothing if watermark is', () => {
                it.each([
                    { desc: 'empty', watermark: {} },
                    { desc: 'undefined', watermark: undefined },
                ])('... $desc', async ({ watermark }) => {
                    fixture.componentRef.setInput('watermark', watermark);
                    await detectChangesOnPush(fixture);

                    expectToBe(compDe.nativeElement.textContent.trim(), '');
                });
            });
        });
    });
});
