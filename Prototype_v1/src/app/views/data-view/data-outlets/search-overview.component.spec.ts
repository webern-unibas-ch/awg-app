/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { SideInfoService } from '@awg-core/services';
import { RouterLinkButtonGroupComponent } from '@awg-shared/router-link-button-group/router-link-button-group.component';
import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

import { SearchOverviewComponent } from './search-overview.component';

fdescribe('SearchOverviewComponent', () => {
    let component: SearchOverviewComponent;
    let fixture: ComponentFixture<SearchOverviewComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedButtonArray: RouterLinkButton[];

    let selectButtonSpy: Spy;
    let updateSearchInfoTitleSpy: Spy;

    beforeEach(async(() => {
        // create a fake DataService object with a `updateSearchInfoTitle()` spy
        const sideInfoService = jasmine.createSpyObj('SideInfoService', ['updateSearchInfoTitle']);

        // spies on service
        updateSearchInfoTitleSpy = sideInfoService.updateSearchInfoTitle.and.callThrough();

        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                SearchOverviewComponent,
                RouterLinkButtonGroupComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ],
            providers: [{ provide: SideInfoService, useValue: sideInfoService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchOverviewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `searchButtonArray`', () => {
            expect(component.searchButtonArray).toBeUndefined('should be undefined');
        });

        describe('#onButtonSelect', () => {
            it('... should not have been called', () => {
                expect(component.onButtonSelect).not.toHaveBeenCalled();
            });
        });

        describe('SideInfoService# updateSearchInfoTitle', () => {
            it('... should not have been called', () => {
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });

            it('... should contain no RouterLinkButtonGroupComponent yet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 0, 0);
            });

            it('... should contain no buttons yet', () => {
                getAndExpectDebugElementByCss(compDe, 'button.btn', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `searchButtonArray`', () => {
            expect(component.searchButtonArray).toBeDefined('should be defined');
            expect(component.searchButtonArray).toEqual(expectedButtonArray, `should equal ${expectedButtonArray}`);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });

            it('... should contain one RouterLinkButtonGroupComponent', () => {
                const groupDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 1, 1);
            });

            it('... should contain one button group', () => {
                getAndExpectDebugElementByCss(compDe, 'div.btn-group', 1, 1);
            });

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

        describe('#onButtonSelect', () => {
            it('... should not have been called', () => {
                expect(component.onButtonSelect).not.toHaveBeenCalled();
            });

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

            it('... should trigger on event from RouterLinkButtonGroupComponent', fakeAsync(() => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(
                    RouterLinkButtonGroupComponent
                ) as RouterLinkButtonGroupComponent;

                // button 1
                buttonCmp.selectButtonRequest.emit(expectedButtonArray[0]);

                expectSpyCall(selectButtonSpy, 1, expectedButtonArray[0]);

                // button 2
                buttonCmp.selectButtonRequest.emit(expectedButtonArray[1]);

                expectSpyCall(selectButtonSpy, 2, expectedButtonArray[1]);

                // button 3
                buttonCmp.selectButtonRequest.emit(expectedButtonArray[2]);

                expectSpyCall(selectButtonSpy, 3, expectedButtonArray[2]);
            }));

            it('... should not do anything if no RouterLinkButton provided', fakeAsync(() => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(
                    RouterLinkButtonGroupComponent
                ) as RouterLinkButtonGroupComponent;

                let noRouterLinkButton;

                // undefined
                noRouterLinkButton = undefined;
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // null
                noRouterLinkButton = null;
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 2, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // empty string
                noRouterLinkButton = '';
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 3, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // string
                noRouterLinkButton = 'test';
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 4, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // number
                noRouterLinkButton = 12;
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 5, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();
            }));

            it('... should update SideInfoService#updateSearchInfoTitle', fakeAsync(() => {
                // button 1
                component.onButtonSelect(expectedButtonArray[0]);
                expectSpyCall(updateSearchInfoTitleSpy, 1, expectedButtonArray[0].label);

                // button 2
                component.onButtonSelect(expectedButtonArray[1]);
                expectSpyCall(updateSearchInfoTitleSpy, 2, expectedButtonArray[1].label);

                // button 3
                // trigger click with click helper & wait for changes
                component.onButtonSelect(expectedButtonArray[2]);
                expectSpyCall(updateSearchInfoTitleSpy, 3, expectedButtonArray[2].label);
            }));
        });
    });
});
