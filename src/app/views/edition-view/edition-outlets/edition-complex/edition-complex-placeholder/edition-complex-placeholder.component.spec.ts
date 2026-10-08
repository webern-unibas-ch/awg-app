import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import {
    EDITION_COMPLEX_PLACEHOLDER_SUBJECTS,
    EditionComplexPlaceholderType,
} from '@awg-views/edition-view/models/edition-complex-placeholder.model';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

import { EditionComplexPlaceholderComponent } from './edition-complex-placeholder.component';

describe('EditionComplexPlaceholderComponent (DONE)', () => {
    let component: EditionComplexPlaceholderComponent;
    let fixture: ComponentFixture<EditionComplexPlaceholderComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedComplex: EditionComplex;
    let expectedType: EditionComplexPlaceholderType;

    /**
     * Helper function: getTextContent.
     *
     * It gets the text content of the given HTML string (e.g. of a complex id).
     */
    const getTextContent = (html: string): string => {
        const spanEl = mockDocument.createElement('span');
        spanEl.innerHTML = html;
        return spanEl.textContent;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionComplexPlaceholderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedComplex = EditionStateHelper.getComplex('op12');
        expectedType = 'intro';

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexPlaceholderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `type`', () => {
            expectToBe(isSignal(component.type), true);

            expect(() => component.type()).toThrow();
        });

        it('... should throw due to missing required input signal `editionComplex`', () => {
            expectToBe(isSignal(component.editionComplex), true);

            expect(() => component.editionComplex()).toThrow();
        });

        it('... should have `EDITION_COMPLEX_PLACEHOLDER_SUBJECTS` to hold a subject with verb per placeholder type', () => {
            expectToEqual(EDITION_COMPLEX_PLACEHOLDER_SUBJECTS, {
                graph: { subject: 'Die Graph-Visualisierungen', verb: 'erscheinen' },
                intro: { subject: 'Die Einleitung', verb: 'erscheint' },
                sourceEvaluation: { subject: 'Die Quellenbewertung', verb: 'erscheint' },
            });
        });

        describe('VIEW', () => {
            it('... should contain no `p.awg-edition-complex-placeholder` yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-placeholder', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('type', expectedType);
            fixture.componentRef.setInput('editionComplex', expectedComplex);

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `type` to hold the provided placeholder type', () => {
            expectToBe(component.type(), expectedType);
        });

        it('... should have input signal `editionComplex` to hold the provided complex', () => {
            expectToEqual(component.editionComplex(), expectedComplex);
        });

        it('... should have computed signal `placeholderSubject` to hold the subject of the placeholder type', () => {
            expectToEqual(component.placeholderSubject(), EDITION_COMPLEX_PLACEHOLDER_SUBJECTS.intro);
        });

        describe('VIEW', () => {
            it('... should contain one `p.awg-edition-complex-placeholder` with one small, text-muted element', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-placeholder', 1, 1);
                const smallDes = getAndExpectDebugElementByCss(pDes[0], 'small', 1, 1);

                expectToContain(smallDes[0].nativeElement.classList, 'text-muted');
            });

            it.each(Object.keys(EDITION_COMPLEX_PLACEHOLDER_SUBJECTS) as EditionComplexPlaceholderType[])(
                '... should display the placeholder text for type `%s`',
                async type => {
                    fixture.componentRef.setInput('type', type);
                    await detectChangesOnPush(fixture);

                    const { subject, verb } = EDITION_COMPLEX_PLACEHOLDER_SUBJECTS[type];
                    const fullComplexId = getTextContent(expectedComplex.complexId.full);
                    const shortComplexId = getTextContent(expectedComplex.complexId.short);
                    const sectionLabel = expectedComplex.pubStatement.labeledSectionRoute.label;
                    const expectedText = `[${subject} zum Editionskomplex ${fullComplexId} ${verb} im Zusammenhang der vollständigen Edition von ${shortComplexId} in ${sectionLabel}.]`;

                    const smallDes = getAndExpectDebugElementByCss(
                        compDe,
                        'p.awg-edition-complex-placeholder > small',
                        1,
                        1
                    );

                    expectToBe(smallDes[0].nativeElement.textContent.trim(), expectedText);
                }
            );

            it('... should render no content if editionComplex is not available', async () => {
                fixture.componentRef.setInput('editionComplex', null);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-placeholder', 0, 0);
            });
        });
    });
});
