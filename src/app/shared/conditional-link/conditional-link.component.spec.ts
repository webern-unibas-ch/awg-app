import { createComponent, DebugElement, EnvironmentInjector, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ConditionalLinkComponent } from './conditional-link.component';

describe('ConditionalLinkComponent', () => {
    let component: ConditionalLinkComponent;
    let fixture: ComponentFixture<ConditionalLinkComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConditionalLinkComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(ConditionalLinkComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `isClickable` to hold the default value', () => {
            expectToBe(isSignal(component.isClickable), true);

            expectToBe(component.isClickable(), false);
        });

        it('... should have input signal `targetRoute` to hold the default value', () => {
            expectToBe(isSignal(component.targetRoute), true);

            expectToBe(component.targetRoute(), null);
        });

        it('... should have output `clicked`', () => {
            expect(component.clicked).toBeDefined();
        });

        describe('VIEW', () => {
            it('... should not contain an anchor yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('... with isClickable = false', () => {
            it('... should have input signal `isClickable` to hold the default value', () => {
                expectToBe(component.isClickable(), false);
            });

            it('... should render no anchor', () => {
                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
            });

            it('... should render no anchor even with a targetRoute', () => {
                fixture.componentRef.setInput('targetRoute', ['/edition']);
                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'a', 0, 0);
            });
        });

        describe('... with isClickable = true and a targetRoute', () => {
            describe('VIEW', () => {
                describe('... should contain a router link with the expected href for a targetRoute given as', () => {
                    it.each([
                        { desc: 'commands array', getTargetRoute: () => ['/edition/complex/op12'] },
                        {
                            desc: 'UrlTree',
                            getTargetRoute: () =>
                                TestBed.inject(Router).parseUrl('/edition/complex/op12/sheets?id=test'),
                        },
                    ])('... $desc', ({ getTargetRoute }) => {
                        const router = TestBed.inject(Router);
                        const targetRoute = getTargetRoute();
                        const expectedHref = Array.isArray(targetRoute)
                            ? router.serializeUrl(router.createUrlTree(targetRoute))
                            : router.serializeUrl(targetRoute);

                        fixture.componentRef.setInput('isClickable', true);
                        fixture.componentRef.setInput('targetRoute', targetRoute);
                        fixture.detectChanges();

                        const anchorDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);
                        const anchorEl: HTMLAnchorElement = anchorDes[0].nativeElement;

                        expectToBe(anchorEl.getAttribute('href'), expectedHref);
                        expectToBe(anchorEl.getAttribute('role'), null);
                    });
                });
            });
        });

        describe('... with isClickable = true', () => {
            beforeEach(() => {
                // Set the initial values for the signal inputs
                fixture.componentRef.setInput('isClickable', true);

                // Trigger change detection
                fixture.detectChanges();
            });

            it('... should have input signal `isClickable` to hold the provided value', () => {
                expectToBe(component.isClickable(), true);
            });

            describe('VIEW', () => {
                it('... should contain a link with the expected accessibility attributes', () => {
                    const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                    const anchorEl: HTMLAnchorElement = anchorDes[0].nativeElement;

                    expectToBe(anchorEl.getAttribute('role'), 'link');
                    expectToBe(anchorEl.tabIndex, 0);
                });

                it('... should emit `clicked` when the link is clicked', async () => {
                    const emitSpy = vi.fn();
                    component.clicked.subscribe(emitSpy);

                    const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                    await clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(emitSpy, 1);
                });

                it('... should emit `clicked` on Enter keyup on the link', () => {
                    const emitSpy = vi.fn();
                    component.clicked.subscribe(emitSpy);

                    const anchorDes = getAndExpectDebugElementByCss(compDe, 'a', 1, 1);
                    const anchorEl: HTMLAnchorElement = anchorDes[0].nativeElement;
                    anchorEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

                    expectSpyCall(emitSpy, 1);
                });

                it('... should render the projected content once, both with and without a link', () => {
                    const hostElement = document.createElement('div');
                    const projectedContent = document.createElement('span');
                    projectedContent.classList.add('projected-content');
                    projectedContent.textContent = 'Siglum';

                    const componentRef = createComponent(ConditionalLinkComponent, {
                        environmentInjector: TestBed.inject(EnvironmentInjector),
                        hostElement,
                        projectableNodes: [[projectedContent]],
                    });

                    try {
                        componentRef.changeDetectorRef.detectChanges();

                        let anchorEl = hostElement.querySelector('a');
                        let contentEl = hostElement.querySelector('.projected-content');

                        expectToBe(anchorEl, null);
                        expect(hostElement.querySelectorAll('.projected-content')).toHaveLength(1);
                        expectToBe(contentEl?.textContent?.trim(), 'Siglum');

                        componentRef.setInput('isClickable', true);
                        componentRef.changeDetectorRef.detectChanges();

                        anchorEl = hostElement.querySelector('a');
                        contentEl = hostElement.querySelector('.projected-content');

                        expect(anchorEl).not.toBeNull();
                        expectToBe(contentEl?.parentElement, anchorEl);
                        expect(hostElement.querySelectorAll('.projected-content')).toHaveLength(1);
                        expectToBe(contentEl?.textContent?.trim(), 'Siglum');
                    } finally {
                        componentRef.destroy();
                    }
                });
            });
        });
    });
});
