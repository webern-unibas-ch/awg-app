import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { click } from '@testing/click-helper';
import { UnsupportedTypeResultsComponent } from './unsupported-type-results.component';

describe('UnsupportedTypeResultsComponent (DONE)', () => {
    let component: UnsupportedTypeResultsComponent;
    let fixture: ComponentFixture<UnsupportedTypeResultsComponent>;
    let compDe: DebugElement;

    let expectedQueryType: string;
    let expectedIsFullscreen: boolean;

    let isAccordionItemDisabledSpy: Spy;

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
            declarations: [UnsupportedTypeResultsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UnsupportedTypeResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedQueryType = 'ask';
        expectedIsFullscreen = false;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        isAccordionItemDisabledSpy = spyOn(component, 'isAccordionItemDisabled').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryType', () => {
            expect(component.queryType).toBeUndefined();
        });

        it('... should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and non-collapsible body yet in div.accordion', () => {
                // Div.accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
                // Header (div.accordion-header)
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                // Body (div.accordion-collapse)
                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.queryType = expectedQueryType;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `queryType` input', () => {
            expectToBe(component.queryType, expectedQueryType);
        });

        it('... should have `isFullScreen` input', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    // Div.accordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Div.accordion-item
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );
                    const itemHeaderEl = itemHeaderDes[0].nativeElement;

                    expect(itemHeaderEl.classList).not.toContain('collapsed');

                    // Body (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    // Item header button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'button#awg-graph-visualizer-unsupported-query-type-result-toggle',
                        1,
                        1
                    );
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Item body is closed
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    let itemBodyEl = itemBodyDes[0].nativeElement;

                    expect(itemBodyEl.classList).toContain('show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item is open
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expect(itemBodyEl.classList).not.toContain('show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expect(itemBodyEl.classList).toContain('show');
                });

                it('... should contain item body with two centered paragraphs', () => {
                    // Body debug elements
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    // Item body paragraphs
                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    pDes.forEach((pDe: DebugElement) => {
                        const pEl = pDe.nativeElement;
                        expect(pEl).toBeTruthy();
                        expect(pEl).toHaveClass('text-center');
                    });
                });

                it('... should display messages in item body paragraphs', () => {
                    // Body debug elements
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    // Item body paragraphs
                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    const pEl0 = pDes[0].nativeElement;
                    const pEl1 = pDes[1].nativeElement;

                    expectToContain(
                        pEl0.textContent.trim(),
                        `Sorry, but the requested SPARQL query type ${expectedQueryType.toUpperCase()} is not supported yet`
                    );
                    expectToContain(pEl1.textContent.trim(), 'Please try a CONSTRUCT or SELECT query instead.');
                });

                it('... should display correct queryType in first paragraph if input changes', () => {
                    // Body debug elements
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    // Item body paragraphs
                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    const pEl0 = pDes[0].nativeElement;

                    expectToContain(pEl0.textContent, expectedQueryType.toUpperCase());

                    // DESCRIBE
                    let newQueryType = 'describe';
                    component.queryType = newQueryType;
                    detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());

                    // COUNT
                    newQueryType = 'count';
                    component.queryType = newQueryType;
                    detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(() => {
                    // Set fullscreen flag to true
                    component.isFullscreen = true;
                    detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    // Div.accordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Item (div.accordion-item)
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );
                    const itemHeaderEl = itemHeaderDes[0].nativeElement;

                    expect(itemHeaderEl.classList).not.toContain('collapsed');

                    // Body (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    // Item header button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'button#awg-graph-visualizer-unsupported-query-type-result-toggle',
                        1,
                        1
                    );
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Item body does not closed
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl = itemBodyDes[0].nativeElement;

                    expect(itemBodyEl.classList).toContain('show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item is open
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expect(itemBodyEl.classList).toContain('show');
                });

                it('... should contain item body with two centered paragraphs', () => {
                    // Body debug elements
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    // Item body paragraphs
                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    pDes.forEach((pDe: DebugElement) => {
                        const pEl = pDe.nativeElement;
                        expect(pEl).toBeTruthy();
                        expect(pEl).toHaveClass('text-center');
                    });
                });

                it('... should display messages in item body paragraphs', () => {
                    // Body debug elements
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    // Item body paragraphs
                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    const pEl0 = pDes[0].nativeElement;
                    const pEl1 = pDes[1].nativeElement;

                    expectToContain(
                        pEl0.textContent.trim(),
                        `Sorry, but the requested SPARQL query type ${expectedQueryType.toUpperCase()} is not supported yet`
                    );
                    expectToContain(pEl1.textContent.trim(), 'Please try a CONSTRUCT or SELECT query instead.');
                });

                it('... should display correct queryType in first paragraph if input changes', () => {
                    // Body debug elements
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    // Item body paragraphs
                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    const pEl0 = pDes[0].nativeElement;

                    expectToContain(pEl0.textContent, expectedQueryType.toUpperCase());

                    // DESCRIBE
                    let newQueryType = 'describe';
                    component.queryType = newQueryType;
                    detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());

                    // COUNT
                    newQueryType = 'count';
                    component.queryType = newQueryType;
                    detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());
                });
            });
        });

        describe('#isAccordionItemDisabled()', () => {
            it('... should have a method `isAccordionItemDisabled`', () => {
                expect(component.isAccordionItemDisabled).toBeDefined();
            });

            it('... should be triggered from ngbAccordionItem', () => {
                expectSpyCall(isAccordionItemDisabledSpy, 2);
            });

            it('... should return false if isFullscreen is false', () => {
                expectToBe(component.isAccordionItemDisabled(), false);
            });

            it('... should return true if isFullscreen is true', () => {
                // Set fullscreen flag to true
                component.isFullscreen = true;

                expectToBe(component.isAccordionItemDisabled(), true);
            });
        });
    });
});
