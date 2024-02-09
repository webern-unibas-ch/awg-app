import { DebugElement, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AppConfig } from '@awg-app/app.config';

import { OpenStreetMapComponent } from './open-street-map.component';

describe('OpenStreetMapComponent (DONE)', () => {
    let component: OpenStreetMapComponent;
    let fixture: ComponentFixture<OpenStreetMapComponent>;
    let compDe: DebugElement;

    let domSanitizer: DomSanitizer;

    let expectedUnsafeOsmEmbedUrl: string;
    let expectedOsmEmbedUrl: SafeResourceUrl;
    let expectedOsmLinkUrl: string;
    let expectedOsmLinkLabel: string;
    let expectedOsmIFrameSettings: { width; height };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [OpenStreetMapComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenStreetMapComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        domSanitizer = TestBed.inject(DomSanitizer);

        // Test data
        expectedOsmLinkLabel = 'Größere Karte anzeigen';
        expectedOsmIFrameSettings = {
            width: '100%',
            height: '350',
        };

        // Unsafe link values for open streets map
        expectedUnsafeOsmEmbedUrl = AppConfig.UNSAFE_OSM_EMBED_URL;
        expectedOsmLinkUrl = AppConfig.OSM_LINK_URL;

        // Trust the unsafe values
        expectedOsmEmbedUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeOsmEmbedUrl);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `osmEmbedUrl` input', () => {
            expect(component.osmEmbedUrl).toBeUndefined();
        });

        it('... should not have `osmLinkUrl` input', () => {
            expect(component.osmLinkUrl).toBeUndefined();
        });

        it('... should have `osmLinkLabel`', () => {
            expectToBe(component.osmLinkLabel, expectedOsmLinkLabel);
        });

        it('... should have `osmIFrameSettings`', () => {
            expectToEqual(component.osmIFrameSettings, expectedOsmIFrameSettings);
        });

        describe('VIEW', () => {
            it('... should contain one iframe', () => {
                getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
            });

            it('... should have title attribute of iframe', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
                const mapEl = mapDes[0].nativeElement;

                expectToBe(mapEl.title, 'Open Street Map View');
            });

            it('... should not pass other attributes to iframe yet', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
                const mapEl = mapDes[0].nativeElement;

                expectToBe(mapEl.width, '');
                expectToBe(mapEl.height, '');
            });

            it('... should contain one div with link', () => {
                getAndExpectDebugElementByCss(compDe, 'div#awg-osm-link a', 1, 1);
            });

            it('... should not render the osm map yet', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
                const mapEl = mapDes[0].nativeElement;

                expect(mapEl.src).toBeDefined();
                expect(mapEl.src).toBeFalsy();
            });

            it('... should not have the link to OSM homepage yet', () => {
                const linkDes = getAndExpectDebugElementByCss(compDe, 'div#awg-osm-link a', 1, 1);
                const linkEl = linkDes[0].nativeElement;

                expect(linkEl.href).toBeDefined();
                expect(linkEl.href).toBeFalsy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            // It gets the bypassed links (SafeResourceUrl)
            component.osmEmbedUrl = expectedOsmEmbedUrl;
            component.osmLinkUrl = expectedOsmLinkUrl;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass correct attributes to iframe', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
                const mapEl = mapDes[0].nativeElement;

                expectToBe(mapEl.width, expectedOsmIFrameSettings.width);
                expectToBe(mapEl.height, expectedOsmIFrameSettings.height);
            });

            it('... should render the osm map in iframe', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
                const mapEl = mapDes[0].nativeElement;

                // Sanitize the bypassed value
                const sanitizedEmbedUrl = domSanitizer.sanitize(SecurityContext.RESOURCE_URL, expectedOsmEmbedUrl);

                // Check for the src attribute to contain the sanitized SafeResourceUrl
                expectToBe(mapEl.src, sanitizedEmbedUrl);
            });

            it('... should have the link to OSM homepage in div', () => {
                const linkDes = getAndExpectDebugElementByCss(compDe, 'div#awg-osm-link a', 1, 1);
                const linkEl = linkDes[0].nativeElement;

                // Check for the href attribute to contain the link url
                expectToBe(linkEl.href, expectedOsmLinkUrl);
            });

            it('... should display the link label in div anchor', () => {
                const linkDes = getAndExpectDebugElementByCss(compDe, 'div#awg-osm-link a', 1, 1);
                const linkEl = linkDes[0].nativeElement;

                // Check for the inner text to contain the link label
                expectToBe(linkEl.innerText, expectedOsmLinkLabel);
            });
        });
    });
});
