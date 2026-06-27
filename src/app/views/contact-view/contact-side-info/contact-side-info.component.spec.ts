import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AppConfig } from '@awg-app/app.config';
import { META_DATA } from '@awg-core/data/meta.data';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-core/models/meta.model';
import { CoreService } from '@awg-core/services/core-service/core.service';

import { ContactAddressComponent } from '../contact-address/contact-address.component';
import { ContactMapComponent } from '../contact-map/contact-map.component';

import { ContactSideInfoComponent } from './contact-side-info.component';

// Mock components
@Component({
    selector: 'awg-contact-address',
    template: '',
})
class ContactAddressStubComponent {
    pageMetaData = input<MetaPage>({} as MetaPage);
    contactMetaData = input<MetaContact>({} as MetaContact);
}

@Component({
    selector: 'awg-contact-map',
    template: '',
})
class ContactMapStubComponent {
    embedUrl = input.required<SafeResourceUrl>();
    linkUrl = input.required<string>();
}

describe('ContactSideInfoComponent (DONE)', () => {
    let component: ContactSideInfoComponent;
    let fixture: ComponentFixture<ContactSideInfoComponent>;
    let compDe: DebugElement;

    let domSanitizer: DomSanitizer;

    let mockCoreService: Partial<CoreService>;

    let expectedPageMetaData: MetaPage;
    let expectedContactMetaData: MetaContact;

    let expectedUnsafeEmbedUrl: string;
    let expectedEmbedUrl: SafeResourceUrl;
    let expectedLinkUrl: string;

    const expectedContactSideInfoHeader = 'Kontakt';

    beforeEach(async () => {
        // Mock service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => META_DATA[sectionType] };

        await TestBed.configureTestingModule({
            imports: [ContactSideInfoComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        })
            .overrideComponent(ContactSideInfoComponent, {
                remove: { imports: [ContactAddressComponent, ContactMapComponent] },
                add: { imports: [ContactAddressStubComponent, ContactMapStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactSideInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        domSanitizer = TestBed.inject(DomSanitizer);

        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedContactMetaData = META_DATA[MetaSectionTypes.contact];

        // Link values for open streets map
        expectedUnsafeEmbedUrl = AppConfig.CONTACT_MAP_UNSAFE_EMBED_URL;
        expectedLinkUrl = AppConfig.CONTACT_MAP_LINK_URL;

        // Trust the unsafe values
        expectedEmbedUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeEmbedUrl);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `CONTACT_SIDE_INFO_HEADER`', () => {
            expectToBe(component.CONTACT_SIDE_INFO_HEADER, expectedContactSideInfoHeader);
        });

        it('... should have `contactMetaData`', () => {
            expectToEqual(component.contactMetaData(), expectedContactMetaData);
        });

        it('... should have `pageMetaData`', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have `embedUrl`', () => {
            expectToEqual(component.mapEmbedUrl(), expectedEmbedUrl);
        });

        it('... should have `linkUrl`', () => {
            expectToBe(component.mapLinkUrl(), expectedLinkUrl);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain one `h5` header in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-contact-side-info-header', 1, 1);
            });

            it('... should not render `CONTACT_SIDE_INFO_HEADER` yet', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-contact-side-info-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, '');
            });

            it('... should contain one address component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ContactAddressStubComponent, 1, 1);
            });

            it('... should pass down empty default values to address component (`pageMetaData` and `contactMetaData`)', () => {
                const addressDes = getAndExpectDebugElementByDirective(compDe, ContactAddressStubComponent, 1, 1);
                const addressCmp = addressDes[0].injector.get(
                    ContactAddressStubComponent
                ) as ContactAddressStubComponent;

                expectToEqual(addressCmp.pageMetaData(), {} as MetaPage);
                expectToEqual(addressCmp.contactMetaData(), {} as MetaContact);
            });

            it('... should contain one map component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ContactMapStubComponent, 1, 1);
            });

            it('... should throw due to missing required values for map component (`embedUrl` and `linkUrl`)', () => {
                const mapDes = getAndExpectDebugElementByDirective(compDe, ContactMapStubComponent, 1, 1);
                const mapCmp = mapDes[0].injector.get(ContactMapStubComponent) as ContactMapStubComponent;

                // Expect the required inputs to throw if not provided
                expect(() => mapCmp.embedUrl()).toThrow();
                expect(() => mapCmp.linkUrl()).toThrow();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render `CONTACT_SIDE_INFO_HEADER`', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-contact-side-info-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedContactSideInfoHeader);
            });

            it('... should pass down updated values to address component (`pageMetaData` and `contactMetaData`)', () => {
                const addressDes = getAndExpectDebugElementByDirective(compDe, ContactAddressStubComponent, 1, 1);
                const addressCmp = addressDes[0].injector.get(
                    ContactAddressStubComponent
                ) as ContactAddressStubComponent;

                expectToEqual(addressCmp.pageMetaData(), expectedPageMetaData);
                expectToEqual(addressCmp.contactMetaData(), expectedContactMetaData);
            });

            it('... should pass down updated values to map component (`embedUrl` and `linkUrl`)', () => {
                const mapDes = getAndExpectDebugElementByDirective(compDe, ContactMapStubComponent, 1, 1);
                const mapCmp = mapDes[0].injector.get(ContactMapStubComponent) as ContactMapStubComponent;

                expect(() => mapCmp.embedUrl()).not.toThrow();
                expect(() => mapCmp.linkUrl()).not.toThrow();
                expectToEqual(mapCmp.embedUrl(), expectedEmbedUrl);
                expectToEqual(mapCmp.linkUrl(), expectedLinkUrl);
            });
        });
    });
});
