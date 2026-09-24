import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionSectionDetailIntroCardComponent } from './edition-section-detail-intro-card.component';

describe('EditionSectionDetailIntroCardComponent (DONE)', () => {
    let component: EditionSectionDetailIntroCardComponent;
    let fixture: ComponentFixture<EditionSectionDetailIntroCardComponent>;
    let compDe: DebugElement;

    let expectedSection: EditionOutlineSection;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionDetailIntroCardComponent, ButtonMoreComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSection = EditionStateHelper.getSection('1', '5');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailIntroCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedSection`', () => {
            expectToBe(isSignal(component.selectedSection), true);

            expect(() => component.selectedSection()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no div.card.awg-edition-section-detail-intro-card yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-section-detail-intro-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('selectedSection', structuredClone(expectedSection));

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedSection` to hold the expected section', () => {
            expectToEqual(component.selectedSection(), expectedSection);
        });

        describe('VIEW', () => {
            const getCardDes = () =>
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-section-detail-intro-card', 1, 1);
            const getCardBodyDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-body', 1, 1);
            const getCardFooterDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-footer', 1, 1);
            const getTextEndParaDes = () => getAndExpectDebugElementByCss(getCardFooterDes()[0], 'p.text-end', 1, 1);

            describe('... should render no content if', () => {
                it('... selected section is not available', () => {
                    fixture.componentRef.setInput('selectedSection', null);

                    fixture.detectChanges();

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail-intro-card', 0, 0);
                });

                it('... selected section has no intro content', () => {
                    const sectionWithoutIntro = {
                        ...structuredClone(expectedSection),
                        content: {
                            ...structuredClone(expectedSection.content),
                            intro: null,
                        },
                    } as unknown as EditionOutlineSection;

                    fixture.componentRef.setInput('selectedSection', sectionWithoutIntro);

                    fixture.detectChanges();

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-detail-intro-card', 0, 0);
                });
            });

            it('... should contain one div.card.awg-edition-section-detail-intro-card', () => {
                getCardDes();
            });

            describe('... should contain card layout elements', () => {
                it.each([
                    { desc: 'one h5.card-header', selector: 'h5.card-header' },
                    { desc: 'one div.card-body', selector: 'div.card-body' },
                    { desc: 'one div.card-footer', selector: 'div.card-footer' },
                ])('... should contain $desc in div.card', ({ selector }) => {
                    getAndExpectDebugElementByCss(getCardDes()[0], selector, 1, 1);
                });
            });

            it('... should render intro title in h5.card-header', () => {
                const hDes = getAndExpectDebugElementByCss(getCardDes()[0], 'h5.card-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent.trim(), 'Einleitung');
            });

            it('... should contain one p.card-text in div.card-body', () => {
                getAndExpectDebugElementByCss(getCardBodyDes()[0], 'p.card-text', 1, 1);
            });

            it('... should render intro preview in p.card-text', () => {
                const pDes = getAndExpectDebugElementByCss(getCardBodyDes()[0], 'p.card-text', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent.trim(), expectedSection.content.intro.preview + ' …');
            });

            it('... should have text-end paragraph in div.card-footer', () => {
                getTextEndParaDes();
            });

            it('... should have a ButtonMoreComponent in text-end paragraph', () => {
                getAndExpectDebugElementByDirective(getTextEndParaDes()[0], ButtonMoreComponent, 1, 1);
            });

            it('... should pass down the correct targetRoute to ButtonMoreComponent', () => {
                const buttonMoreDes = getAndExpectDebugElementByDirective(
                    getTextEndParaDes()[0],
                    ButtonMoreComponent,
                    1,
                    1
                );
                const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                expectToEqual(buttonMoreCmp.targetRoute(), [expectedSection.labeledRoute.route.join('/'), 'intro']);
            });

            it('... should pass down the correct disabled state to ButtonMoreComponent', () => {
                const buttonMoreDes = getAndExpectDebugElementByDirective(
                    getTextEndParaDes()[0],
                    ButtonMoreComponent,
                    1,
                    1
                );
                const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                expectToBe(buttonMoreCmp.disabled(), expectedSection.content.intro.disabled);
            });
        });
    });
});
