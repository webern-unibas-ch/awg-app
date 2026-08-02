import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { AlertInfoStubComponent } from '@testing/component-stubs';
import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';

import { EditionSectionDetailPlaceholderComponent } from './edition-section-detail-placeholder.component';

describe('EditionSectionDetailPlaceholderComponent', () => {
    let component: EditionSectionDetailPlaceholderComponent;
    let fixture: ComponentFixture<EditionSectionDetailPlaceholderComponent>;
    let compDe: DebugElement;

    let expectedSeries: EditionOutlineSeries;
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
        expectedSeries = EditionStateHelper.getSeries('1');
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
        it('... should not have `selectedSeries`', () => {
            expect(component.selectedSeries).toBeUndefined();
        });

        it('... should not have `selectedSection`', () => {
            expect(component.selectedSection).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain an AlertInfoComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
            });

            it('... should throw when accessing AlertInfoComponent inputs (`infoMessage`) due to missing initial data binding', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expect(() => alertInfoCmp.infoMessage()).toThrow();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.selectedSeries = structuredClone(expectedSeries);
            component.selectedSection = structuredClone(expectedSection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down correct values to AlertInfoComponent (`infoMessage `)', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expectToEqual(alertInfoCmp.infoMessage(), expectedInfoMessage);
            });
        });
    });
});
