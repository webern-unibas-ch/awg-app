import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

import { EditionIntroPlaceholderComponent } from './edition-intro-placeholder.component';

describe('EditionIntroPlaceholderComponent (DONE)', () => {
    let component: EditionIntroPlaceholderComponent;
    let fixture: ComponentFixture<EditionIntroPlaceholderComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionLabel: string;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroPlaceholderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionIntroPlaceholderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('op12');
        expectedEditionLabel = 'AWG';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should not have `editionLabel`', () => {
            expect(component.editionLabel).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain a `div.awg-edition-intro-placeholder`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-placeholder', 1, 1);
            });

            it('... should contain a small, text-muted paragraph in div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-placeholder', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expect(pEl.classList.contains('text-muted')).toBe(true);
                expect(pEl.classList.contains('small')).toBe(true);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionComplex = expectedEditionComplex;
            component.editionLabel = expectedEditionLabel;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `editionComplex`', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
        });

        it('... should have `editionLabel`', () => {
            expectToBe(component.editionLabel, expectedEditionLabel);
        });

        describe('VIEW', () => {
            it('... should display small, text-muted placeholder in paragraph', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-placeholder', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expect(pEl.classList.contains('text-muted')).toBe(true);
                expect(pEl.classList.contains('small')).toBe(true);

                // Create intro placeholder
                const fullComplexSpan = mockDocument.createElement('span');
                fullComplexSpan.innerHTML = expectedEditionComplex.complexId.full;

                const shortComplexSpan = mockDocument.createElement('span');
                shortComplexSpan.innerHTML = expectedEditionComplex.complexId.short;

                const awg = expectedEditionLabel;
                const series = expectedEditionComplex.pubStatement.series.short;
                const section = expectedEditionComplex.pubStatement.section.short;

                const introPlaceholder = `[Die Einleitung zum Editionskomplex ${fullComplexSpan.textContent} erscheint im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${awg} ${series}/${section}.]`;

                expectToBe(pEl.textContent.trim(), introPlaceholder);
            });
        });
    });
});
