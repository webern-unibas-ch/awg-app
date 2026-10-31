import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionOutlineCompositeComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionComplexCompositesComponent } from './edition-complex-composites.component';

describe('EditionComplexCompositesComponent (DONE)', () => {
    let component: EditionComplexCompositesComponent;
    let fixture: ComponentFixture<EditionComplexCompositesComponent>;
    let compDe: DebugElement;

    let expectedCompositeComplexes: EditionOutlineCompositeComplexItem[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionComplexCompositesComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedCompositeComplexes = EditionStateHelper.getOutlineComplexItem('m217').compositeComplexes ?? [];

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexCompositesComponent);
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
            it('... should contain no p.awg-edition-complex-composite yet', () => {
                getAndExpectDebugElementByCss(compDe, 'p.awg-edition-complex-composite', 0, 0);
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
                    'p.awg-edition-complex-composite',
                    expectedCompositeComplexes.length,
                    expectedCompositeComplexes.length
                );

            it('... should contain one paragraph per composite complex', () => {
                getPDes();
            });

            it('... should link the enabled composite complex with its full complex id', () => {
                const composite = expectedCompositeComplexes[0];

                const linkDes = getAndExpectDebugElementByCss(getPDes()[0], 'a', 1, 1);
                const linkEl: HTMLAnchorElement = linkDes[0].nativeElement;

                expectToBe(linkEl.getAttribute('href'), composite.complex.baseRoute);
                expectToBe(linkEl.innerHTML, composite.complex.complexId.full);
            });

            it('... should label the composite complex with its short complex id if `isCompact` is true', () => {
                fixture.componentRef.setInput('isCompact', true);
                fixture.detectChanges();

                const linkDes = getAndExpectDebugElementByCss(getPDes()[0], 'a', 1, 1);
                const linkEl: HTMLAnchorElement = linkDes[0].nativeElement;

                expectToBe(linkEl.innerHTML, expectedCompositeComplexes[0].complex.complexId.short);
            });

            it('... should display the part number', () => {
                const pEl: HTMLParagraphElement = getPDes()[0].nativeElement;

                expectToBe(pEl.textContent?.includes(`(Nr. ${expectedCompositeComplexes[0].partNumber})`), true);
            });

            it('... should display a disabled composite complex without link', () => {
                setCompositeComplexes(expectedCompositeComplexes.map(composite => ({ ...composite, disabled: true })));

                const pDes = getPDes();

                getAndExpectDebugElementByCss(pDes[0], 'a', 0, 0);
                getAndExpectDebugElementByCss(pDes[0], 'span', 1, 1);
            });
        });
    });
});
