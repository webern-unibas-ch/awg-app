import { DebugElement } from '@angular/core';

import { describe, expect, it } from 'vitest';

import { expectCollapsedAccordionItem, expectOpenAccordionItem } from './accordion-panel-helper';

describe('accordion-panel-helper', () => {
    describe('#expectCollapsedAccordionItem()', () => {
        it('... should have a method `expectCollapsedAccordionItem`', () => {
            expect(expectCollapsedAccordionItem).toBeDefined();
            expect(typeof expectCollapsedAccordionItem).toBe('function');
        });

        it('... should have `expectCollapsedAccordionItem` pass for a collapsed header', () => {
            const headerEl = document.createElement('div');
            headerEl.classList.add('collapsed');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectCollapsedAccordionItem(headerDe, 'collapsed check')).not.toThrow();
        });

        it('... should have `expectCollapsedAccordionItem` throw for an open header', () => {
            const headerEl = document.createElement('div');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectCollapsedAccordionItem(headerDe, 'collapsed mismatch')).toThrow();
        });
    });

    describe('#expectOpenAccordionItem()', () => {
        it('... should have a method `expectOpenAccordionItem`', () => {
            expect(expectOpenAccordionItem).toBeDefined();
            expect(typeof expectOpenAccordionItem).toBe('function');
        });

        it('... should have `expectOpenAccordionItem` pass for an open header', () => {
            const headerEl = document.createElement('div');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectOpenAccordionItem(headerDe, 'open check')).not.toThrow();
        });

        it('... should have `expectOpenAccordionItem` throw for a collapsed header', () => {
            const headerEl = document.createElement('div');
            headerEl.classList.add('collapsed');
            const headerDe = { nativeElement: headerEl } as unknown as DebugElement;

            expect(() => expectOpenAccordionItem(headerDe, 'open mismatch')).toThrow();
        });
    });
});
