/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent (DONE)', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes, routerLinks;

    let expectedIsCollapsed: boolean;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeModule, NgbCollapseModule, NgbDropdownModule],
            declarations: [NavbarComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedIsCollapsed = true;

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'toggleNav').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have `isCollapsed = true`', () => {
            expect(component.isCollapsed).toBe(true, 'should be true');
        });

        describe('#toggleNav', () => {
            it('... should not have been called', () => {
                expect(component.toggleNav).not.toHaveBeenCalled();
            });

            it('... should be called when button clicked (click helper)', () => {
                // find button elements
                const buttonDes = getAndExpectDebugElementByCss(compDe, 'button.navbar-toggler', 1, 1);
                const buttonEl = buttonDes[0].nativeElement;

                // should have not been called yet
                expect(component.toggleNav).not.toHaveBeenCalled();

                // click button
                click(buttonDes[0]);
                click(buttonEl);

                expect(component.toggleNav).toHaveBeenCalled();
                expect(component.toggleNav).toHaveBeenCalledTimes(2);
            });

            it('... should toggle `isCollapsed`', () => {
                component.toggleNav();

                expect(component.isCollapsed).toBe(false);

                component.toggleNav();

                expect(component.isCollapsed).toBe(true);
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 navbar with 1 toggle button', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'nav.navbar > button.navbar-toggler', 1, 1);
            });

            it('... should contain 1 navbar collapse', () => {
                getAndExpectDebugElementByCss(compDe, 'nav.navbar > .navbar-collapse', 1, 1);
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
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 14, 14);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(14, 'should have 14 routerLinks');
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

                click(contactLinkDe);
                fixture.detectChanges();

                expect(contactLink.navigatedTo).toEqual(['/contact']);
            });
        });
    });
});
