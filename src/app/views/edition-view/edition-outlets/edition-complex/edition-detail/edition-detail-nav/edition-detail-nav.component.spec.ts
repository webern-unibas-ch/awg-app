/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';

import { of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionService } from '@awg-views/edition-view/services';
import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EditionConstants, EditionComplex } from '@awg-views/edition-view/models';

import { EditionDetailNavComponent } from './edition-detail-nav.component';

// Mock components
@Component({ selector: 'awg-router-link-button-group', template: '' })
class RouterLinkButtonGroupStubComponent {
    @Input()
    routerLinkButtons: RouterLinkButton[];
    @Input() queryParamsHandling?: QueryParamsHandling = '';
    @Output()
    selectButtonRequest: EventEmitter<RouterLinkButton> = new EventEmitter<RouterLinkButton>();
}

describe('EditionDetailNavComponent (DONE)', () => {
    let component: EditionDetailNavComponent;
    let fixture: ComponentFixture<EditionDetailNavComponent>;
    let compDe: DebugElement;

    let expectedEditionRouterLinkButtons: RouterLinkButton[];
    let expectedEditionComplex: EditionComplex;

    let setButtonsSpy: Spy;
    let getEditionComplexSpy: Spy;

    beforeEach(waitForAsync(() => {
        // Create a fake service object with a `getData()` spy
        const mockEditionService = jasmine.createSpyObj('EditionService', ['getEditionComplex']);
        // Make the spy return a synchronous Observable with the test data
        getEditionComplexSpy = mockEditionService.getEditionComplex.and.returnValue(
            observableOf(EDITION_COMPLEXES.OP12)
        );

        TestBed.configureTestingModule({
            declarations: [EditionDetailNavComponent, RouterLinkButtonGroupStubComponent, RouterOutletStubComponent],
            providers: [{ provide: EditionService, useValue: mockEditionService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedEditionComplex = EDITION_COMPLEXES.OP12;
        expectedEditionRouterLinkButtons = [
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                expectedEditionComplex.introRoute.route,
                EditionConstants.EDITION_INTRO.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                expectedEditionComplex.sheetsRoute.route,
                EditionConstants.EDITION_SHEETS.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                expectedEditionComplex.reportRoute.route,
                EditionConstants.EDITION_REPORT.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                expectedEditionComplex.graphRoute.route,
                EditionConstants.EDITION_GRAPH.short,
                false
            ),
        ];

        // Spies on component functions
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
            expect(component.editionRouterLinkButtons).withContext('should be undefined').toBeUndefined();
        });

        it('should not have `editionComplex`', () => {
            expect(component.editionComplex).withContext('should be undefined').toBeUndefined();
        });

        describe('#getEditionComplex', () => {
            it('... should not have been called', () => {
                expectSpyCall(getEditionComplexSpy, 0);
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
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#getEditionComplex', () => {
            it('should have been called', () => {
                expectSpyCall(getEditionComplexSpy, 1);
            });
        });

        it('should have `editionComplex`', () => {
            expect(component.editionComplex).withContext('should be defined').toBeDefined();
            expect(component.editionComplex)
                .withContext(`should equal ${expectedEditionComplex}`)
                .toEqual(expectedEditionComplex);
        });

        describe('#setButtons', () => {
            it('... should have been called', () => {
                expectSpyCall(setButtonsSpy, 1);
            });

            it('should have `editionRouterLinkButtons`', () => {
                expect(component.editionRouterLinkButtons).withContext('should be defined').toBeDefined();
                expect(component.editionRouterLinkButtons)
                    .withContext(`should equal ${expectedEditionRouterLinkButtons}`)
                    .toEqual(expectedEditionRouterLinkButtons);
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
                expect(buttonCmp.routerLinkButtons)
                    .withContext(`should equal ${expectedEditionRouterLinkButtons}`)
                    .toEqual(expectedEditionRouterLinkButtons);
            });
        });
    });
});
