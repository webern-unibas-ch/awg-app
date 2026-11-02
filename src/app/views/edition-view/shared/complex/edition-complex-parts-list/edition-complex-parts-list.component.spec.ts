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

import { EditionOutlineComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionComplexPartsListComponent } from './edition-complex-parts-list.component';

describe('EditionComplexPartsListComponent (DONE)', () => {
    let component: EditionComplexPartsListComponent;
    let fixture: ComponentFixture<EditionComplexPartsListComponent>;
    let compDe: DebugElement;

    let expectedParts: EditionOutlineComplexItem[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionComplexPartsListComponent],
        })
            .overrideComponent(ConditionalLinkComponent, { set: { template: '<ng-content />', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data: only the second part of op12 is enabled
        const parts = EditionStateHelper.getOutlineComplexItem('op12').parts ?? [];
        expectedParts = parts.map((part, index) => ({ ...part, disabled: index !== 1 }));

        // Create component fixture
        fixture = TestBed.createComponent(EditionComplexPartsListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `parts`', () => {
            expectToBe(isSignal(component.parts), true);

            expect(() => component.parts()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one ol.awg-edition-complex-parts-list without items yet', () => {
                const olDes = getAndExpectDebugElementByCss(compDe, 'ol.awg-edition-complex-parts-list', 1, 1);

                getAndExpectDebugElementByCss(olDes[0], 'li', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('parts', expectedParts);
            fixture.detectChanges();
        });

        it('... should have input signal `parts` to hold the provided parts', () => {
            expectToEqual(component.parts(), expectedParts);
        });

        describe('VIEW', () => {
            const getLiDes = () =>
                getAndExpectDebugElementByCss(
                    compDe,
                    'ol.awg-edition-complex-parts-list > li',
                    expectedParts.length,
                    expectedParts.length
                );

            it('... should contain one ordered list with one item per part', () => {
                getAndExpectDebugElementByCss(compDe, 'ol.awg-edition-complex-parts-list', 1, 1);
                getLiDes();
            });

            it('... should display the full complex ids of the parts in their order', () => {
                const liEls: HTMLLIElement[] = getLiDes().map(liDe => liDe.nativeElement);

                liEls.forEach((liEl, index) => {
                    const expectedId = expectedParts[index].complex.complexId.full;

                    expectToContain(liEl.innerHTML, expectedId);
                });
            });

            it('... should contain one ConditionalLinkComponent (hollow) per part', () => {
                getLiDes().forEach(liDe => {
                    getAndExpectDebugElementByDirective(liDe, ConditionalLinkComponent, 1, 1);
                });
            });

            it('... should pass down `isClickable` and `targetRoute` to ConditionalLinkComponent (hollow)', () => {
                const linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    ConditionalLinkComponent,
                    expectedParts.length,
                    expectedParts.length
                );

                linkDes.forEach((linkDe, index) => {
                    const linkCmp = linkDe.injector.get(ConditionalLinkComponent);

                    expectToBe(linkCmp.isClickable(), !expectedParts[index].disabled);
                    expectToEqual(linkCmp.targetRoute(), [expectedParts[index].complex.baseRoute]);
                });
            });

            it('... should text-mute only the disabled parts', () => {
                const liEls: HTMLLIElement[] = getLiDes().map(liDe => liDe.nativeElement);

                liEls.forEach((liEl, index) => {
                    const isPartDisabled = expectedParts[index].disabled;
                    const isItemTextMuted = liEl.classList.contains('text-muted');

                    expectToBe(isItemTextMuted, isPartDisabled);
                });
            });
        });
    });
});
