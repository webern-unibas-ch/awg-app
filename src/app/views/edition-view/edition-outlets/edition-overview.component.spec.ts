/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';

import { of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionService } from '@awg-views/edition-view/services';
import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EditionConstants, EditionWork, EditionWorks } from '@awg-views/edition-view/models';

import { EditionOverviewComponent } from './edition-overview.component';

// mock components
@Component({ selector: 'awg-router-link-button-group', template: '' })
class RouterLinkButtonGroupStubComponent {
    @Input()
    routerLinkButtons: RouterLinkButton[];
    @Input() queryParamsHandling?: QueryParamsHandling = '';
    @Output()
    selectButtonRequest: EventEmitter<RouterLinkButton> = new EventEmitter<RouterLinkButton>();
}

describe('EditionOverviewComponent (DONE)', () => {
    let component: EditionOverviewComponent;
    let fixture: ComponentFixture<EditionOverviewComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedEditionRouterLinkButtons: RouterLinkButton[];
    let expectedEditionWork: EditionWork;

    let setButtonsSpy: Spy;
    let getEditionWorkSpy: Spy;

    beforeEach(async(() => {
        // create a fake service object with a `getData()` spy
        const mockEditionService = jasmine.createSpyObj('EditionService', ['getEditionWork']);
        // make the spy return a synchronous Observable with the test data
        getEditionWorkSpy = mockEditionService.getEditionWork.and.returnValue(observableOf(EditionWorks.op12));

        TestBed.configureTestingModule({
            declarations: [EditionOverviewComponent, RouterLinkButtonGroupStubComponent, RouterOutletStubComponent],
            providers: [{ provide: EditionService, useValue: mockEditionService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionOverviewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedEditionWork = EditionWorks.op12;
        expectedEditionRouterLinkButtons = [
            new RouterLinkButton(
                expectedEditionWork.baseRoute,
                expectedEditionWork.introRoute,
                EditionConstants.editionIntro.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionWork.baseRoute,
                expectedEditionWork.detailRoute,
                EditionConstants.editionDetail.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionWork.baseRoute,
                expectedEditionWork.reportRoute,
                EditionConstants.editionReport.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionWork.baseRoute,
                expectedEditionWork.graphRoute,
                EditionConstants.editionGraph.short,
                false
            )
        ];

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        setButtonsSpy = spyOn(component, 'setButtons').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `editionRouterLinkButtons`', () => {
            expect(component.editionRouterLinkButtons).toBeUndefined('should be undefined');
        });

        it('should not have `editionWork`', () => {
            expect(component.editionWork).toBeUndefined('should be undefined');
        });

        describe('#getEditionWork', () => {
            it('... should not have been called', () => {
                expectSpyCall(getEditionWorkSpy, 0);
            });
        });

        describe('#setButtons', () => {
            it('... should not have been called', () => {
                expectSpyCall(setButtonsSpy, 0);
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

        describe('#getEditionWork', () => {
            it('should have been called', () => {
                expectSpyCall(getEditionWorkSpy, 1);
            });
        });

        it('should have `editionWork`', () => {
            expect(component.editionWork).toBeDefined('should be defined');
            expect(component.editionWork).toEqual(expectedEditionWork, `should equal ${expectedEditionWork}`);
        });

        describe('#setButtons', () => {
            it('... should have been called', () => {
                expectSpyCall(setButtonsSpy, 1);
            });

            it('should have `editionRouterLinkButtons`', () => {
                expect(component.editionRouterLinkButtons).toBeDefined('should be defined');
                expect(component.editionRouterLinkButtons).toEqual(
                    expectedEditionRouterLinkButtons,
                    `should equal ${expectedEditionRouterLinkButtons}`
                );
            });
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });

            it('... should contain one RouterLinkButtonGroupComponent', () => {
                getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
            });

            it('... should pass down editionRouterLinkButtons to RouterLinkButtonGroupComponent', () => {
                const buttonDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
                const buttonCmp = buttonDes[0].injector.get(
                    RouterLinkButtonGroupStubComponent
                ) as RouterLinkButtonGroupStubComponent;

                expect(buttonCmp.routerLinkButtons).toBeTruthy();
                expect(buttonCmp.routerLinkButtons).toEqual(
                    expectedEditionRouterLinkButtons,
                    `should equal ${expectedEditionRouterLinkButtons}`
                );
            });
        });
    });
});
