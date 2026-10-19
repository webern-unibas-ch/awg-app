import { TitleCasePipe } from '@angular/common';
import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AlertErrorComponent } from './alert-error.component';
import { AlertError } from './alert-error.model';

describe('AlertErrorComponent', () => {
    let component: AlertErrorComponent;
    let fixture: ComponentFixture<AlertErrorComponent>;
    let compDe: DebugElement;

    const titlecasePipe = new TitleCasePipe();

    let expectedErrorObjectWithKey: AlertError;
    let expectedErrorObjectWithoutKey: AlertError;
    let expectedErrorObjectWithStringError: AlertError;

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

        it('... should throw due to missing required input signal for computed signal `errorMessage`', () => {
            expectToBe(isSignal(component.errorMessage), true);

            expect(() => component.errorMessage()).toThrow();
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

        describe('... should have computed signal `errorMessage` to hold', () => {
            it.each<{ desc: string; error: unknown; expected: string }>([
                {
                    desc: 'the message of an error object',
                    error: { status: 404, message: 'Data not found' },
                    expected: 'Data not found',
                },
                {
                    desc: 'the message of an Error',
                    error: new Error('Connection refused'),
                    expected: 'Connection refused',
                },
                {
                    desc: 'a string error',
                    error: 'Server is currently offline.',
                    expected: 'Server is currently offline.',
                },
                {
                    desc: 'an empty string if the error has no message',
                    error: { status: 500 },
                    expected: '',
                },
                { desc: 'an empty string if the error is null', error: null, expected: '' },
                { desc: 'an empty string if the error is undefined', error: undefined, expected: '' },
            ])('... $desc', ({ error, expected }) => {
                fixture.componentRef.setInput('errorObject', { key: 'preface', error });

                expectToBe(component.errorMessage(), expected);
            });
        });

        describe('VIEW', () => {
            describe('with key', () => {
                it('... should display the formatted key and the error message', () => {
                    const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                    const alertEl: HTMLDivElement = alertDes[0].nativeElement;
                    const content = alertEl.textContent || '';

                    const expectedKeyText = titlecasePipe.transform(expectedErrorObjectWithKey.key);
                    expectToContain(content, expectedKeyText);

                    expectToContain(content, 'Data not found');
                });
            });

            it('... should display the fallback "Error:" strong tag if key is empty', () => {
                fixture.componentRef.setInput('errorObject', expectedErrorObjectWithoutKey);
                fixture.detectChanges();

                const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                const alertEl: HTMLDivElement = alertDes[0].nativeElement;
                const content = alertEl.textContent || '';

                expectToContain(content, 'Error:');
                expectToContain(content, 'Connection refused');
            });

            it('... should display the raw string error if no nested message property exists', () => {
                fixture.componentRef.setInput('errorObject', expectedErrorObjectWithStringError);
                fixture.detectChanges();

                const alertDes = getAndExpectDebugElementByCss(compDe, 'div.alert-danger', 1, 1);
                const alertEl: HTMLDivElement = alertDes[0].nativeElement;
                const content = alertEl.textContent || '';

                const expectedKeyText = titlecasePipe.transform(expectedErrorObjectWithStringError.key);
                expectToContain(content, expectedKeyText);

                expectToContain(content, 'Server is currently offline.');
            });
        });
    });
});
