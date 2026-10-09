import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { Graph } from '@awg-views/edition-view/models/graph.model';
import { EditionComplexPlaceholderComponent } from '@awg-views/edition-view/shared/placeholder/edition-complex-placeholder.component';

import { EditionGraphDescriptionComponent } from './edition-graph-description.component';

describe('EditionGraphDescriptionComponent (DONE)', () => {
    let component: EditionGraphDescriptionComponent;
    let fixture: ComponentFixture<EditionGraphDescriptionComponent>;
    let compDe: DebugElement;

    let expectedComplex: EditionComplex;
    let expectedEmptyGraph: Graph;
    let expectedGraph: Graph;
    let expectedDescriptions: string[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionGraphDescriptionComponent],
        })
            .overrideComponent(EditionComplexPlaceholderComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedComplex = EditionStateHelper.getComplex('op25');
        expectedEmptyGraph = structuredClone(mockEditionData.mockGraphEmptyData.graph[0]);
        expectedDescriptions = ['Description 1', 'Description 2', 'Description 3'];
        expectedGraph = { ...structuredClone(expectedEmptyGraph), description: expectedDescriptions };

        // Create component fixture
        fixture = TestBed.createComponent(EditionGraphDescriptionComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `graph`', () => {
            expectToBe(isSignal(component.graph), true);

            expect(() => component.graph()).toThrow();
        });

        it('... should throw due to missing required input signal `editionComplex`', () => {
            expectToBe(isSignal(component.editionComplex), true);

            expect(() => component.editionComplex()).toThrow();
        });

        it('... should throw when accessing computed signal `hasPlaceholder` due to missing input', () => {
            expectToBe(isSignal(component.hasPlaceholder), true);

            expect(() => component.hasPlaceholder()).toThrow();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('graph', expectedGraph);
            fixture.componentRef.setInput('editionComplex', expectedComplex);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `graph` to hold the provided graph', () => {
            expectToEqual(component.graph(), expectedGraph);
        });

        it('... should have input signal `editionComplex` to hold the provided complex', () => {
            expectToEqual(component.editionComplex(), expectedComplex);
        });

        describe('... computed signal `hasPlaceholder`', () => {
            it('... should hold false if a description is given', () => {
                expectToBe(component.hasPlaceholder(), false);
            });

            it('... should hold false if only triples are given', async () => {
                const graphWithTriples = structuredClone(expectedEmptyGraph);
                graphWithTriples.rdfData.triples = 'example:test example:has example:Success';
                fixture.componentRef.setInput('graph', graphWithTriples);
                await detectChangesOnPush(fixture);

                expectToBe(component.hasPlaceholder(), false);
            });

            it('... should hold true if neither description nor triples are given', async () => {
                fixture.componentRef.setInput('graph', expectedEmptyGraph);
                await detectChangesOnPush(fixture);

                expectToBe(component.hasPlaceholder(), true);
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-graph-description', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-graph-description', 1, 1);
            });

            describe('... if a description is given', () => {
                it('... should contain no EditionComplexPlaceholderComponent (hollow)', () => {
                    getAndExpectDebugElementByDirective(compDe, EditionComplexPlaceholderComponent, 0, 0);
                });

                it('... should contain one paragraph with CompileHtmlDirective per description', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-description > p',
                        expectedDescriptions.length,
                        expectedDescriptions.length
                    );

                    pDes.forEach((pDe, index) => {
                        const directiveIns = pDe.injector.get(CompileHtmlDirective);

                        expectToBe(directiveIns.htmlContent(), expectedDescriptions[index]);
                    });
                });

                it('... should display the descriptions in the paragraphs', () => {
                    const pDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-graph-description > p',
                        expectedDescriptions.length,
                        expectedDescriptions.length
                    );

                    pDes.forEach((pDe, index) => {
                        const pEl: HTMLParagraphElement = pDe.nativeElement;

                        expectToBe(pEl.textContent, expectedDescriptions[index]);
                    });
                });
            });

            describe('... if neither description nor triples are given', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('graph', expectedEmptyGraph);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain no description paragraphs', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-graph-description > p', 0, 0);
                });

                it('... should contain one EditionComplexPlaceholderComponent (hollow)', () => {
                    getAndExpectDebugElementByDirective(compDe, EditionComplexPlaceholderComponent, 1, 1);
                });

                it('... should pass down `type` and `editionComplex` to EditionComplexPlaceholderComponent (hollow)', () => {
                    const placeholderDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionComplexPlaceholderComponent,
                        1,
                        1
                    );
                    const placeholderCmp = placeholderDes[0].injector.get(EditionComplexPlaceholderComponent);

                    expectToBe(placeholderCmp.type(), 'graph');
                    expectToEqual(placeholderCmp.editionComplex(), expectedComplex);
                });
            });
        });
    });
});
