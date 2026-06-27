import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { NavbarDropdownLinkComponent } from './navbar-dropdown-link.component';

describe('NavbarDropdownItemComponent', () => {
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

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('label', '');
        fixture.componentRef.setInput('route', []);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `label` input', () => {
            expectToBe(component.label(), '');
        });

        it('... should have required `route` input', () => {
            expectToEqual(component.route(), []);
        });

        describe('VIEW', () => {
            it('... should contain no dropdown item link yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent updating the input properties
            fixture.componentRef.setInput('label', expectedLabel);
            fixture.componentRef.setInput('route', expectedRoute);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have updated `label` input', () => {
            expectToBe(component.label(), expectedLabel);
        });

        it('... should have updated `route` input', () => {
            expectToEqual(component.route(), expectedRoute);
        });

        describe('VIEW', () => {
            it('... should contain one dropdown item link`', () => {
                getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 1, 1);
            });

            it('... should display corrct label in dropdown item link', () => {
                const aDe = getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 1, 1)[0];
                const aEl = aDe.nativeElement as HTMLAnchorElement;

                expectToBe(aEl.textContent?.trim(), expectedLabel);
            });

            it('... should have `routerLink` in dropdown item link', () => {
                const aDe = getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 1, 1);
                const routerLinkDirective = aDe[0].injector.get(RouterLink, null);

                expect(routerLinkDirective).not.toBe(null);
            });

            it('... should have correct `routerLinkActive` options in dropdown item link', () => {
                const aDe = getAndExpectDebugElementByCss(compDe, 'a.dropdown-item', 1, 1);

                const routerLinkActiveDirective = aDe[0].injector.get(RouterLinkActive, null);
                expect(routerLinkActiveDirective).not.toBeNull();

                expectToEqual(routerLinkActiveDirective?.routerLinkActiveOptions, { exact: true });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(() => {
                // Find DebugElements with an attached RouterLink
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                // Get attached link directive instances using each DebugElement's injector
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
