import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { AlertInfoStubComponent } from '@testing/component-stubs';
import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

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
            imports: [AlertInfoStubComponent],
            declarations: [EditionSectionDetailPlaceholderComponent],
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
            it('... should contain no AlertInfoComponent (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('selectedSection', structuredClone(expectedSection));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain an AlertInfoComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
            });

            it('... should pass down correct values to AlertInfoComponent (`infoMessage `)', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expectToEqual(alertInfoCmp.infoMessage(), expectedInfoMessage);
            });
        });
    });
});
