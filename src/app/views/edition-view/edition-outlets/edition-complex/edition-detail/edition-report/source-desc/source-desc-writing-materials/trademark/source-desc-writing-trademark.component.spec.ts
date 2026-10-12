import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { SourceDescWritingMaterialTrademark } from '@awg-views/edition-view/models/source-desc.model';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { getItemLocus, getTrademark } from '../source-desc-writing-materials.utils';
import { SourceDescWritingTrademarkComponent } from './source-desc-writing-trademark.component';

describe('SourceDescWritingTrademarkComponent (DONE)', () => {
    let component: SourceDescWritingTrademarkComponent;
    let fixture: ComponentFixture<SourceDescWritingTrademarkComponent>;
    let compDe: DebugElement;

    let expectedTrademark: SourceDescWritingMaterialTrademark;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompileHtmlDirective, SourceDescWritingTrademarkComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        const writingMaterials = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescListData.sources[2].physDesc.writingMaterials)
        );
        expectedTrademark = writingMaterials[0].trademark; // With variant and locus

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescWritingTrademarkComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `trademark` to hold the default value', () => {
            expectToBe(isSignal(component.trademark), true);

            expect(component.trademark()).toBeUndefined();
        });

        it('... should have computed signals to hold the default values', () => {
            expectToBe(component.hasTrademark(), false);
            expectToBe(component.variant(), null);
            expectToBe(component.alt(), '');
            expectToEqual(component.loci(), []);
        });

        describe('VIEW', () => {
            it('... should contain no trademark span yet', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-material-trademark', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('trademark', expectedTrademark);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `trademark` to hold the provided trademark', () => {
            expectToEqual(component.trademark(), expectedTrademark);
        });

        describe('... should have recomputed signal `hasTrademark` to hold', () => {
            it.each([
                { desc: 'true if a variant is given', trademark: { variant: 'JE_NO2_LIN12_OP3_J' }, expected: true },
                { desc: 'true if an alt text is given', trademark: { alt: 'Special trademark text' }, expected: true },
                { desc: 'false if trademark is empty', trademark: {}, expected: false },
                { desc: 'false if trademark is undefined', trademark: undefined, expected: false },
            ])('... $desc', ({ trademark, expected }) => {
                fixture.componentRef.setInput('trademark', trademark);

                expectToBe(component.hasTrademark(), expected);
            });
        });

        it('... should have computed signal `variant` to hold the trademark constant for the given variant', () => {
            expectToEqual(component.variant(), getTrademark(expectedTrademark.variant ?? ''));
        });

        describe('... should have recomputed signal `variant` to hold null if', () => {
            it.each([
                { desc: 'variant is empty', trademark: { variant: '', alt: 'Special trademark text' } },
                { desc: 'trademark is undefined', trademark: undefined },
            ])('... $desc', ({ trademark }) => {
                fixture.componentRef.setInput('trademark', trademark);

                expectToBe(component.variant(), null);
            });
        });

        it('... should have recomputed signal `alt` to hold the alt text of the trademark', () => {
            fixture.componentRef.setInput('trademark', { alt: 'Special trademark text' });

            expectToBe(component.alt(), 'Special trademark text');
        });

        describe('... should have recomputed signal `alt` to hold an empty string if', () => {
            it.each([
                { desc: 'alt is undefined', trademark: { variant: 'JE_NO2_LIN12_OP3_J' } },
                { desc: 'trademark is undefined', trademark: undefined },
            ])('... $desc', ({ trademark }) => {
                fixture.componentRef.setInput('trademark', trademark);

                expectToBe(component.alt(), '');
            });
        });

        it('... should have computed signal `loci` to hold the formatted loci of the trademark', () => {
            expectToEqual(component.loci(), (expectedTrademark.locus ?? []).map(getItemLocus));
        });

        describe('... should have recomputed signal `loci` to hold an empty array if', () => {
            it.each([
                { desc: 'locus is undefined', trademark: { variant: 'JE_NO2_LIN12_OP3_J' } },
                { desc: 'trademark is undefined', trademark: undefined },
            ])('... $desc', ({ trademark }) => {
                fixture.componentRef.setInput('trademark', trademark);

                expectToEqual(component.loci(), []);
            });
        });

        describe('VIEW', () => {
            it('... should contain a span with the trademark image if a variant is available', () => {
                const trademarkSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material-trademark',
                    1,
                    1
                );
                const imgDes = getAndExpectDebugElementByCss(trademarkSpanDes[0], 'img.img-thumbnail', 1, 1);
                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                const expectedTrademarkConstant = getTrademark(expectedTrademark.variant ?? '');

                expectToBe(imgEl.getAttribute('src'), expectedTrademarkConstant.route);
                expectToBe(imgEl.title, expectedTrademarkConstant.full);
                expectToBe(imgEl.alt, expectedTrademarkConstant.short);
                expectToBe(trademarkSpanDes[0].nativeElement.textContent.trim(), 'Firmenzeichen:');
            });

            it('... should contain a trademark span with CompileHtmlDirective if an alt text is available instead of a variant', async () => {
                fixture.componentRef.setInput('trademark', {
                    ...expectedTrademark,
                    variant: '',
                    alt: 'Special trademark text',
                });
                await detectChangesOnPush(fixture);

                const trademarkSpanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material-trademark',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(trademarkSpanDes[0], 'img', 0, 0);

                const directiveDes = getAndExpectDebugElementByDirective(
                    trademarkSpanDes[0],
                    CompileHtmlDirective,
                    1,
                    1
                );
                const directiveIns = directiveDes[0].injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                expectToBe(directiveIns.htmlContent(), 'Special trademark text');
            });

            it('... should contain a span for each trademark locus', () => {
                const expectedLoci = expectedTrademark.locus ?? [];

                const locusDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-material-trademark-locus',
                    expectedLoci.length,
                    expectedLoci.length
                );

                locusDes.forEach((locusDe, index) => {
                    const directiveIns = locusDe.injector.get(CompileHtmlDirective) as CompileHtmlDirective;

                    expectToBe(directiveIns.htmlContent(), getItemLocus(expectedLoci[index]));
                });
            });

            it('... should contain no trademark locus span if no locus is given', async () => {
                fixture.componentRef.setInput('trademark', { variant: expectedTrademark.variant });
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-material-trademark', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-material-trademark-locus', 0, 0);
            });

            describe('... should contain a span with a hint if trademark is', () => {
                it.each([
                    { desc: 'empty', trademark: {} },
                    { desc: 'undefined', trademark: undefined },
                ])('... $desc', async ({ trademark }) => {
                    fixture.componentRef.setInput('trademark', trademark);
                    await detectChangesOnPush(fixture);

                    const trademarkSpanDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-writing-material-trademark',
                        1,
                        1
                    );
                    const trademarkSpanEl: HTMLSpanElement = trademarkSpanDes[0].nativeElement;

                    expectToBe(trademarkSpanEl.textContent.trim(), 'kein Firmenzeichen');
                    getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-source-desc-writing-material-trademark-locus',
                        0,
                        0
                    );
                });
            });
        });
    });
});
