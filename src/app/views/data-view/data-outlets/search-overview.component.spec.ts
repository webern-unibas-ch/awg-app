/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import Spy = jasmine.Spy;
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { RouterOutletStubComponent } from '@testing/router-stubs';
import { SideInfoService } from '@awg-core/services';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { SearchOverviewComponent } from './search-overview.component';
import { ActivatedRoute } from '@angular/router';

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

    let expectedButtonArray: RouterLinkButton[] = [
        new RouterLinkButton('/data/search', 'fulltext', 'Volltext-Suche', false),
        new RouterLinkButton('/data/search', 'timeline', 'Timeline', true),
        new RouterLinkButton('/data/search', 'bibliography', 'Bibliographie', true)
    ];

    let mockActivatedRoute;
    let mockActivatedRoutePath: string;

    let selectButtonSpy: Spy;
    let updateSearchInfoTitleFromPathSpy: Spy;
    let service_updateSearchInfoTitleSpy: Spy;
    let service_clearSearchInfoDataSpy: Spy;

    beforeEach(async(() => {
        // create a fake service object with a `updateSearchInfoTitle()` spy
        const mockSideInfoService = jasmine.createSpyObj('SideInfoService', [
            'updateSearchInfoTitle',
            'clearSearchInfoData'
        ]);

        // spies on service
        service_updateSearchInfoTitleSpy = mockSideInfoService.updateSearchInfoTitle.and.callThrough();
        service_clearSearchInfoDataSpy = mockSideInfoService.clearSearchInfoData.and.callThrough();

        // mocked activated route
        // see https://gist.github.com/benjamincharity/3d25cd2c95b6ecffadb18c3d4dbbd80b
        mockActivatedRoute = {
            snapshot: {
                children: [
                    {
                        url: [
                            {
                                path: 'fulltext'
                            }
                        ]
                    }
                ]
            }
        };
        mockActivatedRoutePath = mockActivatedRoute.snapshot.children[0].url[0].path;

        TestBed.configureTestingModule({
            declarations: [SearchOverviewComponent, RouterLinkButtonGroupStubComponent, RouterOutletStubComponent],
            providers: [
                { provide: SideInfoService, useValue: mockSideInfoService },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute
                }
            ]
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
        updateSearchInfoTitleFromPathSpy = spyOn(component, 'updateSearchInfoTitleFromPath').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have `searchButtonArray`', () => {
            expect(component.searchButtonArray).toBeDefined('should be defined');
            expect(component.searchButtonArray).toEqual(expectedButtonArray, `should equal ${expectedButtonArray}`);
        });

        describe('#updateSearchInfoTitleFromPath', () => {
            it('... should not have been called', () => {
                expectSpyCall(updateSearchInfoTitleFromPathSpy, 0);
            });
        });

        describe('#onButtonSelect', () => {
            it('... should not have been called', () => {
                expectSpyCall(selectButtonSpy, 0);
            });

            describe('SideInfoService# updateSearchInfoTitle', () => {
                it('... should not have been called', () => {
                    expect(service_updateSearchInfoTitleSpy).not.toHaveBeenCalled();
                });
            });

            describe('SideInfoService# clearSearchInfoData', () => {
                it('... should not have been called', () => {
                    expect(service_clearSearchInfoDataSpy).not.toHaveBeenCalled();
                });
            });
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });

            it('... should contain no RouterLinkButtonGroupComponent yet', () => {
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain one RouterLinkButtonGroupComponent', () => {
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
            });

            it('... should pass down buttonArray to RouterLinkButtonGroupComponent', () => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(
                    RouterLinkButtonGroupStubComponent
                ) as RouterLinkButtonGroupStubComponent;

                expect(buttonCmp.buttonArray).toBeTruthy();
                expect(buttonCmp.buttonArray).toEqual(expectedButtonArray, `should equal ${expectedButtonArray}`);
            });
        });

        describe('#updateSearchInfoTitleFromPath', () => {
            it('... should have been called', () => {
                expectSpyCall(updateSearchInfoTitleFromPathSpy, 1);
            });

            it('... should update search info title from path', () => {
                expectSpyCall(updateSearchInfoTitleFromPathSpy, 1);

                const path = mockActivatedRoutePath;

                // filter searchButtonArray
                const expectedButton = expectedButtonArray.filter(button => {
                    return button.link === path;
                });

                if (expectedButton.length === 1) {
                    expectSpyCall(service_updateSearchInfoTitleSpy, 1, expectedButton[0].label);
                } else {
                    expectSpyCall(service_updateSearchInfoTitleSpy, 0);
                }
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

            describe('... should not do anything if no RouterLinkButton provided', () => {
                // first call was on init

                let noRouterLinkButton;

                it('... not with undefined', () => {
                    const buttonDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLinkButtonGroupStubComponent,
                        1,
                        1
                    );
                    const buttonCmp = buttonDes[0].injector.get(
                        RouterLinkButtonGroupStubComponent
                    ) as RouterLinkButtonGroupStubComponent;

                    // emit undefined
                    noRouterLinkButton = undefined;
                    buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                    expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                    expectSpyCall(service_updateSearchInfoTitleSpy, 1);
                });

                it('... not with null', () => {
                    const buttonDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLinkButtonGroupStubComponent,
                        1,
                        1
                    );
                    const buttonCmp = buttonDes[0].injector.get(
                        RouterLinkButtonGroupStubComponent
                    ) as RouterLinkButtonGroupStubComponent;

                    // emit null
                    noRouterLinkButton = null;
                    buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                    expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                    expectSpyCall(service_updateSearchInfoTitleSpy, 1);
                });

                it('... not with empty string', () => {
                    const buttonDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLinkButtonGroupStubComponent,
                        1,
                        1
                    );
                    const buttonCmp = buttonDes[0].injector.get(
                        RouterLinkButtonGroupStubComponent
                    ) as RouterLinkButtonGroupStubComponent;

                    // emit empty string
                    noRouterLinkButton = '';
                    buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                    expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                    expectSpyCall(service_updateSearchInfoTitleSpy, 1);
                });

                it('... not with string', () => {
                    const buttonDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLinkButtonGroupStubComponent,
                        1,
                        1
                    );
                    const buttonCmp = buttonDes[0].injector.get(
                        RouterLinkButtonGroupStubComponent
                    ) as RouterLinkButtonGroupStubComponent;

                    // emit string
                    noRouterLinkButton = 'test';
                    buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                    expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                    expectSpyCall(service_updateSearchInfoTitleSpy, 1);
                });

                it('... not with number', () => {
                    const buttonDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLinkButtonGroupStubComponent,
                        1,
                        1
                    );
                    const buttonCmp = buttonDes[0].injector.get(
                        RouterLinkButtonGroupStubComponent
                    ) as RouterLinkButtonGroupStubComponent;

                    // emit number
                    noRouterLinkButton = 12;
                    buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                    expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                    expectSpyCall(service_updateSearchInfoTitleSpy, 1);
                });

                it('... not with router link button without label', () => {
                    const buttonDes = getAndExpectDebugElementByDirective(
                        compDe,
                        RouterLinkButtonGroupStubComponent,
                        1,
                        1
                    );
                    const buttonCmp = buttonDes[0].injector.get(
                        RouterLinkButtonGroupStubComponent
                    ) as RouterLinkButtonGroupStubComponent;

                    // emit router link button without label
                    noRouterLinkButton = new RouterLinkButton('/data/search', 'fulltext', undefined, false);
                    buttonCmp.selectButtonRequest.emit(noRouterLinkButton);

                    expectSpyCall(selectButtonSpy, 1, noRouterLinkButton);
                    expectSpyCall(service_updateSearchInfoTitleSpy, 1);
                });
            });

            it('... should call SideInfoService# clearSearchInfoData', fakeAsync(() => {
                // emit button 1
                component.onButtonSelect(expectedButtonArray[0]);
                expectSpyCall(service_clearSearchInfoDataSpy, 1);

                // emit button 2
                component.onButtonSelect(expectedButtonArray[1]);
                expectSpyCall(service_clearSearchInfoDataSpy, 2);

                // emit button 3
                component.onButtonSelect(expectedButtonArray[2]);
                expectSpyCall(service_clearSearchInfoDataSpy, 3);
            }));

            it('... should call SideInfoService# updateSearchInfoTitle', fakeAsync(() => {
                // first call was on init

                // emit button 1
                component.onButtonSelect(expectedButtonArray[0]);
                expectSpyCall(service_updateSearchInfoTitleSpy, 2, expectedButtonArray[0].label);

                // emit button 2
                component.onButtonSelect(expectedButtonArray[1]);
                expectSpyCall(service_updateSearchInfoTitleSpy, 3, expectedButtonArray[1].label);

                // emit button 3
                component.onButtonSelect(expectedButtonArray[2]);
                expectSpyCall(service_updateSearchInfoTitleSpy, 4, expectedButtonArray[2].label);
            }));
        });
    });
});
