import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionOutlineComplexItem } from '../models/edition-outline.model';
import { EditionComplexCompositesComponent } from '../shared/complex/edition-complex-composites/edition-complex-composites.component';
import { EditionComplexPartsListComponent } from '../shared/complex/edition-complex-parts-list/edition-complex-parts-list.component';

import { EditionComplexPartsComponent } from './edition-complex-parts.component';

describe('EditionComplexPartsComponent (DONE)', () => {
    let component: EditionComplexPartsComponent;
    let fixture: ComponentFixture<EditionComplexPartsComponent>;
    let compDe: DebugElement;

    let expectedCompositeItem: EditionOutlineComplexItem;
    let expectedPartItem: EditionOutlineComplexItem;
    let expectedSingleItem: EditionOutlineComplexItem;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionComplexPartsComponent],
        })
            .overrideComponent(EditionComplexCompositesComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionComplexPartsListComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedCompositeItem = EditionStateHelper.getOutlineComplexItem('op12');
        expectedPartItem = EditionStateHelper.getOutlineComplexItem('m217');
        expectedSingleItem = EditionStateHelper.getOutlineComplexItem('m22');

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexPartsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `outlineComplexItem`', () => {
            expectToBe(isSignal(component.outlineComplexItem), true);

            expect(() => component.outlineComplexItem()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-edition-complex-parts yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex-parts', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const setOutlineComplexItem = (outlineComplexItem: EditionOutlineComplexItem): void => {
            fixture.componentRef.setInput('outlineComplexItem', outlineComplexItem);
            fixture.detectChanges();
        };

        it('... should have input signal `outlineComplexItem` to hold the provided outline complex item', () => {
            setOutlineComplexItem(expectedCompositeItem);

            expectToEqual(component.outlineComplexItem(), expectedCompositeItem);
        });

        describe('VIEW', () => {
            it('... should contain no div.awg-edition-complex-parts for a complex without parts and composite complexes', () => {
                setOutlineComplexItem(expectedSingleItem);

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex-parts', 0, 0);
            });

            describe('... for a composite complex', () => {
                beforeEach(() => {
                    setOutlineComplexItem(expectedCompositeItem);
                });

                it('... should contain a label and one EditionComplexPartsListComponent (hollow)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex-parts', 1, 1);
                    const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 1, 1);
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                    expectToBe(pEl.textContent?.trim(), 'Enthält:');
                    getAndExpectDebugElementByDirective(divDes[0], EditionComplexPartsListComponent, 1, 1);
                });

                it('... should pass down the parts to EditionComplexPartsListComponent (hollow)', () => {
                    const listDes = getAndExpectDebugElementByDirective(compDe, EditionComplexPartsListComponent, 1, 1);
                    const listCmp = listDes[0].injector.get(EditionComplexPartsListComponent);

                    expectToEqual(listCmp.parts(), expectedCompositeItem.parts);
                });

                it('... should contain no EditionComplexCompositesComponent', () => {
                    getAndExpectDebugElementByDirective(compDe, EditionComplexCompositesComponent, 0, 0);
                });
            });

            describe('... for a part of a composite complex', () => {
                beforeEach(() => {
                    setOutlineComplexItem(expectedPartItem);
                });

                it('... should pass down the composite complexes to EditionComplexCompositesComponent (hollow)', () => {
                    const compositesDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionComplexCompositesComponent,
                        1,
                        1
                    );
                    const compositesCmp = compositesDes[0].injector.get(EditionComplexCompositesComponent);

                    expectToEqual(compositesCmp.compositeComplexes(), expectedPartItem.compositeComplexes);
                    expectToBe(compositesCmp.isCompact(), false);
                });

                it('... should contain no label and no EditionComplexPartsListComponent', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-complex-parts > p', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, EditionComplexPartsListComponent, 0, 0);
                });
            });
        });
    });
});
