import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import Spy = jasmine.Spy;

import { RouterLinkStubDirective } from '@testing/router-stubs';
import { click } from '@testing/click-helper';

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

        // test meta data
        expectedButtonArray = [
            {
                root: '/data/search',
                link: 'fulltext',
                label: 'Volltext-Suche',
                disabled: false
            },
            {
                root: '/data/search',
                link: 'timeline',
                label: 'Timeline',
                disabled: true
            },
            {
                root: '/data/search',
                link: 'bibliography',
                label: 'Bibliographie',
                disabled: true
            }
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
                const btnGroupEl = compEl.querySelectorAll('div.btn-group');

                expect(btnGroupEl).toBeDefined();
                expect(btnGroupEl.length).toBe(1, 'should have one `div.btn-group`');
            });

            it('... should contain no buttons yet', () => {
                const btnEl = compEl.querySelectorAll('button.btn');

                expect(btnEl).toBeDefined();
                expect(btnEl.length).toBe(0, 'should have no button');
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
            it('... should contain buttons', () => {
                const btnEl = compEl.querySelectorAll('button.btn');

                expect(btnEl).toBeDefined();
                expect(btnEl.length).toBe(3, 'should have three buttons');
            });

            it('... should disable buttons if necessary', () => {
                const btnEl = compEl.querySelectorAll('button.btn');

                expect(btnEl).toBeDefined();
                expect(btnEl[0].disabled).toBe(expectedButtonArray[0].disabled, 'should not be disabled');
                expect(btnEl[1].disabled).toBe(expectedButtonArray[1].disabled, 'should be disabled');
                expect(btnEl[2].disabled).toBe(expectedButtonArray[2].disabled, 'should be disabled');
            });

            it('... should render button labels', () => {
                const btnEl = compEl.querySelectorAll('button.btn');

                expect(btnEl).toBeDefined();
                expect(btnEl[0].textContent).toMatch(expectedButtonArray[0].label, 'should be `Volltext-Suche`');
                expect(btnEl[1].textContent).toMatch(expectedButtonArray[1].label, 'should be `Timeline`');
                expect(btnEl[2].textContent).toMatch(expectedButtonArray[2].label, 'should be `Bibliographie`');
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = compDe.queryAll(By.directive(RouterLinkStubDirective));

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

                fulltextLinkDe.triggerEventHandler('click', null);
                fixture.detectChanges();

                expect(fulltextLink.navigatedTo).toEqual(['/data/search', 'fulltext']);
            });
        });

        describe('#onButtonSelect', () => {
            // helper functions
            function clickAndDetectChanges(clickDe: DebugElement) {
                // trigger click with click helper
                click(clickDe);

                // wait for changes
                flush();
                fixture.detectChanges();
            }

            function expectSpyCall(spy: Spy, nTimes: number, expectedValue: any) {
                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledTimes(nTimes);
                expect(spy.calls.mostRecent().args[0]).toBe(expectedValue);
            }

            it('... should trigger on click', fakeAsync(() => {
                const btnDes = compDe.queryAll(By.css('button.btn'));

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(btnDes[0]);

                expectSpyCall(selectButtonSpy, 1, expectedButtonArray[0]);

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(btnDes[1]);

                expectSpyCall(selectButtonSpy, 2, expectedButtonArray[1]);

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(btnDes[2]);

                expectSpyCall(selectButtonSpy, 3, expectedButtonArray[2]);
            }));

            it('... should emit selected button on click', fakeAsync(() => {
                const btnDes = compDe.queryAll(By.css('button.btn'));

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(btnDes[0]);

                expectSpyCall(emitSpy, 1, expectedButtonArray[0]);

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(btnDes[1]);

                expectSpyCall(emitSpy, 2, expectedButtonArray[1]);

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(btnDes[2]);

                expectSpyCall(emitSpy, 3, expectedButtonArray[2]);
            }));
        });
    });
});
