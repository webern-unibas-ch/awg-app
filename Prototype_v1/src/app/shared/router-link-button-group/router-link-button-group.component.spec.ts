import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
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
    let linkDes, routerLinks;

    let expectedButtonArray: RouterLinkButton[];

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
        expectedButtonArray = [
            new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', false),
            new RouterLinkButton('/data/search', 'timeline', 'Timeline', true),
            new RouterLinkButton('/data/search', 'bibliography', 'Bibliographie', true)
        ];

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        selectButtonSpy = spyOn(component, 'onButtonSelect').and.callThrough();
        emitSpy = spyOn(component.selectButtonRequest, 'emit').and.callThrough();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `buttonArray` input', () => {
            expect(component.buttonArray).toBeUndefined('should be undefined');
        });

        describe('#onButtonSelect', () => {
            it('... should not have been called', () => {
                expect(component.onButtonSelect).not.toHaveBeenCalled();
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
            component.buttonArray = expectedButtonArray;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain 3 buttons', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);
            });

            it('... should disable buttons if necessary', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                expect(btnDes[0].nativeElement.disabled).toBe(
                    expectedButtonArray[0].disabled,
                    'should not be disabled'
                );
                expect(btnDes[1].nativeElement.disabled).toBe(expectedButtonArray[1].disabled, 'should be disabled');
                expect(btnDes[2].nativeElement.disabled).toBe(expectedButtonArray[2].disabled, 'should be disabled');
            });

            it('... should render button labels', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                expect(btnDes[0].nativeElement.textContent).toBeDefined();
                expect(btnDes[0].nativeElement.textContent).toMatch(
                    expectedButtonArray[0].label,
                    `should be ${expectedButtonArray[0].label}`
                );
                expect(btnDes[1].nativeElement.textContent).toBeDefined();
                expect(btnDes[1].nativeElement.textContent).toMatch(
                    expectedButtonArray[1].label,
                    `should be ${expectedButtonArray[1].label}`
                );
                expect(btnDes[2].nativeElement.textContent).toBeDefined();
                expect(btnDes[2].nativeElement.textContent).toMatch(
                    expectedButtonArray[2].label,
                    `should be ${expectedButtonArray[2].label}`
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

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
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

                expectSpyCall(selectButtonSpy, 1, expectedButtonArray[0]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[1], fixture);

                expectSpyCall(selectButtonSpy, 2, expectedButtonArray[1]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[2], fixture);

                expectSpyCall(selectButtonSpy, 3, expectedButtonArray[2]);
            }));

            it('... should emit selected button on click', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.btn', 3, 3);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(emitSpy, 1, expectedButtonArray[0]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[1], fixture);

                expectSpyCall(emitSpy, 2, expectedButtonArray[1]);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[2], fixture);

                expectSpyCall(emitSpy, 3, expectedButtonArray[2]);
            }));
        });
    });
});
