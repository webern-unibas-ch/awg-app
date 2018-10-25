/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { click } from '@testing/click-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes, routerLinks;

    let expectedShowMobileNav: boolean;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NavbarComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        expectedShowMobileNav = false;

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'toggleNav').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have `showMobileNav = false`', () => {
            expect(component.showMobileNav).toBe(false, 'should be false');
        });

        describe('#toggleNav', () => {
            it('... should not have been called', () => {
                expect(component.toggleNav).not.toHaveBeenCalled();
            });

            it('... should be called when button clicked (click helper)', () => {
                // find button elements
                const buttonDe = fixture.debugElement.query(By.css('.navbar-header > button.navbar-toggle'));
                const buttonEl = buttonDe.nativeElement;

                // should have not been called yet
                expect(component.toggleNav).not.toHaveBeenCalled();

                // click button
                click(buttonDe);
                click(buttonEl);

                expect(component.toggleNav).toHaveBeenCalled();
            });

            it('... should toggle `showMobileNav`', () => {
                component.toggleNav();

                expect(component.showMobileNav).toBe(true);

                component.toggleNav();

                expect(component.showMobileNav).toBe(false);
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 navbar header with 1 toggle button', () => {
                const headerDes = fixture.debugElement.queryAll(By.css('.navbar-header'));
                const buttonDes = fixture.debugElement.queryAll(By.css('.navbar-header > button.navbar-toggle'));

                expect(headerDes).toBeTruthy();
                expect(headerDes.length).toBe(1, 'should have 1 header');

                expect(buttonDes).toBeTruthy();
                expect(buttonDes.length).toBe(1, 'should have 1 button');
            });

            it('... should contain 1 navbar collapse', () => {
                const collapseDes = fixture.debugElement.queryAll(By.css('.navbar-collapse'));
                expect(collapseDes).toBeTruthy();
                expect(collapseDes.length).toBe(1, 'should have 1 collapse');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(14, 'should have 14 routerLink');
                expect(routerLinks[0].linkParams).toEqual(['/home']);
                expect(routerLinks[1].linkParams).toEqual(['/edition', 'intro']);
                expect(routerLinks[2].linkParams).toEqual(['/edition/detail', 'Aa:SkI/2']);
                expect(routerLinks[3].linkParams).toEqual(['/edition/detail', 'Aa:SkI/3']);
                expect(routerLinks[4].linkParams).toEqual(['/edition/detail', 'Aa:SkI/4']);
                expect(routerLinks[5].linkParams).toEqual(['/edition/detail', 'Aa:SkI/5']);
                expect(routerLinks[6].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[7].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[8].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[9].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[10].linkParams).toEqual(['/edition', 'report']);
                expect(routerLinks[11].linkParams).toEqual(['/structure']);
                expect(routerLinks[12].linkParams).toEqual(['/data/search', 'fulltext']);
                expect(routerLinks[13].linkParams).toEqual(['/contact']);
            });

            it('... can click Contact link in template', () => {
                const contactLinkDe = linkDes[13]; // contact link DebugElement
                const contactLink = routerLinks[13]; // contact link directive

                expect(contactLink.navigatedTo).toBeNull('should not have navigated yet');

                contactLinkDe.triggerEventHandler('click', null);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
