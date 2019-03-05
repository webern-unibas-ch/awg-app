import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ResourceDetailProps } from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentPropsComponent } from './props.component';

xdescribe('ResourceDetailHtmlContentPropsComponent', () => {
    let component: ResourceDetailHtmlContentPropsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentPropsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    const expectedProps: ResourceDetailProps[] = [];
    let expectedMetaBreakLine: string;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHtmlContentPropsComponent, CompileHtmlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentPropsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedMetaBreakLine = 'Versionsdatum';

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

        it('should not have `incoming` inputs', () => {
            expect(component.props).toBeUndefined('should be undefined');
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(emitSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one section.awg-linked-obj', () => {
                getAndExpectDebugElementByCss(compDe, 'section.awg-props', 1, 1);
            });

            it('... should contain one header', () => {
                // header debug element
                const headerDes = getAndExpectDebugElementByCss(compDe, 'section.awg-props > h4.awg-props-title', 1, 1);

                // check output
                expect(headerDes[0].nativeElement.textContent).toBe('Objektdaten');
            });

            it('... should contain no ul with props yet', () => {
                // ul debug element
                const ulDes = getAndExpectDebugElementByCss(compDe, 'section.awg-props > ul', 0, 0);
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

        it('should have `props` inputs', () => {
            expect(component.props).toBeDefined('should be defined');
            expect(component.props).toBe(expectedProps, `should be expectedProps: ${expectedProps}`);
        });

        xdescribe('#navigateToResource', () => {
            it('... should trigger on click', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                // no id
                expectSpyCall(navigateToResourceSpy, 1, '');

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                // string
                expectSpyCall(navigateToResourceSpy, 2, '28');

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                // string
                expectSpyCall(navigateToResourceSpy, 3, '330');
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // first anchor has no id

                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // first anchor has no id, see above

                // second anchor has @id: string
                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(emitSpy, 1, '28');

                // third anchor has @id: string
                // trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(emitSpy, 2, '330');
            }));
        });

        /*
        xdescribe('VIEW', () => {
            it('... should contain one header showing number of items', () => {
                // size debug elements
                const sizeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-linked-obj > h5 > span#awg-incoming-size',
                    1,
                    1
                );

                // check size output

                expect(sizeDes[0].nativeElement.textContent).toBe(
                    expectedTotalItems.toString(),
                    `should be expectedTotalItems: ${expectedTotalItems}`
                );

            });

            it('... should contain 2 ngb-panel elements (div.card) with header but no body (closed)', () => {
                // panel debug elements
                const panelDes = getAndExpectDebugElementByCss(compDe, 'div.card', 2, 2);

                // header debug elements
                getAndExpectDebugElementByCss(panelDes[0], 'div.card-header', 1, 1, 'in first panel');
                getAndExpectDebugElementByCss(panelDes[1], 'div.card-header', 1, 1, 'in second panel');

                // body debug elements
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div.card-header > div > div.card-body',
                    0,
                    0,
                    'in first panel'
                );
                getAndExpectDebugElementByCss(
                    panelDes[1],
                    'div.card-header > div > div.card-body',
                    0,
                    0,
                    'in second panel'
                );
            });

            it('... should render incoming group length and key in panel header (div.card-header)', () => {
                // header debug element
                const panelHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 2, 2);

                // badge debug elements
                const badgeDes0 = getAndExpectDebugElementByCss(
                    panelHeaderDes[0],
                    'span.badge',
                    1,
                    1,
                    'in first panel'
                );
                const badgeDes1 = getAndExpectDebugElementByCss(
                    panelHeaderDes[1],
                    'span.badge',
                    1,
                    1,
                    'in second panel'
                );

                // badge native elements
                const badge0El = badgeDes0[0].nativeElement;
                const badge1El = badgeDes1[0].nativeElement;

                // key debug elements
                const keyDes0 = getAndExpectDebugElementByCss(
                    panelHeaderDes[0],
                    'span.awg-linked-obj-title',
                    1,
                    1,
                    'in first panel'
                );
                const keyDes1 = getAndExpectDebugElementByCss(
                    panelHeaderDes[1],
                    'span.awg-linked-obj-title',
                    1,
                    1,
                    'in second panel'
                );

                // key native elements
                const key0El = keyDes0[0].nativeElement;
                const key1El = keyDes1[0].nativeElement;

                // create pipe
                keyValuePipe = new KeyValuePipe(defaultKeyValueDiffers);
                const pipedExpectedIncoming = keyValuePipe.transform(expectedIncoming);

                // check badge output
                expect(badge0El.textContent).toBe(
                    pipedExpectedIncoming[0].value.length.toString(),
                    `should be ${pipedExpectedIncoming[0].value.length}`
                );
                expect(badge1El.textContent).toBe(
                    pipedExpectedIncoming[1].value.length.toString(),
                    `should be ${pipedExpectedIncoming[1].value.length}`
                );

                // check key output
                expect(key0El.textContent).toBe(
                    pipedExpectedIncoming[0].key,
                    `should be ${pipedExpectedIncoming[0].key}`
                );
                expect(key1El.textContent).toBe(
                    pipedExpectedIncoming[1].key,
                    `should be ${pipedExpectedIncoming[1].key}`
                );
            });

            it('... should render incomingLinks in table of panel content (div.card-body)', () => {
                // button debug elements
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card > div.card-header button.btn-link',
                    2,
                    2
                );

                // first button's native element to click on
                const button0El = buttonDes[0].nativeElement;

                // open first panel
                (<HTMLElement>button0El).click();
                fixture.detectChanges();

                expectOpenPanelBody(compDe, 0, 'should have first panel opened');

                // table debug elements
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);

                // img
                const imgDes = getAndExpectDebugElementByCss(tableDes[0], 'a.awg-linked-obj-link > img', 2, 2);
                const icon0 = expectedIncoming['testkey1'][0].restype.icon;
                const icon1 = expectedIncoming['testkey1'][1].restype.icon;

                // spanId
                const spanIdDes = getAndExpectDebugElementByCss(
                    tableDes[0],
                    'a.awg-linked-obj-link > span.awg-linked-obj-link-id',
                    2,
                    2
                );
                const id0 = expectedIncoming['testkey1'][0].id;
                const id1 = expectedIncoming['testkey1'][1].id;

                // spanValue
                const spanValueDes = getAndExpectDebugElementByCss(
                    tableDes[0],
                    'a.awg-linked-obj-link > span.awg-linked-obj-link-value',
                    2,
                    2
                );
                const value0 = expectedIncoming['testkey1'][0].value;
                const value1 = expectedIncoming['testkey1'][1].value;

                // check img output
                expect(imgDes[0].properties.src).toBe(icon0, `should be icon0: ${icon0}`);
                expect(imgDes[1].properties.src).toBe(icon1, `should be icon1: ${icon1}`);

                // check id output
                expect(spanIdDes[0].nativeElement.textContent).toBe(`${id0}`, `should be id0: ${id0}`);
                expect(spanIdDes[1].nativeElement.textContent).toBe(`${id1}`, `should be id1: ${id1}`);

                // check value output
                expect(spanValueDes[0].nativeElement.textContent).toBe(`${value0}`, `should be value0: ${value0}`);
                expect(spanValueDes[1].nativeElement.textContent).toBe(`${value1}`, `should be value1: ${value1}`);
            });
        });
        */
    });
});
