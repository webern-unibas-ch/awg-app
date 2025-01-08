import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { expectCollapsedAccordionItem, expectOpenAccordionItem } from '@testing/accordion-panel-helper';
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
            restype: { id: '1235', label: 'test-type2', icon: '/assets/img/logos/snf.svg' },
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

            it('... should contain one heading showing no number of items yet', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'div.awg-linked-obj > h5', 1, 1);

                getAndExpectDebugElementByCss(hDes[0], 'span#awg-incoming-size', 0, 0);
            });

            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain no div.accordion-items yet', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 0, 0);
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
                const sizeEl: HTMLSpanElement = sizeDes[0].nativeElement;

                expectToBe(sizeEl.textContent, component.totalNumber.toString());
            });

            it('... should contain two div.accordion-item with header and closed body in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 2, 2);

                const itemHeaderDes1 = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div.accordion-header',
                    1,
                    1,
                    'in first item'
                );
                const itemHeaderDes2 = getAndExpectDebugElementByCss(
                    itemDes[1],
                    'div.accordion-header',
                    1,
                    1,
                    'in second item'
                );

                // Both items closed first by default
                expectCollapsedAccordionItem(itemHeaderDes1[0], 'first item closed');
                expectCollapsedAccordionItem(itemHeaderDes2[0], 'second item closed');
            });

            it('... should render incoming group length as badges in item header (div.accordion-header)', () => {
                const itemHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                itemHeaderDes.forEach((itemHeaderDe, index) => {
                    const badgeDes = getAndExpectDebugElementByCss(
                        itemHeaderDe,
                        'span.badge',
                        1,
                        1,
                        `in item ${index}`
                    );
                    const badgeEl: HTMLSpanElement = badgeDes[0].nativeElement;

                    expectToBe(badgeEl.textContent, expectedIncoming[index].links.length.toString());
                });
            });

            it('... should render restype label in item header (div.accordion-header)', () => {
                const itemHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                itemHeaderDes.forEach((itemHeaderDe, index) => {
                    const labelDes = getAndExpectDebugElementByCss(
                        itemHeaderDe,
                        'span.awg-linked-obj-title',
                        1,
                        1,
                        `in item ${index}`
                    );
                    const labelEl: HTMLSpanElement = labelDes[0].nativeElement;

                    expectToBe(labelEl.textContent, expectedIncoming[index].restypeLabel);
                });
            });

            it('... should open and close items on click', fakeAsync(() => {
                const itemHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                const btnDes0 = getAndExpectDebugElementByCss(
                    itemHeaderDes[0],
                    'button.accordion-button',
                    1,
                    1,
                    'in first item'
                );
                const btnDes1 = getAndExpectDebugElementByCss(
                    itemHeaderDes[1],
                    'button.accordion-button',
                    1,
                    1,
                    'in second item'
                );

                // Both items closed first by default
                expectCollapsedAccordionItem(itemHeaderDes[0], 'first item closed');
                expectCollapsedAccordionItem(itemHeaderDes[1], 'second item closed');

                // Click first item
                clickAndAwaitChanges(btnDes0[0], fixture);

                expectOpenAccordionItem(itemHeaderDes[0], 'first item open');
                expectCollapsedAccordionItem(itemHeaderDes[1], 'second item closed');

                // Click first item again
                clickAndAwaitChanges(btnDes0[0], fixture);

                expectCollapsedAccordionItem(itemHeaderDes[0], 'first item closed');
                expectCollapsedAccordionItem(itemHeaderDes[1], 'second item closed');

                // Click second item
                clickAndAwaitChanges(btnDes1[0], fixture);

                expectCollapsedAccordionItem(itemHeaderDes[0], 'first item closed');
                expectOpenAccordionItem(itemHeaderDes[1], 'second item open');

                // Click second item again
                clickAndAwaitChanges(btnDes1[0], fixture);

                expectCollapsedAccordionItem(itemHeaderDes[0], 'first item closed');
                expectCollapsedAccordionItem(itemHeaderDes[1], 'second item closed');
            }));

            it('... should toggle items alternately on click', fakeAsync(() => {
                const itemHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                const btnDes0 = getAndExpectDebugElementByCss(
                    itemHeaderDes[0],
                    'button.accordion-button',
                    1,
                    1,
                    'in first item'
                );
                const btnDes1 = getAndExpectDebugElementByCss(
                    itemHeaderDes[1],
                    'button.accordion-button',
                    1,
                    1,
                    'in second item'
                );

                // Both items closed first by default
                expectCollapsedAccordionItem(itemHeaderDes[0], 'closed (first item)');
                expectCollapsedAccordionItem(itemHeaderDes[1], 'closed (second item)');

                // Click first item
                clickAndAwaitChanges(btnDes0[0], fixture);

                expectOpenAccordionItem(itemHeaderDes[0], 'opened (first item)');
                expectCollapsedAccordionItem(itemHeaderDes[1], 'closed (second item)');

                // Click second item
                clickAndAwaitChanges(btnDes1[0], fixture);

                expectCollapsedAccordionItem(itemHeaderDes[0], 'closed (first item)');
                expectOpenAccordionItem(itemHeaderDes[1], 'opened (second item)');
            }));

            describe('... should render item content (div.accordion-body)', () => {
                let listDes: DebugElement[];

                beforeEach(async () => {
                    /**
                     * Click button to open first item and get inner table
                     */
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item > div.accordion-header',
                        2,
                        2
                    );

                    // Button debug elements
                    const btnDes0 = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'button.accordion-button',
                        1,
                        1,
                        'in first item'
                    );
                    getAndExpectDebugElementByCss(itemHeaderDes[1], 'button.accordion-button', 1, 1, 'in second item');

                    // First button's native element to click on
                    const btnEl0: HTMLButtonElement = btnDes0[0].nativeElement;

                    // Open first item
                    click(btnEl0 as HTMLElement);
                    await detectChangesOnPush(fixture); // Replacement for fixture.detectChanges with OnPush

                    expectOpenAccordionItem(itemHeaderDes[0], 'should have first item opened');

                    // List debug elements
                    listDes = getAndExpectDebugElementByCss(compDe, 'ul.awg-linked-obj-list', 1, 1);
                });

                it('... should render restype icon', () => {
                    const imgDes = getAndExpectDebugElementByCss(listDes[0], 'a.awg-linked-obj-link > img', 2, 2);

                    imgDes.forEach((imgDe, index) => {
                        const imgEl: HTMLImageElement = imgDe.nativeElement;

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
                        const idEl: HTMLSpanElement = idDe.nativeElement;

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
                        const linkValueEl: HTMLSpanElement = linkValueDe.nativeElement;

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
                // Header debug elements
                const itemHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.accordion-item > div.accordion-header',
                    2,
                    2
                );

                // Button debug elements
                getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1, 'in first item');
                const btnDes1 = getAndExpectDebugElementByCss(
                    itemHeaderDes[1],
                    'button.accordion-button',
                    1,
                    1,
                    'in second item'
                );

                // Open second item
                clickAndAwaitChanges(btnDes1[0], fixture);

                expectCollapsedAccordionItem(itemHeaderDes[0], 'should have first item closed');
                expectOpenAccordionItem(itemHeaderDes[1], 'should have second item opened');

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
