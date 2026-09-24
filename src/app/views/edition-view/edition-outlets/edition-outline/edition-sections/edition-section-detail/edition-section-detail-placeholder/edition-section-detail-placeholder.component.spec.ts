import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';
import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionSectionDetailPlaceholderComponent } from './edition-section-detail-placeholder.component';

describe('EditionSectionDetailPlaceholderComponent', () => {
    let component: EditionSectionDetailPlaceholderComponent;
    let fixture: ComponentFixture<EditionSectionDetailPlaceholderComponent>;
    let compDe: DebugElement;

    let expectedSection: EditionOutlineSection;
    let expectedInfoMessage: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionDetailPlaceholderComponent, AlertInfoComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSection = EditionStateHelper.getSection('1', '5');

        const sectionLabel = expectedSection.labeledRoute.label;
        expectedInfoMessage = `[Diese Inhalte erscheinen im Zusammenhang der vollständigen Edition von ${sectionLabel}.]`;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailPlaceholderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedSection`', () => {
            expectToBe(isSignal(component.selectedSection), true);

            expect(() => component.selectedSection()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no AlertInfoComponent yet', () => {
                getAndExpectDebugElementByDirective(compDe, AlertInfoComponent, 0, 0);
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

                getAndExpectDebugElementByDirective(compDe, AlertInfoComponent, 0, 0);
            });

            it('... should contain an AlertInfoComponent', () => {
                getAndExpectDebugElementByDirective(compDe, AlertInfoComponent, 1, 1);
            });

            it('... should pass down the correct values to AlertInfoComponent (`infoMessage `)', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoComponent) as AlertInfoComponent;

                expectToEqual(alertInfoCmp.infoMessage(), expectedInfoMessage);
            });
        });
    });
});
