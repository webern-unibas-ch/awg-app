import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, it } from 'vitest';

import { expectToBe, expectToContain, expectToNotContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AbbrDirective } from './abbr.directive';

import abbreviationsData from 'assets/data/edition/abbreviations.json';

// Mock component
@Component({
    template: `<p [awgAbbr]="text()"></p>`,
    imports: [AbbrDirective],
})
class TestAbbrComponent {
    readonly text = input('This is a test with Klav. and Klav. o. and Ges. It is located in CH-Bps.');
}

describe('AbbrDirective (DONE)', () => {
    let fixture: ComponentFixture<TestAbbrComponent>;
    let compDe: DebugElement;

    let expectedAbbreviations: Map<string, string>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestAbbrComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedAbbreviations = new Map<string, string>(Object.entries(abbreviationsData.abbreviations));

        // Create component fixture
        fixture = TestBed.createComponent(TestAbbrComponent);
        compDe = fixture.debugElement;
    });

    it('... should replace abbreviations with <abbr> elements', () => {
        fixture.detectChanges();

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        expectToContain(pEl.innerHTML, '<abbr title="Klavier">Klav.</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Klavier oben">Klav. o.</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Gesang">Ges.</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Paul Sacher Stiftung, Basel">CH-Bps</abbr>');
    });

    it('... should update and clear abbreviation markup when text changes', () => {
        fixture.detectChanges();

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        expectToContain(pEl.innerHTML, '<abbr title="Klavier">Klav.</abbr>');

        fixture.componentRef.setInput('text', 'Ges.');
        fixture.detectChanges();

        expectToBe(pEl.innerHTML, '<abbr title="Gesang">Ges.</abbr>');
        expectToNotContain(pEl.innerHTML, 'Klav.');

        fixture.componentRef.setInput('text', '');
        fixture.detectChanges();

        expectToBe(pEl.innerHTML, '');
        getAndExpectDebugElementByCss(pDes[0], 'abbr', 0, 0);
    });

    it('... should replace all given abbreviations with <abbr> elements', () => {
        fixture.componentRef.setInput('text', Array.from(expectedAbbreviations.keys()).join(' | '));
        fixture.detectChanges();

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        getAndExpectDebugElementByCss(pDes[0], `abbr`, expectedAbbreviations.size, expectedAbbreviations.size);

        for (const [abbr, full] of expectedAbbreviations.entries()) {
            // HTML escape special characters
            const fullEscaped = full.replace(/&/g, '&amp;');

            expectToContain(pEl.innerHTML, `<abbr title="${fullEscaped}">${abbr}</abbr>`);
        }
    });

    it('... should not replace parts of words', () => {
        fixture.componentRef.setInput('text', 'This is a test with Klaviertaste and Klav. o. and Ges.');
        fixture.detectChanges();

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        expectToNotContain(pEl.innerHTML, '<abbr title="Klavier">Klaviertaste</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Klavier oben">Klav. o.</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Gesang">Ges.</abbr>');
    });

    it('... should handle empty text', () => {
        fixture.componentRef.setInput('text', '');
        fixture.detectChanges();

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        expectToBe(pEl.innerHTML, '');
    });
});
