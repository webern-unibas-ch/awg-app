import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import type { Quad } from '@rdfjs/types';
import { DataFactory } from 'n3';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { SparqlConstructResult, SparqlSelectResult } from '../../models/sparql-result.model';

import { GraphResultsStatusComponent } from './graph-results-status.component';

const { namedNode, quad } = DataFactory;

describe('GraphResultsStatusComponent (DONE)', () => {
    let component: GraphResultsStatusComponent;
    let fixture: ComponentFixture<GraphResultsStatusComponent>;
    let compDe: DebugElement;

    let expectedConstructResult: SparqlConstructResult;
    let expectedSelectResult: SparqlSelectResult;
    let expectedQueryTime: number;

    const getStatusEl = (): HTMLParagraphElement =>
        getAndExpectDebugElementByCss(compDe, 'p.awg-graph-results-status', 1, 1)[0].nativeElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GraphResultsStatusComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        const EX = 'http://example.org/';
        expectedConstructResult = {
            kind: 'construct',
            quads: [
                quad(namedNode(`${EX}a`), namedNode(`${EX}p`), namedNode(`${EX}b`)) as Quad,
                quad(namedNode(`${EX}b`), namedNode(`${EX}p`), namedNode(`${EX}c`)) as Quad,
            ],
            prefixes: {},
        };
        expectedSelectResult = {
            kind: 'select',
            variables: ['s'],
            bindings: [{ s: namedNode(`${EX}a`) }, { s: namedNode(`${EX}b`) }, { s: namedNode(`${EX}c`) }],
            prefixes: {},
        };
        expectedQueryTime = 34.4;

        // Create component fixture
        fixture = TestBed.createComponent(GraphResultsStatusComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `queryResult` to hold undefined initially', () => {
            expectToBe(isSignal(component.queryResult), true);
            expect(component.queryResult()).toBeUndefined();
        });

        it('... should have input signal `queryTime` to hold 0 initially', () => {
            expectToBe(isSignal(component.queryTime), true);
            expectToBe(component.queryTime(), 0);
        });

        it('... should have computed signal `statusText` to hold the running message', () => {
            expectToBe(component.statusText(), 'Abfrage läuft …');
        });

        describe('VIEW', () => {
            it('... should contain one paragraph with role `status`', () => {
                expectToBe(getStatusEl().getAttribute('role'), 'status');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('queryResult', expectedSelectResult);
            fixture.componentRef.setInput('queryTime', expectedQueryTime);

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `queryResult` to hold the provided query result', () => {
            expectToBe(component.queryResult(), expectedSelectResult);
        });

        it('... should have input signal `queryTime` to hold the provided query time', () => {
            expectToBe(component.queryTime(), expectedQueryTime);
        });

        it('... should have computed signal `statusText` to hold the number of bindings and the duration for select results', () => {
            expectToBe(component.statusText(), '3 Treffer in 34 ms');
        });

        it('... should have computed signal `statusText` to hold the number of triples and the duration for construct results', () => {
            fixture.componentRef.setInput('queryResult', expectedConstructResult);

            expectToBe(component.statusText(), '2 Tripel in 34 ms');
        });

        it('... should have computed signal `statusText` to hold an empty string for unsupported results', () => {
            fixture.componentRef.setInput('queryResult', { kind: 'unsupported', queryType: 'ask' });

            expectToBe(component.statusText(), '');
        });

        it('... should have computed signal `statusText` to hold the running message while the query is running', () => {
            fixture.componentRef.setInput('queryResult', undefined);

            expectToBe(component.statusText(), 'Abfrage läuft …');
        });

        describe('VIEW', () => {
            it('... should display `statusText` in the paragraph', () => {
                expectToBe(getStatusEl().textContent, '3 Treffer in 34 ms');
            });

            it('... should display a changed `statusText` in the paragraph', async () => {
                fixture.componentRef.setInput('queryResult', expectedConstructResult);
                await detectChangesOnPush(fixture);

                expectToBe(getStatusEl().textContent, '2 Tripel in 34 ms');
            });
        });

        describe('METHODS', () => {
            describe('#_formatDuration()', () => {
                it('... should have a method `_formatDuration`', () => {
                    expect(component['_formatDuration']).toBeDefined();
                });

                it('... should format durations below one second as rounded milliseconds', () => {
                    expectToBe(component['_formatDuration'](0), '0 ms');
                    expectToBe(component['_formatDuration'](34.5), '35 ms');
                    expectToBe(component['_formatDuration'](999.4), '999 ms');
                    expectToBe(component['_formatDuration'](999.6), '1 s');
                });

                it('... should format durations from one second as seconds with one decimal place', () => {
                    expectToBe(component['_formatDuration'](1000), '1 s');
                    expectToBe(component['_formatDuration'](1240), '1,2 s');
                    expectToBe(component['_formatDuration'](12345), '12,3 s');
                });
            });
        });
    });
});
