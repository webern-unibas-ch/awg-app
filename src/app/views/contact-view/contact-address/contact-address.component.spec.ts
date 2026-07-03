import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { META_DATA } from '@awg-core/data/meta.data';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/models/meta.model';

import { ContactAddressComponent } from './contact-address.component';

describe('ContactAddressComponent (DONE)', () => {
    let component: ContactAddressComponent;
    let fixture: ComponentFixture<ContactAddressComponent>;
    let compDe: DebugElement;

    let expectedPageMetaData: MetaPage;
    let expectedContactMetaData: MetaContact;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContactAddressComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedContactMetaData = META_DATA[MetaSectionTypes.contact];

        // Create component fixture
        fixture = TestBed.createComponent(ContactAddressComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `pageMetaData`', () => {
            expectToBe(isSignal(component.pageMetaData), true);

            expect(() => component.pageMetaData()).toThrow();
        });

        it('... should throw due to missing required input signal `contactMetaData`', () => {
            expectToBe(isSignal(component.contactMetaData), true);

            expect(() => component.contactMetaData()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one address field with 3 ´p´ elements', () => {
                getAndExpectDebugElementByCss(compDe, 'address', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'address p', 3, 3);

                getAndExpectDebugElementByCss(compDe, 'address p#awg-contact-address-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'address p.awg-contact-address-content', 2, 2);
            });

            it('... should not render the address header link yet', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'address p#awg-contact-address-header a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.href, '');
                expectToBe(aEl.textContent, '');
            });

            it('... should not render the address content information yet', () => {
                const contentDes = getAndExpectDebugElementByCss(compDe, 'address p.awg-contact-address-content', 2, 2);
                const content0Des = contentDes[0];
                const content1Des = contentDes[1];

                // Content1
                const insitutionDes = getAndExpectDebugElementByCss(
                    content0Des,
                    'span#awg-contact-address-institution',
                    1,
                    1
                );
                const streetDes = getAndExpectDebugElementByCss(content0Des, 'span#awg-contact-address-street', 1, 1);
                const postalCityDes = getAndExpectDebugElementByCss(
                    content0Des,
                    'span#awg-contact-address-postal-city',
                    1,
                    1
                );
                const countryDes = getAndExpectDebugElementByCss(content0Des, 'span#awg-contact-address-country', 1, 1);

                const institutionEl: HTMLSpanElement = insitutionDes[0].nativeElement;
                const streetEl: HTMLSpanElement = streetDes[0].nativeElement;
                const postalCityEl: HTMLSpanElement = postalCityDes[0].nativeElement;
                const countryEl: HTMLSpanElement = countryDes[0].nativeElement;

                // Content 2
                const phoneDes = getAndExpectDebugElementByCss(content1Des, 'span#awg-contact-address-phone', 1, 1);
                const emailDes = getAndExpectDebugElementByCss(content1Des, 'span#awg-contact-address-email a', 1, 1);

                const phoneEl: HTMLSpanElement = phoneDes[0].nativeElement;
                const emailEl: HTMLAnchorElement = emailDes[0].nativeElement;

                expectToBe(institutionEl.textContent, '');
                expectToBe(streetEl.textContent, '');
                expectToBe(postalCityEl.textContent, '');
                expectToBe(countryEl.textContent, '');

                expectToBe(phoneEl.textContent, '');
                expectToBe(emailEl.href, '');
                expectToBe(emailEl.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);
            fixture.componentRef.setInput('contactMetaData', expectedContactMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `pageMetaData` to hold the provided data', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have input signal `contactMetaData` to hold the provided data', () => {
            expectToEqual(component.contactMetaData(), expectedContactMetaData);
        });

        describe('VIEW', () => {
            it('... should render the address header link', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'address p#awg-contact-address-header a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.href, expectedPageMetaData.awgProjectUrl);
                expectToBe(aEl.textContent, expectedPageMetaData.awgProjectName);
            });

            it('... should render the address content institution information', () => {
                const institutionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-contact-address-content span#awg-contact-address-institution',
                    1,
                    1
                );
                const institutionEl: HTMLSpanElement = institutionDes[0].nativeElement;

                expectToBe(institutionEl.textContent, expectedContactMetaData.address.institution);
            });

            it('... should render the address content street information', () => {
                const streetDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-contact-address-content span#awg-contact-address-street',
                    1,
                    1
                );
                const streetEl: HTMLSpanElement = streetDes[0].nativeElement;

                expectToBe(streetEl.textContent, expectedContactMetaData.address.street);
            });

            it('... should render the address content postal city information', () => {
                const postalCityDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-contact-address-content span#awg-contact-address-postal-city',
                    1,
                    1
                );
                const postalCityEl: HTMLSpanElement = postalCityDes[0].nativeElement;

                const expectedPostalCity =
                    expectedContactMetaData.address.postalCode + '\xA0' + expectedContactMetaData.address.city;

                expectToBe(postalCityEl.textContent, expectedPostalCity);
            });

            it('... should render the address content country information', () => {
                const countryDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-contact-address-content span#awg-contact-address-country',
                    1,
                    1
                );
                const countryEl: HTMLSpanElement = countryDes[0].nativeElement;

                expectToBe(countryEl.textContent, expectedContactMetaData.address.country);
            });

            it('... should render the address content phone information', () => {
                const phoneDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-contact-address-content span#awg-contact-address-phone',
                    1,
                    1
                );
                const phoneEl: HTMLSpanElement = phoneDes[0].nativeElement;

                const expectedPhone =
                    expectedContactMetaData.phone.label + '\xA0' + expectedContactMetaData.phone.number;

                expectToBe(phoneEl.textContent, expectedPhone);
            });

            it('... should render the address content email information', () => {
                const emailDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-contact-address-content span#awg-contact-address-email a',
                    1,
                    1
                );
                const emailEl: HTMLAnchorElement = emailDes[0].nativeElement;

                expectToBe(emailEl.href, expectedContactMetaData.email.mailto);
                expectToBe(emailEl.textContent, expectedContactMetaData.email.safeString);
            });
        });
    });
});
