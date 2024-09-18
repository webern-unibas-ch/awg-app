import { JsonPipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { ErrorAlertComponent } from './error-alert.component';

describe('ErrorAlertComponent', () => {
    let component: ErrorAlertComponent;
    let fixture: ComponentFixture<ErrorAlertComponent>;
    let compDe: DebugElement;

    let expectedErrorObject: any;

    const jsonPipe = new JsonPipe();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorAlertComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorAlertComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedErrorObject = { status: 404, statusText: 'got Error' };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `errorObject`', () => {
            expect(component.errorObject).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should have an outer div.awg-error-message', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-error-message', 1, 1);
            });

            it('... should have a centered danger alert in div.awg-error-message', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-error-message ', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.text-center > div.alert-danger', 1, 1);
            });

            it('... should not display an error message in div.alert yet', () => {
                const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                const alertEl = alertDes[0].nativeElement;

                expectToBe(alertEl.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.errorObject = expectedErrorObject;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should display an error message in div.alert', () => {
                const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                const alertEl = alertDes[0].nativeElement;

                expectToContain(alertEl.textContent, jsonPipe.transform(expectedErrorObject));
            });
        });
    });
});
