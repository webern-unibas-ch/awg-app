import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionSectionDetailCoverComponent } from './edition-section-detail-cover.component';

describe('EditionSectionDetailCoverComponent (DONE)', () => {
    let component: EditionSectionDetailCoverComponent;
    let fixture: ComponentFixture<EditionSectionDetailCoverComponent>;
    let compDe: DebugElement;

    let expectedSection: EditionOutlineSection;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionDetailCoverComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSection = EditionStateHelper.getSection('1', '5');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailCoverComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedSection`', () => {
            expectToBe(isSignal(component.selectedSection), true);

            expect(() => component.selectedSection()).toThrow();
        });

        describe('VIEW', () => {
            it('... should not contain a img.awg-edition-section-detail-cover yet', () => {
                getAndExpectDebugElementByCss(compDe, 'img.awg-edition-section-detail-cover', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('selectedSection', structuredClone(expectedSection));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedSection` to hold the expected section', () => {
            expectToEqual(component.selectedSection(), expectedSection);
        });

        describe('VIEW', () => {
            it('... should render no content if selected section is not available', () => {
                fixture.componentRef.setInput('selectedSection', null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'img.awg-edition-section-detail-cover', 0, 0);
            });

            it('... should contain one img.awg-edition-section-detail-cover', () => {
                getAndExpectDebugElementByCss(compDe, 'img.awg-edition-section-detail-cover', 1, 1);
            });

            it('... should render the cover with the expected src, title and alt attributes', () => {
                const imageDes = getAndExpectDebugElementByCss(compDe, 'img.awg-edition-section-detail-cover', 1, 1);
                const imageEl: HTMLImageElement = imageDes[0].nativeElement;

                const expectedLabel = expectedSection.labeledRoute.label;

                expectToContain(imageEl.src, expectedSection.labeledRoute.route.join('/') + '/cover.jpg');
                expectToBe(imageEl.title, expectedLabel);
                expectToBe(imageEl.alt, 'Cover ' + expectedLabel);
            });
        });
    });
});
