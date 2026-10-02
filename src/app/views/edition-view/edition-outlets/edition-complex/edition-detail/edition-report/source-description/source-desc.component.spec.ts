import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { SourceDescriptionList } from '@awg-views/edition-view/models/source-description.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescItemComponent } from './source-desc-item/source-desc-item.component';
import { SourceDescComponent } from './source-desc.component';

describe('SourceDescComponent', () => {
    let component: SourceDescComponent;
    let fixture: ComponentFixture<SourceDescComponent>;
    let compDe: DebugElement;

    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedSourceDescListData: SourceDescriptionList;

    beforeEach(async () => {
        // Mock services
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SourceDescComponent, SourceDescItemComponent],
            providers: [{ provide: EditionNavigationService, useValue: mockNavigationService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSourceDescListData = structuredClone(mockEditionData.mockSourceDescListData);

        // Create component fixture
        fixture = TestBed.createComponent(SourceDescComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `sourceDescListData`', () => {
            expectToBe(isSignal(component.sourceDescListData), true);

            expect(() => component.sourceDescListData()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain the main description list div, but no source descriptions yet', () => {
                const listDes = getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-list', 1, 1);

                getAndExpectDebugElementByCss(listDes[0], 'div.awg-source-desc', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('sourceDescListData', expectedSourceDescListData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `sourceDescListData` to hold the provided data', () => {
            expectToEqual(component.sourceDescListData(), expectedSourceDescListData);
        });

        describe('VIEW', () => {
            let sourceDescDes: DebugElement[];

            beforeEach(() => {
                const sourcesLength = expectedSourceDescListData.sources.length;

                sourceDescDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-desc-list > div.awg-source-desc',
                    sourcesLength,
                    sourcesLength
                );
            });

            it('... should contain one main description list div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-desc-list', 1, 1);
            });

            it('... should have `card` and `mb-2` classes on each description div', () => {
                sourceDescDes.forEach(divDe => {
                    const divEl: HTMLDivElement = divDe.nativeElement;

                    expectToContain(divEl.classList, 'card');
                    expectToContain(divEl.classList, 'mb-2');
                });
            });

            it('... should set the source id as id of each description div', () => {
                sourceDescDes.forEach((divDe, index) => {
                    const divEl: HTMLDivElement = divDe.nativeElement;

                    expectToBe(divEl.id, expectedSourceDescListData.sources[index].id);
                });
            });

            it('... should contain one SourceDescItemComponent in each description div', () => {
                sourceDescDes.forEach(divDe => {
                    getAndExpectDebugElementByDirective(divDe, SourceDescItemComponent, 1, 1);
                });
            });

            it('... should pass down the source description to each SourceDescItemComponent', () => {
                sourceDescDes.forEach((divDe, index) => {
                    const itemDes = getAndExpectDebugElementByDirective(divDe, SourceDescItemComponent, 1, 1);
                    const itemCmp = itemDes[0].injector.get(SourceDescItemComponent);

                    expectToEqual(itemCmp.sourceDescription(), expectedSourceDescListData.sources[index]);
                });
            });
        });
    });
});
