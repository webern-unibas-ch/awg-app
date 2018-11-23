import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { FooterTextComponent } from './footer-text.component';
import { Meta } from '@awg-core/core-models';

describe('FooterDeclarationComponent', () => {
    let component: FooterTextComponent;
    let fixture: ComponentFixture<FooterTextComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes, routerLinks;

    let expectedMetaData: Meta;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterTextComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterTextComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test meta data
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
                const paraDes = fixture.debugElement.queryAll(By.css('p'));
                expect(paraDes).toBeTruthy();
                expect(paraDes.length).toBe(3, 'should have 3 paragraphs');
            });

            it('... should not render metaData yet', () => {
                // find debug elements
                const versionDe = fixture.debugElement.query(By.css('#awg-version'));
                const versionDateDe = fixture.debugElement.query(By.css('#awg-version-date'));

                // find native elements
                const versionEl = versionDe.nativeElement;
                const versionDateEl = versionDateDe.nativeElement;

                expect(versionEl.textContent).toBeDefined();
                expect(versionEl.textContent).toBe('', 'should be empty string');

                expect(versionDateEl.textContent).toBeDefined();
                expect(versionDateEl.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the input values supplied by the parent component
            expectedMetaData = new Meta();
            expectedMetaData.page = {
                yearStart: 2015,
                yearRecent: 2017,
                version: '1.0.0',
                versionReleaseDate: '8. November 2016'
            };

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
                const versionDe = fixture.debugElement.query(By.css('#awg-version'));
                const versionDateDe = fixture.debugElement.query(By.css('#awg-version-date'));

                // find native elements
                const versionEl = versionDe.nativeElement;
                const versionDateEl = versionDateDe.nativeElement;

                expect(versionEl.textContent).toContain(expectedVersion);
                expect(versionDateEl.textContent).toContain(expectedVersionDate);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));

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

                contactLinkDe.triggerEventHandler('click', null);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
