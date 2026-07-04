import { DebugElement, isSignal, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AppConfig } from '@awg-app/app.config';

import { ContactMapComponent } from './contact-map.component';

describe('ContactMapComponent (DONE)', () => {
    let component: ContactMapComponent;
    let fixture: ComponentFixture<ContactMapComponent>;
    let compDe: DebugElement;

    let domSanitizer: DomSanitizer;

    let expectedUnsafeEmbedUrl: string;
    let expectedEmbedUrl: SafeResourceUrl;
    let expectedLinkUrl: string;
    let expectedLinkLabel: string;
    let expectedIFrameSettings: {
        width: string;
        height: string;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContactMapComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        domSanitizer = TestBed.inject(DomSanitizer);

        // Test data
        expectedLinkLabel = 'Größere Karte anzeigen';
        expectedIFrameSettings = {
            width: '100%',
            height: '350',
        };

        // Unsafe link values for open streets map
        expectedUnsafeEmbedUrl = AppConfig.CONTACT_MAP_UNSAFE_EMBED_URL;
        expectedLinkUrl = AppConfig.CONTACT_MAP_LINK_URL;

        // Trust the unsafe values
        expectedEmbedUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeEmbedUrl);

        // Create component fixture
        fixture = TestBed.createComponent(ContactMapComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `embedUrl`', () => {
            expectToBe(isSignal(component.embedUrl), true);

            expect(() => component.embedUrl()).toThrow();
        });

        it('... should throw due to missing required input signal `linkUrl`', () => {
            expectToBe(isSignal(component.linkUrl), true);

            expect(() => component.linkUrl()).toThrow();
        });

        it('... should have `LINK_LABEL`', () => {
            expectToBe(component.LINK_LABEL, expectedLinkLabel);
        });

        it('... should have `IFRAME_SETTINGS`', () => {
            expectToEqual(component.IFRAME_SETTINGS, expectedIFrameSettings);
        });

        describe('VIEW', () => {
            it('... should contain one iframe', () => {
                getAndExpectDebugElementByCss(compDe, 'iframe#awg-contact-map-embed', 1, 1);
            });

            it('... should have title attribute of iframe', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-contact-map-embed', 1, 1);
                const mapEl: HTMLIFrameElement = mapDes[0].nativeElement;

                expectToBe(mapEl.title, 'Contact Map View');
            });

            it('... should not pass other attributes to iframe yet', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-contact-map-embed', 1, 1);
                const mapEl: HTMLIFrameElement = mapDes[0].nativeElement;

                expectToBe(mapEl.width, '');
                expectToBe(mapEl.height, '');
            });

            it('... should contain one div with link', () => {
                getAndExpectDebugElementByCss(compDe, 'div#awg-contact-map-link a', 1, 1);
            });

            it('... should not render the map yet', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-contact-map-embed', 1, 1);
                const mapEl: HTMLIFrameElement = mapDes[0].nativeElement;

                expectToBe(mapEl.src, '');
            });

            it('... should not have the link to the external map homepage yet', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'div#awg-contact-map-link a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.href, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('embedUrl', expectedEmbedUrl);
            fixture.componentRef.setInput('linkUrl', expectedLinkUrl);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `embedUrl` to hold the provided URL', () => {
            expectToEqual(component.embedUrl(), expectedEmbedUrl);
        });

        it('... should have input signal `linkUrl` to hold the provided URL', () => {
            expectToEqual(component.linkUrl(), expectedLinkUrl);
        });

        describe('VIEW', () => {
            it('... should pass correct attributes to iframe', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-contact-map-embed', 1, 1);
                const mapEl: HTMLIFrameElement = mapDes[0].nativeElement;

                expectToBe(mapEl.width, expectedIFrameSettings.width);
                expectToBe(mapEl.height, expectedIFrameSettings.height);
            });

            it('... should render the map in iframe', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-contact-map-embed', 1, 1);
                const mapEl: HTMLIFrameElement = mapDes[0].nativeElement;

                // Sanitize the bypassed value
                const sanitizedEmbedUrl = domSanitizer.sanitize(SecurityContext.RESOURCE_URL, expectedEmbedUrl);

                // Check for the src attribute to contain the sanitized SafeResourceUrl
                expectToBe(mapEl.src, sanitizedEmbedUrl);
            });

            it('... should have the link to external map homepage in div', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'div#awg-contact-map-link a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                // Check for the href attribute to contain the link url
                expectToBe(aEl.href, expectedLinkUrl);
            });

            it('... should display the link label in div anchor', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'div#awg-contact-map-link a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                // Check for the inner text to contain the link label
                expectToBe(aEl.textContent, expectedLinkLabel);
            });
        });
    });
});
