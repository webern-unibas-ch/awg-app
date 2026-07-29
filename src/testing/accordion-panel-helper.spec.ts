import { DebugElement } from '@angular/core';

import { describe, expect, it } from 'vitest';

import { expectToBe } from './expect-helper';

import { expectCollapsedAccordionItem, expectOpenAccordionItem } from './accordion-panel-helper';

describe('accordion-panel-helper', () => {
    describe('#expectCollapsedAccordionItem()', () => {
        it('... should have a method `expectCollapsedAccordionItem`', () => {
            expect(expectCollapsedAccordionItem).toBeDefined();
            expectToBe(typeof expectCollapsedAccordionItem, 'function');
        });

        it('... should have `expectCollapsedAccordionItem` pass for a collapsed header', () => {
            const headerEl = document.createElement('div');
            headerEl.classList.add('collapsed');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectCollapsedAccordionItem(headerDe, 'collapsed check')).not.toThrow();
        });

        it('... should have `expectCollapsedAccordionItem` throw an error with suffix if msg is provided', () => {
            const headerEl = document.createElement('div');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectCollapsedAccordionItem(headerDe, 'collapsed mismatch')).toThrow(
                /Header should be collapsed \(collapsed mismatch\)/
            );
        });

        it('... should have `expectCollapsedAccordionItem` throw for an open header', () => {
            const headerEl = document.createElement('div');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectCollapsedAccordionItem(headerDe, 'collapsed mismatch')).toThrow();
        });

        it('... should have `expectCollapsedAccordionItem` throw an error without suffix if msg is empty', () => {
            const headerEl = document.createElement('div');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectCollapsedAccordionItem(headerDe, '')).toThrow(/^Header should be collapsed/);
        });
    });

    describe('#expectOpenAccordionItem()', () => {
        it('... should have a method `expectOpenAccordionItem`', () => {
            expect(expectOpenAccordionItem).toBeDefined();
            expectToBe(typeof expectOpenAccordionItem, 'function');
        });

        it('... should have `expectOpenAccordionItem` pass for an open header', () => {
            const headerEl = document.createElement('div');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectOpenAccordionItem(headerDe, 'open check')).not.toThrow();
        });

        it('... should have `expectOpenAccordionItem` throw an error with suffix if msg is provided', () => {
            const headerEl = document.createElement('div');
            headerEl.classList.add('collapsed'); // Kollabierter Header (mismatch für open)
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectOpenAccordionItem(headerDe, 'open mismatch')).toThrowError(
                /Header should be not collapsed \(open mismatch\)/
            );
        });

        it('... should have `expectOpenAccordionItem` throw an error without suffix if msg is empty', () => {
            const headerEl = document.createElement('div');
            headerEl.classList.add('collapsed');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectOpenAccordionItem(headerDe, '')).toThrow(/^Header should be not collapsed/);
        });
    });
});
