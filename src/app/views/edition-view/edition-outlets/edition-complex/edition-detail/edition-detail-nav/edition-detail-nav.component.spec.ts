import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QueryParamsHandling } from '@angular/router';

import { of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionDetailNavComponent } from './edition-detail-nav.component';

// Mock components
@Component({
    selector: 'awg-router-link-button-group',
    template: '',
    standalone: false,
})
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
    let getSelectedEditionComplexSpy: Spy;

    beforeEach(waitForAsync(() => {
        // Create a fake service object with a `getData()` spy
        const mockEditionStateService = jasmine.createSpyObj('EditionStateService', ['getSelectedEditionComplex']);
        // Make the spy return a synchronous Observable with the test data
        getSelectedEditionComplexSpy = mockEditionStateService.getSelectedEditionComplex.and.returnValue(
            observableOf(EditionComplexesService.getEditionComplexById('OP12'))
        );

        TestBed.configureTestingModule({
            declarations: [EditionDetailNavComponent, RouterLinkButtonGroupStubComponent, RouterOutletStubComponent],
            providers: [{ provide: EditionStateService, useValue: mockEditionStateService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailNavComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedEditionRouterLinkButtons = [
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route,
                EDITION_ROUTE_CONSTANTS.EDITION_INTRO.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route,
                EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route,
                EDITION_ROUTE_CONSTANTS.EDITION_REPORT.short,
                false
            ),
            new RouterLinkButton(
                expectedEditionComplex.baseRoute,
                EDITION_ROUTE_CONSTANTS.EDITION_GRAPH.route,
                EDITION_ROUTE_CONSTANTS.EDITION_GRAPH.short,
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

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionRouterLinkButtons`', () => {
            expect(component.editionRouterLinkButtons).toBeUndefined();
        });

        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        describe('#getEditionComplex()', () => {
            it('... should have a method `getEditionComplex`', () => {
                expect(component.getEditionComplex).toBeDefined();
            });

            it('... should not have been called', () => {
                expectSpyCall(getSelectedEditionComplexSpy, 0);
            });
        });

        describe('#setButtons()', () => {
            it('... should have a method `setButtons`', () => {
                expect(component.setButtons).toBeDefined();
            });

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

        describe('#getEditionComplex()', () => {
            it('... should have been called', () => {
                expectSpyCall(getSelectedEditionComplexSpy, 1);
            });
        });

        it('... should have `editionComplex`', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
        });

        describe('#setButtons()', () => {
            it('... should have been called', () => {
                expectSpyCall(setButtonsSpy, 1);
            });

            it('... should have `editionRouterLinkButtons`', () => {
                expectToEqual(component.editionRouterLinkButtons, expectedEditionRouterLinkButtons);
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
                const btnDes = getAndExpectDebugElementByDirective(compDe, RouterLinkButtonGroupStubComponent, 1, 1);
                const btnCmp = btnDes[0].injector.get(
                    RouterLinkButtonGroupStubComponent
                ) as RouterLinkButtonGroupStubComponent;

                expectToEqual(btnCmp.routerLinkButtons, expectedEditionRouterLinkButtons);
            });
        });
    });
});
