import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, SecurityContext } from '@angular/core';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { OpenStreetMapComponent } from './open-street-map.component';

describe('OpenStreetMapComponent (DONE)', () => {
    let component: OpenStreetMapComponent;
    let fixture: ComponentFixture<OpenStreetMapComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let domSanitizer: DomSanitizer;

    let expectedUnsafeOsmEmbedUrl: string;
    let expectedUnsafeOsmLinkUrl: string;
    let expectedOsmEmbedUrl: SafeResourceUrl;
    let expectedOsmLinkUrl: SafeResourceUrl;
    let expectedOsmLinkLabel: string;
    let expectedOsmIFrameSettings: { width; height; scrolling };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserModule],
            declarations: [OpenStreetMapComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenStreetMapComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        domSanitizer = TestBed.inject(DomSanitizer);

        // test data
        expectedOsmLinkLabel = 'Größere Karte anzeigen';
        expectedOsmIFrameSettings = {
            width: '100%',
            height: '350',
            scrolling: 'no'
        };

        // unsafe link values for open streets map
        expectedUnsafeOsmEmbedUrl =
            'https://www.openstreetmap.org/export/embed.html?bbox=7.582175731658936%2C47.55789611508066%2C7.586840093135835%2C47.56003739001212&layer=mapnik&marker=47.55896585846639%2C7.584506571292877';
        expectedUnsafeOsmLinkUrl =
            'https://www.openstreetmap.org/?mlat=47.55897&amp;mlon=7.58451#map=19/47.55897/7.58451';

        // bypass the unsafe values
        expectedOsmEmbedUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeOsmEmbedUrl);
        expectedOsmLinkUrl = domSanitizer.bypassSecurityTrustResourceUrl(expectedUnsafeOsmLinkUrl);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `osmEmbedUrl` input', () => {
            expect(component.osmEmbedUrl).toBeUndefined('should be undefined');
        });

        it('should not have `osmLinkUrl` input', () => {
            expect(component.osmLinkUrl).toBeUndefined('should be undefined');
        });

        it('should have `osmLinkLabel`', () => {
            expect(component.osmLinkLabel).toBeDefined();
            expect(component.osmLinkLabel).toBe(expectedOsmLinkLabel, `should be ${expectedOsmLinkLabel}`);
        });

        it('should have `osmIFrameSettings`', () => {
            expect(component.osmIFrameSettings).toBeDefined();
            expect(component.osmIFrameSettings).toEqual(
                expectedOsmIFrameSettings,
                `should equal ${expectedOsmIFrameSettings}`
            );
        });

        describe('VIEW', () => {
            it('... should contain one iframe', () => {
                getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
            });

            it('... should contain one div with link', () => {
                getAndExpectDebugElementByCss(compDe, 'div#awg-osm-link a', 1, 1);
            });

            it('... should not render the osm map yet', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
                const mapEl = mapDes[0].nativeElement;

                expect(mapEl.src).toBeDefined();
                expect(mapEl.src).toBe('', `should be empty string`);
            });

            it('... should not render the link to OSM homepage yet', () => {
                const linkDes = getAndExpectDebugElementByCss(compDe, 'div#awg-osm-link a', 1, 1);
                const linkEl = linkDes[0].nativeElement;

                expect(linkEl.href).toBeDefined();
                expect(linkEl.href).toBe('', `should be empty string`);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            // it gets the bypassed links (SafeResourceUrl)
            component.osmEmbedUrl = expectedOsmEmbedUrl;
            component.osmLinkUrl = expectedOsmLinkUrl;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render the osm map', () => {
                const mapDes = getAndExpectDebugElementByCss(compDe, 'iframe#awg-osm-embed-map', 1, 1);
                const mapEl = mapDes[0].nativeElement;

                // sanitize the bypassed value
                const sanitizedEmbedUrl = domSanitizer.sanitize(SecurityContext.RESOURCE_URL, expectedOsmEmbedUrl);
                // check for the src attribute to contain the sanitized SafeResourceUrl
                expect(mapEl.src).toBeDefined();
                expect(mapEl.src).toBe(sanitizedEmbedUrl, `should be ${sanitizedEmbedUrl}`);
                expect(mapEl.src).toBe(expectedUnsafeOsmEmbedUrl, `should be ${expectedUnsafeOsmEmbedUrl}`);
            });

            it('... should render the link to OSM homepage', () => {
                const linkDes = getAndExpectDebugElementByCss(compDe, 'div#awg-osm-link a', 1, 1);
                const linkEl = linkDes[0].nativeElement;

                // sanitize the bypassed value
                const sanitizedLinkUrl = domSanitizer.sanitize(SecurityContext.RESOURCE_URL, expectedOsmLinkUrl);
                // check for the href attribute to contain the sanitized SafeResourceUrl
                expect(linkEl.href).toBeDefined();
                expect(linkEl.href).toBe(sanitizedLinkUrl, `should be ${sanitizedLinkUrl}`);
                expect(linkEl.href).toBe(expectedUnsafeOsmLinkUrl, `should be ${expectedUnsafeOsmLinkUrl}`);
            });
        });
    });
});
