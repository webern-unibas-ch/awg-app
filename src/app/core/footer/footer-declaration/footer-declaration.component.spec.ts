import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { DebugElement, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { META_DATA } from '@awg-core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { provideRouter, Router, RouterLink } from '@angular/router';
import { FooterDeclarationComponent } from './footer-declaration.component';

registerLocaleData(localeDeDE);

describe('FooterDeclarationComponent (DONE)', () => {
    let component: FooterDeclarationComponent;
    let fixture: ComponentFixture<FooterDeclarationComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedPageMetaData: MetaPage;
    let expectedChangelogUrl: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FooterDeclarationComponent],
            providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'de-DE' }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterDeclarationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        router = TestBed.inject(Router);

        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
        expectedChangelogUrl = `${expectedPageMetaData.awgAppGithubUrl}/blob/v${expectedPageMetaData.awgAppVersion}/CHANGELOG.md`;

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('pageMetaData', {} as MetaPage);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `pageMetaData` input', () => {
            expectToEqual(component.pageMetaData(), {} as MetaPage);
        });

        it('... should have computed `changelogUrl` to be null (due to empty pageMetaData)', () => {
            expectToBe(component.changelogUrl(), null);
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

                expectToContain(contactLinkEl.textContent.trim(), 'Impressum | Dokumentation');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('pageMetaData', expectedPageMetaData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have updated `pageMetaData` input', () => {
            expectToEqual(component.pageMetaData(), expectedPageMetaData);
        });

        it('... should have computed `changelogUrl`', () => {
            expectToEqual(component.changelogUrl(), expectedChangelogUrl);
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
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 2, 2);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 2);
            });

            it('... can get correct linkParams from template', () => {
                const urlTree0 = routerLinks[0].urlTree;
                const urlTree1 = routerLinks[1].urlTree;

                expectToBe(urlTree0.toString(), '/contact#awg-imprint');
                expectToBe(urlTree1.toString(), '/contact#awg-documentation');
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
