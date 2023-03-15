import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AppConfig } from '@awg-app/app.config';
import { METADATA } from '@awg-core/core-data';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { CoreService } from '@awg-core/services';
import { ContactInfoComponent } from './contact-info.component';

// Mock address component
@Component({ selector: 'awg-address', template: '' })
class AddressStubComponent {
    @Input()
    pageMetaData: MetaPage;
    @Input()
    contactMetaData: MetaContact;
}

// Mock open street map component
@Component({ selector: 'awg-open-street-map', template: '' })
class OpenStreetMapStubComponent {
    @Input()
    osmEmbedUrl: SafeResourceUrl;
    @Input()
    osmLinkUrl: string;
}

describe('ContactInfoComponent (DONE)', () => {
    let component: ContactInfoComponent;
    let fixture: ComponentFixture<ContactInfoComponent>;
    let compDe: DebugElement;

    let provideMetaDataSpy: Spy;
    let provideOSMUrlSpy: Spy;

    let domSanitizer: DomSanitizer;

    let mockCoreService: Partial<CoreService>;

    let expectedPageMetaData: MetaPage;
    let expectedContactMetaData: MetaContact;

    let expectedUnsafeOsmEmbedUrl: string;
    let expectedOsmEmbedUrl: SafeResourceUrl;
    let expectedOsmLinkUrl: string;

    const expectedContactInfoHeader = 'Kontakt';

    beforeEach(waitForAsync(() => {
        // Mock service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => METADATA[sectionType] };

        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [ContactInfoComponent, AddressStubComponent, OpenStreetMapStubComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        domSanitizer = TestBed.inject(DomSanitizer);

        // Test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
        expectedContactMetaData = METADATA[MetaSectionTypes.contact];

        // Link values for open streets map
        expectedUnsafeOsmEmbedUrl = AppConfig.UNSAFE_OSM_EMBED_URL;
        expectedOsmLinkUrl = AppConfig.OSM_LINK_URL;

        // Trust the unsafe values
        expectedOsmEmbedUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeOsmEmbedUrl);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        provideMetaDataSpy = spyOn(component, 'provideMetaData').and.callThrough();
        provideOSMUrlSpy = spyOn(component, 'provideOSMUrls').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBe(true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have contact info header', () => {
            expect(component.contactInfoHeader).toBeDefined();
            expect(component.contactInfoHeader).toBe(expectedContactInfoHeader);
        });

        it('... should not have metadata nor open street map links', () => {
            expect(component.pageMetaData).toBeUndefined();
            expect(component.contactMetaData).toBeUndefined();
            expect(component.osmEmbedUrl).toBeUndefined();
            expect(component.osmLinkUrl).toBeUndefined();
        });

        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(provideMetaDataSpy, 0);
            });
        });

        describe('#provideOSMUrls()', () => {
            it('... should have a method `provideOSMUrls`', () => {
                expect(component.provideOSMUrls).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(provideOSMUrlSpy, 0);
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain one `h5` header in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-contact-info-header', 1, 1);
            });

            it('... should not render `contactInfoHeader` yet', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-contact-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).toBeFalsy();
            });

            it('... should contain one address component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, AddressStubComponent, 1, 1);
            });

            it('... should contain one OpenStreetMap component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, OpenStreetMapStubComponent, 1, 1);
            });

            it('... should not pass down `pageMetaData` and `contactMetaData` to address component', () => {
                const addressDes = getAndExpectDebugElementByDirective(compDe, AddressStubComponent, 1, 1);
                const addressCmp = addressDes[0].injector.get(AddressStubComponent) as AddressStubComponent;

                expect(addressCmp.pageMetaData).toBeUndefined();
                expect(addressCmp.contactMetaData).toBeUndefined();
            });

            it('... should not pass down `osmEmbedUrl` and `osmLinkUrl` to OpenStreetMap component', () => {
                const osmDes = getAndExpectDebugElementByDirective(compDe, OpenStreetMapStubComponent, 1, 1);
                const osmCmp = osmDes[0].injector.get(OpenStreetMapStubComponent) as OpenStreetMapStubComponent;

                expect(osmCmp.osmEmbedUrl).toBeUndefined();
                expect(osmCmp.osmLinkUrl).toBeUndefined();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the call to the DomSanitizer in #provideOSMUrls
            // It sets the bypassed links (SafeResourceUrl)
            component.osmEmbedUrl = expectedOsmEmbedUrl;
            component.osmLinkUrl = expectedOsmLinkUrl;

            // Mock the call to the meta service in #provideMetaData
            component.pageMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.page);
            component.contactMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.contact);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expectSpyCall(provideMetaDataSpy, 1);
            });

            it('... should return pageMetaData', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData)
                    .withContext(`should be ${expectedPageMetaData}`)
                    .toBe(expectedPageMetaData);
            });

            it('... should return contactMetaData', () => {
                expect(component.contactMetaData).toBeDefined();
                expect(component.contactMetaData)
                    .withContext(`should be ${expectedContactMetaData}`)
                    .toBe(expectedContactMetaData);
            });
        });

        describe('#provideOSMUrls()', () => {
            it('... should have been called', () => {
                expectSpyCall(provideOSMUrlSpy, 1);
            });

            it('... should return osmEmbedUrl', () => {
                expect(component.osmEmbedUrl).toBeDefined();
                expect(component.osmEmbedUrl)
                    .withContext(`should equal ${expectedOsmEmbedUrl}`)
                    .toEqual(expectedOsmEmbedUrl);
            });

            it('... should return osmLinkUrl', () => {
                expect(component.osmLinkUrl).toBeDefined();
                expect(component.osmLinkUrl)
                    .withContext(`should equal ${expectedOsmLinkUrl}`)
                    .toEqual(expectedOsmLinkUrl);
            });
        });

        describe('VIEW', () => {
            it('... should render `contactInfoHeader`', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-contact-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent)
                    .withContext(`should be ${expectedContactInfoHeader}`)
                    .toBe(expectedContactInfoHeader);
            });

            it('... should pass down `pageMetaData` and `contactMetaData` to address component', () => {
                const addressDes = getAndExpectDebugElementByDirective(compDe, AddressStubComponent, 1, 1);
                const addressCmp = addressDes[0].injector.get(AddressStubComponent) as AddressStubComponent;

                expect(addressCmp.pageMetaData).toBeTruthy();
                expect(addressCmp.pageMetaData)
                    .withContext(`should be ${expectedPageMetaData}`)
                    .toBe(expectedPageMetaData);

                expect(addressCmp.contactMetaData).toBeTruthy();
                expect(addressCmp.contactMetaData)
                    .withContext(`should be ${expectedContactMetaData}`)
                    .toBe(expectedContactMetaData);
            });

            it('... should pass down `osmEmbedUrl` and `osmLinkUrl` to OpenStreetMap component', () => {
                const osmDes = getAndExpectDebugElementByDirective(compDe, OpenStreetMapStubComponent, 1, 1);
                const osmCmp = osmDes[0].injector.get(OpenStreetMapStubComponent) as OpenStreetMapStubComponent;

                expect(osmCmp.osmEmbedUrl).toBeTruthy();
                expect(osmCmp.osmEmbedUrl)
                    .withContext(`should equal ${expectedOsmEmbedUrl}`)
                    .toEqual(expectedOsmEmbedUrl);

                expect(osmCmp.osmLinkUrl).toBeTruthy();
                expect(osmCmp.osmLinkUrl).withContext(`should equal ${expectedOsmLinkUrl}`).toEqual(expectedOsmLinkUrl);
            });
        });
    });
});
