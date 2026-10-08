import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

import { EditionGraphPlaceholderComponent } from './edition-graph-placeholder.component';

describe('EditionGraphPlaceholderComponent (DONE)', () => {
    let component: EditionGraphPlaceholderComponent;
    let fixture: ComponentFixture<EditionGraphPlaceholderComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedComplex: EditionComplex;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionGraphPlaceholderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op25');

        // Create component fixture
        fixture = TestBed.createComponent(EditionGraphPlaceholderComponent);
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
            it('... should contain no `p.awg-graph-placeholder` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-graph-placeholder', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
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

                getAndExpectDebugElementByCss(compDe, 'p.awg-graph-placeholder', 0, 0);
            });

            it('... should contain one `p.awg-graph-placeholder` with a muted small element', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-graph-placeholder', 1, 1);

                getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
            });

            it('... should display the placeholder text in the small element', () => {
                const smallDes = getAndExpectDebugElementByCss(compDe, 'p.awg-graph-placeholder > small', 1, 1);
                const smallEl: HTMLElement = smallDes[0].nativeElement;

                // Create graph placeholder
                const fullComplexSpan = mockDocument.createElement('span');
                fullComplexSpan.innerHTML = expectedComplex.complexId.full;

                const shortComplexSpan = mockDocument.createElement('span');
                shortComplexSpan.innerHTML = expectedComplex.complexId.short;

                const sectionLabel = expectedComplex.pubStatement.labeledSectionRoute.label;
                const graphPlaceholder = `[Die Graph-Visualisierungen zum Editionskomplex ${fullComplexSpan.textContent} erscheinen im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${sectionLabel}.]`;

                expectToBe(smallEl.textContent.trim(), graphPlaceholder);
            });
        });
    });
});
