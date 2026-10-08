import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { SourceDescWritingMaterial } from '@awg-views/edition-view/models/source-desc.model';

import { SourceDescWritingMaterialComponent } from './material/source-desc-writing-material.component';
import { SourceDescWritingMaterialsComponent } from './source-desc-writing-materials.component';

describe('SourceDescWritingMaterialsComponent', () => {
    let component: SourceDescWritingMaterialsComponent;
    let fixture: ComponentFixture<SourceDescWritingMaterialsComponent>;
    let compDe: DebugElement;

    let expectedWritingMaterials: SourceDescWritingMaterial[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SourceDescWritingMaterialComponent, SourceDescWritingMaterialsComponent],
        })
            .overrideComponent(SourceDescWritingMaterialComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedWritingMaterials = JSON.parse(
            JSON.stringify(mockEditionData.mockSourceDescListData.sources[2].physDesc.writingMaterials)
        );

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescWritingMaterialsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `writingMaterials`', () => {
            expectToBe(isSignal(component.writingMaterials), true);

            expect(() => component.writingMaterials()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain the paragraph with label and content span, but no writing materials yet', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-writing-materials', 1, 1);

                getAndExpectDebugElementByCss(pDes[0], 'span.awg-source-desc-writing-materials-label', 1, 1);
                getAndExpectDebugElementByCss(pDes[0], 'span.awg-source-desc-writing-materials-content', 1, 1);
                getAndExpectDebugElementByDirective(pDes[0], SourceDescWritingMaterialComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('writingMaterials', expectedWritingMaterials);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `writingMaterials` to hold the provided writing materials', () => {
            expectToEqual(component.writingMaterials(), expectedWritingMaterials);
        });

        describe('VIEW', () => {
            it('... should contain one paragraph (p.awg-source-desc-writing-materials)', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-source-desc-writing-materials', 1, 1);
            });

            it('... should display correct label in smallcaps', () => {
                const spanDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-materials-label',
                    1,
                    1
                );
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), 'Beschreibstoff:');
                expectToContain(spanEl.classList, 'smallcaps');
            });

            it('... should contain a span with class `awg-source-desc-writing-materials-content`', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-desc-writing-materials-content', 1, 1);
            });

            it('... should contain one SourceDescWritingMaterialComponent (hollow) for each writing material', () => {
                const contentDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-materials-content',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(
                    contentDes[0],
                    SourceDescWritingMaterialComponent,
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );
            });

            it('... should pass down the writing material to each SourceDescWritingMaterialComponent (hollow)', () => {
                const materialDes = getAndExpectDebugElementByDirective(
                    compDe,
                    SourceDescWritingMaterialComponent,
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );

                materialDes.forEach((materialDe, index) => {
                    const materialCmp = materialDe.injector.get(SourceDescWritingMaterialComponent);

                    expectToEqual(materialCmp.material(), expectedWritingMaterials[index]);
                });
            });

            it('... should end each writing material statement with a semicolon, except the last one with a full stop', () => {
                const punctuationDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-source-desc-writing-materials-content > span',
                    expectedWritingMaterials.length,
                    expectedWritingMaterials.length
                );

                punctuationDes.forEach((punctuationDe, index) => {
                    const punctuationEl: HTMLSpanElement = punctuationDe.nativeElement;
                    const expectedPunctuation = index === expectedWritingMaterials.length - 1 ? '.' : ';';

                    expectToBe(punctuationEl.textContent, expectedPunctuation);
                });
            });
        });
    });
});
