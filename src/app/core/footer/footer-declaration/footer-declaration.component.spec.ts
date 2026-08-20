import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { DebugElement, isSignal, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { META_DATA } from '@awg-shared/meta/meta.data';
import { MetaPage, MetaSectionTypes } from '@awg-shared/meta/meta.model';

import { FooterDeclarationComponent } from './footer-declaration.component';

registerLocaleData(localeDeDE);

describe('FooterDeclarationComponent (DONE)', () => {
    let component: FooterDeclarationComponent;
    let fixture: ComponentFixture<FooterDeclarationComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedPageMetaData: MetaPage;
    let expectedVersionData: NonNullable<ReturnType<typeof component.versionData>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterDeclarationComponent],
            providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'de-DE' }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];

        expectedVersionData = {
            url: `${expectedPageMetaData.awgAppGithubUrl}/blob/v${expectedPageMetaData.awgAppVersion}/CHANGELOG.md`,
            version: expectedPageMetaData.awgAppVersion,
            versionDate: expectedPageMetaData.awgAppVersionReleaseDate,
        };

        // Create component fixture
        fixture = TestBed.createComponent(FooterDeclarationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `pageMetaData`', () => {
            expectToBe(isSignal(component.pageMetaData), true);

            expect(() => component.pageMetaData()).toThrow();
        });

        it('... should throw when accessing computed signal `versionData` due to missing input', () => {
            expectToBe(isSignal(component.versionData), true);

            expect(() => component.versionData()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one div container', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-footer-declaration', 1, 1);
            });

            it('... should contain 3 paragraphs in div container', () => {
                const containerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-footer-declaration', 1, 1);
                getAndExpectDebugElementByCss(containerDes[0], 'p', 3, 3);
                getAndExpectDebugElementByCss(containerDes[0], 'p.awg-version-title', 1, 1);
                getAndExpectDebugElementByCss(containerDes[0], 'p.awg-version-desc', 1, 1);
                getAndExpectDebugElementByCss(containerDes[0], 'p#awg-contact-link', 1, 1);
            });

            it('... should render version title in first paragraph', () => {
                const expectedTitle = 'AWG-Online-Edition';

                const titleDes = getAndExpectDebugElementByCss(compDe, 'p.awg-version-title', 1, 1);
                const titleEl: HTMLParagraphElement = titleDes[0].nativeElement;

                expectToContain(titleEl.textContent, expectedTitle);
            });

            it('... should not render version desc info yet in second paragraph', () => {
                const changeLogDes = getAndExpectDebugElementByCss(compDe, 'p.awg-version-desc', 1, 1);

                getAndExpectDebugElementByCss(changeLogDes[0], 'a', 0, 0);
                getAndExpectDebugElementByCss(changeLogDes[0], '#awg-version', 0, 0);
                getAndExpectDebugElementByCss(changeLogDes[0], '#awg-version-date', 0, 0);
            });

            it('... should render contact link text in third paragraph', () => {
                const contactLinkDes = getAndExpectDebugElementByCss(compDe, 'p#awg-contact-link', 1, 1);
                const contactLinkEl: HTMLParagraphElement = contactLinkDes[0].nativeElement;

                const normalizedLinkText = contactLinkEl.textContent.replace(/\s+/g, ' ').trim();

                expectToContain(normalizedLinkText, 'Impressum | Dokumentation');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `pageMetaData` to hold the provided data', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have computed signal `versionData` to hold the expected data', () => {
            expectToEqual(component.versionData(), expectedVersionData);
        });

        describe('... should have computed signal `versionData` to hold null if ...', () => {
            it('... pageMetaData is an empty object {}, null or undefined', () => {
                fixture.componentRef.setInput('pageMetaData', {} as MetaPage);
                expectToBe(component.versionData(), null);

                fixture.componentRef.setInput('pageMetaData', undefined as any);
                expectToBe(component.versionData(), null);

                fixture.componentRef.setInput('pageMetaData', null as any);
                expectToBe(component.versionData(), null);
            });

            it('... `awgAppGithubUrl` is empty', () => {
                const incompletePageMetaData = {
                    ...expectedPageMetaData,
                    awgAppGithubUrl: '',
                } as MetaPage;
                fixture.componentRef.setInput('pageMetaData', incompletePageMetaData);

                expectToBe(component.versionData(), null);
            });

            it('... `awgAppVersion` is empty', () => {
                const incompletePageMetaData = {
                    ...expectedPageMetaData,
                    awgAppVersion: '',
                } as MetaPage;
                fixture.componentRef.setInput('pageMetaData', incompletePageMetaData);

                expectToBe(component.versionData(), null);
            });

            it('... `awgAppVersionReleaseDate` is empty', () => {
                const incompletePageMetaData = {
                    ...expectedPageMetaData,
                    awgAppVersionReleaseDate: '',
                } as MetaPage;
                fixture.componentRef.setInput('pageMetaData', incompletePageMetaData);

                expectToBe(component.versionData(), null);
            });
        });

        describe('VIEW', () => {
            it('... should render  version desc info in second paragraph', () => {
                const expectedVersion = expectedPageMetaData.awgAppVersion;
                const datePipe = new DatePipe('de-DE');
                const expectedVersionDate = datePipe.transform(
                    expectedPageMetaData.awgAppVersionReleaseDate,
                    'longDate'
                );

                const versionDes = getAndExpectDebugElementByCss(compDe, '#awg-version', 1, 1);
                const versionDateDes = getAndExpectDebugElementByCss(compDe, '#awg-version-date', 1, 1);

                const versionEl: HTMLElement = versionDes[0].nativeElement;
                const versionDateEl: HTMLElement = versionDateDes[0].nativeElement;

                expectToContain(versionEl.textContent, expectedVersion);
                expectToContain(versionDateEl.textContent, expectedVersionDate);
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 2, 2);

                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 2);
            });

            it('... can get correct linkParams from template', () => {
                const urlTreeString1 = routerLinks[0].urlTree?.toString();
                const urlTreeString2 = routerLinks[1].urlTree?.toString();

                expectToBe(urlTreeString1, '/contact#awg-imprint');
                expectToBe(urlTreeString2, '/contact#awg-documentation');
            });
            it('... can click imprint link in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
                navigateSpy.mockClear();

                const imprintLinkDe = linkDes[0];

                await clickAndAwaitChanges(imprintLinkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                const firstCallArg = navigateSpy.mock.calls[0][0];
                const actualUrl = firstCallArg.toString();

                expectToBe(actualUrl, '/contact#awg-imprint');

                navigateSpy.mockRestore();
            });

            it('... can click documentation link in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
                navigateSpy.mockClear();

                const documentationLinkDe = linkDes[1]; // Contact link DebugElement

                await clickAndAwaitChanges(documentationLinkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                const firstCallArg = navigateSpy.mock.calls[0][0];
                const actualUrl = firstCallArg.toString();

                expectToBe(actualUrl, '/contact#awg-documentation');

                navigateSpy.mockRestore();
            });
        });
    });
});
