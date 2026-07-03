import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { Component, DebugElement, input, isSignal, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { META_DATA } from '@awg-core/data/meta.data';
import { MetaContact, MetaIdentifiers, MetaPage, MetaSectionTypes } from '@awg-core/models/meta.model';
import { CoreService } from '@awg-core/services/core-service/core.service';
import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta-identifier-badges/meta-identifier-badges.component';

import { ContactViewComponent } from './contact-view.component';

registerLocaleData(localeDeDE);

// Mock components
@Component({
    selector: 'awg-heading',
    template: '',
})
class HeadingStubComponent {
    title = input.required<string>();
    id = input.required<string>();
}

@Component({
    selector: 'awg-meta-identifier-badges',
    template: '',
})
class MetaIdentifierBadgesStubComponent {
    identifiers = input.required<MetaIdentifiers>();
}

describe('ContactViewComponent (DONE)', () => {
    let component: ContactViewComponent;
    let fixture: ComponentFixture<ContactViewComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    let expectedContactMetaData: MetaContact;
    let expectedPageMetaData: MetaPage;
    let expectedToday: number;

    const expectedCitationId = 'awg-citation';
    const expectedCitationTitle = 'Zitation';
    const expectedDocumentationId = 'awg-documentation';
    const expectedDocumentationTitle = 'Dokumentation';
    const expectedImprintId = 'awg-imprint';
    const expectedImprintTitle = 'Impressum';

    beforeEach(async () => {
        // Mock service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => META_DATA[sectionType] };

        await TestBed.configureTestingModule({
            imports: [ContactViewComponent],
            providers: [
                { provide: LOCALE_ID, useValue: 'de-DE' },
                { provide: CoreService, useValue: mockCoreService },
            ],
        })
            .overrideComponent(ContactViewComponent, {
                remove: { imports: [HeadingComponent, MetaIdentifierBadgesComponent] },
                add: { imports: [HeadingStubComponent, MetaIdentifierBadgesStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Set fixed date for testing (before component creation)
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));

        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedContactMetaData = META_DATA[MetaSectionTypes.contact];
        expectedToday = Date.now();

        // Create component fixture
        fixture = TestBed.createComponent(ContactViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have citation title and id', () => {
            expectToBe(component.CITATION_ID, expectedCitationId);
            expectToBe(component.CITATION_TITLE, expectedCitationTitle);
        });

        it('... should have documentation title and id', () => {
            expectToBe(component.DOCUMENTATION_ID, expectedDocumentationId);
            expectToBe(component.DOCUMENTATION_TITLE, expectedDocumentationTitle);
        });

        it('... should have imprint title and id', () => {
            expectToBe(component.IMPRINT_ID, expectedImprintId);
            expectToBe(component.IMPRINT_TITLE, expectedImprintTitle);
        });

        it('... should have signal `contactMetaData` to hold the provided data (via service)', () => {
            expectToBe(isSignal(component.contactMetaData), true);

            expectToEqual(component.contactMetaData(), expectedContactMetaData);
        });

        it('... should have signal `pageMetaData` to hold the provided data (via service)', () => {
            expectToBe(isSignal(component.pageMetaData), true);

            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have signal `today` to hold correct date', () => {
            expectToBe(isSignal(component.today), true);

            expectToBe(component.today(), expectedToday);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-contact-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
            });

            it('... should contain 3 heading components (stubbed) in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 3, 3);
            });

            it('... should pass down empty default values to heading components (`id` and `title`)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);

                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expectToBe(headingCmps[0].id(), '');
                expectToBe(headingCmps[0].title(), '');

                expectToBe(headingCmps[1].id(), '');
                expectToBe(headingCmps[1].title(), '');

                expectToBe(headingCmps[2].id(), '');
                expectToBe(headingCmps[2].title(), '');
            });

            it('... should contain 1 `div.awg-citation-description` with 5 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-citation-description', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-citation-description > p', 5, 5);
            });

            it('... should contain 1 `div.awg-documentation-description` with 2 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-documentation-description', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-documentation-description > p', 2, 2);
            });

            it('... should contain 1 `div.awg-imprint-description` with 5 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-imprint-description', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-imprint-description > p', 5, 5);
            });

            it('... should contain 1 `div#awg-disclaimer` with 17 `p` elements in `div.awg-contact-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div#awg-disclaimer', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'div#awg-disclaimer > p', 17, 17);
            });

            it('... should not render `version`, `versionReleaseDate` and `today` yet', () => {
                // Debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // Native elements
                const versionEl: HTMLElement = versionDes[0].nativeElement;
                const releaseEl: HTMLElement = releaseDes[0].nativeElement;
                const dateEl0: HTMLElement = dateDes[0].nativeElement;
                const dateEl1: HTMLElement = dateDes[1].nativeElement;

                // Check output
                expectToBe(versionEl.textContent, '');
                expectToBe(releaseEl.textContent, '');
                expectToBe(dateEl0.textContent, '');
                expectToBe(dateEl1.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down correct values to heading components (`id` and `title`)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);

                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expectToBe(headingCmps[0].id(), expectedCitationId);
                expectToBe(headingCmps[0].title(), expectedCitationTitle);

                expectToBe(headingCmps[1].id(), expectedDocumentationId);
                expectToBe(headingCmps[1].title(), expectedDocumentationTitle);

                expectToBe(headingCmps[2].id(), expectedImprintId);
                expectToBe(headingCmps[2].title(), expectedImprintTitle);
            });

            it('... should render `version`, `versionReleaseDate` and `today`', () => {
                // Debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                // Native elements
                const versionEl: HTMLElement = versionDes[0].nativeElement;
                const releaseEl: HTMLElement = releaseDes[0].nativeElement;
                const dateEl0: HTMLElement = dateDes[0].nativeElement;
                const dateEl1: HTMLElement = dateDes[1].nativeElement;

                // Pipe
                const datePipe = new DatePipe('de-DE');
                const pipedToday = datePipe.transform(expectedToday, 'longDate');
                const pipedReleaseDate = datePipe.transform(expectedPageMetaData.awgAppVersionReleaseDate, 'longDate');

                // Check output
                expectToContain(versionEl.textContent, expectedPageMetaData.awgAppVersion);
                expectToContain(releaseEl.textContent, pipedReleaseDate);
                expectToContain(dateEl0.textContent, pipedToday);
                expectToContain(dateEl1.textContent, pipedToday);
            });

            it('... should pass down `identifiers` to MetaIdentifierBadgesComponent for each developer', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-imprint-description', 1, 1);
                const badgeDes = getAndExpectDebugElementByDirective(
                    divDes[0],
                    MetaIdentifierBadgesStubComponent,
                    expectedContactMetaData.developers.length,
                    expectedContactMetaData.developers.length
                );
                const badgeCmps = badgeDes.map(de => de.injector.get(MetaIdentifierBadgesStubComponent));

                badgeCmps.forEach((badgeCmp, i) => {
                    expectToEqual(badgeCmp.identifiers(), expectedContactMetaData.developers[i].identifiers);
                });
            });
        });
    });
});
