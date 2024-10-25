import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService } from '@awg-views/edition-view/services';

import { EditionSectionDetailPlaceholderComponent } from './edition-section-detail-placeholder.component';

// Mock components
@Component({ selector: 'awg-alert-info', template: '' })
class AlertInfoStubComponent {
    @Input()
    infoMessage: string;
}

describe('EditionSectionDetailPlaceholderComponent', () => {
    let component: EditionSectionDetailPlaceholderComponent;
    let fixture: ComponentFixture<EditionSectionDetailPlaceholderComponent>;
    let compDe: DebugElement;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;

    let expectedInfoMessage: string;

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailPlaceholderComponent, AlertInfoStubComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSectionDetailPlaceholderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedSeries = JSON.parse(JSON.stringify(EditionOutlineService.getEditionOutline()[0]));
        expectedSelectedSection = JSON.parse(JSON.stringify(expectedSelectedSeries.sections[4]));

        const series = expectedSelectedSeries.series.short;
        const section = expectedSelectedSection.section.short;
        expectedInfoMessage = `[Diese Inhalte erscheinen im Zusammenhang der vollständigen Edition von AWG ${series}/${section}.]`;
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
            it('... should contain an AlertInfoComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
            });

            it('... should not pass down infoMessage to AlertInfoComponent yet', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expect(alertInfoCmp.infoMessage).toBeUndefined();
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
            it('... should pass down infoMessage to AlertInfoComponent', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoStubComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoStubComponent) as AlertInfoStubComponent;

                expectToEqual(alertInfoCmp.infoMessage, expectedInfoMessage);
            });
        });
    });
});
