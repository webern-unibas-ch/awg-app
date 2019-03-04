import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { DebugElement, SimpleChange, ɵdefaultKeyValueDiffers as defaultKeyValueDiffers } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ConversionService } from '@awg-core/services';
import { ResourceDetailGroupedIncomingLinks, ResourceDetailIncomingLinks } from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentLinkedobjectsComponent } from './linkedobjects.component';

// helper functions
function expectClosedPanelBody(de: DebugElement, id: number, msg: string) {
    // body debug elements
    const bodyDes = de.queryAll(By.css(`div.card > div#incoming-linkgroup-${id} > div.card-body`));

    expect(bodyDes).toBeDefined();
    expect(bodyDes.length).toBe(0, msg);
}
function expectOpenPanelBody(de: DebugElement, id: number, msg: string) {
    // body debug elements
    const bodyDes = de.queryAll(By.css(`div.card > div#incoming-linkgroup-${id} > div.card-body`));

    expect(bodyDes).toBeDefined();
    expect(bodyDes.length).toBe(1, msg);
}

describe('ResourceDetailHtmlContentLinkedobjectsComponent (DONE)', () => {
    let component: ResourceDetailHtmlContentLinkedobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentLinkedobjectsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let keyValuePipe: KeyValuePipe;

    let updateTotalNumberSpy: Spy;
    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    let expectedIncoming: ResourceDetailGroupedIncomingLinks;
    let incomingLink1: ResourceDetailIncomingLinks;
    let incomingLink2: ResourceDetailIncomingLinks;
    let incomingLink3: ResourceDetailIncomingLinks;
    const expectedTotalItems = 5;

    const mockConversionService = {
        getNestedArraysTotalItems: (obj: ResourceDetailGroupedIncomingLinks): number => {
            let size = 0;
            // iterate over object keys
            Object.keys(obj).forEach(key => {
                // sum up length of array nested in object
                size += obj[key].length;
            });
            return size;
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionModule],
            declarations: [ResourceDetailHtmlContentLinkedobjectsComponent],
            providers: [{ provide: ConversionService, useValue: mockConversionService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentLinkedobjectsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        incomingLink1 = {
            id: '',
            value: 'testvalue1',
            restype: { id: '1234', label: 'test-type1', icon: '/assets/img/logos/angular.png' }
        };
        incomingLink2 = {
            id: '28',
            value: 'testvalue2',
            restype: { id: '1235', label: 'test-type2', icon: '/assets/img/logos/snf.png' }
        };
        incomingLink3 = {
            id: '330',
            value: 'testvalue3',
            restype: { id: '1236', label: 'test-type3', icon: '/assets/img/logos/awg.png' }
        };

        expectedIncoming = new ResourceDetailGroupedIncomingLinks();
        expectedIncoming = {
            testkey1: [incomingLink1, incomingLink2],
            testkey2: [incomingLink1, incomingLink2, incomingLink3]
        };

        // set mockService to return default value
        mockConversionService.getNestedArraysTotalItems(expectedIncoming);

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        updateTotalNumberSpy = spyOn(component, 'updateTotalNumber').and.callThrough();
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        emitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should have totalNumber = 0', () => {
            expect(component.totalNumber).toBe(0, 'should be 0');
        });

        it('should not have `incoming` inputs', () => {
            expect(component.incoming).toBeUndefined('should be undefined');
        });

        describe('#updateTotalNumber', () => {
            it('... should not have been called', () => {
                expect(updateTotalNumberSpy).not.toHaveBeenCalled();
            });
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(emitSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-linked-obj', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj', 1, 1);
            });

            it('... should contain no header showing number of items yet', () => {
                // header debug element
                const headerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj > h5', 1, 1);
                // size debug element
                getAndExpectDebugElementByCss(headerDes[0], 'span#awg-incoming-size', 0, 0);
            });

            it('... should contain one ngb-accordion (empty yet))', () => {
                // ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj > ngb-accordion', 1, 1);

                // panel
                getAndExpectDebugElementByCss(accordionDes[0], 'ngb-panel', 0, 0, 'yet');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.incoming = expectedIncoming;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `incoming` inputs', () => {
            expect(component.incoming).toBeDefined('should be defined');
            expect(component.incoming).toBe(expectedIncoming);
        });

        describe('#updateTotalNumber', () => {
            it('... should have been called', fakeAsync(() => {
                expectSpyCall(updateTotalNumberSpy, 1);
            }));

            it('... should have updated totalNumber with number of nested array items', fakeAsync(() => {
                expectSpyCall(updateTotalNumberSpy, 1);

                expect(component.totalNumber).toBe(
                    expectedTotalItems,
                    `should be expectedTotalItems: ${expectedTotalItems}`
                );
            }));

            it('... should do nothing on first onChanges', fakeAsync(() => {
                const newExpectedIncoming: ResourceDetailGroupedIncomingLinks = {
                    testkey1: [incomingLink1, incomingLink2]
                };

                // simulate the parent changing the input properties for the first time
                component.incoming = newExpectedIncoming;

                // trigger ngOnChanges
                component.ngOnChanges({ incoming: new SimpleChange(null, component.incoming, true) });
                fixture.detectChanges();

                // spy has been called only once with ngOnInit
                expectSpyCall(updateTotalNumberSpy, 1);

                // output has not changed
                expect(component.totalNumber).toBe(
                    expectedTotalItems,
                    `should be still expectedTotalItems: ${expectedTotalItems}`
                );
            }));

            it('... should recalculate total number on input changes (second & more)', fakeAsync(() => {
                const newExpectedIncoming: ResourceDetailGroupedIncomingLinks = {
                    testkey1: [incomingLink1, incomingLink2, incomingLink3]
                };
                const newTotalItems = newExpectedIncoming['testkey1'].length;

                // simulate the parent changing the input properties for the first time
                component.incoming = newExpectedIncoming;

                // trigger ngOnChanges
                component.ngOnChanges({ incoming: new SimpleChange(null, component.incoming, false) });
                fixture.detectChanges();

                // spy has been called twice now
                expectSpyCall(updateTotalNumberSpy, 2);

                // output has changed
                expect(component.totalNumber).toBe(newTotalItems, `should be newTotalItems: ${newTotalItems}`);
            }));
        });

        describe('#navigateToResource', () => {
            beforeEach(() => {
                // open second panel

                // button debug elements
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card > div.card-header button.btn-link',
                    2,
                    2
                );

                // first button's native element to click on
                const buttonEl = buttonDes[1].nativeElement;

                // open first panel
                (<HTMLElement>buttonEl).click();
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'should have first panel closed');
                expectOpenPanelBody(compDe, 1, 'should have second panel opened');
            });

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

        describe('VIEW', () => {
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

            it('... should toggle panels alternately on click', () => {
                // header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 2, 2);

                // button debug elements
                const button0Des = getAndExpectDebugElementByCss(
                    panelHeaderDes[0],
                    'button.btn-link',
                    1,
                    1,
                    'in first panel'
                );
                const button1Des = getAndExpectDebugElementByCss(
                    panelHeaderDes[1],
                    'button.btn-link',
                    1,
                    1,
                    'in second panel'
                );

                // button native elements to click on
                const button0El = button0Des[0].nativeElement;
                const button1El = button1Des[0].nativeElement;

                // both panels closed first by default
                expectClosedPanelBody(compDe, 0, 'should have not opened first panel');
                expectClosedPanelBody(compDe, 1, 'should have not opened second panel');

                // click first panel
                (<HTMLElement>button0El).click();
                fixture.detectChanges();

                expectOpenPanelBody(compDe, 0, 'should have first panel opened');
                expectClosedPanelBody(compDe, 1, 'should have second panel closed');

                // click first panel again
                (<HTMLElement>button0El).click();
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'should have first panel closed');
                expectClosedPanelBody(compDe, 1, 'should have second panel closed');

                // click second panel
                (<HTMLElement>button1El).click();
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'should have first panel closed');
                expectOpenPanelBody(compDe, 1, 'should have second panel opened');

                // click second panel again
                (<HTMLElement>button1El).click();
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'should have first panel closed');
                expectClosedPanelBody(compDe, 1, 'should have second panel closed');

                // click first panel
                (<HTMLElement>button0El).click();
                fixture.detectChanges();

                expectOpenPanelBody(compDe, 0, 'should have first panel opened');
                expectClosedPanelBody(compDe, 1, 'should have second panel closed');

                // click second panel
                (<HTMLElement>button1El).click();
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'should have first panel closed');
                expectOpenPanelBody(compDe, 1, 'should have second panel opened');
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
    });
});
