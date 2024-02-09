import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { METADATA } from '@awg-core/core-data';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { AddressComponent } from './address.component';

describe('AddressComponent (DONE)', () => {
    let component: AddressComponent;
    let fixture: ComponentFixture<AddressComponent>;
    let compDe: DebugElement;

    let expectedPageMetaData: MetaPage;
    let expectedContactMetaData: MetaContact;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AddressComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddressComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
        expectedContactMetaData = METADATA[MetaSectionTypes.contact];
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `pageMetaData` input', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        it('... should not have `contactMetaData` input', () => {
            expect(component.contactMetaData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one address field with 3 ´p´ elements', () => {
                getAndExpectDebugElementByCss(compDe, 'address', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'address p', 3, 3);

                getAndExpectDebugElementByCss(compDe, 'address p#awg-address-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'address p.awg-address-content', 2, 2);
            });

            it('... should not render the address header information yet', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'address p#awg-address-header a', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl.href).toBeDefined();
                expect(headerEl.href).toBeFalsy();

                expect(headerEl.textContent).toBeDefined();
                expect(headerEl.textContent).toBeFalsy();
            });

            it('... should not render the address content information yet', () => {
                const contentDes = getAndExpectDebugElementByCss(compDe, 'address p.awg-address-content', 2, 2);
                const content0Des = contentDes[0];
                const content1Des = contentDes[1];

                // Content1
                const insitutionDes = getAndExpectDebugElementByCss(content0Des, '#awg-address-institution', 1, 1);
                const streetDes = getAndExpectDebugElementByCss(content0Des, '#awg-address-street', 1, 1);
                const postalCityDes = getAndExpectDebugElementByCss(content0Des, '#awg-address-postal-city', 1, 1);
                const countryDes = getAndExpectDebugElementByCss(content0Des, '#awg-address-country', 1, 1);

                const institutionEl = insitutionDes[0].nativeElement;
                const streetEl = streetDes[0].nativeElement;
                const postalCityEl = postalCityDes[0].nativeElement;
                const countryEl = countryDes[0].nativeElement;

                // Content 2
                const phoneDes = getAndExpectDebugElementByCss(content1Des, '#awg-address-phone', 1, 1);
                const emailDes = getAndExpectDebugElementByCss(content1Des, '#awg-address-email a', 1, 1);

                const phoneEl = phoneDes[0].nativeElement;
                const emailEl = emailDes[0].nativeElement;

                expect(institutionEl.textContent).toBeDefined();
                expect(institutionEl.textContent).toBeFalsy();

                expect(streetEl.textContent).toBeDefined();
                expect(streetEl.textContent).toBeFalsy();

                expect(postalCityEl.textContent).toBeDefined();
                expect(postalCityEl.textContent).toBeFalsy();

                expect(countryEl.textContent).toBeDefined();
                expect(countryEl.textContent).toBeFalsy();

                expect(phoneEl.textContent).toBeDefined();
                expect(phoneEl.textContent).toBeFalsy();

                expect(emailEl.href).toBeDefined();
                expect(emailEl.href).toBeFalsy();
                expect(emailEl.textContent).toBeDefined();
                expect(emailEl.textContent).toBeFalsy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.pageMetaData = expectedPageMetaData;
            component.contactMetaData = expectedContactMetaData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render the address header information', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'address p#awg-address-header a', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl.href).toBeTruthy();
                expect(headerEl.href)
                    .withContext(`should be ${expectedPageMetaData.awgProjectUrl}`)
                    .toBe(expectedPageMetaData.awgProjectUrl);

                expect(headerEl.textContent).toBeTruthy();
                expect(headerEl.textContent)
                    .withContext(`should be ${expectedPageMetaData.awgProjectName}`)
                    .toBe(expectedPageMetaData.awgProjectName);
            });

            it('... should render the address content institution information', () => {
                const institutionDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-address-content span#awg-address-institution',
                    1,
                    1
                );
                const institutionEl = institutionDes[0].nativeElement;

                expect(institutionEl.textContent).toBeTruthy();
                expect(institutionEl.textContent)
                    .withContext(`should be ${expectedContactMetaData.address.institution}`)
                    .toBe(expectedContactMetaData.address.institution);
            });

            it('... should render the address content street information', () => {
                const streetDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-address-content span#awg-address-street',
                    1,
                    1
                );
                const streetEl = streetDes[0].nativeElement;

                expect(streetEl.textContent).toBeTruthy();
                expect(streetEl.textContent)
                    .withContext(`should be ${expectedContactMetaData.address.street}`)
                    .toBe(expectedContactMetaData.address.street);
            });

            it('... should render the address content postal city information', () => {
                const postalCityDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-address-content span#awg-address-postal-city',
                    1,
                    1
                );
                const postalCityEl = postalCityDes[0].nativeElement;

                const expectedPostalCity =
                    expectedContactMetaData.address.postalCode + '\xA0' + expectedContactMetaData.address.city;

                expect(postalCityEl.textContent).toBeTruthy();
                expect(postalCityEl.textContent)
                    .withContext(`should be ${expectedPostalCity}`)
                    .toBe(expectedPostalCity);
            });

            it('... should render the address content country information', () => {
                const countryDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-address-content span#awg-address-country',
                    1,
                    1
                );
                const countryEl = countryDes[0].nativeElement;

                expect(countryEl.textContent).toBeTruthy();
                expect(countryEl.textContent)
                    .withContext(`should be ${expectedContactMetaData.address.country}`)
                    .toBe(expectedContactMetaData.address.country);
            });

            it('... should render the address content phone information', () => {
                const phoneDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-address-content span#awg-address-phone',
                    1,
                    1
                );
                const phoneEl = phoneDes[0].nativeElement;

                const expectedPhone =
                    expectedContactMetaData.phone.label + '\xA0' + expectedContactMetaData.phone.number;

                expect(phoneEl.textContent).toBeTruthy();
                expect(phoneEl.textContent).withContext(`should be ${expectedPhone}`).toBe(expectedPhone);
            });

            it('... should render the address content email information', () => {
                const emailDes = getAndExpectDebugElementByCss(
                    compDe,
                    'address p.awg-address-content span#awg-address-email a',
                    1,
                    1
                );
                const emailEl = emailDes[0].nativeElement;

                expect(emailEl.href).toBeTruthy();
                expect(emailEl.href)
                    .withContext(`should be ${expectedContactMetaData.email.mailto}`)
                    .toBe(expectedContactMetaData.email.mailto);
                expect(emailEl.textContent).toBeTruthy();
                expect(emailEl.textContent)
                    .withContext(`should be ${expectedContactMetaData.email.safeString}`)
                    .toBe(expectedContactMetaData.email.safeString);
            });
        });
    });
});
