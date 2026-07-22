import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

import { EditionIntroPlaceholderComponent } from './edition-intro-placeholder.component';

describe('EditionIntroPlaceholderComponent (DONE)', () => {
    let component: EditionIntroPlaceholderComponent;
    let fixture: ComponentFixture<EditionIntroPlaceholderComponent>;
    let compDe: DebugElement;

    let editionComplexesService: EditionComplexesService;
    let mockDocument: Document;

    let expectedEditionComplex: EditionComplex;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionIntroPlaceholderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        mockDocument = TestBed.inject(DOCUMENT);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();

        // Test data
        expectedEditionComplex = editionComplexesService.getEditionComplexById('op12');

        // Create component fixture
        fixture = TestBed.createComponent(EditionIntroPlaceholderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain a `div.awg-edition-intro-placeholder`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-placeholder', 1, 1);
            });

            it('... should contain a small, text-muted paragraph in div', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-placeholder', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'text-muted');
                expectToContain(pEl.classList, 'small');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionComplex = expectedEditionComplex;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `editionComplex`', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
        });

        describe('VIEW', () => {
            it('... should display small, text-muted placeholder in paragraph', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-placeholder', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToContain(pEl.classList, 'text-muted');
                expectToContain(pEl.classList, 'small');

                // Create intro placeholder
                const fullComplexSpan = mockDocument.createElement('span');
                fullComplexSpan.innerHTML = expectedEditionComplex.complexId.full;

                const shortComplexSpan = mockDocument.createElement('span');
                shortComplexSpan.innerHTML = expectedEditionComplex.complexId.short;

                const sectionLabel = expectedEditionComplex.pubStatement.labeledSectionRoute.label;
                const introPlaceholder = `[Die Einleitung zum Editionskomplex ${fullComplexSpan.textContent} erscheint im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${sectionLabel}.]`;

                expectToBe(pEl.textContent.trim(), introPlaceholder);
            });
        });
    });
});
