import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { MetaPage, MetaSectionTypes } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';

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
        expectedPageMetaData = METADATA[MetaSectionTypes.page];
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have pageMetaData', () => {
            expect(component.pageMetaData).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 3 paragraphs', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 3, 3);
            });

            it('... should not render pageMetaData yet', () => {
                // Find debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '#awg-version', 1, 1);
                const versionDateDes = getAndExpectDebugElementByCss(compDe, '#awg-version-date', 1, 1);

                // Find native elements
                const versionEl = versionDes[0].nativeElement;
                const versionDateEl = versionDateDes[0].nativeElement;

                // Check output
                expect(versionEl.textContent).toBeDefined();
                expect(versionEl.textContent).toBe('', 'should contain empty string');

                expect(versionDateEl.textContent).toBeDefined();
                expect(versionDateEl.textContent).toBe('', 'should contain empty string');
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
            it('should render values', () => {
                const expectedVersion = expectedPageMetaData.version;
                const expectedVersionDate = expectedPageMetaData.versionReleaseDate;

                // Find debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '#awg-version', 1, 1);
                const versionDateDes = getAndExpectDebugElementByCss(compDe, '#awg-version-date', 1, 1);

                // Find native elements
                const versionEl = versionDes[0].nativeElement;
                const versionDateEl = versionDateDes[0].nativeElement;

                expect(versionEl.textContent).toContain(expectedVersion, `should contain ${expectedVersion}`);
                expect(versionDateEl.textContent).toContain(
                    expectedVersionDate,
                    `should contain ${expectedVersionDate}`
                );
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 2, 2);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLinks from template', () => {
                expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
                expect(routerLinks[0].linkParams).toEqual(['/contact']);
                expect(routerLinks[1].linkParams).toEqual(['/contact']);
            });

            it('... can click imprint link in template', () => {
                const imprintLinkDe = linkDes[0]; // Contact link DebugElement
                const imprintLink = routerLinks[0]; // Contact link directive

                expect(imprintLink.navigatedTo).toBeNull('should not have navigated yet');

                click(imprintLinkDe);
                fixture.detectChanges();

                expect(imprintLink.navigatedTo).toEqual(['/contact']);
            });

            it('... can click documentation link in template', () => {
                const documentationLinkDe = linkDes[1]; // Contact link DebugElement
                const documentationLink = routerLinks[1]; // Contact link directive

                expect(documentationLink.navigatedTo).toBeNull('should not have navigated yet');

                click(documentationLinkDe);
                fixture.detectChanges();

                expect(documentationLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
