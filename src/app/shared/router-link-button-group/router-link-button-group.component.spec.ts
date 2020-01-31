import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';

import Spy = jasmine.Spy;

import { click, clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { RouterLinkButtonGroupComponent } from './router-link-button-group.component';

describe('RouterLinkButtonGroupComponent (DONE)', () => {
    let component: RouterLinkButtonGroupComponent;
    let fixture: ComponentFixture<RouterLinkButtonGroupComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    let expectedRouterLinkButtons: RouterLinkButton[];
    let expectedQueryParamsHandling: QueryParamsHandling;

    let selectButtonSpy: Spy;
    let emitSpy: Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RouterLinkButtonGroupComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RouterLinkButtonGroupComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedRouterLinkButtons = [
            new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', false),
            new RouterLinkButton('/data/search', 'timeline', 'Timeline', true),
            new RouterLinkButton('/data/search', 'bibliography', 'Bibliographie', true)
        ];
        expectedQueryParamsHandling = 'preserve';

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        selectButtonSpy = spyOn(component, 'selectButton').and.callThrough();
        emitSpy = spyOn(component.selectButtonRequest, 'emit').and.callThrough();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `buttonArray` input', () => {
            expect(component.routerLinkButtons).toBeUndefined('should be undefined');
        });

        it('should have default `queryParamsHandling` input', () => {
            expect(component.queryParamsHandling).toBe('');
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
            // simulate the parent setting the input properties
            component.routerLinkButtons = expectedRouterLinkButtons;
            component.queryParamsHandling = expectedQueryParamsHandling;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `buttonArray` input', () => {
            expect(component.routerLinkButtons).toEqual(
                expectedRouterLinkButtons,
                'should equal expectedRouterLinkButtons'
            );
        });

        it('should have `queryParamsHandling` input', () => {
            expect(component.queryParamsHandling).toBe(expectedQueryParamsHandling, 'should be preserve');
        });

        describe('VIEW', () => {
            it('... should contain 3 buttons', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);
            });

            it('... should disable buttons if necessary', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);
                const btn0El = btnDes[0].nativeElement;
                const btn1El = btnDes[1].nativeElement;
                const btn2El = btnDes[2].nativeElement;

                expect(btn0El.disabled).toBe(expectedRouterLinkButtons[0].disabled, 'should not be disabled');
                expect(btn1El.disabled).toBe(expectedRouterLinkButtons[1].disabled, 'should be disabled');
                expect(btn2El.disabled).toBe(expectedRouterLinkButtons[2].disabled, 'should be disabled');
            });

            it('... should render button labels', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);
                const btn0El = btnDes[0].nativeElement;
                const btn1El = btnDes[1].nativeElement;
                const btn2El = btnDes[2].nativeElement;

                expect(btn0El.textContent).toBeDefined();
                expect(btn0El.textContent).toMatch(
                    expectedRouterLinkButtons[0].label,
                    `should be ${expectedRouterLinkButtons[0].label}`
                );
                expect(btn1El.textContent).toBeDefined();
                expect(btn1El.textContent).toMatch(
                    expectedRouterLinkButtons[1].label,
                    `should be ${expectedRouterLinkButtons[1].label}`
                );
                expect(btn2El.textContent).toBeDefined();
                expect(btn2El.textContent).toMatch(
                    expectedRouterLinkButtons[2].label,
                    `should be ${expectedRouterLinkButtons[2].label}`
                );
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 3, 3);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
            });

            it('... can get correct paths from routerLinks', () => {
                expect(routerLinks[0].linkParams).toEqual(['/data/search', 'fulltext']);
                expect(routerLinks[1].linkParams).toEqual(['/data/search', 'timeline']);
                expect(routerLinks[2].linkParams).toEqual(['/data/search', 'bibliography']);
            });

            it('... can click fulltext link in template', () => {
                const fulltextLinkDe = linkDes[0]; // fulltext link DebugElement
                const fulltextLink = routerLinks[0]; // fulltext link directive

                expect(fulltextLink.navigatedTo).toBeNull('should not have navigated yet');

                click(fulltextLinkDe);
                fixture.detectChanges();

                expect(fulltextLink.navigatedTo).toEqual(['/data/search', 'fulltext']);
            });
        });

        describe('#onButtonSelect', () => {
            it('... should trigger on click', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(selectButtonSpy, 1, expectedRouterLinkButtons[0]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[1], fixture);

                expectSpyCall(selectButtonSpy, 2, expectedRouterLinkButtons[1]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[2], fixture);

                expectSpyCall(selectButtonSpy, 3, expectedRouterLinkButtons[2]);
            }));

            it('... should emit selected button on click', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(emitSpy, 1, expectedRouterLinkButtons[0]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[1], fixture);

                expectSpyCall(emitSpy, 2, expectedRouterLinkButtons[1]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[2], fixture);

                expectSpyCall(emitSpy, 3, expectedRouterLinkButtons[2]);
            }));
        });
    });
});
