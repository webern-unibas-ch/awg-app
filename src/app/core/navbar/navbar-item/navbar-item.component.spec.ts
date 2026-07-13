import { Component, DebugElement, isSignal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NgbDropdown, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { NAVBAR_ITEMS } from '../navbar.data';
import { NavbarItem } from '../navbar.model';
import { NavbarItemComponent } from './navbar-item.component';

// Test Host Component to test NavbarItemComponent with correct dropdown context
@Component({
    imports: [NavbarItemComponent, NgbDropdown],
    template: `
        <div ngbDropdown>
            <awg-navbar-item [id]="testId" [item]="testItem" [isDropdown]="isTestDropdown"></awg-navbar-item>
        </div>
    `,
})
class TestHostComponent {
    @ViewChild(NavbarItemComponent) navbarItemComponent!: NavbarItemComponent;

    testItem: NavbarItem | null = null;
    testId = '';
    isTestDropdown = false;
}

describe('NavbarItemComponent (DONE)', () => {
    describe('BEFORE initial data binding (no Host)', () => {
        let fixture: ComponentFixture<NavbarItemComponent>;
        let component: NavbarItemComponent;
        let compDe: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [NavbarItemComponent],
                providers: [provideRouter([])],
            }).compileComponents();

            fixture = TestBed.createComponent(NavbarItemComponent);
            component = fixture.componentInstance;
            compDe = fixture.debugElement;
        });

        it('... should throw due to missing required input signal `item`', () => {
            expectToBe(isSignal(component.item), true);

            expect(() => component.item()).toThrow();
        });

        it('... should have input signal `id` to hold the default value', () => {
            expectToBe(isSignal(component.id), true);

            expectToBe(component.id(), '');
        });

        it('... should have input signal `isDropdown` to hold the default value', () => {
            expectToBe(isSignal(component.isDropdown), true);

            expectToBe(component.isDropdown(), false);
        });

        describe('VIEW', () => {
            it('... should contain no nav link yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.nav-link', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding (with Host)', () => {
        let hostFixture: ComponentFixture<TestHostComponent>;
        let hostComponent: TestHostComponent;

        let component: NavbarItemComponent;
        let compDe: DebugElement;

        let router: Router;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostComponent],
                providers: [provideRouter([])],
            }).compileComponents();
        });

        beforeEach(() => {
            hostFixture = TestBed.createComponent(TestHostComponent);
            hostComponent = hostFixture.componentInstance;

            router = TestBed.inject(Router);
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        const allNavbarItems = Object.values(NAVBAR_ITEMS);
        const dropdownStates = [false, true];

        // Loop through all navbar items and dropdown states to test the component with different inputs
        allNavbarItems.forEach(navbarItem => {
            dropdownStates.forEach(isDropdownState => {
                describe(`... with item "${navbarItem.id}" and isDropdown = ${isDropdownState}`, () => {
                    beforeEach(() => {
                        // Set the initial values for the signal inputs
                        hostComponent.testItem = navbarItem;
                        hostComponent.testId = isDropdownState ? 'dropdown-' + navbarItem.id : '';
                        hostComponent.isTestDropdown = isDropdownState;

                        // Trigger initial data binding
                        hostFixture.detectChanges();

                        // Create the component instance and debug element for the NavbarItemComponent
                        compDe = hostFixture.debugElement.query(By.directive(NavbarItemComponent));
                        component = compDe.componentInstance;
                    });

                    it('should create', () => {
                        expect(component).toBeTruthy();
                    });

                    it('... should have input signal `item` to hold the provided item', () => {
                        expectToEqual(component.item(), hostComponent.testItem);
                    });

                    it('... should have input signal `id` to hold the provided id', () => {
                        expectToBe(component.id(), hostComponent.testId);
                    });

                    it('... should have input signal `isDropdown` to hold the provided value', () => {
                        expectToBe(component.isDropdown(), hostComponent.isTestDropdown);
                    });

                    describe('VIEW', () => {
                        it('... should contain one nav link', () => {
                            getAndExpectDebugElementByCss(compDe, 'a.nav-link', 1, 1);
                        });

                        it('... should have link label with correct classes', () => {
                            const navItemLinkSpanDes = getAndExpectDebugElementByCss(compDe, 'a.nav-link > span', 1, 1);
                            const navItemLinkSpanEl1: HTMLSpanElement = navItemLinkSpanDes[0].nativeElement;

                            expectToBe(navItemLinkSpanEl1.textContent, hostComponent.testItem.label);

                            const expectedClasses = hostComponent.testItem.spanClass.split(' ');
                            expectedClasses.forEach(className => {
                                expect(navItemLinkSpanEl1.classList.contains(className)).toBe(true);
                            });
                        });

                        it('... should have fa-icon with correct icon and iconClass', () => {
                            const faIconDes = getAndExpectDebugElementByCss(compDe, 'a.nav-link > fa-icon', 1, 1);
                            const faIconIns = faIconDes[0].componentInstance.icon;
                            const faIconEl: HTMLElement = faIconDes[0].nativeElement;

                            expectToEqual(faIconIns(), hostComponent.testItem.icon);
                            expectToContain(faIconEl.className, hostComponent.testItem.iconClass);
                        });

                        if (isDropdownState) {
                            it('... should have id on nav link', () => {
                                const navItemLinkDes = getAndExpectDebugElementByCss(compDe, 'a.nav-link', 1, 1);
                                const navItemLinkEl: HTMLAnchorElement = navItemLinkDes[0].nativeElement;

                                expect(navItemLinkEl.id).toBe(hostComponent.testId);
                            });

                            it('... should have no RouterLink, but NgbDropdownToggle', () => {
                                getAndExpectDebugElementByDirective(compDe, RouterLink, 0, 0);
                                getAndExpectDebugElementByDirective(compDe, NgbDropdownToggle, 1, 1);
                            });
                        } else {
                            it('... should have no id on nav link', () => {
                                const navItemLinkDes = getAndExpectDebugElementByCss(compDe, 'a.nav-link', 1, 1);
                                const navItemLinkEl: HTMLAnchorElement = navItemLinkDes[0].nativeElement;

                                expect(navItemLinkEl.id).toBe('');
                            });

                            it('... should have RouterLink, but no NgbDropdownToggle', () => {
                                getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);
                                getAndExpectDebugElementByDirective(compDe, NgbDropdownToggle, 0, 0);
                            });
                        }

                        if (!isDropdownState) {
                            describe('[routerLink]', () => {
                                let linkDes: DebugElement[];
                                let routerLinks: RouterLink[];
                                let expectedRouterlinks: string[][];

                                beforeEach(() => {
                                    expectedRouterlinks = [hostComponent.testItem.route];

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

                                    expectToBe(urlTree.toString(), expectedRouterlinks[0].join('/'));
                                });

                                it('... can click all links in template', async () => {
                                    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                                    navigateSpy.mockClear();

                                    const linkDe = linkDes[0];
                                    const expectedRouterLink = expectedRouterlinks[0];

                                    await clickAndAwaitChanges(linkDe, hostFixture);

                                    expect(navigateSpy).toHaveBeenCalled();
                                    const firstCallArg = navigateSpy.mock.calls[0][0];
                                    const actualUrl = firstCallArg.toString();

                                    expectToBe(actualUrl, expectedRouterLink.join('/'));

                                    navigateSpy.mockRestore();
                                });
                            });
                        }
                    });
                });
            });
        });
    });
});
