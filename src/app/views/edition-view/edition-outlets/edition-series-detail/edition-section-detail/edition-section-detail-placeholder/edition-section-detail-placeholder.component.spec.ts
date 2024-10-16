import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { EditionSectionDetailPlaceholderComponent } from './edition-section-detail-placeholder.component';

describe('EditionSectionDetailPlaceholderComponent', () => {
    let component: EditionSectionDetailPlaceholderComponent;
    let fixture: ComponentFixture<EditionSectionDetailPlaceholderComponent>;
    let compDe: DebugElement;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailPlaceholderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSectionDetailPlaceholderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedSeries = JSON.parse(JSON.stringify(EditionOutlineService.getEditionOutline()[0]));
        expectedSelectedSection = JSON.parse(JSON.stringify(expectedSelectedSeries.sections[4]));
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedSeries`', () => {
            expect(component.selectedSeries).toBeUndefined();
        });

        it('... should not have `selectedSection`', () => {
            expect(component.selectedSection).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.alert-info', () => {
                getAndExpectDebugElementByCss(compDe, 'div.alert-info', 1, 1);
            });

            it('... should contain one centered, muted paragraph in div.alert-info', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.alert-info', 1, 1);
                const pDe = getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
                const pEl = pDe[0].nativeElement;

                expectToContain(pEl.classList, 'text-muted');
                expectToContain(pEl.classList, 'text-center');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.selectedSeries = expectedSelectedSeries;
            component.selectedSection = expectedSelectedSection;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should display placeholder in paragraph', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.alert-info', 1, 1);
                const pDe = getAndExpectDebugElementByCss(divDe[0], 'p', 1, 1);
                const pEl = pDe[0].nativeElement;

                const series = expectedSelectedSeries.series.short;
                const section = expectedSelectedSection.section.short;

                const expectedPlaceholder = `[Diese Inhalte erscheinen im Zusammenhang der vollständigen Edition von AWG ${series}/${section}.]`;

                expectToBe(pEl.textContent.trim(), expectedPlaceholder.trim());
            });
        });
    });
});
