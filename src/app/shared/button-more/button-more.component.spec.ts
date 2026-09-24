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
            it('... should have one anchor', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
            });

            it('... should display the correct button text', () => {
                const buttonText = 'Mehr …';
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const anchorEl: HTMLElement = anchorDes[0].nativeElement;

                expectToBe(anchorEl.textContent?.trim(), buttonText);
            });

            it('... should have the correct default classes', () => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                const anchorEl: HTMLElement = anchorDes[0].nativeElement;

                expect(anchorEl.classList).toHaveLength(2);
                expectToContain(anchorEl.classList, 'btn');
                expectToContain(anchorEl.classList, 'btn-outline-info');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const getAnchorDes = () => getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
        const getAnchorEl = () => getAnchorDes()[0].nativeElement as HTMLElement;

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
            it('should bind the correct href URL from route and queryParams', () => {
                expectToBe(getAnchorEl().getAttribute('href'), expectedRoute);
            });

            it('... should not have class `disabled`', () => {
                expectToNotContain(getAnchorEl().classList, 'disabled');
            });

            it('... should have aria-disabled set to null', () => {
                expectToBe(getAnchorEl().getAttribute('aria-disabled'), null);
            });

            it('... should have tabindex set to null', () => {
                expectToBe(getAnchorEl().getAttribute('tabindex'), null);
            });

            describe('... with disabled = true', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('disabled', true);
                    fixture.detectChanges();
                });

                it('... should have class `disabled`', () => {
                    expectToContain(getAnchorEl().classList, 'disabled');
                });

                it('... should have aria-disabled set to true', () => {
                    expectToBe(getAnchorEl().getAttribute('aria-disabled'), 'true');
                });

                it('... should have tabindex set to -1', () => {
                    expectToBe(getAnchorEl().getAttribute('tabindex'), '-1');
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
