import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';

import { EditionSectionDetailDisclaimerComponent } from './edition-section-detail-disclaimer.component';

describe('EditionSectionDetailDisclaimerComponent (DONE)', () => {
    let component: EditionSectionDetailDisclaimerComponent;
    let fixture: ComponentFixture<EditionSectionDetailDisclaimerComponent>;
    let compDe: DebugElement;

    let expectedInfoMessage: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionDetailDisclaimerComponent, AlertInfoComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedInfoMessage = `Die Online-Edition wird in Bezug auf Umfang und Funktionalität kontinuierlich erweitert.`;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailDisclaimerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        describe('VIEW', () => {
            it('... should contain one AlertInfoComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AlertInfoComponent, 1, 1);
            });

            it('... should throw when accessing AlertInfoComponent inputs (`infoMessage`) due to missing initial data binding', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoComponent) as AlertInfoComponent;

                expect(() => alertInfoCmp.infoMessage()).toThrow();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down the correct values to AlertInfoComponent (`infoMessage`)', () => {
                const alertInfoDes = getAndExpectDebugElementByDirective(compDe, AlertInfoComponent, 1, 1);
                const alertInfoCmp = alertInfoDes[0].injector.get(AlertInfoComponent) as AlertInfoComponent;

                expectToEqual(alertInfoCmp.infoMessage(), expectedInfoMessage);
            });
        });
    });
});
