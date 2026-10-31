import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionOutlineComplexItem } from '../models/edition-outline.model';

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
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data: the second part of op12 is enabled to test the links
        const compositeItem = EditionStateHelper.getOutlineComplexItem('op12');
        const parts = compositeItem.parts ?? [];
        expectedCompositeItem = {
            ...compositeItem,
            parts: parts.map((part, index) => ({ ...part, disabled: index !== 1 })),
        };
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

                it('... should contain one ordered list with one item per part', () => {
                    const parts = expectedCompositeItem.parts ?? [];

                    const olDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-complex-parts > ol.awg-edition-complex-parts-list',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(olDes[0], 'li', parts.length, parts.length);
                });

                it('... should display the full complex ids of the parts in their order', () => {
                    const parts = expectedCompositeItem.parts ?? [];

                    const liDes = getAndExpectDebugElementByCss(compDe, 'ol > li', parts.length, parts.length);
                    const liEls: HTMLLIElement[] = liDes.map(liDe => liDe.nativeElement);

                    liEls.forEach((liEl, index) => {
                        expectToBe(liEl.innerHTML.includes(parts[index].complex.complexId.full), true);
                    });
                });

                it('... should link only the enabled parts to their complexes', () => {
                    const enabledPart = (expectedCompositeItem.parts ?? [])[1];

                    const linkDes = getAndExpectDebugElementByCss(compDe, 'ol > li > a', 1, 1);
                    const linkEl: HTMLAnchorElement = linkDes[0].nativeElement;

                    expectToBe(linkEl.getAttribute('href'), enabledPart.complex.baseRoute);
                });

                it('... should contain no paragraph for composite complexes', () => {
                    getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-parts-composite', 0, 0);
                });
            });

            describe('... for a part of a composite complex', () => {
                beforeEach(() => {
                    setOutlineComplexItem(expectedPartItem);
                });

                it('... should contain one paragraph per composite complex', () => {
                    const composites = expectedPartItem.compositeComplexes ?? [];

                    getAndExpectDebugElementByCss(
                        compDe,
                        'p.awg-edition-complex-parts-composite',
                        composites.length,
                        composites.length
                    );
                });

                it('... should link the enabled composite complex and display the part number', () => {
                    const composite = (expectedPartItem.compositeComplexes ?? [])[0];

                    const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-parts-composite', 1, 1);
                    const pEl: HTMLParagraphElement = pDes[0].nativeElement;
                    const linkDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
                    const linkEl: HTMLAnchorElement = linkDes[0].nativeElement;

                    expectToBe(linkEl.getAttribute('href'), composite.complex.baseRoute);
                    expectToBe(pEl.textContent?.includes(`(Nr. ${composite.partNumber})`), true);
                });

                it('... should display a disabled composite complex without link', () => {
                    const composites = expectedPartItem.compositeComplexes ?? [];
                    setOutlineComplexItem({
                        ...expectedPartItem,
                        compositeComplexes: composites.map(composite => ({ ...composite, disabled: true })),
                    });

                    const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-parts-composite', 1, 1);

                    getAndExpectDebugElementByCss(pDes[0], 'a', 0, 0);
                    getAndExpectDebugElementByCss(pDes[0], 'span', 1, 1);
                });

                it('... should contain no ordered list of parts', () => {
                    getAndExpectDebugElementByCss(compDe, 'ol.awg-edition-complex-parts-list', 0, 0);
                });
            });
        });
    });
});
