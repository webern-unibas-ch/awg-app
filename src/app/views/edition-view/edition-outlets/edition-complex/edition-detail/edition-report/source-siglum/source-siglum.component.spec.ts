import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { Source, TextSource } from '@awg-views/edition-view/models/source.model';

import { SourceSiglumComponent } from './source-siglum.component';

describe('SourceSiglumComponent', () => {
    let component: SourceSiglumComponent;
    let fixture: ComponentFixture<SourceSiglumComponent>;
    let compDe: DebugElement;

    let expectedSourceData: Source;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SourceSiglumComponent, ConditionalLinkComponent],
        })
            .overrideComponent(ConditionalLinkComponent, { set: { template: '<ng-content />', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSourceData = structuredClone(mockEditionData.mockSourceListData.sources[0]);

        // Create component fixture
        fixture = TestBed.createComponent(SourceSiglumComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `siglumData`', () => {
            expectToBe(isSignal(component.siglumData), true);

            expect(() => component.siglumData()).toThrow();
        });

        it('... should have input signal `isClickable` to hold the default value', () => {
            expectToBe(isSignal(component.isClickable), true);

            expectToBe(component.isClickable(), false);
        });

        it('... should have input signal `classPrefix` to hold the default value', () => {
            expectToBe(isSignal(component.classPrefix), true);

            expectToBe(component.classPrefix(), 'awg-source-list');
        });

        it('... should have output `clicked`', () => {
            expect(component.clicked).toBeDefined();
        });

        it('... should throw when accessing computed signal `hasMissingFlag` due to missing input', () => {
            expectToBe(isSignal(component.hasMissingFlag), true);

            expect(() => component.hasMissingFlag()).toThrow();
        });

        it('... should have computed signal `siglumContainerClass` to hold the default value', () => {
            expectToBe(isSignal(component.siglumContainerClass), true);

            expectToBe(component.siglumContainerClass(), 'awg-source-list-siglum-container');
        });

        it('... should have computed signal `siglumClass` to hold the default value', () => {
            expectToBe(isSignal(component.siglumClass), true);

            expectToBe(component.siglumClass(), 'awg-source-list-siglum');
        });

        it('... should have computed signal `siglumAddendumClass` to hold the default value', () => {
            expectToBe(isSignal(component.siglumAddendumClass), true);

            expectToBe(component.siglumAddendumClass(), 'awg-source-list-siglum-addendum');
        });

        describe('VIEW', () => {
            it('... should contain no span yet', () => {
                getAndExpectDebugElementByCss(compDe, 'span', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('siglumData', structuredClone(expectedSourceData));
            fixture.componentRef.setInput('isClickable', true);
            fixture.componentRef.setInput('classPrefix', 'awg-source-list');

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `siglumData` to hold the expected data', () => {
            expectToEqual(component.siglumData(), expectedSourceData);
        });

        it('... should have input signal `isClickable` to hold the expected value', () => {
            expectToEqual(component.isClickable(), true);
        });

        it('... should have input signal `classPrefix` to hold the expected value', () => {
            expectToEqual(component.classPrefix(), 'awg-source-list');
        });

        it('... should have computed signal `hasMissingFlag` to hold the expected value', () => {
            expectToEqual(component.hasMissingFlag(), false);
        });

        it('... should re-compute `hasMissingFlag` when input changes', () => {
            fixture.componentRef.setInput('siglumData', { ...expectedSourceData, missing: true });
            fixture.detectChanges();

            expectToEqual(component.hasMissingFlag(), true);
        });

        it('... should have computed signal `siglumContainerClass` to hold the expected value', () => {
            expectToEqual(component.siglumContainerClass(), 'awg-source-list-siglum-container');
        });

        it('... should have computed signal `siglumClass` to hold the expected value', () => {
            expectToEqual(component.siglumClass(), 'awg-source-list-siglum');
        });

        it('... should have computed signal `siglumAddendumClass` to hold the expected value', () => {
            expectToEqual(component.siglumAddendumClass(), 'awg-source-list-siglum-addendum');
        });

        it('... should re-compute the class signals when input changes', () => {
            fixture.componentRef.setInput('classPrefix', 'awg-source-list-text');
            fixture.detectChanges();

            expectToEqual(component.siglumContainerClass(), 'awg-source-list-text-siglum-container');
            expectToEqual(component.siglumClass(), 'awg-source-list-text-siglum');
            expectToEqual(component.siglumAddendumClass(), 'awg-source-list-text-siglum-addendum');
        });

        describe('VIEW', () => {
            const getSiglumContainerDes = () =>
                getAndExpectDebugElementByCss(compDe, 'span.awg-source-list-siglum-container', 1, 1);
            const getConditionalLinkCmp = () =>
                getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 1, 1)[0].injector.get(
                    ConditionalLinkComponent
                );

            it('... should render no content if siglumData is null', async () => {
                fixture.componentRef.setInput('siglumData', null);

                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 0, 0);
            });

            it('... should contain a container span', () => {
                getSiglumContainerDes();
            });

            it('... should contain one ConditionalLinkComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, ConditionalLinkComponent, 1, 1);
            });

            it('... should pass down `isClickable` to ConditionalLinkComponent (hollow)', () => {
                expectToBe(getConditionalLinkCmp().isClickable(), true);
            });

            it('... should contain siglum as content of ConditionalLinkComponent (hollow)', () => {
                const linkDes = getAndExpectDebugElementByCss(getSiglumContainerDes()[0], 'awg-conditional-link', 1, 1);
                const linkEl: HTMLElement = linkDes[0].nativeElement;

                const spanDes = getAndExpectDebugElementByCss(linkDes[0], 'span', 1, 1);

                const siglumSpanDes = spanDes[0];
                const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                const expectedSiglum = expectedSourceData.siglum;

                expectToBe(linkEl.textContent.trim(), expectedSiglum.trim());
                expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');
            });

            describe('... should display siglum with addendum as content of ConditionalLinkComponent (hollow) if present', () => {
                it.each([
                    { siglum: 'A', addendum: 'a' },
                    { siglum: 'B', addendum: 'H' },
                    { siglum: 'C', addendum: 'F1-F2' },
                ])('... with addendum $addendum', async ({ siglum, addendum }) => {
                    expectedSourceData = {
                        ...mockEditionData.mockSourceListDataWithTexts.sources[0],
                        siglum,
                        siglumAddendum: addendum,
                    };

                    fixture.componentRef.setInput('siglumData', expectedSourceData);
                    await detectChangesOnPush(fixture);

                    const linkDes = getAndExpectDebugElementByCss(
                        getSiglumContainerDes()[0],
                        'awg-conditional-link',
                        1,
                        1
                    );
                    const linkEl: HTMLElement = linkDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(linkDes[0], 'span', 2, 2);

                    const siglumSpanDes = spanDes[0];
                    const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;

                    const siglumAddendumSpanDes = spanDes[1];
                    const siglumAddendumSpanEl: HTMLSpanElement = siglumAddendumSpanDes.nativeElement;

                    const expectedSiglum = expectedSourceData.siglum;
                    const expectedAddendum = expectedSourceData.siglumAddendum ?? '';

                    expectToBe(linkEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                    expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');

                    expectToBe(siglumAddendumSpanEl.textContent.trim(), expectedAddendum.trim());
                    expectToContain(siglumAddendumSpanEl.classList, 'awg-source-list-siglum-addendum');
                });
            });

            it('... should emit `clicked` when ConditionalLinkComponent (hollow) is clicked', () => {
                const emitSpy = vi.fn();
                fixture.componentInstance.clicked.subscribe(emitSpy);

                getConditionalLinkCmp().clicked.emit();

                expectSpyCall(emitSpy, 1);
            });

            describe('... missing sources', () => {
                beforeEach(async () => {
                    expectedSourceData = structuredClone(mockEditionData.mockSourceListData.sources[2]);
                    fixture.componentRef.setInput('isClickable', true);
                    fixture.componentRef.setInput('classPrefix', 'awg-source-list');

                    fixture.componentRef.setInput('siglumData', expectedSourceData);
                    await detectChangesOnPush(fixture);
                });

                it('... should display missing sources in brackets as content of ConditionalLinkComponent (hollow)', async () => {
                    const linkDes = getAndExpectDebugElementByCss(
                        getSiglumContainerDes()[0],
                        'awg-conditional-link',
                        1,
                        1
                    );
                    const linkEl: HTMLElement = linkDes[0].nativeElement;

                    const spanDes = getAndExpectDebugElementByCss(linkDes[0], 'span', 3, 3);

                    const openingBracketSpanDes = spanDes[0];
                    const siglumSpanDes = spanDes[1];
                    const closingBracketSpanDes = spanDes[2];

                    const openingBracketSpanEl: HTMLSpanElement = openingBracketSpanDes.nativeElement;
                    const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;
                    const closingBracketSpanEl: HTMLSpanElement = closingBracketSpanDes.nativeElement;

                    const expectedSiglum = expectedSourceData.siglum;

                    expectToBe(linkEl.textContent.trim(), `[${expectedSiglum}]`);

                    expectToBe(openingBracketSpanEl.textContent.trim(), '[');
                    expectToBe(closingBracketSpanEl.textContent.trim(), ']');

                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                    expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');
                });

                describe('... should display missing sources with addendum in brackets as content of ConditionalLinkComponent (hollow)', () => {
                    it.each([
                        { siglum: 'A', addendum: 'a' },
                        { siglum: 'B', addendum: 'H' },
                        { siglum: 'C', addendum: 'F1-F2' },
                    ])('... with addendum $addendum', async ({ siglum, addendum }) => {
                        expectedSourceData = { ...expectedSourceData, siglum, siglumAddendum: addendum };

                        fixture.componentRef.setInput('siglumData', expectedSourceData);
                        await detectChangesOnPush(fixture);

                        const linkDes = getAndExpectDebugElementByCss(
                            fixture.debugElement,
                            'awg-conditional-link',
                            1,
                            1
                        );
                        const linkEl: HTMLElement = linkDes[0].nativeElement;

                        const spanDes = getAndExpectDebugElementByCss(linkDes[0], 'span', 4, 4);

                        const openingBracketSpanDes = spanDes[0];
                        const siglumSpanDes = spanDes[1];
                        const siglumAddendumSpanDes = spanDes[2];
                        const closingBracketSpanDes = spanDes[3];

                        const openingBracketSpanEl: HTMLSpanElement = openingBracketSpanDes.nativeElement;
                        const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;
                        const siglumAddendumSpanEl: HTMLSpanElement = siglumAddendumSpanDes.nativeElement;
                        const closingBracketSpanEl: HTMLSpanElement = closingBracketSpanDes.nativeElement;

                        expectToBe(linkEl.textContent.trim(), `[${siglum}${addendum}]`);

                        expectToBe(openingBracketSpanEl.textContent.trim(), '[');
                        expectToBe(closingBracketSpanEl.textContent.trim(), ']');
                        expectToBe(siglumSpanEl.textContent.trim(), siglum);
                        expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');
                        expectToBe(siglumAddendumSpanEl.textContent.trim(), addendum);
                        expectToContain(siglumAddendumSpanEl.classList, 'awg-source-list-siglum-addendum');

                        const supDes = getAndExpectDebugElementByCss(siglumAddendumSpanDes, 'sup', 1, 1);
                        expectToBe(supDes[0].nativeElement.textContent.trim(), addendum);
                    });
                });

                it('... should render a missing source with non-clickable ConditionalLinkComponent (hollow) when not clickable', async () => {
                    const mockSource = {
                        siglum: 'C',
                        siglumAddendum: '',
                        missing: true,
                        type: 'Test type 3',
                        location: 'Test location 3.',
                        hasDescription: false,
                        linkTo: '',
                    };
                    fixture.componentRef.setInput('siglumData', structuredClone(mockSource));
                    fixture.componentRef.setInput('isClickable', false);
                    await detectChangesOnPush(fixture);

                    expectToBe(getConditionalLinkCmp().isClickable(), false);

                    const spanDes = getAndExpectDebugElementByCss(getSiglumContainerDes()[0], 'span', 3, 3);

                    const openingBracketSpanDes = spanDes[0];
                    const siglumSpanDes = spanDes[1];
                    const closingBracketSpanDes = spanDes[2];

                    const openingBracketSpanEl: HTMLSpanElement = openingBracketSpanDes.nativeElement;
                    const siglumSpanEl: HTMLSpanElement = siglumSpanDes.nativeElement;
                    const closingBracketSpanEl: HTMLSpanElement = closingBracketSpanDes.nativeElement;

                    const expectedSiglum = mockSource.siglum;

                    expectToBe(openingBracketSpanEl.textContent.trim(), '[');
                    expectToBe(closingBracketSpanEl.textContent.trim(), ']');

                    expectToBe(siglumSpanEl.textContent.trim(), expectedSiglum.trim());
                    expectToContain(siglumSpanEl.classList, 'awg-source-list-siglum');
                });
            });
        });
    });

    describe('... with text sources', () => {
        let expectedTextSourceData: TextSource;

        beforeEach(async () => {
            expectedTextSourceData = {
                id: 'text_textB',
                siglum: 'textB',
                siglumAddendum: 'H',
                type: 'Text type 2',
                location: 'Text location 2.',
            };
            fixture.componentRef.setInput('siglumData', expectedTextSourceData);
            fixture.componentRef.setInput('classPrefix', 'awg-source-list-text');

            await detectChangesOnPush(fixture);
        });

        it('... should render a text-source siglum and addendum with non-clickable ConditionalLinkComponent (hollow)', () => {
            expectToEqual(component.siglumData(), expectedTextSourceData);
            expectToBe(component.hasMissingFlag(), false);
            expectToBe(component.isClickable(), false);

            const containerDes = getAndExpectDebugElementByCss(
                compDe,
                'span.awg-source-list-text-siglum-container',
                1,
                1
            );
            const conditionalLinkDes = getAndExpectDebugElementByDirective(
                containerDes[0],
                ConditionalLinkComponent,
                1,
                1
            );
            expectToBe(conditionalLinkDes[0].injector.get(ConditionalLinkComponent).isClickable(), false);

            const siglumDes = getAndExpectDebugElementByCss(containerDes[0], 'span.awg-source-list-text-siglum', 1, 1);
            const addendumDes = getAndExpectDebugElementByCss(
                containerDes[0],
                'span.awg-source-list-text-siglum-addendum > sup',
                1,
                1
            );
            const siglumEl: HTMLSpanElement = siglumDes[0].nativeElement;
            const addendumEl: HTMLElement = addendumDes[0].nativeElement;

            expectToBe(siglumEl.textContent.trim(), expectedTextSourceData.siglum);
            expectToBe(addendumEl.textContent.trim(), expectedTextSourceData.siglumAddendum);
        });
    });
});
