import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faDiagramProject, faGripHorizontal, faTable } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { ViewHandleButtonGroupComponent } from './view-handle-button-group.component';
import { ViewHandle, ViewHandleTypes } from './view-handle.model';

describe('ViewHandleButtonGroupComponent (DONE)', () => {
    let component: ViewHandleButtonGroupComponent;
    let fixture: ComponentFixture<ViewHandleButtonGroupComponent>;
    let compDe: DebugElement;

    let expectedViewHandles: ViewHandle[];
    let expectedSelectedViewType: ViewHandleTypes;

    let createFormGroupSpy: Spy;
    let listenToUserInputChangeSpy: Spy;
    let onViewChangeSpy: Spy;
    let viewChangeRequestSpy: Spy;
    let viewHandleTrackerSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbTooltip, ReactiveFormsModule],
            declarations: [ViewHandleButtonGroupComponent],
            providers: [UntypedFormBuilder],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewHandleButtonGroupComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedViewHandles = [
            new ViewHandle('Graph view', ViewHandleTypes.GRAPH, faDiagramProject),
            new ViewHandle('Table view', ViewHandleTypes.TABLE, faTable),
            new ViewHandle('Grid view', ViewHandleTypes.GRID, faGripHorizontal),
        ];
        expectedSelectedViewType = ViewHandleTypes.GRAPH;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        createFormGroupSpy = spyOn(component, 'createFormGroup').and.callThrough();
        listenToUserInputChangeSpy = spyOn(component, 'listenToUserInputChange').and.callThrough();
        onViewChangeSpy = spyOn(component, 'onViewChange').and.callThrough();
        viewChangeRequestSpy = spyOn(component.viewChangeRequest, 'emit').and.callThrough();
        viewHandleTrackerSpy = spyOn(component, 'viewHandleTracker').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have a view handle control form', () => {
            expect(component.viewHandleControlForm).toBeUndefined();
        });

        it('should not have a selected view type', () => {
            expect(component.selectedViewType).toBeUndefined();
        });

        it('should not have a list of view handles', () => {
            expect(component.viewHandles).toBeUndefined();
        });

        describe('VIEW', () => {
            it('should have a div.awg-view-handle-btn-group', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-view-handle-btn-group', 1, 1);
            });

            it('should have a form in div.awg-view-handle-btn-group', () => {
                const divDe = getAndExpectDebugElementByCss(compDe, 'div.awg-view-handle-btn-group', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'form', 1, 1);
            });

            it('should have another div.btn-group in form', () => {
                const formDe = getAndExpectDebugElementByCss(compDe, 'div.awg-view-handle-btn-group > form', 1, 1);

                getAndExpectDebugElementByCss(formDe[0], 'div.btn-group', 1, 1);
            });

            it('should not have any input elements in div.btn-group', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDe[0], 'input', 0, 0);
            });

            it('should not have any label elements in div.btn-group', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(divDe[0], 'label', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent component setting the data
            component.viewHandles = expectedViewHandles;
            component.selectedViewType = expectedSelectedViewType;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should trigger the `createFormGroup()` method with selected view type', () => {
            expectSpyCall(createFormGroupSpy, 1, expectedSelectedViewType);
        });

        describe('#createFormGroup()', () => {
            it('should have a `createFormGroup()` method', () => {
                expect(component.createFormGroup).toBeDefined();
            });

            it('should trigger on init', () => {
                expectSpyCall(createFormGroupSpy, 1, expectedSelectedViewType);
            });

            it('... should trigger on changes of selectedViewType', () => {
                expectSpyCall(createFormGroupSpy, 1, ViewHandleTypes.GRAPH);

                // Directly trigger ngOnChanges
                component.selectedViewType = ViewHandleTypes.GRID;
                component.ngOnChanges({
                    selectedViewType: new SimpleChange(component.selectedViewType, [component.selectedViewType], false),
                });

                expectSpyCall(createFormGroupSpy, 2, ViewHandleTypes.GRID);
            });

            it('... should only trigger on changes of selectedViewType if not first change', () => {
                expectSpyCall(createFormGroupSpy, 1, ViewHandleTypes.GRAPH);

                // Directly trigger ngOnChanges
                component.selectedViewType = ViewHandleTypes.GRID;
                component.ngOnChanges({
                    selectedViewType: new SimpleChange(component.selectedViewType, [ViewHandleTypes.GRID], true),
                });

                expectSpyCall(createFormGroupSpy, 1, (component.selectedViewType = ViewHandleTypes.GRAPH));
            });

            it('should create the viewHandleControlForm', () => {
                expect(component.viewHandleControlForm).toBeDefined();
                expect(component.viewHandleControlForm).toBeInstanceOf(UntypedFormGroup);
                expect(component.viewHandleControlForm.controls).toBeDefined();
            });

            it('should create the viewHandleControlForm with correct viewHandleControl', () => {
                expect(component.viewHandleControlForm.controls).toBeDefined();

                expect(component.viewHandleControlForm.controls['viewHandleControl']).toBeDefined();
                expect(component.viewHandleControlForm.controls['viewHandleControl']).toBeInstanceOf(
                    UntypedFormControl
                );
            });

            it('should create the viewHandleControlForm with correct viewHandleControl value', () => {
                expect(component.viewHandleControlForm.controls['viewHandleControl'].value).toBeTruthy();
                expect(component.viewHandleControlForm.controls['viewHandleControl'].value).toBe(
                    expectedSelectedViewType
                );
            });

            it('should get the viewHandleControl from its getter', () => {
                expect(component.viewHandleControl).toBeDefined();
                expect(component.viewHandleControl).toBeInstanceOf(UntypedFormControl);

                expect(component.viewHandleControl.value).toBeTruthy();
                expect(component.viewHandleControl.value).toBe(expectedSelectedViewType);
            });

            it('should trigger the `listenToUserInputChange()` method', () => {
                expectSpyCall(listenToUserInputChangeSpy, 1);

                // Trigger the `listenToUserInputChange()` method
                component.createFormGroup(ViewHandleTypes.TABLE);
                fixture.detectChanges();

                expectSpyCall(listenToUserInputChangeSpy, 2);
            });
        });

        describe('#listenToUserInputChange()', () => {
            it('should have a `listenToUserInputChange()` method', () => {
                expect(component.listenToUserInputChange).toBeDefined();
            });

            it('should trigger the `onViewChange()` method when viewHandle controls changes value', () => {
                // Trigger the value change
                component.viewHandleControl.setValue(ViewHandleTypes.TABLE);
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.TABLE);

                // Trigger the value change
                component.viewHandleControl.setValue(ViewHandleTypes.GRAPH);
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 2, ViewHandleTypes.GRAPH);

                // Trigger the value change
                component.viewHandleControl.setValue(ViewHandleTypes.GRID);
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 3, ViewHandleTypes.GRID);
            });

            it('should trigger the `onViewChange()` method by by change event from GRAPH radio button', () => {
                const inputDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group > input',
                    3,
                    3
                );
                const inputEl = inputDes[0].nativeElement;

                inputEl.dispatchEvent(new Event('change'));
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.GRAPH);
            });

            it('should trigger the `onViewChange()` method by by change event from TABLE radio button', () => {
                const inputDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group > input',
                    3,
                    3
                );
                const inputEl = inputDes[1].nativeElement;

                inputEl.dispatchEvent(new Event('change'));
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.TABLE);
            });

            it('should trigger the `onViewChange()` method by change event from GRID radio button', () => {
                const inputDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group > input',
                    3,
                    3
                );
                const inputEl = inputDes[2].nativeElement;

                inputEl.dispatchEvent(new Event('change'));
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.GRID);
            });

            it('should not trigger the `onViewChange()` method when component is destroyed', () => {
                // Trigger the value change
                component.viewHandleControl.setValue(ViewHandleTypes.TABLE);
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.TABLE);

                // Destroy the component
                fixture.destroy();

                // Trigger the value change
                component.viewHandleControl.setValue(ViewHandleTypes.GRAPH);
                fixture.detectChanges();

                expectSpyCall(onViewChangeSpy, 1, ViewHandleTypes.TABLE);
            });
        });

        describe('#onViewChange()', () => {
            it('should have a `onViewChange()` method', () => {
                expect(component.onViewChange).toBeDefined();
            });

            describe('... should not do anything if ', () => {
                it('... view is undefined', () => {
                    component.onViewChange(undefined);
                    fixture.detectChanges();

                    expectSpyCall(viewChangeRequestSpy, 0);
                });

                it('... view is null', () => {
                    component.onViewChange(null);
                    fixture.detectChanges();

                    expectSpyCall(viewChangeRequestSpy, 0);
                });

                it('... view has type `never`', () => {
                    let expectedView: never;

                    component.onViewChange(expectedView);
                    fixture.detectChanges();

                    expectSpyCall(viewChangeRequestSpy, 0);
                });
            });

            it('should emit a given GRAPH view', () => {
                const expectedView = ViewHandleTypes.GRAPH;

                component.onViewChange(expectedView);
                fixture.detectChanges();

                expectSpyCall(viewChangeRequestSpy, 1, 'graph');
            });

            it('should emit a given TABLE view', () => {
                const expectedView = ViewHandleTypes.TABLE;

                component.onViewChange(expectedView);
                fixture.detectChanges();

                expectSpyCall(viewChangeRequestSpy, 1, 'table');
            });

            it('should emit a given GRID view', () => {
                const expectedView = ViewHandleTypes.GRID;

                component.onViewChange(expectedView);
                fixture.detectChanges();

                expectSpyCall(viewChangeRequestSpy, 1, 'grid');
            });
        });

        describe('#viewHandleTracker()', () => {
            it('should have a `viewHandleTracker()` method', () => {
                expect(component.viewHandleTracker).toBeDefined();
            });

            it('should return the type of a given view handle', () => {
                expect(component.viewHandleTracker(0, expectedViewHandles[0])).toBe(ViewHandleTypes.GRAPH);
                expect(component.viewHandleTracker(1, expectedViewHandles[1])).toBe(ViewHandleTypes.TABLE);
            });
        });

        describe('VIEW', () => {
            it('should have as many radio elements (input.btn-check) in div.btn-group as viewHandles given', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );

                const inputDes = getAndExpectDebugElementByCss(
                    divDe[0],
                    'input.btn-check',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                for (let i = 0; i < expectedViewHandles.length; i++) {
                    expect(inputDes[i].nativeElement.type).toBe('radio');
                }
            });

            it('should set the value of the input element to the viewHandle type', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );
                const inputDes = getAndExpectDebugElementByCss(
                    divDe[0],
                    'input',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                for (let i = 0; i < expectedViewHandles.length; i++) {
                    expect(inputDes[i].attributes['ng-reflect-value']).toBeTruthy();
                    expect(inputDes[i].attributes['ng-reflect-value'])
                        .withContext(`should be ${expectedViewHandles[i].type}`)
                        .toBe(expectedViewHandles[i].type);
                }
            });

            it('should set the id of the input element to `{viewHandle.type}-view-button`', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );
                const inputDes = getAndExpectDebugElementByCss(
                    divDe[0],
                    'input',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                const inputEl1 = inputDes[0].nativeElement;
                const inputEl2 = inputDes[1].nativeElement;
                const inputEl3 = inputDes[2].nativeElement;

                expect(inputEl1.id).toBeTruthy();
                expect(inputEl1.id)
                    .withContext(`should be '${expectedViewHandles}-view-button'`)
                    .toBe(`${expectedViewHandles[0].type}-view-button`);

                expect(inputEl2.id).toBeTruthy();
                expect(inputEl2.id)
                    .withContext(`should be '${expectedViewHandles}-view-button'`)
                    .toBe(`${expectedViewHandles[1].type}-view-button`);

                expect(inputEl3.id).toBeTruthy();
                expect(inputEl3.id)
                    .withContext(`should be '${expectedViewHandles}-view-button'`)
                    .toBe(`${expectedViewHandles[2].type}-view-button`);
            });

            it('should have as many label elements in div.btn-group as viewHandles given', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );

                getAndExpectDebugElementByCss(
                    divDe[0],
                    'label',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );
            });

            it('should have as many icon elements in div.btn-group > label as viewHandles given', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );
                const iconDes = getAndExpectDebugElementByCss(
                    divDe[0],
                    'label > fa-icon',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                const iconDeChild1 = iconDes[0].children[0];
                const iconDeChild2 = iconDes[1].children[0];
                const iconDeChild3 = iconDes[2].children[0];

                expect(iconDeChild1.classes['fa-diagram-project']).toBeTruthy();
                expect(iconDeChild2.classes['fa-table']).toBeTruthy();
                expect(iconDeChild3.classes['fa-grip']).toBeTruthy();
            });

            it('should set the label for the correct input', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );
                const labelDes = getAndExpectDebugElementByCss(
                    divDe[0],
                    'label',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                for (let i = 0; i < expectedViewHandles.length; i++) {
                    expect(labelDes[i].attributes['for']).toBeTruthy();
                    expect(labelDes[i].attributes['for'])
                        .withContext(`should be ${expectedViewHandles[i].type}-view-button`)
                        .toBe(`${expectedViewHandles[i].type}-view-button`);
                }
            });

            it('should display tooltip with `{type} view` for each view handle', () => {
                const divDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-view-handle-btn-group > form > div.btn-group',
                    1,
                    1
                );
                const labelDes = getAndExpectDebugElementByCss(
                    divDe[0],
                    'label',
                    expectedViewHandles.length,
                    expectedViewHandles.length
                );

                for (let i = 0; i < expectedViewHandles.length; i++) {
                    expect(labelDes[i].attributes['ng-reflect-ngb-tooltip']).toBeTruthy();
                    expect(labelDes[i].attributes['ng-reflect-ngb-tooltip'])
                        .withContext(`should be  '${expectedViewHandles[i].type} view'`)
                        .toBe(expectedViewHandles[i].type + ' view');
                }
            });
        });
    });
});
