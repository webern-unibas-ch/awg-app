import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { META_DATA } from '@awg-core/core-data';
import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';

import { FooterDeclarationComponent } from './footer-declaration.component';

describe('FooterDeclarationComponent (DONE)', () => {
    let component: FooterDeclarationComponent;
    let fixture: ComponentFixture<FooterDeclarationComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedPageMetaData: MetaPage;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FooterDeclarationComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterDeclarationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedPageMetaData = META_DATA[MetaSectionTypes.page];
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain 3 paragraphs', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 3, 3);

                getAndExpectDebugElementByCss(compDe, 'p.awg-version-title', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'p.awg-version-desc', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'p#awg-contact-link', 1, 1);
            });

            it('... should render version title', () => {
                const expectedTitle = 'AWG-Online-Edition';

                const titleDes = getAndExpectDebugElementByCss(compDe, 'p.awg-version-title', 1, 1);
                const titleEl = titleDes[0].nativeElement;

                expectToContain(titleEl.textContent, expectedTitle);
            });

            it('... should not render pageMetaData yet', () => {
                const versionDes = getAndExpectDebugElementByCss(compDe, '#awg-version', 1, 1);
                const versionDateDes = getAndExpectDebugElementByCss(compDe, '#awg-version-date', 1, 1);

                const versionEl = versionDes[0].nativeElement;
                const versionDateEl = versionDateDes[0].nativeElement;

                expectToBe(versionEl.textContent, '');
                expectToBe(versionDateEl.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.pageMetaData = expectedPageMetaData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render version values', () => {
                const expectedVersion = expectedPageMetaData.version;
                const expectedVersionDate = expectedPageMetaData.versionReleaseDate;

                const versionDes = getAndExpectDebugElementByCss(compDe, '#awg-version', 1, 1);
                const versionDateDes = getAndExpectDebugElementByCss(compDe, '#awg-version-date', 1, 1);

                const versionEl = versionDes[0].nativeElement;
                const versionDateEl = versionDateDes[0].nativeElement;

                expectToContain(versionEl.textContent, expectedVersion);
                expectToContain(versionDateEl.textContent, expectedVersionDate);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 2, 2);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 2);
            });

            it('... can get correct linkParams from template', () => {
                expectToEqual(routerLinks[0].linkParams, ['/contact']);
                expectToEqual(routerLinks[1].linkParams, ['/contact']);
            });

            it('... can get correct fragments from template', () => {
                expectToBe(routerLinks[0].fragment, 'awg-imprint');
                expectToBe(routerLinks[1].fragment, 'awg-documentation');
            });

            it('... can click imprint link in template', () => {
                const imprintLinkDe = linkDes[0]; // Contact link DebugElement
                const imprintLink = routerLinks[0]; // Contact link directive

                expectToBe(imprintLink.navigatedTo, null);

                click(imprintLinkDe);
                fixture.detectChanges();

                expectToEqual(imprintLink.navigatedTo, ['/contact']);
                expectToBe(imprintLink.navigatedToFragment, 'awg-imprint');
            });

            it('... can click documentation link in template', () => {
                const documentationLinkDe = linkDes[1]; // Contact link DebugElement
                const documentationLink = routerLinks[1]; // Contact link directive

                expectToBe(documentationLink.navigatedTo, null);

                click(documentationLinkDe);
                fixture.detectChanges();

                expectToEqual(documentationLink.navigatedTo, ['/contact']);
                expectToBe(documentationLink.navigatedToFragment, 'awg-documentation');
            });
        });
    });
});
