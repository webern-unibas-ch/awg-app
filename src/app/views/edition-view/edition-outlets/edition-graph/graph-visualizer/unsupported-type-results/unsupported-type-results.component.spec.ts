import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement, NgModule } from '@angular/core';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { UnsupportedTypeResultsComponent } from './unsupported-type-results.component';

describe('UnsupportedTypeResultsComponent (DONE)', () => {
    let component: UnsupportedTypeResultsComponent;
    let fixture: ComponentFixture<UnsupportedTypeResultsComponent>;
    let compDe: DebugElement;

    let expectedQueryType: string;

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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have queryType', () => {
            expect(component.queryType).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.accordion-item) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 0, 0, 'yet');
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

        it('should have `queryType` input', () => {
            expect(component.queryType).toBeDefined();
            expect(component.queryType).withContext(`should be ${expectedQueryType}`).toBe(expectedQueryType);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with panel (div.accordion-item) header and body', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel (div.card)
                const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1); // Panel (div.card)
                // Header
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-unsupported-query-type-result-header.accordion-header',
                    1,
                    1
                ); // Panel (div.card)
                // Body
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-body',
                    1,
                    1
                );
            });

            it('... should display panel header button', () => {
                // Panel header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result-header > button',
                    1,
                    1
                );

                const btnEl = btnDes[0].nativeElement;

                // Check button content
                expect(btnEl.textContent).toBeTruthy();
                expect(btnEl.textContent).withContext('should contain Resultat').toContain('Resultat');
            });

            it('... should contain panel body with two centered paragraphs', () => {
                // Panel body paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-body > p',
                    2,
                    2
                );

                const pEl0 = pDes[0].nativeElement;
                const pEl1 = pDes[1].nativeElement;

                expect(pEl0).toHaveClass('text-center');
                expect(pEl1).toHaveClass('text-center');
            });

            it('... should display messages in panel body paragraphs', () => {
                // Panel body paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-body > p',
                    2,
                    2
                );

                const pEl0 = pDes[0].nativeElement;
                const pEl1 = pDes[1].nativeElement;

                expect(pEl0.textContent).toBeTruthy();
                expect(pEl0.textContent.trim())
                    .withContext(
                        `should contain 'Sorry, but the requested SPARQL query type ${expectedQueryType.toUpperCase()} is not supported yet'`
                    )
                    .toContain(
                        `Sorry, but the requested SPARQL query type ${expectedQueryType.toUpperCase()} is not supported yet`
                    );

                expect(pEl1.textContent).toBeTruthy();
                expect(pEl1.textContent.trim())
                    .withContext(`should be 'Please try a CONSTRUCT or SELECT query instead.'`)
                    .toBe('Please try a CONSTRUCT or SELECT query instead.');
            });

            it('... should display correct queryType if input changes', () => {
                // Panel body paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-unsupported-query-type-result > div.accordion-body > p',
                    2,
                    2
                );
                const pEl0 = pDes[0].nativeElement;

                expect(pEl0.textContent).toBeTruthy();
                expect(pEl0.textContent)
                    .withContext(`should contain ${expectedQueryType.toUpperCase()}`)
                    .toContain(expectedQueryType.toUpperCase());

                // DESCRIBE
                let newQueryType = 'describe';
                component.queryType = newQueryType;
                detectChangesOnPush(fixture);

                expect(pEl0.textContent).toBeTruthy();
                expect(pEl0.textContent)
                    .withContext(`should contain ${newQueryType.toUpperCase()}`)
                    .toContain(newQueryType.toUpperCase());

                // COUNT
                newQueryType = 'count';
                component.queryType = newQueryType;
                detectChangesOnPush(fixture);

                expect(pEl0.textContent)
                    .withContext(`should contain ${newQueryType.toUpperCase()}`)
                    .toContain(newQueryType.toUpperCase());
            });
        });
    });
});
