import { TitleCasePipe } from '@angular/common';
import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AlertErrorComponent } from './alert-error.component';

describe('AlertErrorComponent', () => {
    let component: AlertErrorComponent;
    let fixture: ComponentFixture<AlertErrorComponent>;
    let compDe: DebugElement;

    const titlecasePipe = new TitleCasePipe();

    let expectedErrorObjectWithKey: any;
    let expectedErrorObjectWithoutKey: any;
    let expectedErrorObjectWithStringError: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertErrorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedErrorObjectWithKey = {
            key: 'preface',
            error: { status: 404, message: 'Data not found' },
        };

        expectedErrorObjectWithoutKey = {
            key: '',
            error: { message: 'Connection refused' },
        };

        expectedErrorObjectWithStringError = {
            key: 'report',
            error: 'Server is currently offline.',
        };

        // Create component fixture
        fixture = TestBed.createComponent(AlertErrorComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `errorObject`', () => {
            expectToBe(isSignal(component.errorObject), true);

            expect(() => component.errorObject()).toThrow();
        });

        describe('VIEW', () => {
            it('... should have an outer `div.awg-error-message`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-error-message', 1, 1);
            });

            it('... should have a centered danger alert in `div.awg-error-message`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-error-message ', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.text-center > div.alert-danger', 1, 1);
            });

            it('... should not display an error message in `div.alert-danger` yet', () => {
                const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                const alertEl: HTMLDivElement = alertDes[0].nativeElement;

                expectToBe(alertEl.textContent.trim(), '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial value for the signal input
            fixture.componentRef.setInput('errorObject', expectedErrorObjectWithKey);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            describe('with key', () => {
                it('... should display the formatted key and the error message', () => {
                    const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                    const alertEl: HTMLDivElement = alertDes[0].nativeElement;
                    const content = alertEl.textContent || '';

                    const expectedKeyText = titlecasePipe.transform(expectedErrorObjectWithKey.key);
                    expectToContain(content, expectedKeyText);

                    expectToContain(content, expectedErrorObjectWithKey.error.message);
                });
            });

            it('... should display the fallback "Error:" strong tag if key is empty', () => {
                fixture.componentRef.setInput('errorObject', expectedErrorObjectWithoutKey);
                fixture.detectChanges();

                const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                const alertEl: HTMLDivElement = alertDes[0].nativeElement;
                const content = alertEl.textContent || '';

                expectToContain(content, 'Error:');
                expectToContain(content, expectedErrorObjectWithoutKey.error.message);
            });

            it('... should display the raw string error if no nested message property exists', () => {
                fixture.componentRef.setInput('errorObject', expectedErrorObjectWithStringError);
                fixture.detectChanges();

                const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                const alertEl: HTMLDivElement = alertDes[0].nativeElement;
                const content = alertEl.textContent || '';

                const expectedKeyText = titlecasePipe.transform(expectedErrorObjectWithStringError.key);
                expectToContain(content, expectedKeyText);

                expectToContain(content, expectedErrorObjectWithStringError.error);
            });
        });
    });
});
