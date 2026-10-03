import { Component, DebugElement, isSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionSheetFacetItemLinkDirective } from './edition-sheet-facet-item-link.directive';

// Test host component
@Component({
    template: `<a class="test-link" [awgEditionSheetFacetItemLink]="sheetIds()" [isActive]="isActive()">Test link</a>`,
    imports: [EditionSheetFacetItemLinkDirective],
})
class TestEditionSheetFacetItemLinkComponent {
    sheetIds = signal<SheetClickEvent>({ complexId: '', sheetId: 'test-1' });
    isActive = signal(false);
}

describe('EditionSheetFacetItemLinkDirective (DONE)', () => {
    let hostComponent: TestEditionSheetFacetItemLinkComponent;
    let fixture: ComponentFixture<TestEditionSheetFacetItemLinkComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;
    let serviceNavigateToSvgSheetSpy: Spy;
    let selectSpy: Spy;

    let expectedSheetIds: SheetClickEvent;

    const getLinkDes = () => getAndExpectDebugElementByCss(compDe, 'a.test-link', 1, 1);
    const getLinkEl = (): HTMLAnchorElement => getLinkDes()[0].nativeElement;
    const getDirective = () =>
        getAndExpectDebugElementByDirective(compDe, EditionSheetFacetItemLinkDirective, 1, 1)[0].injector.get(
            EditionSheetFacetItemLinkDirective
        );

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [TestEditionSheetFacetItemLinkComponent],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Service spies
        serviceNavigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');

        // Test data
        expectedSheetIds = { complexId: '', sheetId: 'test-1' };

        // Create host fixture
        fixture = TestBed.createComponent(TestEditionSheetFacetItemLinkComponent);
        hostComponent = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Trigger initial data binding
        fixture.detectChanges();

        // Directive spies
        selectSpy = vi.spyOn(getDirective(), 'select');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create the host with one directive instance', () => {
        expect(hostComponent).toBeTruthy();
        expect(getDirective()).toBeTruthy();
    });

    describe('INPUTS', () => {
        it('... should have input signal `sheetIds` to hold the provided sheet ids', () => {
            expectToBe(isSignal(getDirective().sheetIds), true);

            expectToEqual(getDirective().sheetIds(), expectedSheetIds);
        });

        it('... should have input signal `isActive` to hold the provided value', () => {
            expectToBe(isSignal(getDirective().isActive), true);

            expectToBe(getDirective().isActive(), false);
        });
    });

    describe('HOST', () => {
        it('... should set `role="link"` and `tabindex="0"` on the anchor', () => {
            expectToBe(getLinkEl().getAttribute('role'), 'link');
            expectToBe(getLinkEl().getAttribute('tabindex'), '0');
        });

        it('... should keep the existing classes of the anchor', () => {
            expectToContain(getLinkEl().classList, 'test-link');
        });

        it('... should have `text-muted` and no `active` class if not active', () => {
            expectToContain(getLinkEl().classList, 'text-muted');
            expectToNotContain(getLinkEl().classList, 'active');
        });

        it('... should have `active` and no `text-muted` class if active', async () => {
            hostComponent.isActive.set(true);
            await detectChangesOnPush(fixture);

            expectToContain(getLinkEl().classList, 'active');
            expectToNotContain(getLinkEl().classList, 'text-muted');
        });
    });

    describe('METHODS', () => {
        describe('#select()', () => {
            it('... should have a method `select`', () => {
                expect(getDirective().select).toBeDefined();
            });

            it('... should trigger on click on the anchor', async () => {
                await clickAndAwaitChanges(getLinkDes()[0], fixture);

                expectSpyCall(selectSpy, 1);
            });

            it('... should trigger on enter key on the anchor', async () => {
                getLinkEl().dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
                await detectChangesOnPush(fixture);

                expectSpyCall(selectSpy, 1);
            });

            it('... should navigate to the provided sheet ids', () => {
                getDirective().select();

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);
            });

            it('... should navigate to the provided sheet ids with partial', async () => {
                const expectedSheetIdsWithPartial: SheetClickEvent = { complexId: 'testComplex1', sheetId: 'test-2a' };
                hostComponent.sheetIds.set(expectedSheetIdsWithPartial);
                await detectChangesOnPush(fixture);

                getDirective().select();

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIdsWithPartial);
            });

            it('... should do nothing if no sheetId is provided', async () => {
                hostComponent.sheetIds.set({ complexId: 'op25', sheetId: '' });
                await detectChangesOnPush(fixture);

                getDirective().select();

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
            });
        });
    });
});
