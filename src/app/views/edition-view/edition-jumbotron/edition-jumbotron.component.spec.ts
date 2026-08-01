import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionJumbotronComponent } from './edition-jumbotron.component';

describe('EditionJumbotronComponent (DONE)', () => {
    let component: EditionJumbotronComponent;
    let fixture: ComponentFixture<EditionJumbotronComponent>;
    let compDe: DebugElement;

    const expectedId = 'awg-edition-view';
    const expectedTitle = 'Inhalt';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionJumbotronComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Create component fixture
        fixture = TestBed.createComponent(EditionJumbotronComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `id`', () => {
            expectToBe(isSignal(component.id), true);

            expect(() => component.id()).toThrow();
        });

        it('... should throw due to missing required input signal `title`', () => {
            expectToBe(isSignal(component.title), true);

            expect(() => component.title()).toThrow();
        });

        describe('VIEW', () => {
            it('... should have one div.awg-jumbotron', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-jumbotron', 1, 1);
            });

            it('... should have a heading (h3) in jumbotron', () => {
                const jumbotronDes = getAndExpectDebugElementByCss(compDe, 'div.awg-jumbotron', 1, 1);

                getAndExpectDebugElementByCss(jumbotronDes[0], 'h3', 1, 1);
            });

            it('... should not have `id` or `title` on jumbotron heading', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'div.awg-jumbotron > h3', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.id, '');
                expectToBe(hEl.textContent.trim(), '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('id', expectedId);
            fixture.componentRef.setInput('title', expectedTitle);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `id` to hold the expected id', () => {
            expectToBe(component.id(), expectedId);
        });

        it('... should have signal `title` to hold the expected title', () => {
            expectToBe(component.title(), expectedTitle);
        });

        describe('VIEW', () => {
            it('... should pass down `id` and `title` to jumbotron heading', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'div.awg-jumbotron > h3', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.id, expectedId);
                expectToBe(hEl.textContent.trim(), expectedTitle);
            });
        });
    });
});
