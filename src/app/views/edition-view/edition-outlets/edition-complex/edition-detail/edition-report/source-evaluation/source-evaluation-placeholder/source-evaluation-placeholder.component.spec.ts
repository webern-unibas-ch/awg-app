import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

import { SourceEvaluationPlaceholderComponent } from './source-evaluation-placeholder.component';

describe('SourceEvaluationPlaceholderComponent', () => {
    let component: SourceEvaluationPlaceholderComponent;
    let fixture: ComponentFixture<SourceEvaluationPlaceholderComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedComplex: EditionComplex;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SourceEvaluationPlaceholderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        const complexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(complexId);

        // Create component fixture
        fixture = TestBed.createComponent(SourceEvaluationPlaceholderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `editionComplex`', () => {
            expectToBe(isSignal(component.editionComplex), true);

            expect(() => component.editionComplex()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no p.awg-source-evaluation-placeholder yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-source-evaluation-placeholder', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('editionComplex', expectedComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `editionComplex` to hold the expected complex', () => {
            expectToEqual(component.editionComplex(), expectedComplex);
        });

        describe('VIEW', () => {
            it('... should render no content if editionComplex is not available', () => {
                fixture.componentRef.setInput('editionComplex', null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'p.awg-source-evaluation-placeholder', 0, 0);
            });

            it('... should contain one p.awg-source-evaluation-placeholder', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-source-evaluation-placeholder', 1, 1);
            });

            it('... should contain one text-muted small element in placeholder paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-evaluation-placeholder', 1, 1);

                getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
            });

            it('... should display correct text in placeholder paragraph', async () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-source-evaluation-placeholder', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                // Create evaluation placeholder
                const fullComplexSpan = mockDocument.createElement('span');
                fullComplexSpan.innerHTML = expectedComplex.complexId.full;

                const shortComplexSpan = mockDocument.createElement('span');
                shortComplexSpan.innerHTML = expectedComplex.complexId.short;

                const sectionLabel = expectedComplex.pubStatement.labeledSectionRoute.label;

                const evaluationPlaceholder = `[Die Quellenbewertung zum Editionskomplex ${fullComplexSpan.textContent} erscheint im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${sectionLabel}.]`;

                expectToBe(pEl.textContent.trim(), evaluationPlaceholder);
            });
        });
    });
});
