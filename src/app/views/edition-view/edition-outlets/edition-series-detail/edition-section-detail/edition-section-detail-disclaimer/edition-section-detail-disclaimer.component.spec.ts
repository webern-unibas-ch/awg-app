import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { EditionSectionDetailDisclaimerComponent } from './edition-section-detail-disclaimer.component';

// Mock components
@Component({ selector: 'awg-alert-info', template: '' })
class AlertInfoStubComponent {
    @Input()
    infoMessage: string;
}

describe('EditionSectionDetailDisclaimerComponent (DONE)', () => {
    let component: EditionSectionDetailDisclaimerComponent;
    let fixture: ComponentFixture<EditionSectionDetailDisclaimerComponent>;
    let compDe: DebugElement;

    let expectedInfoMessage: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailDisclaimerComponent, AlertInfoStubComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditionSectionDetailDisclaimerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedInfoMessage = `Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.`;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
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
