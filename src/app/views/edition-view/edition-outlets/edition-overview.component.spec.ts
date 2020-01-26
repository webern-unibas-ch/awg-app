/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';

import { getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { RouterLinkButton } from '@awg-shared/router-link-button-group/router-link-button.model';
import { EditionConstants, EditionPath } from '@awg-views/edition-view/models';
import { EditionOverviewComponent } from './edition-overview.component';

// mock components
@Component({ selector: 'awg-router-link-button-group', template: '' })
class RouterLinkButtonGroupStubComponent {
    @Input()
    buttonArray: RouterLinkButton[];
    @Input() queryParamsHandling?: QueryParamsHandling = '';
    @Output()
    selectButtonRequest: EventEmitter<RouterLinkButton> = new EventEmitter<RouterLinkButton>();
}

describe('EditionOverviewComponent (DONE)', () => {
    let component: EditionOverviewComponent;
    let fixture: ComponentFixture<EditionOverviewComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedButtonArray: RouterLinkButton[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionOverviewComponent, RouterLinkButtonGroupStubComponent, RouterOutletStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionOverviewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        const expectedEditionPath = new EditionPath(EditionConstants.op12);
        expectedButtonArray = [
            new RouterLinkButton(expectedEditionPath.root, EditionConstants.editionIntro, 'Einleitung', false),
            new RouterLinkButton(expectedEditionPath.root, EditionConstants.editionDetail, 'Edierter Notentext', false),
            new RouterLinkButton(expectedEditionPath.root, EditionConstants.editionReport, 'Kritischer Bericht', false)
        ];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `editionButtonArray`', () => {
            expect(component.editionButtonArray).toBeUndefined('should be undefined');
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

        it('should have `editionButtonArray`', () => {
            expect(component.editionButtonArray).toBeDefined('should be defined');
            expect(component.editionButtonArray).toEqual(expectedButtonArray, `should equal ${expectedButtonArray}`);
        });

        describe('VIEW', () => {
            it('... should contain one router outlet (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, RouterOutletStubComponent, 1, 1);
            });

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
    });
});
