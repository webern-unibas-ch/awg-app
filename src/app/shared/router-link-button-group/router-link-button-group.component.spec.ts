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
import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

import { RouterLinkButtonGroupComponent } from './router-link-button-group.component';

describe('RouterLinkButtonGroupComponent (DONE)', () => {
    let component: RouterLinkButtonGroupComponent;
    let fixture: ComponentFixture<RouterLinkButtonGroupComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedRouterLinkButtons: RouterLinkButton[];
    let expectedOrderOfRouterlinks: string[][];
    let expectedQueryParamsHandling: QueryParamsHandling;

    let selectButtonSpy: Spy;
    let emitSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterLinkButtonGroupComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        router = TestBed.inject(Router);

        fixture = TestBed.createComponent(RouterLinkButtonGroupComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedOrderOfRouterlinks = [
            ['/data/search', 'fulltext'],
            ['/data/search', 'timeline'],
            ['/data/search', 'bibliography'],
        ];
        expectedRouterLinkButtons = [
            new RouterLinkButton(
                expectedOrderOfRouterlinks[0][0],
                expectedOrderOfRouterlinks[0][1],
                'Volltext-Suche',
                false
            ),
            new RouterLinkButton(expectedOrderOfRouterlinks[1][0], expectedOrderOfRouterlinks[1][1], 'Timeline', true),
            new RouterLinkButton(
                expectedOrderOfRouterlinks[2][0],
                expectedOrderOfRouterlinks[2][1],
                'Bibliographie',
                true
            ),
        ];
        expectedQueryParamsHandling = 'preserve';

        // Spies
        selectButtonSpy = vi.spyOn(component, 'selectButton');
        emitSpy = vi.spyOn(component.selectButtonRequest, 'emit');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `routerLinkButtons` to hold an empty array', () => {
            expectToBe(isSignal(component.routerLinkButtons), true);

            expectToEqual(component.routerLinkButtons(), []);
        });

        it('... should have input signal `queryParamsHandling` to hold the default value', () => {
            expectToBe(isSignal(component.queryParamsHandling), true);

            expectToBe(component.queryParamsHandling(), '');
        });

        it('... should have output `selectButtonRequest`', () => {
            expect(component.selectButtonRequest).toBeDefined();
        });

        describe('#selectButton()', () => {
            it('... should have a method `selectButton`', () => {
                expect(component.selectButton).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.selectButton).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one link group', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-router-link-btn-group', 1, 1);
            });

            it('... should contain no links yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('routerLinkButtons', expectedRouterLinkButtons);
            fixture.componentRef.setInput('queryParamsHandling', expectedQueryParamsHandling);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `routerLinkButtons` to hold the provided links', () => {
            expectToEqual(component.routerLinkButtons(), expectedRouterLinkButtons);
        });

        it('... should have input signal `queryParamsHandling` to hold the provided value', () => {
            expectToBe(component.queryParamsHandling(), expectedQueryParamsHandling);
        });

        describe('VIEW', () => {
            it('... should contain as many links as given routerLinkButtons', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-router-link-btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );
            });

            it('... should mark first and last link', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 3, 3);

                expectToContain(aDes[0].nativeElement.classList, 'first');
                expectToNotContain(aDes[1].nativeElement.classList, 'first');
                expectToNotContain(aDes[1].nativeElement.classList, 'last');
                expectToContain(aDes[2].nativeElement.classList, 'last');
            });

            it('... should disable links if necessary', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-router-link-btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl: HTMLAnchorElement = aDe.nativeElement;

                    if (expectedRouterLinkButtons[index].disabled) {
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

            it('... should render link labels', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-router-link-btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl: HTMLAnchorElement = aDe.nativeElement;

                    expectToBe(aEl.textContent.trim(), expectedRouterLinkButtons[index].label.toUpperCase());
                });
            });

            it('... should have `awgClick` on each link', () => {
                getAndExpectDebugElementByDirective(
                    compDe,
                    ClickDirective,
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );
            });

            it('... should have `routerLinkActive` on each link', () => {
                getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkActive,
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );
            });

            describe('[routerLink]', () => {
                let linkDes: DebugElement[];
                let routerLinks: RouterLink[];

                beforeEach(() => {
                    linkDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLink,
                        expectedRouterLinkButtons.length,
                        expectedRouterLinkButtons.length
                    );

                    routerLinks = linkDes.map(de => de.injector.get(RouterLink));
                });

                it('... can get correct linkParams from routerLinks of enabled links', () => {
                    routerLinks.forEach((routerLink, index) => {
                        const expectedUrl = expectedRouterLinkButtons[index].disabled
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

            describe('... output `selectButtonRequest`', () => {
                it('... should trigger `selectButton` on click if enabled or disabled', async () => {
                    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 3, 3);

                    await clickAndAwaitChanges(aDes[0], fixture);

                    expectSpyCall(selectButtonSpy, 1, expectedRouterLinkButtons[0]);

                    await clickAndAwaitChanges(aDes[1], fixture);

                    expectSpyCall(selectButtonSpy, 2, expectedRouterLinkButtons[1]);

                    await clickAndAwaitChanges(aDes[2], fixture);

                    expectSpyCall(selectButtonSpy, 3, expectedRouterLinkButtons[2]);
                });

                it('... should emit only for enabled links on click', async () => {
                    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 3, 3);

                    for (const aDe of aDes) {
                        await clickAndAwaitChanges(aDe, fixture);
                    }

                    expectSpyCall(emitSpy, 1, expectedRouterLinkButtons[0]);
                });

                it('... should trigger `selectButton` on Enter key of disabled links (no native activation)', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 3, 3);

                    aDes[1].triggerEventHandler('keydown.enter', { target: aDes[1].nativeElement });

                    expectSpyCall(selectButtonSpy, 1, expectedRouterLinkButtons[1]);
                    expectSpyCall(emitSpy, 0);
                });

                it('... should not trigger `selectButton` on Enter key of enabled links (native activation)', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 3, 3);

                    aDes[0].triggerEventHandler('keydown.enter', { target: aDes[0].nativeElement });

                    expectSpyCall(selectButtonSpy, 0);
                });

                it('... should not trigger `selectButton` on Space key (links)', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 3, 3);

                    aDes[1].triggerEventHandler('keydown.space', { target: aDes[1].nativeElement });

                    expectSpyCall(selectButtonSpy, 0);
                });

                it('... should not trigger `selectButton` on other keys', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'a.awg-router-link-btn', 3, 3);

                    aDes[0].nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

                    expectSpyCall(selectButtonSpy, 0);
                });
            });
        });

        describe('#selectButton()', () => {
            it('... should have a method `selectButton`', () => {
                expect(component.selectButton).toBeDefined();
            });

            it('... should do nothing if routerLinkButton is disabled', () => {
                const disabledButton = new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', true);

                component.selectButton(disabledButton);

                expectSpyCall(selectButtonSpy, 1, disabledButton);
                expectSpyCall(emitSpy, 0);
            });

            it('... should emit if routerLinkButton is enabled', () => {
                const enabledButton = new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', false);

                component.selectButton(enabledButton);

                expectSpyCall(selectButtonSpy, 1, enabledButton);
                expectSpyCall(emitSpy, 1, enabledButton);
            });
        });
    });
});
