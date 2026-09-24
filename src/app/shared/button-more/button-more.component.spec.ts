import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ButtonMoreComponent } from './button-more.component';

describe('ButtonMoreComponent', () => {
    let component: ButtonMoreComponent;
    let fixture: ComponentFixture<ButtonMoreComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedTargetRoute: string[];
    let expectedQueryParams: Record<string, string> | null;
    let expectedRoute: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonMoreComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        expectedTargetRoute = ['/test-route'];
        expectedQueryParams = { param1: 'value1' };
        expectedRoute =
            expectedTargetRoute.join('/') +
            '?' +
            new URLSearchParams(expectedQueryParams as Record<string, string>).toString();

        // Create component fixture
        fixture = TestBed.createComponent(ButtonMoreComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `targetRoute`', () => {
            expectToBe(isSignal(component.targetRoute), true);

            expect(() => component.targetRoute()).toThrow();
        });

        it('... should have input signal `queryParams` to hold the default value', () => {
            expectToBe(isSignal(component.queryParams), true);

            expectToBe(component.queryParams(), null);
        });

        it('... should have input signal `disabled` to hold the default value', () => {
            expectToBe(isSignal(component.disabled), true);

            expectToBe(component.disabled(), false);
        });

        describe('VIEW', () => {
            it('... should contain no anchor and no button', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                getAndExpectDebugElementByCss(compDe, 'button', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const getAnchorDes = () => getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
        const getAnchorEl = () => getAnchorDes()[0].nativeElement as HTMLAnchorElement;
        const getButtonDes = () => getAndExpectDebugElementByCss(compDe, 'button', 1, 1);
        const getButtonEl = () => getButtonDes()[0].nativeElement as HTMLButtonElement;

        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('targetRoute', expectedTargetRoute);
            fixture.componentRef.setInput('queryParams', expectedQueryParams);
            fixture.componentRef.setInput('disabled', false);

            // Trigger change detection
            fixture.detectChanges();
        });

        it('... should have input signal `targetRoute` to hold the expected route', () => {
            expectToBe(component.targetRoute(), expectedTargetRoute);
        });

        it('... should have input signal `queryParams` to hold the expected query parameters', () => {
            expectToBe(component.queryParams(), expectedQueryParams);
        });

        it('... should have input signal `disabled` to hold the expected disabled state', () => {
            expectToBe(component.disabled(), false);
        });

        describe('VIEW', () => {
            describe('... with disabled = false', () => {
                it('... should contain one anchor, but no button', () => {
                    getAnchorDes();
                    getAndExpectDebugElementByCss(compDe, 'button', 0, 0);
                });

                it('... should display the correct anchor text', () => {
                    const buttonText = 'Mehr …';

                    expectToBe(getAnchorEl().textContent?.trim(), buttonText);
                });

                it('... should have the correct classes', () => {
                    const anchorEl = getAnchorEl();

                    expect(anchorEl.classList).toHaveLength(2);
                    expectToContain(anchorEl.classList, 'btn');
                    expectToContain(anchorEl.classList, 'btn-outline-info');
                });

                it('... should not have class `disabled`', () => {
                    expectToNotContain(getAnchorEl().classList, 'disabled');
                });

                it('should bind the correct href URL from route and queryParams', () => {
                    expectToBe(getAnchorEl().getAttribute('href'), expectedRoute);
                });
            });

            describe('... with disabled = true', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('disabled', true);
                    fixture.detectChanges();
                });

                it('... should contain one button, but no anchor', () => {
                    getButtonDes();
                    getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
                });

                it('... should display the correct button text', () => {
                    const buttonText = 'Mehr …';

                    expectToBe(getButtonEl().textContent?.trim(), buttonText);
                });

                it('... should have the correct classes including `disabled`', () => {
                    const buttonEl = getButtonEl();

                    expect(buttonEl.classList).toHaveLength(3);
                    expectToContain(buttonEl.classList, 'btn');
                    expectToContain(buttonEl.classList, 'btn-outline-dark');
                    expectToContain(buttonEl.classList, 'disabled');
                });

                it('... should disable the button element via the native disabled property', () => {
                    expectToBe(getButtonEl().disabled, true);
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                routerLinks = linkDes.map(de => de.injector.get(RouterLink) as RouterLink);
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                expectToBe(routerLinks[0].urlTree?.toString(), expectedRoute);
            });

            it('... can click the router link in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                await clickAndAwaitChanges(linkDes[0], fixture);

                expect(navigateSpy).toHaveBeenCalled();
                expectToBe(navigateSpy.mock.calls[0][0].toString(), expectedRoute);

                navigateSpy.mockRestore();
            });
        });
    });
});
