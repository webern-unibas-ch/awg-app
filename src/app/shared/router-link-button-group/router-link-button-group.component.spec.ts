import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { QueryParamsHandling } from '@angular/router';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click, clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
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

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `buttonArray` input', () => {
            expect(component.routerLinkButtons).toBeUndefined();
        });

        it('... should have default empty `queryParamsHandling` input', () => {
            expect(component.queryParamsHandling).toBeFalsy();
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
            it('... should contain one button group', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-router-link-btn-group', 1, 1);
            });

            it('... should contain no buttons yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-router-link-btn', 0, 0);
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

        it('... should have `buttonArray` input', () => {
            expectToEqual(component.routerLinkButtons, expectedRouterLinkButtons);
        });

        it('... should have `queryParamsHandling` input', () => {
            expectToBe(component.queryParamsHandling, expectedQueryParamsHandling);
        });

        describe('VIEW', () => {
            it('... should contain as many buttons as given routerLinkButtons', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-router-link-btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );
            });

            it('... should disable buttons if necessary', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-router-link-btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );

                btnDes.forEach((btnDe, index) => {
                    const btnEl = btnDe.nativeElement;

                    if (expectedRouterLinkButtons[index].disabled) {
                        expect(btnEl).toHaveClass('disabled');
                    } else {
                        expect(btnEl).not.toHaveClass('disabled');
                    }
                });
            });

            it('... should render button labels', () => {
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-router-link-btn',
                    expectedRouterLinkButtons.length,
                    expectedRouterLinkButtons.length
                );
                btnDes.forEach((btnDe, index) => {
                    const btnEl = btnDe.nativeElement;

                    expectToBe(btnEl.textContent.trim(), expectedRouterLinkButtons[index].label.toUpperCase());
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
                expectToBe(routerLinks.length, expectedRouterLinkButtons.length);
            });

            it('... can get correct linkParams from routerLinks', () => {
                routerLinks.forEach((routerLink: { linkParams: any }, index: number) => {
                    expectToEqual(routerLink.linkParams, expectedOrderOfRouterlinks[index]);
                });
            });

            it('... can click fulltext link in template', () => {
                const fulltextLinkDe = linkDes[0]; // Fulltext link DebugElement
                const fulltextLink = routerLinks[0]; // Fulltext link directive

                expect(fulltextLink.navigatedTo).toBeNull();

                click(fulltextLinkDe);
                fixture.detectChanges();

                expectToEqual(fulltextLink.navigatedTo, ['/data/search', 'fulltext']);
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedOrderOfRouterlinks[index];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });

        describe('#selectButton()', () => {
            describe('... should do nothing if...', () => {
                it('... routerLinkButton is null', () => {
                    const nullButton: RouterLinkButton = null;

                    component.selectButton(nullButton);

                    expectSpyCall(selectButtonSpy, 1, nullButton);
                    expectSpyCall(emitSpy, 0);
                });

                it('... routerLinkButton is undefined', () => {
                    const undefinedButton: RouterLinkButton = undefined;

                    component.selectButton(undefinedButton);

                    expectSpyCall(selectButtonSpy, 1, undefinedButton);
                    expectSpyCall(emitSpy, 0);
                });

                it('... routerLinkButton is disabled', () => {
                    const disabledButton: RouterLinkButton = new RouterLinkButton(
                        '/data/search',
                        'fulltext',
                        'Volltext-Suche',
                        true
                    );

                    component.selectButton(disabledButton);

                    expectSpyCall(selectButtonSpy, 1, disabledButton);
                    expectSpyCall(emitSpy, 0);
                });
            });

            it('... should trigger on click if enabled or disabled', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'div.awg-router-link-btn', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expect(btnDes[0].nativeElement).not.toHaveClass('disabled');
                expectSpyCall(selectButtonSpy, 1, expectedRouterLinkButtons[0]);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[1], fixture);

                expect(btnDes[1].nativeElement).toHaveClass('disabled');
                expectSpyCall(selectButtonSpy, 2, expectedRouterLinkButtons[1]);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[2], fixture);

                expect(btnDes[2].nativeElement).toHaveClass('disabled');
                expectSpyCall(selectButtonSpy, 3, expectedRouterLinkButtons[2]);
            }));

            it('... should emit if routerLinkButton is enabled', () => {
                const enabledButton: RouterLinkButton = new RouterLinkButton(
                    '/data/search',
                    'fulltext',
                    'Volltext-Suche',
                    false
                );

                component.selectButton(enabledButton);

                expectSpyCall(selectButtonSpy, 1, enabledButton);
                expectSpyCall(emitSpy, 1, enabledButton);
            });
        });
    });
});
