/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import Spy = jasmine.Spy;

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { SideInfoService } from '@awg-core/services';
import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

import { SearchOverviewComponent } from './search-overview.component';

// mock components
@Component({ selector: 'awg-router-link-button-group', template: '' })
class RouterLinkButtonGroupStubComponent {
    @Input()
    buttonArray: RouterLinkButton[];
    @Output()
    selectButtonRequest: EventEmitter<RouterLinkButton> = new EventEmitter<RouterLinkButton>();
}

describe('SearchOverviewComponent (DONE)', () => {
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
            declarations: [SearchOverviewComponent, RouterLinkButtonGroupStubComponent, RouterOutletStubComponent],
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
            new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', false),
            new RouterLinkButton('/data/search', 'timeline', 'Timeline', true),
            new RouterLinkButton('/data/search', 'bibliography', 'Bibliographie', true)
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
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 0, 0);
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
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
            });
        });

        describe('#onButtonSelect', () => {
            it('... should not have been called', () => {
                expect(component.onButtonSelect).not.toHaveBeenCalled();
            });

            it('... should trigger on event from RouterLinkButtonGroupComponent', fakeAsync(() => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(
                    RouterLinkButtonGroupStubComponent
                ) as RouterLinkButtonGroupStubComponent;

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
                const buttonDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(
                    RouterLinkButtonGroupStubComponent
                ) as RouterLinkButtonGroupStubComponent;

                let noRouterLinkButton;

                // emit undefined
                noRouterLinkButton = undefined;
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // emit null
                noRouterLinkButton = null;
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 2, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // emit empty string
                noRouterLinkButton = '';
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 3, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // emit string
                noRouterLinkButton = 'test';
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 4, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();

                // emit number
                noRouterLinkButton = 12;
                buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                expectSpyCall(selectButtonSpy, 5, noRouterLinkButton);
                expect(updateSearchInfoTitleSpy).not.toHaveBeenCalled();
            }));

            it('... should update SideInfoService#updateSearchInfoTitle', fakeAsync(() => {
                // emit button 1
                component.onButtonSelect(expectedButtonArray[0]);
                expectSpyCall(updateSearchInfoTitleSpy, 1, expectedButtonArray[0].label);

                // emit button 2
                component.onButtonSelect(expectedButtonArray[1]);
                expectSpyCall(updateSearchInfoTitleSpy, 2, expectedButtonArray[1].label);

                // emit button 3
                // trigger click with click helper & wait for changes
                component.onButtonSelect(expectedButtonArray[2]);
                expectSpyCall(updateSearchInfoTitleSpy, 3, expectedButtonArray[2].label);
            }));
        });
    });
});
