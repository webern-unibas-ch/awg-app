import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { HeadingComponent } from './heading.component';

describe('HeadingComponent (DONE)', () => {
    let component: HeadingComponent;
    let fixture: ComponentFixture<HeadingComponent>;
    let compDe: DebugElement;

    let expectedId: string;
    let expectedTitle: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeadingComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedTitle = 'Test Title';
        expectedId = 'test-heading-id';

        // Create component fixture
        fixture = TestBed.createComponent(HeadingComponent);
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
            it('... should contain one div.para with an h3', () => {
                getAndExpectDebugElementByCss(compDe, 'div.para', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.para > h3', 1, 1);
            });

            it('... should have empty `id` on div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 1, 1);
                const divEl: HTMLDivElement = divDes[0].nativeElement;

                expectToBe(divEl.id, '');
            });

            it('... should have empty `title` on h3', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'div.para > h3', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding (update)', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs signals
            fixture.componentRef.setInput('id', expectedId);
            fixture.componentRef.setInput('title', expectedTitle);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `id` to hold the provided id', () => {
            expectToBe(component.id(), expectedId);
        });

        it('... should have input signal `title` to hold the provided title', () => {
            expectToBe(component.title(), expectedTitle);
        });

        describe('VIEW', () => {
            it('... should have updated `id` on div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 1, 1);
                const divEl: HTMLDivElement = divDes[0].nativeElement;

                expectToBe(divEl.id, expectedId);
            });

            it('... should have updated `title` on h3', () => {
                const hDes = getAndExpectDebugElementByCss(compDe, 'div.para > h3', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedTitle);
            });
        });
    });
});
