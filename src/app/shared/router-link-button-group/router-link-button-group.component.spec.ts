import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { QueryParamsHandling } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click, clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

import { RouterLinkButtonGroupComponent } from './router-link-button-group.component';

describe('RouterLinkButtonGroupComponent (DONE)', () => {
    let component: RouterLinkButtonGroupComponent;
    let fixture: ComponentFixture<RouterLinkButtonGroupComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedRouterLinkButtons: RouterLinkButton[];
    let expectedOrderOfRouterlinks: string[][];
    let expectedQueryParamsHandling: QueryParamsHandling;

    let selectButtonSpy: Spy;
    let emitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RouterLinkButtonGroupComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
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

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        selectButtonSpy = spyOn(component, 'selectButton').and.callThrough();
        emitSpy = spyOn(component.selectButtonRequest, 'emit').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `buttonArray` input', () => {
            expect(component.routerLinkButtons).toBeUndefined();
        });

        it('should have default empty `queryParamsHandling` input', () => {
            expect(component.queryParamsHandling).toBeFalsy();
        });

        describe('#onButtonSelect', () => {
            it('... should not have been called', () => {
                expect(component.selectButton).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one button group', () => {
                getAndExpectDebugElementByCss(compDe, 'div.btn-group', 1, 1);
            });

            it('... should contain no buttons yet', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.routerLinkButtons = expectedRouterLinkButtons;
            component.queryParamsHandling = expectedQueryParamsHandling;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `buttonArray` input', () => {
            expect(component.routerLinkButtons).toBeDefined();
            expect(component.routerLinkButtons)
                .withContext(`should equal ${expectedRouterLinkButtons}`)
                .toEqual(expectedRouterLinkButtons);
        });

        it('should have `queryParamsHandling` input', () => {
            expect(component.queryParamsHandling).toBeTruthy();
            expect(component.queryParamsHandling).withContext(`should be 'preserve'`).toBe(expectedQueryParamsHandling);
        });

        describe('VIEW', () => {
            it('... should contain as many buttons as given routerLinkButtons', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'button.btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );
            });

            it('... should disable buttons if necessary', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button.btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );

                btnDes.forEach((btnDe, index) => {
                    const btnEl = btnDe.nativeElement;

                    if (expectedRouterLinkButtons[index].disabled) {
                        expect(btnEl.disabled).toBeDefined();
                        expect(btnEl.disabled).withContext('should be disabled').toBe(true);
                    } else {
                        expect(btnEl.disabled).toBeDefined();
                        expect(btnEl.disabled).withContext('should not be disabled').toBe(false);
                    }
                });
            });

            it('... should render button labels', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'button.btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );
                btnDes.forEach((btnDe, index) => {
                    const btnEl = btnDe.nativeElement;

                    expect(btnEl.textContent).toBeTruthy();
                    expect(btnEl.textContent.trim())
                        .withContext(`should be ${expectedRouterLinkButtons[index].label}`)
                        .toBe(expectedRouterLinkButtons[index].label.trim());
                });
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expect(routerLinks.length)
                    .withContext(`should have ${expectedRouterLinkButtons.length} routerLinks`)
                    .toBe(expectedRouterLinkButtons.length);
            });

            it('... can get correct linkParams from routerLinks', () => {
                routerLinks.forEach((routerLink, index) => {
                    expect(routerLink.linkParams)
                        .withContext(`should be ${expectedOrderOfRouterlinks[index]}`)
                        .toEqual(expectedOrderOfRouterlinks[index]);
                });
            });

            it('... can click fulltext link in template', () => {
                const fulltextLinkDe = linkDes[0]; // Fulltext link DebugElement
                const fulltextLink = routerLinks[0]; // Fulltext link directive

                expect(fulltextLink.navigatedTo).toBeNull();

                click(fulltextLinkDe);
                fixture.detectChanges();

                expect(fulltextLink.navigatedTo)
                    .withContext(`should equal ['/data/search', 'fulltext']`)
                    .toEqual(['/data/search', 'fulltext']);
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedOrderOfRouterlinks[index];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expect(routerLink.navigatedTo)
                        .withContext(`should equal ${expectedRouterLink}`)
                        .toEqual(expectedRouterLink);
                });
            });
        });

        describe('#onButtonSelect', () => {
            it('... should trigger on click if enabled', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expect(btnDes[0].nativeElement.disabled).toBeFalse();
                expectSpyCall(selectButtonSpy, 1, expectedRouterLinkButtons[0]);
            }));

            it('... should not trigger on click if disabled', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[1], fixture);

                expect(btnDes[1].nativeElement.disabled).toBeTrue();
                expectSpyCall(selectButtonSpy, 0);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[2], fixture);

                expect(btnDes[2].nativeElement.disabled).toBeTrue();
                expectSpyCall(selectButtonSpy, 0);
            }));

            it('... should emit selected button on click if enabled', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expect(btnDes[0].nativeElement.disabled).toBeFalse();
                expectSpyCall(emitSpy, 1, expectedRouterLinkButtons[0]);
            }));

            it('... should not emit selected button on click if disabled', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[1], fixture);

                expect(btnDes[1].nativeElement.disabled).toBeTrue();
                expectSpyCall(emitSpy, 0);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[2], fixture);

                expect(btnDes[2].nativeElement.disabled).toBeTrue();
                expectSpyCall(emitSpy, 0);
            }));
        });
    });
});
