import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ResourceDetailProperty } from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentPropsComponent } from './props.component';

describe('ResourceDetailHtmlContentPropsComponent', () => {
    let component: ResourceDetailHtmlContentPropsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentPropsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    let expectedProps: ResourceDetailProperty[];
    let expectedMetaBreakLine: string;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ResourceDetailHtmlContentPropsComponent, CompileHtmlComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentPropsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedMetaBreakLine = 'Versionsdatum';

        const prop1Value1 = `<a (click)="ref.navigateToResource()">Op. 28</a>: Skizzen zu einem "1. Satz"<a (click)="ref.navigateToResource(\'28\')"> (später 2. Satz [<a (click)="ref.navigateToResource(330)">M 330</a>])`;
        const props1: ResourceDetailProperty = new ResourceDetailProperty('0', 'text', 'prop1', [
            prop1Value1,
            'prop1-value2'
        ]);
        const props2: ResourceDetailProperty = new ResourceDetailProperty('1', 'date', 'Versionsdatum', ['2019']);
        const props3: ResourceDetailProperty = new ResourceDetailProperty('2', 'richtext', 'prop2', [
            'prop2-value1',
            'prop2-value2',
            'prop2-value3'
        ]);
        const props4: ResourceDetailProperty = new ResourceDetailProperty('3', 'text', 'prop1', []);
        expectedProps = [props1, props2, props3, props4];

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        emitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have `metaBreakLine`', () => {
            expect(component.metaBreakLine).toBeDefined('should be defined');
            expect(component.metaBreakLine).toBe(expectedMetaBreakLine, `should be ${expectedMetaBreakLine}`);
        });

        it('should not have `props` input', () => {
            expect(component.props).toBeUndefined('should be undefined');
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(emitSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one section.awg-props', () => {
                getAndExpectDebugElementByCss(compDe, 'section.awg-props', 1, 1);
            });

            it('... should contain one header', () => {
                // header debug element
                const headerDes = getAndExpectDebugElementByCss(compDe, 'section.awg-props > h4.awg-props-title', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                // check output
                expect(headerEl.textContent).toContain('Objektdaten');
            });

            it('... should contain no ul with props yet', () => {
                getAndExpectDebugElementByCss(compDe, 'section.awg-props > ul', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.props = expectedProps;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `props` input', () => {
            expect(component.props).toBeDefined('should be defined');
            expect(component.props).toBe(expectedProps, `should be expectedProps: ${expectedProps}`);
        });

        describe('VIEW', () => {
            it('... should contain 4 ul with props', () => {
                getAndExpectDebugElementByCss(compDe, 'section.awg-props > ul', 4, 4);
            });

            it('... should have one breakline (from props 2)', () => {
                const breakDes = getAndExpectDebugElementByCss(compDe, 'ul > li#breakLine', 1, 1);

                getAndExpectDebugElementByCss(breakDes[0], 'hr', 1, 1);
            });

            it('... should contain only 3 props (li.awg-prop), last props.value is empty', () => {
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

            it('... should contain 6 li.awg-prop-value', () => {
                getAndExpectDebugElementByCss(compDe, 'ul > li.awg-prop > ul > li.awg-prop-value', 6, 6);
            });

            it('... should contain 6 CompileHtmlComponents in li.awg-prop-value', () => {
                const htmlDes = getAndExpectDebugElementByDirective(compDe, CompileHtmlComponent, 6, 6);

                htmlDes.forEach(html => {
                    expect(html.name).toBeDefined();
                    expect(html.name).toBe('span');

                    // check parent
                    expect(html.parent.name).toBe('li');
                    expect(html.parent.attributes.class).toBeDefined();
                    expect(html.parent.attributes.class).toBe('awg-prop-value');
                });
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
                const anchorDes = getAndExpectDebugElementByCss(innerLiDes[0], 'a', 3, 3);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                // no id
                expectSpyCall(navigateToResourceSpy, 1, '');

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                // string as input
                expectSpyCall(navigateToResourceSpy, 2, '28');

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                // number as input
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

                // first anchor has no id

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const innerLiDes = getAndExpectDebugElementByCss(
                    compDe,
                    'ul > li.awg-prop > ul > li.awg-prop-value',
                    6,
                    6
                );
                const anchorDes = getAndExpectDebugElementByCss(innerLiDes[0], 'a', 3, 3);

                // first anchor has no id, see above

                // second anchor has @id: string
                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(emitSpy, 1, '28');

                // third anchor has @id: number
                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(emitSpy, 2, '330');
            }));
        });
    });
});
