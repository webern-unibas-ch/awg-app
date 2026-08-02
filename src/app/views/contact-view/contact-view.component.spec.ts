import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { DebugElement, isSignal, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    HeadingStubComponent,
    MetaIdentifierBadgesStubComponent,
    ScrollToTopButtonStubComponent,
} from '@testing/component-stubs';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { HeadingComponent } from '@awg-shared/heading/heading.component';
import { MetaIdentifierBadgesComponent } from '@awg-shared/meta/meta-identifier-badges/meta-identifier-badges.component';
import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaContact, MetaPage, MetaSectionTypes } from '@awg-shared/meta/meta.model';
import { ScrollToTopButtonComponent } from '@awg-shared/scroll-to-top-button/scroll-to-top-button.component';

import { ContactViewComponent } from './contact-view.component';

registerLocaleData(localeDeDE);

describe('ContactViewComponent (DONE)', () => {
    let component: ContactViewComponent;
    let fixture: ComponentFixture<ContactViewComponent>;
    let compDe: DebugElement;

    const expectedCitationId = 'awg-citation';
    const expectedCitationTitle = 'Zitation';
    const expectedDocumentationId = 'awg-documentation';
    const expectedDocumentationTitle = 'Dokumentation';
    const expectedImprintId = 'awg-imprint';
    const expectedImprintTitle = 'Impressum';

    let expectedContactMetaData: MetaContact;
    let expectedPageMetaData: MetaPage;
    let expectedToday: number;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContactViewComponent],
            providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
        })
            .overrideComponent(ContactViewComponent, {
                remove: { imports: [HeadingComponent, MetaIdentifierBadgesComponent, ScrollToTopButtonComponent] },
                add: {
                    imports: [HeadingStubComponent, MetaIdentifierBadgesStubComponent, ScrollToTopButtonStubComponent],
                },
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

        it('... should have `contactMetaData`', () => {
            expectToEqual(component.contactMetaData, expectedContactMetaData);
        });

        it('... should have `pageMetaData`', () => {
            expectToEqual(component.pageMetaData, expectedPageMetaData);
        });

        it('... should have signal `today` to hold the expected date', () => {
            expectToBe(isSignal(component.today), true);

            expectToBe(component.today(), expectedToday);
        });

        describe('VIEW', () => {
            const getContactViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-contact-view', 1, 1);

            it('... should contain one `div.awg-contact-view`', () => {
                getContactViewDes();
            });

            it('... should contain one ScrollToTop component (stubbed) in `div.awg-contact-view`', () => {
                getAndExpectDebugElementByDirective(getContactViewDes()[0], ScrollToTopButtonStubComponent, 1, 1);
            });

            it('... should contain 3 heading components (stubbed) in `div.awg-contact-view`', () => {
                getAndExpectDebugElementByDirective(getContactViewDes()[0], HeadingStubComponent, 3, 3);
            });

            it('... should throw when accessing heading component inputs (`id` and `title`) due to missing initial data binding', () => {
                const headingDes = getAndExpectDebugElementByDirective(
                    getContactViewDes()[0],
                    HeadingStubComponent,
                    3,
                    3
                );
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                headingCmps.forEach(headingCmp => {
                    expect(() => headingCmp.title()).toThrow();
                    expect(() => headingCmp.id()).toThrow();
                });
            });

            describe('... should contain divs with expected number of paragraphs in `div.awg-contact-view`', () => {
                it.each([
                    { selector: 'div.awg-citation-description', expectedParagraphs: 5 },
                    { selector: 'div.awg-documentation-description', expectedParagraphs: 2 },
                    { selector: 'div.awg-imprint-description', expectedParagraphs: 5 },
                    { selector: 'div#awg-disclaimer', expectedParagraphs: 17 },
                ])('... one $selector with $expectedParagraphs `p` elements', ({ selector, expectedParagraphs }) => {
                    const divDes = getAndExpectDebugElementByCss(getContactViewDes()[0], selector, 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'p', expectedParagraphs, expectedParagraphs);
                });
            });

            it('... should not render `version`, `versionReleaseDate` and `today` yet', () => {
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                const versionEl: HTMLElement = versionDes[0].nativeElement;
                const releaseEl: HTMLElement = releaseDes[0].nativeElement;
                const dateEl0: HTMLElement = dateDes[0].nativeElement;
                const dateEl1: HTMLElement = dateDes[1].nativeElement;

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
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 3, 3);
                const headingCmps = headingDes.map(de => de.injector.get(HeadingStubComponent) as HeadingStubComponent);

                expectToBe(headingCmps[0].id(), expectedCitationId);
                expectToBe(headingCmps[0].title(), expectedCitationTitle);

                expectToBe(headingCmps[1].id(), expectedDocumentationId);
                expectToBe(headingCmps[1].title(), expectedDocumentationTitle);

                expectToBe(headingCmps[2].id(), expectedImprintId);
                expectToBe(headingCmps[2].title(), expectedImprintTitle);
            });

            it('... should render `version`, `versionReleaseDate` and `today`', () => {
                const versionDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version', 1, 1);
                const releaseDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-version-release', 1, 1);
                const dateDes = getAndExpectDebugElementByCss(compDe, '.awg-citation-date', 2, 2);

                const versionEl: HTMLElement = versionDes[0].nativeElement;
                const releaseEl: HTMLElement = releaseDes[0].nativeElement;
                const dateEl0: HTMLElement = dateDes[0].nativeElement;
                const dateEl1: HTMLElement = dateDes[1].nativeElement;

                const datePipe = new DatePipe('de-DE');
                const pipedToday = datePipe.transform(expectedToday, 'longDate');
                const pipedReleaseDate = datePipe.transform(expectedPageMetaData.awgAppVersionReleaseDate, 'longDate');

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
