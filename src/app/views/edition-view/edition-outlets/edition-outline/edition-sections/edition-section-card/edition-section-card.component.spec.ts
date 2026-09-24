import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';

import { EditionSectionCardComponent } from './edition-section-card.component';

describe('EditionSectionCardComponent (DONE)', () => {
    let component: EditionSectionCardComponent;
    let fixture: ComponentFixture<EditionSectionCardComponent>;
    let compDe: DebugElement;

    let expectedSection: EditionOutlineSection;
    let expectedDisabledSection: EditionOutlineSection;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionCardComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        const series = EditionStateHelper.getSeries('1');
        expectedSection = series.sections.find(section => !section.disabled) as EditionOutlineSection;
        expectedDisabledSection = series.sections.find(section => section.disabled) as EditionOutlineSection;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `displayedSection`', () => {
            expectToBe(isSignal(component.displayedSection), true);
            expect(() => component.displayedSection()).toThrow();
        });

        it('... should not contain a div.awg-edition-section-card yet', () => {
            getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-card', 0, 0);
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('displayedSection', expectedSection);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `displayedSection` to hold the expected section', () => {
            expectToBe(component.displayedSection(), expectedSection);
        });

        describe('VIEW', () => {
            const getCardDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-card', 1, 1);
            const getCardFooterDes = () => getAndExpectDebugElementByCss(getCardDes()[0], 'div.card-footer', 1, 1);

            it('... should render no content if displayed section is not available', () => {
                fixture.componentRef.setInput('displayedSection', null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-card', 0, 0);
            });

            it('... should contain one div.awg-edition-section-card', () => {
                getCardDes();
            });

            it('... should contain one div.row', () => {
                getAndExpectDebugElementByCss(getCardDes()[0], 'div.row', 1, 1);
            });

            it('... should render the card layout', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-card-content', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                getCardFooterDes();
            });

            it('... should render the cover image', () => {
                const imageContainerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-img-container', 1, 1);
                const imageDes = getAndExpectDebugElementByCss(imageContainerDes[0], 'img.card-img-top', 1, 1);
                const imageEl: HTMLImageElement = imageDes[0].nativeElement;

                expectToContain(imageEl.src, expectedSection.labeledRoute.route.join('/') + '/cover.jpg');
                expectToBe(imageEl.alt, 'Cover ' + expectedSection.labeledRoute.label);
                expectToBe(imageEl.title, expectedSection.labeledRoute.label);
            });

            it('... should apply the enabled content classes', () => {
                const contentDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-section-card-content', 1, 1);
                const contentEl: HTMLDivElement = contentDes[0].nativeElement;

                expectToContain(contentEl.classList, 'col-8');
                expectToContain(contentEl.classList, 'col-sm-10');

                const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const bodyEl: HTMLDivElement = bodyDes[0].nativeElement;

                expectToContain(bodyEl.classList, 'awg-card-border-top');
            });

            it('... should display the enabled section title', () => {
                const titleDes = getAndExpectDebugElementByCss(compDe, 'h5.card-title', 1, 1);
                const titleEl: HTMLHeadingElement = titleDes[0].nativeElement;

                expectToBe(titleEl.textContent?.trim(), expectedSection.section.full);
                expectToNotContain(titleEl.classList, 'text-muted');
            });

            it('... should have a ButtonMoreComponent in div.card-footer', () => {
                getAndExpectDebugElementByDirective(getCardFooterDes()[0], ButtonMoreComponent, 1, 1);
            });

            it('... should pass down the correct targetRoute to ButtonMoreComponent', () => {
                const buttonMoreDes = getAndExpectDebugElementByDirective(
                    getCardFooterDes()[0],
                    ButtonMoreComponent,
                    1,
                    1
                );
                const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                expectToEqual(buttonMoreCmp.targetRoute(), [expectedSection.section.route]);
            });

            it('... should pass down the correct disabled state to ButtonMoreComponent', () => {
                const buttonMoreDes = getAndExpectDebugElementByDirective(
                    getCardFooterDes()[0],
                    ButtonMoreComponent,
                    1,
                    1
                );
                const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                expectToBe(buttonMoreCmp.disabled(), false);
            });

            describe('... with a disabled section', () => {
                beforeEach(() => {
                    fixture.componentRef.setInput('displayedSection', expectedDisabledSection);
                    fixture.detectChanges();
                });

                it('... should omit the cover image and content columns', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-img-container', 0, 0);

                    const contentEl: HTMLDivElement = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card-content',
                        1,
                        1
                    )[0].nativeElement;

                    expectToNotContain(contentEl.classList, 'col-8');
                    expectToNotContain(contentEl.classList, 'col-sm-10');
                });

                it('... should omit the image border and mute the section title', () => {
                    const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                    const bodyEl: HTMLDivElement = bodyDes[0].nativeElement;

                    expectToNotContain(bodyEl.classList, 'awg-card-border-top');

                    const titleDes = getAndExpectDebugElementByCss(compDe, 'h5.card-title', 1, 1);
                    const titleEl: HTMLHeadingElement = titleDes[0].nativeElement;

                    expectToContain(titleEl.classList, 'text-muted');
                });

                it('... should pass down the correct disabled state to ButtonMoreComponent', () => {
                    const buttonMoreDes = getAndExpectDebugElementByDirective(
                        getCardFooterDes()[0],
                        ButtonMoreComponent,
                        1,
                        1
                    );
                    const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                    expectToBe(buttonMoreCmp.disabled(), true);
                });
            });
        });
    });
});
