import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

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
            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.queryType = expectedQueryType;

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
            it('... should contain one div.accordion with panel (div.accordion-item) header and open body', () => {
                // Div.accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                // Panel (div.accordion-item)
                const panelDes = getAndExpectDebugElementByCss(
                    accordionDes[0],
                    'div#awg-graph-visualizer-unsupported-query-type-result.accordion-item',
                    1,
                    1
                );
                // Header (div.accordion-header)
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                    1,
                    1
                );
                const panelHeaderEl = panelHeaderDes[0].nativeElement;

                expect(panelHeaderEl.classList).not.toContain('collapsed');

                // Body (div.accordion-collapse)
                const panelBodyDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                    1,
                    1
                );
                const panelBodyEl = panelBodyDes[0].nativeElement;

                expectToContain(panelBodyEl.classList, 'show');
            });

            it('... should display panel header button', () => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-header',
                    1,
                    1
                );

                // Panel header button
                const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);

                const btnEl = btnDes[0].nativeElement;

                // Check button content
                expectToBe(btnEl.textContent, 'Resultat');
            });

            it('... should contain panel body with two centered paragraphs', () => {
                // Body debug elements
                const panelBodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                    1,
                    1
                );

                // Panel body paragraphs
                const pDes = getAndExpectDebugElementByCss(panelBodyDes[0], 'p', 2, 2);

                pDes.forEach((pDe: DebugElement) => {
                    const pEl = pDe.nativeElement;
                    expect(pEl).toBeTruthy();
                    expect(pEl).toHaveClass('text-center');
                });
            });

            it('... should display messages in panel body paragraphs', () => {
                // Body debug elements
                const panelBodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                    1,
                    1
                );

                // Panel body paragraphs
                const pDes = getAndExpectDebugElementByCss(panelBodyDes[0], 'p', 2, 2);

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
                const panelBodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-collapse',
                    1,
                    1
                );

                // Panel body paragraphs
                const pDes = getAndExpectDebugElementByCss(panelBodyDes[0], 'p', 2, 2);

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

        describe('#isAccordionItemDisabled()', () => {
            it('... should have a method `isAccordionItemDisabled`', () => {
                expect(component.isAccordionItemDisabled).toBeDefined();
            });

            it('... should be triggered from ngbAccordionItem', () => {
                expectSpyCall(isAccordionItemDisabledSpy, 1);
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
