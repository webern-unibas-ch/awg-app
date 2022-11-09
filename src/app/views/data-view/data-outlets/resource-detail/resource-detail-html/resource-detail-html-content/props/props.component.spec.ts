import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { GndEvent, GndEventType } from '@awg-core/services/gnd-service';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ResourceDetailProperty } from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentPropsComponent } from './props.component';

describe('ResourceDetailHtmlContentPropsComponent (DONE)', () => {
    let component: ResourceDetailHtmlContentPropsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentPropsComponent>;
    let compDe: DebugElement;

    let exposeGndSpy: Spy;
    let navigateToResourceSpy: Spy;
    let gndRequestEmitSpy: Spy;
    let resourceRequestEmitSpy: Spy;

    let expectedProps: ResourceDetailProperty[];
    let expectedPropWithGnd: ResourceDetailProperty;
    let expectedGndValue: string;
    let expectedGnd: string;
    let expectedMetaBreakLine: string;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHtmlContentPropsComponent, CompileHtmlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentPropsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedMetaBreakLine = 'Versionsdatum';
        expectedGnd = '12345678-X';

        const prop1Value1 =
            '<a (click)="ref.navigateToResource()">Op. 28</a>: Skizzen zu einem "1. Satz"<a (click)="ref.navigateToResource(\'28\')"> (später 2. Satz [<a (click)="ref.navigateToResource(330)">M 330</a>])';
        const props1: ResourceDetailProperty = new ResourceDetailProperty('0', 'text', 'prop1', [
            prop1Value1,
            'prop1-value2',
        ]);
        const props2: ResourceDetailProperty = new ResourceDetailProperty('1', 'date', 'Versionsdatum', ['2019']);
        const props3: ResourceDetailProperty = new ResourceDetailProperty('2', 'richtext', 'prop2', [
            'prop2-value1',
            'prop2-value2',
            'prop2-value3',
        ]);
        const props4: ResourceDetailProperty = new ResourceDetailProperty('3', 'text', 'prop1', []);
        expectedGndValue = `<a href="http://d-nb.info/gnd/${expectedGnd}">http://d-nb.info/gnd/${expectedGnd}</a>`;
        expectedPropWithGnd = new ResourceDetailProperty('856', 'richtext', 'prop1', [expectedGndValue]);

        expectedProps = [props1, props2, props3, props4];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        exposeGndSpy = spyOn(component, 'exposeGnd').and.callThrough();
        gndRequestEmitSpy = spyOn(component.gndRequest, 'emit').and.callThrough();
        resourceRequestEmitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have `metaBreakLine`', () => {
            expect(component.metaBreakLine).withContext('should be defined').toBeDefined();
            expect(component.metaBreakLine)
                .withContext(`should be ${expectedMetaBreakLine}`)
                .toBe(expectedMetaBreakLine);
        });

        it('should not have `props` input', () => {
            expect(component.props).withContext('should be undefined').toBeUndefined();
        });

        describe('#exposeGnd', () => {
            it('... should not have been called', () => {
                expect(exposeGndSpy).not.toHaveBeenCalled();
                expect(gndRequestEmitSpy).not.toHaveBeenCalled();
            });
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(resourceRequestEmitSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one section.awg-props', () => {
                getAndExpectDebugElementByCss(compDe, 'section.awg-props', 1, 1);
            });

            it('... should contain one header', () => {
                // Header debug element
                const headerDes = getAndExpectDebugElementByCss(compDe, 'section.awg-props > h4.awg-props-title', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                // Check output
                expect(headerEl.textContent).toBeTruthy();
                expect(headerEl.textContent).withContext('Objektdaten').toContain('Objektdaten');
            });

            it('... should contain no ul with props yet', () => {
                getAndExpectDebugElementByCss(compDe, 'section.awg-props > ul', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Simulate the parent setting the input properties
            component.props = expectedProps;

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('should have `props` input', () => {
            expect(component.props).withContext('should be defined').toBeDefined();
            expect(component.props).withContext(`should be expectedProps: ${expectedProps}`).toBe(expectedProps);
        });

        describe('VIEW', () => {
            it('... should contain 4 ul elements (one for each prop of props array)', () => {
                getAndExpectDebugElementByCss(compDe, 'section.awg-props > ul', 4, 4);
            });

            it('... should have one breakline (from props 2)', () => {
                const breakDes = getAndExpectDebugElementByCss(compDe, 'ul > li#breakLine', 1, 1);

                getAndExpectDebugElementByCss(breakDes[0], 'hr', 1, 1);
            });

            it('... should contain altogether 3 li.awg-prop elements, since last props.value is empty', () => {
                getAndExpectDebugElementByCss(compDe, 'ul > li.awg-prop', 3, 3);
            });

            it('... should contain inner ul elements according to each props.value.length', () => {
                const outerLiDes = getAndExpectDebugElementByCss(compDe, 'ul > li.awg-prop', 3, 3);

                const expectedLength0 = expectedProps[0].values.length;
                const expectedLength1 = expectedProps[1].values.length;
                const expectedLength2 = expectedProps[2].values.length;

                getAndExpectDebugElementByCss(outerLiDes[0], 'ul', expectedLength0, expectedLength0);
                getAndExpectDebugElementByCss(outerLiDes[1], 'ul', expectedLength1, expectedLength1);
                getAndExpectDebugElementByCss(outerLiDes[2], 'ul', expectedLength2, expectedLength2);
            });

            it('... should contain altogether 6 li.awg-prop-value elements', () => {
                getAndExpectDebugElementByCss(compDe, 'ul > li.awg-prop > ul > li.awg-prop-value', 6, 6);
            });

            it('... should contain 7 CompileHtmlComponents in li.awg-prop-value', () => {
                const htmlDes = getAndExpectDebugElementByDirective(compDe, CompileHtmlComponent, 6, 6);

                htmlDes.forEach(html => {
                    expect(html.name).toBeTruthy();
                    expect(html.name).withContext(`should be span`).toBe('span');

                    // Check parent
                    expect(html.parent.name).toBeTruthy();
                    expect(html.parent.name).withContext(`should be li`).toBe('li');
                    expect(html.parent.attributes['class']).toBeTruthy();
                    expect(html.parent.attributes['class'])
                        .withContext(`should be awg-prop-value`)
                        .toBe('awg-prop-value');
                });
            });
        });

        describe('#exposeGnd', () => {
            let gndEvent: GndEvent;

            describe('... should trigger', () => {
                it('... on props input change', fakeAsync(() => {
                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        props: new SimpleChange(component.props, [expectedPropWithGnd], false),
                    });

                    // Gets triggered 2x (remove all old GND values & set new GND value)
                    expectSpyCall(exposeGndSpy, 2);
                }));

                it('... a REMOVE event that clears all previous GND entries if props input contains no GND property', fakeAsync(() => {
                    const gndRemoveEvent = new GndEvent(GndEventType.REMOVE, null);

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        props: new SimpleChange(component.props, [expectedProps], false),
                    });

                    expectSpyCall(exposeGndSpy, 1, gndRemoveEvent);
                    expect(exposeGndSpy.calls.mostRecent().args[0]).toEqual(gndRemoveEvent);
                }));

                it('... a REMOVE and SET event if props input contains a GND property', fakeAsync(() => {
                    const gndRemoveEvent = new GndEvent(GndEventType.REMOVE, null);
                    const gndSetEvent = new GndEvent(GndEventType.SET, expectedGndValue);

                    // Directly trigger ngOnChanges
                    component.ngOnChanges({
                        props: new SimpleChange(component.props, [expectedPropWithGnd], false),
                    });

                    // Gets triggered 2x (remove all old GND values & set new GND value)
                    expectSpyCall(exposeGndSpy, 2, gndSetEvent);
                    expect(exposeGndSpy.calls.first().args[0]).toEqual(gndRemoveEvent);
                    expect(exposeGndSpy.calls.mostRecent().args[0]).toEqual(gndSetEvent);
                }));
            });

            describe('... should not emit anything if', () => {
                it('... gndEvent is undefined', fakeAsync(() => {
                    gndEvent = undefined;
                    component.exposeGnd(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, undefined);
                    expectSpyCall(gndRequestEmitSpy, 0);
                }));

                it('... gndEvent is null', fakeAsync(() => {
                    gndEvent = null;
                    component.exposeGnd(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, null);
                    expectSpyCall(gndRequestEmitSpy, 0);
                }));

                it('... gndEvent type is undefined', fakeAsync(() => {
                    gndEvent = new GndEvent(undefined, expectedGnd);
                    component.exposeGnd(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, null);
                    expectSpyCall(gndRequestEmitSpy, 0);
                }));
            });

            describe('... should emit provided gndEvent for', () => {
                it('... SET event', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.SET, expectedGnd);
                    component.exposeGnd(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                    expectSpyCall(gndRequestEmitSpy, 1, gndEvent);
                }));

                it('... REMOVE event', fakeAsync(() => {
                    gndEvent = new GndEvent(GndEventType.REMOVE, null);
                    component.exposeGnd(gndEvent);

                    expectSpyCall(exposeGndSpy, 1, gndEvent);
                    expectSpyCall(gndRequestEmitSpy, 1, gndEvent);
                }));
            });
        });

        describe('#navigateToResource', () => {
            it('... should trigger on click', fakeAsync(() => {
                const innerLiDes = getAndExpectDebugElementByCss(
                    compDe,
                    'ul > li.awg-prop > ul > li.awg-prop-value',
                    6,
                    6
                );
                // Get second element with anchor
                const anchorDes = getAndExpectDebugElementByCss(innerLiDes[0], 'a', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                // No id
                expectSpyCall(navigateToResourceSpy, 1, '');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                // String as input
                expectSpyCall(navigateToResourceSpy, 2, '28');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                // Number as input
                expectSpyCall(navigateToResourceSpy, 3, 330);
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                const innerLiDes = getAndExpectDebugElementByCss(
                    compDe,
                    'ul > li.awg-prop > ul > li.awg-prop-value',
                    6,
                    6
                );
                const anchorDes = getAndExpectDebugElementByCss(innerLiDes[0], 'a', 3, 3);

                // First anchor has no id

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expect(resourceRequestEmitSpy).not.toHaveBeenCalled();
                expect(resourceRequestEmitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const innerLiDes = getAndExpectDebugElementByCss(
                    compDe,
                    'ul > li.awg-prop > ul > li.awg-prop-value',
                    6,
                    6
                );
                const anchorDes = getAndExpectDebugElementByCss(innerLiDes[0], 'a', 3, 3);

                // First anchor has no id, see above

                // Second anchor has @id: string
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(resourceRequestEmitSpy, 1, '28');

                // Third anchor has @id: number
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(resourceRequestEmitSpy, 2, '330');
            }));
        });
    });
});
