import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, QueryParamsHandling, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ClickDirective } from '@awg-shared/click/click.directive';
import { NavLink } from '@awg-shared/nav-link-group/nav-link.model';

import { NavLinkGroupComponent } from './nav-link-group.component';

describe('NavLinkGroupComponent (DONE)', () => {
    let component: NavLinkGroupComponent;
    let fixture: ComponentFixture<NavLinkGroupComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedNavLinks: NavLink[];
    let expectedOrderOfRouterlinks: string[][];
    let expectedQueryParamsHandling: QueryParamsHandling;

    let selectNavLinkSpy: Spy;
    let emitSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavLinkGroupComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        router = TestBed.inject(Router);

        fixture = TestBed.createComponent(NavLinkGroupComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedOrderOfRouterlinks = [
            ['/data/search', 'fulltext'],
            ['/data/search', 'timeline'],
            ['/data/search', 'bibliography'],
        ];
        expectedNavLinks = [
            new NavLink(expectedOrderOfRouterlinks[0][0], expectedOrderOfRouterlinks[0][1], 'Volltext-Suche', false),
            new NavLink(expectedOrderOfRouterlinks[1][0], expectedOrderOfRouterlinks[1][1], 'Timeline', true),
            new NavLink(expectedOrderOfRouterlinks[2][0], expectedOrderOfRouterlinks[2][1], 'Bibliographie', true),
        ];
        expectedQueryParamsHandling = 'preserve';

        // Spies
        selectNavLinkSpy = vi.spyOn(component, 'selectNavLink');
        emitSpy = vi.spyOn(component.selectNavLinkRequest, 'emit');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `navLinks` to hold an empty array', () => {
            expectToBe(isSignal(component.navLinks), true);

            expectToEqual(component.navLinks(), []);
        });

        it('... should have input signal `queryParamsHandling` to hold the default value', () => {
            expectToBe(isSignal(component.queryParamsHandling), true);

            expectToBe(component.queryParamsHandling(), '');
        });

        it('... should have output `selectNavLinkRequest`', () => {
            expect(component.selectNavLinkRequest).toBeDefined();
        });

        describe('#selectNavLink()', () => {
            it('... should have a method `selectNavLink`', () => {
                expect(component.selectNavLink).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.selectNavLink).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one link group', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-nav-link-group', 1, 1);
            });

            it('... should contain no links yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-nav-link', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('navLinks', expectedNavLinks);
            fixture.componentRef.setInput('queryParamsHandling', expectedQueryParamsHandling);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `navLinks` to hold the provided links', () => {
            expectToEqual(component.navLinks(), expectedNavLinks);
        });

        it('... should have input signal `queryParamsHandling` to hold the provided value', () => {
            expectToBe(component.queryParamsHandling(), expectedQueryParamsHandling);
        });

        describe('VIEW', () => {
            it('... should contain as many links as given navLinks', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-nav-link',
                    expectedNavLinks.length,
                    expectedNavLinks.length
                );
            });

            it('... should mark first and last link', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-nav-link', 3, 3);

                expectToContain(aDes[0].nativeElement.classList, 'first');
                expectToNotContain(aDes[1].nativeElement.classList, 'first');
                expectToNotContain(aDes[1].nativeElement.classList, 'last');
                expectToContain(aDes[2].nativeElement.classList, 'last');
            });

            it('... should disable links if necessary', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-nav-link',
                    expectedNavLinks.length,
                    expectedNavLinks.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl: HTMLAnchorElement = aDe.nativeElement;

                    if (expectedNavLinks[index].disabled) {
                        expectToContain(aEl.classList, 'disabled');
                        expectToBe(aEl.getAttribute('aria-disabled'), 'true');
                        expectToBe(aEl.hasAttribute('href'), false);
                    } else {
                        expectToNotContain(aEl.classList, 'disabled');
                        expectToBe(aEl.hasAttribute('aria-disabled'), false);
                        expectToBe(aEl.hasAttribute('href'), true);
                    }
                });
            });

            it('... should keep disabled links out of the tab order', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-nav-link',
                    expectedNavLinks.length,
                    expectedNavLinks.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl: HTMLAnchorElement = aDe.nativeElement;
                    const isFocusable = aEl.hasAttribute('href') || aEl.hasAttribute('tabindex');

                    expectToBe(isFocusable, !expectedNavLinks[index].disabled);
                });
            });

            it('... should render link labels', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-nav-link',
                    expectedNavLinks.length,
                    expectedNavLinks.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl: HTMLAnchorElement = aDe.nativeElement;

                    expectToBe(aEl.textContent.trim(), expectedNavLinks[index].label.toUpperCase());
                });
            });

            it('... should have `awgClick` on each link', () => {
                getAndExpectDebugElementByDirective(
                    compDe,
                    ClickDirective,
                    expectedNavLinks.length,
                    expectedNavLinks.length
                );
            });

            it('... should have `routerLinkActive` on each link', () => {
                getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkActive,
                    expectedNavLinks.length,
                    expectedNavLinks.length
                );
            });

            describe('[routerLink]', () => {
                let linkDes: DebugElement[];
                let routerLinks: RouterLink[];

                beforeEach(() => {
                    linkDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLink,
                        expectedNavLinks.length,
                        expectedNavLinks.length
                    );

                    routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                });

                it('... can get correct linkParams from routerLinks of enabled links', () => {
                    routerLinks.forEach((routerLink, index) => {
                        const expectedUrl = expectedNavLinks[index].disabled
                            ? null
                            : expectedOrderOfRouterlinks[index].join('/');

                        expectToBe(routerLink.urlTree?.toString() ?? null, expectedUrl);
                    });
                });

                it('... should pass down `queryParamsHandling` to routerLinks', () => {
                    routerLinks.forEach(routerLink => {
                        expectToBe(routerLink.queryParamsHandling, expectedQueryParamsHandling);
                    });
                });

                it('... should navigate only on click of enabled links in template', async () => {
                    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                    for (const linkDe of linkDes) {
                        await clickAndAwaitChanges(linkDe, fixture);
                    }

                    expectToBe(navigateSpy.mock.calls.length, 1);
                    expectToBe(navigateSpy.mock.calls[0][0].toString(), expectedOrderOfRouterlinks[0].join('/'));
                });
            });

            describe('... output `selectNavLinkRequest`', () => {
                it('... should trigger `selectNavLink` on click if enabled or disabled', async () => {
                    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-nav-link', 3, 3);

                    await clickAndAwaitChanges(aDes[0], fixture);

                    expectSpyCall(selectNavLinkSpy, 1, expectedNavLinks[0]);

                    await clickAndAwaitChanges(aDes[1], fixture);

                    expectSpyCall(selectNavLinkSpy, 2, expectedNavLinks[1]);

                    await clickAndAwaitChanges(aDes[2], fixture);

                    expectSpyCall(selectNavLinkSpy, 3, expectedNavLinks[2]);
                });

                it('... should emit only for enabled links on click', async () => {
                    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-nav-link', 3, 3);

                    for (const aDe of aDes) {
                        await clickAndAwaitChanges(aDe, fixture);
                    }

                    expectSpyCall(emitSpy, 1, expectedNavLinks[0]);
                });

                it('... should not trigger `selectNavLink` on Enter key of enabled links (native activation)', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-nav-link', 3, 3);

                    aDes[0].triggerEventHandler('keydown.enter', { target: aDes[0].nativeElement });

                    expectSpyCall(selectNavLinkSpy, 0);
                });

                it('... should not trigger `selectNavLink` on Space key (links)', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-nav-link', 3, 3);

                    aDes[0].triggerEventHandler('keydown.space', { target: aDes[0].nativeElement });

                    expectSpyCall(selectNavLinkSpy, 0);
                });

                it('... should not trigger `selectNavLink` on other keys', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-nav-link', 3, 3);

                    aDes[0].nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

                    expectSpyCall(selectNavLinkSpy, 0);
                });
            });
        });

        describe('#selectNavLink()', () => {
            it('... should have a method `selectNavLink`', () => {
                expect(component.selectNavLink).toBeDefined();
            });

            it('... should do nothing if navLink is disabled', () => {
                const disabledNavLink = new NavLink('/data/search', 'fulltext', 'Volltext-Suche', true);

                component.selectNavLink(disabledNavLink);

                expectSpyCall(selectNavLinkSpy, 1, disabledNavLink);
                expectSpyCall(emitSpy, 0);
            });

            it('... should emit if navLink is enabled', () => {
                const enabledNavLink = new NavLink('/data/search', 'fulltext', 'Volltext-Suche', false);

                component.selectNavLink(enabledNavLink);

                expectSpyCall(selectNavLinkSpy, 1, enabledNavLink);
                expectSpyCall(emitSpy, 1, enabledNavLink);
            });
        });
    });
});
