import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { expectClosedPanelBody, expectOpenPanelBody } from '@testing/accordion-panel-helper';
import { click, clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { ResourceDetailGroupedIncomingLinks, ResourceDetailIncomingLink } from '@awg-views/data-view/models';

import { ResourceDetailHtmlContentLinkedobjectsComponent } from './linkedobjects.component';

describe('ResourceDetailHtmlContentLinkedObjectsComponent (DONE)', () => {
    let component: ResourceDetailHtmlContentLinkedobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentLinkedobjectsComponent>;
    let compDe: DebugElement;

    let totalNumberSpy: Spy;
    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    let expectedIncoming: ResourceDetailGroupedIncomingLinks[];
    let incomingLink1: ResourceDetailIncomingLink;
    let incomingLink2: ResourceDetailIncomingLink;
    let incomingLink3: ResourceDetailIncomingLink;
    const expectedTotalItems = 5;
    const expectedFirstPanelId = 'incoming-linkgroup-0';
    const expectedSecondPanelId = 'incoming-linkgroup-1';

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule],
            declarations: [ResourceDetailHtmlContentLinkedobjectsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentLinkedobjectsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        incomingLink1 = {
            id: '',
            value: 'testexpectedLinkValue1',
            restype: { id: '1234', label: 'test-type1', icon: '/assets/img/logos/angular.png' },
        };
        incomingLink2 = {
            id: '28',
            value: 'testvalue2',
            restype: { id: '1235', label: 'test-type2', icon: '/assets/img/logos/snf.png' },
        };
        incomingLink3 = {
            id: '330',
            value: 'testvalue3',
            restype: { id: '1236', label: 'test-type3', icon: '/assets/img/logos/awg.png' },
        };

        expectedIncoming = [
            {
                restypeLabel: 'testkey1',
                links: [incomingLink1, incomingLink2],
            },
            { restypeLabel: 'testkey2', links: [incomingLink1, incomingLink2, incomingLink3] },
        ];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        totalNumberSpy = spyOnProperty(component, 'totalNumber', 'get').and.callThrough();
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        emitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `incomingGroups` inputs', () => {
            expect(component.incomingGroups).toBeUndefined();
        });

        it('... should have totalNumber = 0', () => {
            expectToBe(component.totalNumber, 0);
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

            it('... should contain one ngb-accordion without panels (div.accordion-item) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj > ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 0, 0, 'yet');
            });
        });

        describe('#navigateToResource()', () => {
            it('... should have a method `navigateToResource`', () => {
                expect(component.navigateToResource).toBeDefined();
            });

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

        it('... should have `incomingGroups` inputs', () => {
            expectToBe(component.incomingGroups, expectedIncoming);
        });

        it('... should have updated totalNumber with number of nested items in `incomingGroups`', fakeAsync(() => {
            expectSpyCall(totalNumberSpy, 1);

            expectToBe(component.totalNumber, expectedTotalItems);
        }));

        it('... should recalculate total number on input changes (second & more)', fakeAsync(() => {
            const newExpectedIncomingGroups: ResourceDetailGroupedIncomingLinks[] = [
                {
                    restypeLabel: 'testkey1',
                    links: [incomingLink1, incomingLink2, incomingLink3, incomingLink1],
                },
            ];
            const newExpectedTotalItems = newExpectedIncomingGroups[0].links.length;

            // Simulate the parent changing the input properties
            // No fixture detect changes needed because totalNumber is a getter()
            component.incomingGroups = newExpectedIncomingGroups;

            // Output has changed
            expectToBe(component.totalNumber, newExpectedTotalItems);
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
                expectToBe(sizeEl.textContent, component.totalNumber.toString());
            });

            it('... should contain 2 ngb-panel elements in accordion (div.accordion-item) with header but no body (closed)', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj > ngb-accordion', 1, 1);

                // Panel debug elements
                const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 2, 2);

                // Header debug elements
                getAndExpectDebugElementByCss(panelDes[0], 'div.accordion-header', 1, 1, 'in first panel');
                getAndExpectDebugElementByCss(panelDes[1], 'div.accordion-header', 1, 1, 'in second panel');

                // Body debug elements
                getAndExpectDebugElementByCss(panelDes[0], 'div.accordion-body', 0, 0, 'in first panel');
                getAndExpectDebugElementByCss(panelDes[1], 'div.accordion-body', 0, 0, 'in second panel');
            });

            it('... should render incoming group length as badges in panel header (div.accordion-header)', () => {
                // Header debug element
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                panelHeaderDes.forEach((panelHeaderDe, index) => {
                    const badgeDes = getAndExpectDebugElementByCss(
                        panelHeaderDe,
                        'span.badge',
                        1,
                        1,
                        `in panel ${index}`
                    );
                    const badgeEl = badgeDes[0].nativeElement;

                    expectToBe(badgeEl.textContent, expectedIncoming[index].links.length.toString());
                });
            });

            it('... should render restype label in panel header (div.accordion-header)', () => {
                // Header debug element
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                panelHeaderDes.forEach((panelHeaderDe, index) => {
                    const labelDes = getAndExpectDebugElementByCss(
                        panelHeaderDe,
                        'span.awg-linked-obj-title',
                        1,
                        1,
                        `in panel ${index}`
                    );
                    const labelEl = labelDes[0].nativeElement;

                    expectToBe(labelEl.textContent, expectedIncoming[index].restypeLabel);
                });
            });

            it('... should open and close panels on click', fakeAsync(() => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                // Button debug elements
                const button0Des = getAndExpectDebugElementByCss(
                    panelHeaderDes[0],
                    'button.accordion-button',
                    1,
                    1,
                    'in first panel'
                );
                const button1Des = getAndExpectDebugElementByCss(
                    panelHeaderDes[1],
                    'button.accordion-button',
                    1,
                    1,
                    'in second panel'
                );

                // Both panels closed first by default
                expectClosedPanelBody(compDe, expectedFirstPanelId, 'first panel closed');
                expectClosedPanelBody(compDe, expectedSecondPanelId, 'second panel closed');

                // Click first panel
                clickAndAwaitChanges(button0Des[0], fixture);

                expectOpenPanelBody(compDe, expectedFirstPanelId, 'first panel open');
                expectClosedPanelBody(compDe, expectedSecondPanelId, 'second panel closed');

                // Click first panel again
                clickAndAwaitChanges(button0Des[0], fixture);

                expectClosedPanelBody(compDe, expectedFirstPanelId, 'first panel closed');
                expectClosedPanelBody(compDe, expectedSecondPanelId, 'second panel closed');

                // Click second panel
                clickAndAwaitChanges(button1Des[0], fixture);

                expectClosedPanelBody(compDe, expectedFirstPanelId, 'first panel closed');
                expectOpenPanelBody(compDe, expectedSecondPanelId, 'second panel open');

                // Click second panel again
                clickAndAwaitChanges(button1Des[0], fixture);

                expectClosedPanelBody(compDe, expectedFirstPanelId, 'first panel closed');
                expectClosedPanelBody(compDe, expectedSecondPanelId, 'second panel closed');
            }));

            it('... should toggle panels alternately on click', fakeAsync(() => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                // Button debug elements
                const button0Des = getAndExpectDebugElementByCss(
                    panelHeaderDes[0],
                    'button.accordion-button',
                    1,
                    1,
                    'in first panel'
                );
                const button1Des = getAndExpectDebugElementByCss(
                    panelHeaderDes[1],
                    'button.accordion-button',
                    1,
                    1,
                    'in second panel'
                );

                // Both panels closed first by default
                expectClosedPanelBody(compDe, expectedFirstPanelId, 'closed (first panel)');
                expectClosedPanelBody(compDe, expectedSecondPanelId, 'closed (second panel)');

                // Click first panel
                clickAndAwaitChanges(button0Des[0], fixture);

                expectOpenPanelBody(compDe, expectedFirstPanelId, 'opened (first panel)');
                expectClosedPanelBody(compDe, expectedSecondPanelId, 'closed (second panel)');

                // Click second panel
                clickAndAwaitChanges(button1Des[0], fixture);

                expectClosedPanelBody(compDe, expectedFirstPanelId, 'closed (first panel)');
                expectOpenPanelBody(compDe, expectedSecondPanelId, 'opened (second panel)');
            }));

            describe('... should render panel content (div.accordion-body)', () => {
                let listDes: DebugElement[];

                beforeEach(async () => {
                    /**
                     * Click button to open first panel and get inner table
                     */

                    // Button debug elements
                    const buttonDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item > div.accordion-header button.accordion-button',
                        2,
                        2
                    );

                    // First button's native element to click on
                    const button0El = buttonDes[0].nativeElement;

                    // Open first panel
                    click(button0El as HTMLElement);
                    await detectChangesOnPush(fixture); // Replacement for fixture.detectChanges with OnPush

                    expectOpenPanelBody(compDe, expectedFirstPanelId, 'should have first panel opened');

                    // List debug elements
                    listDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-linked-obj-list', 1, 1);
                });

                it('... should render restype icon', () => {
                    const imgDes = getAndExpectDebugElementByCss(listDes[0], 'a.awg-linked-obj-link > img', 2, 2);

                    imgDes.forEach((imgDe, index) => {
                        const imgEl = imgDe.nativeElement;

                        expectToContain(imgEl.src, expectedIncoming[0].links[index].restype.icon);
                    });
                });

                it('... should render restpye id', () => {
                    const idDes = getAndExpectDebugElementByCss(
                        listDes[0],
                        'a.awg-linked-obj-link > span.awg-linked-obj-link-id',
                        2,
                        2
                    );

                    idDes.forEach((idDe, index) => {
                        const idEl = idDe.nativeElement;

                        expectToBe(idEl.textContent, expectedIncoming[0].links[index].id);
                    });
                });

                it('... should render link value', () => {
                    const linkValueDes = getAndExpectDebugElementByCss(
                        listDes[0],
                        'a.awg-linked-obj-link > span.awg-linked-obj-link-value',
                        2,
                        2
                    );

                    linkValueDes.forEach((linkValueDe, index) => {
                        const linkValueEl = linkValueDe.nativeElement;

                        expectToBe(linkValueEl.textContent, expectedIncoming[0].links[index].value);
                    });
                });
            });
        });

        describe('#navigateToResource()', () => {
            let listDes: DebugElement[];
            let listItemDes: DebugElement[];
            let anchorDes0: DebugElement[];
            let anchorDes1: DebugElement[];
            let anchorDes2: DebugElement[];

            beforeEach(fakeAsync(() => {
                // Button debug elements
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header button.accordion-button',
                    2,
                    2
                );

                // Open second panel
                clickAndAwaitChanges(buttonDes[1], fixture);

                expectClosedPanelBody(compDe, expectedFirstPanelId, 'should have first panel closed');
                expectOpenPanelBody(compDe, expectedSecondPanelId, 'should have second panel opened');

                listDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-linked-obj-list', 1, 1);
                listItemDes = getAndExpectDebugElementByCss(listDes[0], 'li', 3, 3);
                anchorDes0 = getAndExpectDebugElementByCss(listItemDes[0], 'a', 1, 1);
                anchorDes1 = getAndExpectDebugElementByCss(listItemDes[1], 'a', 1, 1);
                anchorDes2 = getAndExpectDebugElementByCss(listItemDes[2], 'a', 1, 1);
            }));

            it('... should trigger on click', fakeAsync(() => {
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes0[0], fixture);

                // No id
                expectSpyCall(navigateToResourceSpy, 1, '');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes1[0], fixture);

                // String
                expectSpyCall(navigateToResourceSpy, 2, '28');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes2[0], fixture);

                // String
                expectSpyCall(navigateToResourceSpy, 3, '330');
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                // First anchor has no id

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes0[0], fixture);

                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                // First anchor has no id, see above

                // Second anchor has @id: string
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes1[0], fixture);

                expectSpyCall(emitSpy, 1, '28');

                // Third anchor has @id: string
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes2[0], fixture);

                expectSpyCall(emitSpy, 2, '330');
            }));
        });
    });
});
