import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { Meta } from '@awg-core/core-models';

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
        expectedMetaData = new Meta();
        expectedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2018,
            version: '0.2.0',
            versionReleaseDate: '18. Oktober 2018'
        };
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
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
                expect(routerLinks[0].linkParams).toEqual(['/contact']);
            });

            it('... can click Contact link in template', () => {
                const contactLinkDe = linkDes[0]; // contact link DebugElement
                const contactLink = routerLinks[0]; // contact link directive

                expect(contactLink.navigatedTo).toBeNull('should not have navigated yet');

                click(contactLinkDe);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
