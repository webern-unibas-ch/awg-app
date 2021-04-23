import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { JsonPipe } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';

import { EMPTY, Observable, of as observableOf } from 'rxjs';
import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { customJasmineMatchers } from '@testing/custom-matchers';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { Triple } from '../models';

import { SelectResultsComponent } from './select-results.component';

// Mock components
@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('SelectResultsComponent', () => {
    let component: SelectResultsComponent;
    let fixture: ComponentFixture<SelectResultsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    const jsonPipe = new JsonPipe();

    let expectedTriples: Triple[];
    let expectedQueryResult: Observable<Triple[]>;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbAccordionWithConfigModule],
                declarations: [SelectResultsComponent, TwelveToneSpinnerStubComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        // Add custom jasmine matchers (ToHaveCssClass)
        jasmine.addMatchers(customJasmineMatchers);

        fixture = TestBed.createComponent(SelectResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedTriples = [
            {
                subject: { nominalValue: 'example:Test' },
                predicate: { nominalValue: 'example:has' },
                object: { nominalValue: 'example:Success' }
            }
        ];
        expectedQueryResult = observableOf(expectedTriples);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryResult', () => {
            expect(component.queryResult).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.queryResult = expectedQueryResult;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `queryResult` input', () => {
            expect(component.queryResult).toBeDefined('should be defined');
            expect(component.queryResult).toEqual(expectedQueryResult, `should equal ${expectedQueryResult}`);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with panel (div.card) header and body', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel (div.card)
                const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1); // Panel (div.card)
                // Header
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-select-result-header.card-header',
                    1,
                    1
                ); // Panel (div.card)
                // Body
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-select-result > div.card-body',
                    1,
                    1
                );
            });

            it('... should display panel header button', () => {
                // Panel header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-result-header > button',
                    1,
                    1
                );

                const btnEl = btnDes[0].nativeElement;

                // Check button content
                expect(btnEl.textContent).toBeTruthy();
                expect(btnEl.textContent).toContain('Resultat', 'should contain Resultat');
            });

            it('... should contain panel body with centered paragraph and result div', () => {
                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-result > div.card-body',
                    1,
                    1
                );

                // Panel body content paragraph
                const pDes = getAndExpectDebugElementByCss(bodyDes[0], 'p', 1, 1);
                const pEl = pDes[0].nativeElement;

                expect(pEl).toHaveCssClass('text-center');

                // Panel body content div
                const divDes = getAndExpectDebugElementByCss(bodyDes[0], 'div', 1, 1);
            });

            it('... should display message in first panel body paragraph', () => {
                // Panel body paragraph
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-result > div.card-body > p',
                    1,
                    1
                );
                const pEl = pDes[0].nativeElement;

                expect(pEl.textContent).toBeTruthy();
                expect(pEl.textContent).toContain('Got a SELECT request');
            });

            it('... should display json-piped queryResults in panel body div', () => {
                // Panel body div
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-result > div.card-body > div',
                    1,
                    1
                );
                const divEl = divDes[0].nativeElement;

                expect(divEl.textContent).toBeTruthy();
                expect(divEl.textContent).toContain(jsonPipe.transform(expectedTriples));
            });

            it('... should display additional message in second panel body paragraph if no results', () => {
                // Mock empty result
                component.queryResult = EMPTY;
                detectChangesOnPush(fixture);

                // Panel body paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-result > div.card-body > p',
                    2,
                    2
                );
                const pEl1 = pDes[1].nativeElement;

                expect(pEl1.textContent).toBeTruthy();
                expect(pEl1.textContent).toContain('No result to show');
            });
        });
    });
});
