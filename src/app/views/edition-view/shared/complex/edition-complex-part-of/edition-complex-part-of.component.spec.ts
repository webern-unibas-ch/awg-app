import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { EditionOutlineCompositeComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionComplexPartOfComponent } from './edition-complex-part-of.component';

describe('EditionComplexPartOfComponent (DONE)', () => {
    let component: EditionComplexPartOfComponent;
    let fixture: ComponentFixture<EditionComplexPartOfComponent>;
    let compDe: DebugElement;

    let expectedCompositeComplexes: EditionOutlineCompositeComplexItem[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionComplexPartOfComponent],
        })
            .overrideComponent(ConditionalLinkComponent, { set: { template: '<ng-content />', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedCompositeComplexes = EditionStateHelper.getOutlineComplexItem('m217').compositeComplexes ?? [];

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexPartOfComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `compositeComplexes`', () => {
            expectToBe(isSignal(component.compositeComplexes), true);

            expect(() => component.compositeComplexes()).toThrow();
        });

        it('... should have input signal `isCompact` to hold false', () => {
            expectToBe(isSignal(component.isCompact), true);

            expectToBe(component.isCompact(), false);
        });

        describe('VIEW', () => {
            it('... should contain no p.awg-edition-complex-part-of yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-part-of', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const setCompositeComplexes = (compositeComplexes: EditionOutlineCompositeComplexItem[]): void => {
            fixture.componentRef.setInput('compositeComplexes', compositeComplexes);
            fixture.detectChanges();
        };

        beforeEach(() => {
            setCompositeComplexes(expectedCompositeComplexes);
        });

        it('... should have input signal `compositeComplexes` to hold the provided composite complexes', () => {
            expectToEqual(component.compositeComplexes(), expectedCompositeComplexes);
        });

        it('... should have input signal `isCompact` to hold the provided flag', () => {
            fixture.componentRef.setInput('isCompact', true);
            fixture.detectChanges();

            expectToBe(component.isCompact(), true);
        });

        describe('VIEW', () => {
            const getPDes = () =>
                getAndExpectDebugElementByCss(
                    compDe,
                    'p.awg-edition-complex-part-of',
                    expectedCompositeComplexes.length,
                    expectedCompositeComplexes.length
                );
            const getLinkDes = () => getAndExpectDebugElementByDirective(getPDes()[0], ConditionalLinkComponent, 1, 1);
            const getLinkCmp = (): ConditionalLinkComponent => getLinkDes()[0].injector.get(ConditionalLinkComponent);

            it('... should contain one paragraph per composite complex', () => {
                getPDes();
            });

            it('... should pass down `isClickable` and `targetRoute` to ConditionalLinkComponent (hollow)', () => {
                const composite = expectedCompositeComplexes[0];

                const linkCmp = getLinkCmp();

                expectToBe(linkCmp.isClickable(), true);
                expectToEqual(linkCmp.targetRoute(), [composite.complex.baseRoute]);
            });

            it('... should label the composite complex with its full complex id', () => {
                const expectedId = expectedCompositeComplexes[0].complex.complexId.full;

                const labelDes = getAndExpectDebugElementByCss(getLinkDes()[0], 'span', 1, 1);
                const labelEl: HTMLSpanElement = labelDes[0].nativeElement;

                expectToBe(labelEl.innerHTML, expectedId);
            });

            it('... should label the composite complex with its short complex id if `isCompact` is true', () => {
                fixture.componentRef.setInput('isCompact', true);
                fixture.detectChanges();

                const expectedId = expectedCompositeComplexes[0].complex.complexId.short;

                const labelDes = getAndExpectDebugElementByCss(getLinkDes()[0], 'span', 1, 1);
                const labelEl: HTMLSpanElement = labelDes[0].nativeElement;

                expectToBe(labelEl.innerHTML, expectedId);
            });

            it('... should display the part number', () => {
                const expectedPartNumber = `(Nr. ${expectedCompositeComplexes[0].partNumber})`;

                const pEl: HTMLParagraphElement = getPDes()[0].nativeElement;

                expectToContain(pEl.textContent, expectedPartNumber);
            });

            it('... should pass down `isClickable` = false for a disabled composite complex', () => {
                const disabledCompositeComplexes = expectedCompositeComplexes.map(composite => ({
                    ...composite,
                    disabled: true,
                }));

                setCompositeComplexes(disabledCompositeComplexes);

                expectToBe(getLinkCmp().isClickable(), false);
            });
        });
    });
});
