import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, expectToContain, expectToNotContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { UnsupportedTypeResultsComponent } from './unsupported-type-results.component';

describe('UnsupportedTypeResultsComponent (DONE)', () => {
    let component: UnsupportedTypeResultsComponent;
    let fixture: ComponentFixture<UnsupportedTypeResultsComponent>;
    let compDe: DebugElement;

    let expectedQueryType: string;
    let expectedIsFullscreen: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbAccordionModule, UnsupportedTypeResultsComponent],
        }).compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        // Test data
        expectedQueryType = 'ask';
        expectedIsFullscreen = false;

        // Create component fixture
        fixture = TestBed.createComponent(UnsupportedTypeResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `queryType` to hold an empty string initially', () => {
            expectToBe(isSignal(component.queryType), true);
            expectToBe(component.queryType(), '');
        });

        it('... should have input signal `isFullscreenMode` to hold false initially', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);
            expectToBe(component.isFullscreenMode(), false);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and non-collapsible body yet in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('queryType', expectedQueryType);
            fixture.componentRef.setInput('isFullscreenMode', expectedIsFullscreen);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `queryType` to hold the provided query type', () => {
            expectToBe(component.queryType(), expectedQueryType);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result.accordion-item',
                        1,
                        1
                    );
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );
                    const itemHeaderEl: HTMLDivElement = itemHeaderDes[0].nativeElement;

                    expectToNotContain(itemHeaderEl.classList, 'collapsed');

                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'button#awg-graph-visualizer-unsupported-query-type-result-toggle',
                        1,
                        1
                    );

                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item is open
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToNotContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should contain item body with two centered paragraphs', () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    pDes.forEach((pDe: DebugElement) => {
                        const pEl: HTMLParagraphElement = pDe.nativeElement;

                        expectToContain(pEl.classList, 'text-center');
                    });
                });

                it('... should display messages in item body paragraphs', () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);
                    const pEl0: HTMLParagraphElement = pDes[0].nativeElement;
                    const pEl1: HTMLParagraphElement = pDes[1].nativeElement;

                    expectToContain(
                        pEl0.textContent.trim(),
                        `Sorry, but the requested SPARQL query type ${expectedQueryType.toUpperCase()} is not supported yet`
                    );
                    expectToContain(pEl1.textContent.trim(), 'Please try a CONSTRUCT or SELECT query instead.');
                });

                it('... should display correct queryType in first paragraph if input changes', async () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);
                    const pEl0: HTMLParagraphElement = pDes[0].nativeElement;

                    expectToContain(pEl0.textContent, expectedQueryType.toUpperCase());

                    // DESCRIBE
                    let newQueryType = 'describe';
                    fixture.componentRef.setInput('queryType', newQueryType);
                    await detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());

                    // COUNT
                    newQueryType = 'count';
                    fixture.componentRef.setInput('queryType', newQueryType);
                    await detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    // Set fullscreen flag to true
                    fixture.componentRef.setInput('isFullscreenMode', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result.accordion-item',
                        1,
                        1
                    );
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );
                    const itemHeaderEl: HTMLDivElement = itemHeaderDes[0].nativeElement;

                    expectToNotContain(itemHeaderEl.classList, 'collapsed');

                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(
                        itemHeaderDes[0],
                        'button#awg-graph-visualizer-unsupported-query-type-result-toggle',
                        1,
                        1
                    );

                    // Item body does not closed
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item is open
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should contain item body with two centered paragraphs', () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);

                    pDes.forEach((pDe: DebugElement) => {
                        const pEl: HTMLParagraphElement = pDe.nativeElement;

                        expectToContain(pEl.classList, 'text-center');
                    });
                });

                it('... should display messages in item body paragraphs', () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);
                    const pEl0: HTMLParagraphElement = pDes[0].nativeElement;
                    const pEl1: HTMLParagraphElement = pDes[1].nativeElement;

                    expectToContain(
                        pEl0.textContent.trim(),
                        `Sorry, but the requested SPARQL query type ${expectedQueryType.toUpperCase()} is not supported yet`
                    );
                    expectToContain(pEl1.textContent.trim(), 'Please try a CONSTRUCT or SELECT query instead.');
                });

                it('... should display correct queryType in first paragraph if input changes', async () => {
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                        1,
                        1
                    );

                    const pDes = getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);
                    const pEl0: HTMLParagraphElement = pDes[0].nativeElement;

                    expectToContain(pEl0.textContent, expectedQueryType.toUpperCase());

                    // DESCRIBE
                    let newQueryType = 'describe';
                    fixture.componentRef.setInput('queryType', newQueryType);
                    await detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());

                    // COUNT
                    newQueryType = 'count';
                    fixture.componentRef.setInput('queryType', newQueryType);
                    await detectChangesOnPush(fixture);

                    expectToContain(pEl0.textContent, newQueryType.toUpperCase());
                });
            });
        });
    });
});
