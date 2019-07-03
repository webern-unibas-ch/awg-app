import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { Meta } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';

import { FooterDeclarationComponent } from './footer-declaration.component';

describe('FooterDeclarationComponent (DONE)', () => {
    let component: FooterDeclarationComponent;
    let fixture: ComponentFixture<FooterDeclarationComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    let expectedMetaData: Meta;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterDeclarationComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterDeclarationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedMetaData = METADATA;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have metaData', () => {
            expect(component.metaData).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 3 paragraphs', () => {
                getAndExpectDebugElementByCss(compDe, 'p', 3, 3);
            });

            it('... should not render metaData yet', () => {
                // find debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '#awg-version', 1, 1);
                const versionDateDes = getAndExpectDebugElementByCss(compDe, '#awg-version-date', 1, 1);

                // find native elements
                const versionEl = versionDes[0].nativeElement;
                const versionDateEl = versionDateDes[0].nativeElement;

                // check output
                expect(versionEl.textContent).toBeDefined();
                expect(versionEl.textContent).toBe('', 'should contain empty string');

                expect(versionDateEl.textContent).toBeDefined();
                expect(versionDateEl.textContent).toBe('', 'should contain empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.metaData = expectedMetaData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('should render values', () => {
                const expectedVersion = expectedMetaData.page.version;
                const expectedVersionDate = expectedMetaData.page.versionReleaseDate;

                // find debug elements
                const versionDes = getAndExpectDebugElementByCss(compDe, '#awg-version', 1, 1);
                const versionDateDes = getAndExpectDebugElementByCss(compDe, '#awg-version-date', 1, 1);

                // find native elements
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
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 2, 2);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLinks from template', () => {
                expect(routerLinks.length).toBe(2, 'should have 2 routerLinks');
                expect(routerLinks[0].linkParams).toEqual(['/contact']);
                expect(routerLinks[1].linkParams).toEqual(['/contact']);
            });

            it('... can click masthead link in template', () => {
                const mastheadLinkDe = linkDes[0]; // contact link DebugElement
                const mastheadLink = routerLinks[0]; // contact link directive

                expect(mastheadLink.navigatedTo).toBeNull('should not have navigated yet');

                click(mastheadLinkDe);
                fixture.detectChanges();

                expect(mastheadLink.navigatedTo).toEqual(['/contact']);
            });

            it('... can click documentation link in template', () => {
                const documentationLinkDe = linkDes[1]; // contact link DebugElement
                const documentationLink = routerLinks[1]; // contact link directive

                expect(documentationLink.navigatedTo).toBeNull('should not have navigated yet');

                click(documentationLinkDe);
                fixture.detectChanges();

                expect(documentationLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
