import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { NavbarDropdownLinkComponent } from './navbar-dropdown-link.component';

describe('NavbarDropdownLinkComponent (DONE)', () => {
    let component: NavbarDropdownLinkComponent;
    let fixture: ComponentFixture<NavbarDropdownLinkComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedLabel: string;
    let expectedRoute: string[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarDropdownLinkComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarDropdownLinkComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        router = TestBed.inject(Router);

        // Test data
        expectedLabel = 'Test Label';
        expectedRoute = ['/test', 'route'];
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `label`', () => {
            expectToBe(isSignal(component.label), true);

            expect(() => component.label()).toThrow();
        });

        it('... should throw due to missing required input signal `route`', () => {
            expectToBe(isSignal(component.route), true);

            expect(() => component.route()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no dropdown item link yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('label', expectedLabel);
            fixture.componentRef.setInput('route', expectedRoute);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `label` to hold the provided label', () => {
            expectToBe(component.label(), expectedLabel);
        });

        it('... should have input signal `route` to hold the provided route', () => {
            expectToBe(component.route(), expectedRoute);
        });

        describe('VIEW', () => {
            it('... should contain one dropdown item link`', () => {
                getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 1, 1);
            });

            it('... should display correct label in dropdown item link', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 1, 1);
                const aEl = aDes[0].nativeElement as HTMLAnchorElement;

                expectToBe(aEl.textContent?.trim(), expectedLabel);
            });

            it('... should have `routerLink` in dropdown item link', () => {
                getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);
            });

            it('... should have correct `routerLinkActive` options in dropdown item link', () => {
                const routerLinkActiveDes = getAndExpectDebugElementByDirective(compDe, RouterLinkActive, 1, 1);
                const routerLinkActive = routerLinkActiveDes[0].injector.get(RouterLinkActive) as RouterLinkActive;

                expectToEqual(routerLinkActive.routerLinkActiveOptions, { exact: true });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct numer of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                const urlTree = routerLinks[0].urlTree;

                expectToBe(urlTree.toString(), expectedRoute.join('/'));
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                navigateSpy.mockClear();

                const linkDe = linkDes[0];

                await clickAndAwaitChanges(linkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                const firstCallArg = navigateSpy.mock.calls[0][0];
                const actualUrl = firstCallArg.toString();

                expectToBe(actualUrl, expectedRoute.join('/'));

                navigateSpy.mockRestore();
            });
        });
    });
});
