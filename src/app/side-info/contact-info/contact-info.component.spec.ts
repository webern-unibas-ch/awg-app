import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { Meta, MetaContact, MetaEdition, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

import { ContactInfoComponent } from './contact-info.component';

// mock address component
@Component({ selector: 'awg-address', template: '' })
class AddressStubComponent {
    @Input()
    pageMetaData: MetaPage;
    @Input()
    contactMetaData: MetaContact;
}

// mock open street map component
@Component({ selector: 'awg-open-street-map', template: '' })
class OpenStreetMapStubComponent {
    @Input()
    osmEmbedUrl: SafeResourceUrl;
    @Input()
    osmLinkUrl: SafeResourceUrl;
}

describe('ContactInfoComponent (DONE)', () => {
    let component: ContactInfoComponent;
    let fixture: ComponentFixture<ContactInfoComponent>;
    let compDe: DebugElement;
    let compEl;

    let domSanitizer: DomSanitizer;

    let mockCoreService: Partial<CoreService>;

    let expectedPageMetaData: MetaPage;
    let expectedContactMetaData: MetaContact;

    let expectedUnsafeOsmEmbedUrl: string;
    let expectedUnsafeOsmLinkUrl: string;
    let expectedOsmEmbedUrl: SafeResourceUrl;
    let expectedOsmLinkUrl: SafeResourceUrl;

    const expectedContactInfoHeader = 'Kontakt';

    beforeEach(async(() => {
        // mock service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => METADATA[sectionType] };

        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [ContactInfoComponent, AddressStubComponent, OpenStreetMapStubComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        domSanitizer = TestBed.get(DomSanitizer);

        // test data
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
        expectedContactMetaData = METADATA[MetaSectionTypes.contact];

        // unsafe link values for open streets map
        expectedUnsafeOsmEmbedUrl =
            'https://www.openstreetmap.org/export/embed.html?bbox=7.582175731658936%2C47.55789611508066%2C7.586840093135835%2C47.56003739001212&layer=mapnik&marker=47.55896585846639%2C7.584506571292877';
        expectedUnsafeOsmLinkUrl =
            'https://www.openstreetmap.org/?mlat=47.55897&amp;mlon=7.58451#map=19/47.55897/7.58451';

        // bypass the unsafe values
        expectedOsmEmbedUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeOsmEmbedUrl);
        expectedOsmLinkUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeOsmLinkUrl);

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'sanitizeUrls').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);
    });

    it('changing the stub service has no effect on the injected service', () => {
        const coreService = TestBed.get(CoreService);
        const CHANGEDMETA: Meta = {
            page: new MetaPage(),
            edition: new MetaEdition(),
            structure: new MetaStructure(),
            contact: new MetaContact()
        };
        mockCoreService = { getMetaDataSection: sectionType => CHANGEDMETA[sectionType] };

        expect(coreService.getMetaDataSection(MetaSectionTypes.page)).toBe(expectedPageMetaData);
    });

    describe('BEFORE initial data binding', () => {
        it('should have contact info header', () => {
            expect(component.contactInfoHeader).toBeDefined();
            expect(component.contactInfoHeader).toBe(expectedContactInfoHeader);
        });

        it('should not have metadata nor open street map links', () => {
            expect(component.pageMetaData).toBeUndefined('should be undefined');
            expect(component.contactMetaData).toBeUndefined('should be undefined');
            expect(component.osmEmbedUrl).toBeUndefined('should be undefined');
            expect(component.osmLinkUrl).toBeUndefined('should be undefined');
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        describe('#sanitizeUrls', () => {
            it('... should not have been called', () => {
                expect(component.sanitizeUrls).not.toHaveBeenCalled();
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
                expect(headerEl.textContent).toBe('', 'should be empty string');
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
            // mock the call to the DomSanitizer in #sanitizeUrls
            // it sets the bypassed links (SafeResourceUrl)
            component.osmEmbedUrl = expectedOsmEmbedUrl;
            component.osmLinkUrl = expectedOsmLinkUrl;

            // mock the call to the meta service in #provideMetaData
            component.pageMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.page);
            component.contactMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.contact);

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return pageMetaData', () => {
                expect(component.pageMetaData).toBeDefined();
                expect(component.pageMetaData).toBe(expectedPageMetaData, `should be ${expectedPageMetaData}`);
            });

            it('... should return contactMetaData', () => {
                expect(component.contactMetaData).toBeDefined();
                expect(component.contactMetaData).toBe(expectedContactMetaData, `should be ${expectedContactMetaData}`);
            });
        });

        describe('#sanitizeUrls', () => {
            it('... should have been called', () => {
                expect(component.sanitizeUrls).toHaveBeenCalled();
            });

            it('... should return osmEmbedUrl', () => {
                expect(component.osmEmbedUrl).toBeDefined();
                expect(component.osmEmbedUrl).toEqual(expectedOsmEmbedUrl, `should equal ${expectedOsmEmbedUrl}`);
            });

            it('... should return osmLinkUrl', () => {
                expect(component.osmLinkUrl).toBeDefined();
                expect(component.osmLinkUrl).toEqual(expectedOsmLinkUrl, `should equal ${expectedOsmLinkUrl}`);
            });
        });

        describe('VIEW', () => {
            it('... should render `contactInfoHeader`', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-contact-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).toBe(expectedContactInfoHeader, `should be ${expectedContactInfoHeader}`);
            });

            it('... should pass down `pageMetaData` and `contactMetaData` to address component', () => {
                const addressDes = getAndExpectDebugElementByDirective(compDe, AddressStubComponent, 1, 1);
                const addressCmp = addressDes[0].injector.get(AddressStubComponent) as AddressStubComponent;

                expect(addressCmp.pageMetaData).toBeTruthy();
                expect(addressCmp.pageMetaData).toBe(expectedPageMetaData, `should be ${expectedPageMetaData}`);

                expect(addressCmp.contactMetaData).toBeTruthy();
                expect(addressCmp.contactMetaData).toBe(
                    expectedContactMetaData,
                    `should be ${expectedContactMetaData}`
                );
            });

            it('... should pass down `osmEmbedUrl` and `osmLinkUrl` to OpenStreetMap component', () => {
                const osmDes = getAndExpectDebugElementByDirective(compDe, OpenStreetMapStubComponent, 1, 1);
                const osmCmp = osmDes[0].injector.get(OpenStreetMapStubComponent) as OpenStreetMapStubComponent;

                expect(osmCmp.osmEmbedUrl).toBeTruthy();
                expect(osmCmp.osmEmbedUrl).toEqual(expectedOsmEmbedUrl, `should equal ${expectedOsmEmbedUrl}`);

                expect(osmCmp.osmLinkUrl).toBeTruthy();
                expect(osmCmp.osmLinkUrl).toEqual(expectedOsmLinkUrl, `should equal ${expectedOsmLinkUrl}`);
            });
        });
    });
});
