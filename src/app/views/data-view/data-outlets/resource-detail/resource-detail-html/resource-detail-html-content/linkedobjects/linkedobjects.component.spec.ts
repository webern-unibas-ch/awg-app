import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import Spy = jasmine.Spy;

import { click, clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ResourceDetailGroupedIncomingLinks, ResourceDetailIncomingLink } from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentLinkedobjectsComponent } from './linkedobjects.component';

// Helper functions
function expectClosedPanelBody(de: DebugElement, id: number, msg: string) {
    // Body debug elements
    getAndExpectDebugElementByCss(de, `div.card > div#incoming-linkgroup-${id} > div.card-body`, 0, 0, msg);
}
function expectOpenPanelBody(de: DebugElement, id: number, msg: string) {
    // Body debug elements
    getAndExpectDebugElementByCss(de, `div.card > div#incoming-linkgroup-${id} > div.card-body`, 1, 1, msg);
}

describe('ResourceDetailHtmlContentLinkedobjectsComponent (DONE)', () => {
    let component: ResourceDetailHtmlContentLinkedobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentLinkedobjectsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let totalNumberSpy: Spy;
    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    let expectedIncoming: ResourceDetailGroupedIncomingLinks[];
    let incomingLink1: ResourceDetailIncomingLink;
    let incomingLink2: ResourceDetailIncomingLink;
    let incomingLink3: ResourceDetailIncomingLink;
    const expectedTotalItems = 5;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbAccordionModule],
                declarations: [ResourceDetailHtmlContentLinkedobjectsComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentLinkedobjectsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        incomingLink1 = {
            id: '',
            value: 'testexpectedLinkValue1',
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

        expectedIncoming = [
            {
                restypeLabel: 'testkey1',
                links: [incomingLink1, incomingLink2]
            },
            { restypeLabel: 'testkey2', links: [incomingLink1, incomingLink2, incomingLink3] }
        ];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        totalNumberSpy = spyOnProperty(component, 'totalNumber', 'get').and.callThrough();
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        emitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `incomingGroups` inputs', () => {
            expect(component.incomingGroups).toBeUndefined('should be undefined');
        });

        it('should have totalNumber = 0', () => {
            expect(component.totalNumber).toBeDefined();
            expect(component.totalNumber).toBe(0, 'should be 0');
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-linked-obj', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj', 1, 1);
            });

            it('... should contain one header showing no number of items yet', () => {
                // Header debug element
                const headerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj > h5', 1, 1);
                // Size debug element
                getAndExpectDebugElementByCss(headerDes[0], 'span#awg-incoming-size', 0, 0);
            });

            it('... should contain one ngb-accordion without panels (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj > ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(emitSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.incomingGroups = expectedIncoming;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `incomingGroups` inputs', () => {
            expect(component.incomingGroups).toBeDefined('should be defined');
            expect(component.incomingGroups).toBe(expectedIncoming, `should be expectedIncoming: ${expectedIncoming}`);
        });

        it('... should have updated totalNumber with number of nested items in `incomingGroups`', fakeAsync(() => {
            expectSpyCall(totalNumberSpy, 1);

            expect(component.totalNumber).toBe(
                expectedTotalItems,
                `should be expectedTotalItems: ${expectedTotalItems}`
            );
        }));

        it('... should recalculate total number on input changes (second & more)', fakeAsync(() => {
            const newExpectedIncomingGroups: ResourceDetailGroupedIncomingLinks[] = [
                {
                    restypeLabel: 'testkey1',
                    links: [incomingLink1, incomingLink2, incomingLink3, incomingLink1]
                }
            ];
            const newExpectedTotalItems = newExpectedIncomingGroups[0].links.length;

            // Simulate the parent changing the input properties
            // No fixture detect changes needed because totalNumber is a getter()
            component.incomingGroups = newExpectedIncomingGroups;

            // Output has changed
            expect(component.totalNumber).toBe(
                newExpectedTotalItems,
                `should be newExpectedTotalItems: ${newExpectedTotalItems}`
            );
        }));

        describe('VIEW', () => {
            it('... should contain one header showing number of items', () => {
                // Size debug elements
                const sizeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-linked-obj > h5 > span#awg-incoming-size',
                    1,
                    1
                );
                const sizeEl = sizeDes[0].nativeElement;

                // Check size output
                expect(sizeEl.textContent).toBeDefined();
                expect(sizeEl.textContent).toContain(
                    component.totalNumber,
                    `should contain expectedTotalItems: ${component.totalNumber}`
                );
            });

            it('... should contain 2 ngb-panel elements (div.card) with header but no body (closed)', () => {
                // Panel debug elements
                const panelDes = getAndExpectDebugElementByCss(compDe, 'div.card', 2, 2);

                // Header debug elements
                getAndExpectDebugElementByCss(panelDes[0], 'div.card-header', 1, 1, 'in first panel');
                getAndExpectDebugElementByCss(panelDes[1], 'div.card-header', 1, 1, 'in second panel');

                // Body debug elements
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

            it('... should render incoming group length as badges in panel header (div.card-header)', () => {
                // Header debug element
                const panelHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 2, 2);
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

                const badge0El = badgeDes0[0].nativeElement;
                const badge1El = badgeDes1[0].nativeElement;

                expect(badge0El.textContent).toBeDefined();
                expect(badge0El.textContent).toContain(
                    expectedIncoming[0].links.length,
                    `should contain ${expectedIncoming[0].links.length}`
                );
                expect(badge1El.textContent).toBeDefined();
                expect(badge1El.textContent).toContain(
                    expectedIncoming[1].links.length,
                    `should contain ${expectedIncoming[1].links.length}`
                );
            });

            it('... should render restype label in panel header (div.card-header)', () => {
                // Header debug element
                const panelHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 2, 2);
                const labelDes0 = getAndExpectDebugElementByCss(
                    panelHeaderDes[0],
                    'span.awg-linked-obj-title',
                    1,
                    1,
                    'in first panel'
                );
                const labelDes1 = getAndExpectDebugElementByCss(
                    panelHeaderDes[1],
                    'span.awg-linked-obj-title',
                    1,
                    1,
                    'in second panel'
                );

                const label0El = labelDes0[0].nativeElement;
                const label1El = labelDes1[0].nativeElement;

                expect(label0El.textContent).toBeDefined();
                expect(label0El.textContent).toContain(
                    expectedIncoming[0].restypeLabel,
                    `should contain ${expectedIncoming[0].restypeLabel}`
                );
                expect(label0El.textContent).toBeDefined();
                expect(label1El.textContent).toContain(
                    expectedIncoming[1].restypeLabel,
                    `should contain ${expectedIncoming[1].restypeLabel}`
                );
            });

            it('... should toggle panels alternately on click', () => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 2, 2);

                // Button debug elements
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

                // Button native elements to click on
                const button0El = button0Des[0].nativeElement;
                const button1El = button1Des[0].nativeElement;

                // Both panels closed first by default
                expectClosedPanelBody(compDe, 0, 'closed (first panel)');
                expectClosedPanelBody(compDe, 1, 'closed (second panel)');

                // Click first panel
                click(button0El as HTMLElement);
                fixture.detectChanges();

                expectOpenPanelBody(compDe, 0, 'opened (first panel)');
                expectClosedPanelBody(compDe, 1, 'closed (second panel)');

                // Click first panel again
                click(button0El as HTMLElement);
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'closed (first panel)');
                expectClosedPanelBody(compDe, 1, 'closed (second panel)');

                // Click second panel
                click(button1El as HTMLElement);
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'closed (first panel)');
                expectOpenPanelBody(compDe, 1, 'opened (second panel)');

                // Click second panel again
                click(button1El as HTMLElement);
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'closed (first panel)');
                expectClosedPanelBody(compDe, 1, 'closed (second panel)');

                // Click first panel
                click(button0El as HTMLElement);
                fixture.detectChanges();

                expectOpenPanelBody(compDe, 0, 'opened (first panel)');
                expectClosedPanelBody(compDe, 1, 'closed (second panel)');

                // Click second panel
                click(button1El as HTMLElement);
                fixture.detectChanges();

                expectClosedPanelBody(compDe, 0, 'closed (first panel)');
                expectOpenPanelBody(compDe, 1, 'opened (second panel)');
            });

            describe('... should render panel content (div.card-body)', () => {
                let tableDes: DebugElement[];

                beforeEach(() => {
                    /**
                     * Click button to open first panel and get inner table
                     */

                    // Button debug elements
                    const buttonDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card > div.card-header button.btn-link',
                        2,
                        2
                    );

                    // First button's native element to click on
                    const button0El = buttonDes[0].nativeElement;

                    // Open first panel
                    click(button0El as HTMLElement);
                    fixture.detectChanges();

                    expectOpenPanelBody(compDe, 0, 'should have first panel opened');

                    // Table debug elements
                    tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                });

                it('... should render restype icon', () => {
                    const expectedIcon0 = expectedIncoming[0].links[0].restype.icon;
                    const expectedIcon1 = expectedIncoming[0].links[1].restype.icon;

                    const imgDes = getAndExpectDebugElementByCss(tableDes[0], 'a.awg-linked-obj-link > img', 2, 2);

                    const imgEl0 = imgDes[0].nativeElement;
                    const imgEl1 = imgDes[1].nativeElement;

                    expect(imgEl0.src).toBeDefined();
                    expect(imgEl0.src).toContain(expectedIcon0, `should contain expectedIcon0: ${expectedIcon0}`);

                    expect(imgEl1.src).toBeDefined();
                    expect(imgEl1.src).toContain(expectedIcon1, `should contain expectedIcon1: ${expectedIcon1}`);
                });

                it('... should render restpye id', () => {
                    const expectedId0 = expectedIncoming[0].links[0].id;
                    const expectedId1 = expectedIncoming[0].links[1].id;

                    const idDes = getAndExpectDebugElementByCss(
                        tableDes[0],
                        'a.awg-linked-obj-link > span.awg-linked-obj-link-id',
                        2,
                        2
                    );

                    const idEl0 = idDes[0].nativeElement;
                    const idEl1 = idDes[1].nativeElement;

                    expect(idEl0.textContent).toBeDefined();
                    expect(idEl0.textContent).toBe(expectedId0, `should be expectedId0: ${expectedId0}`);

                    expect(idEl1.textContent).toBeDefined();
                    expect(idEl1.textContent).toContain(expectedId1, `should contain expectedId1: ${expectedId1}`);
                });

                it('... should render link value', () => {
                    const expectedLinkValue0 = expectedIncoming[0].links[0].value;
                    const expectedLinkValue1 = expectedIncoming[0].links[1].value;

                    const linkValueDes = getAndExpectDebugElementByCss(
                        tableDes[0],
                        'a.awg-linked-obj-link > span.awg-linked-obj-link-value',
                        2,
                        2
                    );

                    const linkValueEl0 = linkValueDes[0].nativeElement;
                    const linkValueEl1 = linkValueDes[1].nativeElement;

                    expect(linkValueEl0.textContent).toBeDefined();
                    expect(linkValueEl0.textContent).toContain(
                        expectedLinkValue0,
                        `should contain expectedLinkValue0: ${expectedLinkValue0}`
                    );

                    expect(linkValueEl1.textContent).toBeDefined();
                    expect(linkValueEl1.textContent).toContain(
                        expectedLinkValue1,
                        `should contain expectedLinkValue1: ${expectedLinkValue1}`
                    );
                });
            });
        });

        describe('#navigateToResource', () => {
            beforeEach(fakeAsync(() => {
                // Open second panel

                // Button debug elements
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card > div.card-header button.btn-link',
                    2,
                    2
                );

                // Open first panel
                clickAndAwaitChanges(buttonDes[1], fixture);

                expectClosedPanelBody(compDe, 0, 'should have first panel closed');
                expectOpenPanelBody(compDe, 1, 'should have second panel opened');
            }));

            it('... should trigger on click', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                // No id
                expectSpyCall(navigateToResourceSpy, 1, '');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                // String
                expectSpyCall(navigateToResourceSpy, 2, '28');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                // String
                expectSpyCall(navigateToResourceSpy, 3, '330');
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // First anchor has no id

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.awg-linked-obj-table', 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(tableDes[0], 'a', 3, 3);

                // First anchor has no id, see above

                // Second anchor has @id: string
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(emitSpy, 1, '28');

                // Third anchor has @id: string
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(emitSpy, 2, '330');
            }));
        });
    });
});
