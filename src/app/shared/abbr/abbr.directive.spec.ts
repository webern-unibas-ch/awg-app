import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToContain, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AbbrDirective } from './abbr.directive';

// Test abbr component
@Component({
    template: `<p [awgAbbr]="text"></p>`,
})
class TestAbbrComponent {
    text = 'This is a test with Klav. and Klav. o. and Ges. It is located in CH-Bps.';
}

describe('AbbrDirective (DONE)', () => {
    let fixture: ComponentFixture<TestAbbrComponent>;
    let component: TestAbbrComponent;
    let compDe: DebugElement;

    let expectedAbbreviations: Map<string, string>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestAbbrComponent, AbbrDirective],
        });

        fixture = TestBed.createComponent(TestAbbrComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedAbbreviations = new Map<string, string>([
            // General
            ['Bl.', 'Blatt (r - recto, v - verso)'],
            ['S.', 'Seite'],
            ['T.', 'Takt'],
            // Instrumentations
            ['Ges.', 'Gesang'],
            ['Klav. o.', 'Klavier oben'],
            ['Klav. u.', 'Klavier unten'],
            ['Klav.', 'Klavier'],
            // RISM-IDs
            ['A-Was', 'Arnold Schönberg Center, Wien'],
            ['A-Wn', 'Österreichische Nationalbibliothek, Musiksammlung, Wien'],
            ['A-Wst', 'Wienbibliothek im Rathaus, Musiksammlung, Wien'],
            ['A-Wue', 'Universal Edition, Historisches Archiv, Wien'],
            ['CH-Bps', 'Paul Sacher Stiftung, Basel'],
            ['CH-END', 'Dokumentationsbibliothek Walter Labhart, Endingen'],
            ['GB-Lbl', 'The Britisch Library, London'],
            ['US-NH', 'Yale University, Irving S. Gilmore Music Library, New Haven, CT'],
            ['US-NYpm', 'The Morgan Library & Museum, New York City, NY'],
            ['US-Wc', 'The Library of Congress, Music Division, Washington, D.C.'],
        ]);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should replace abbreviations with <abbr> elements', () => {
        fixture.detectChanges(); // Trigger initial data binding

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        expectToContain(pEl.innerHTML, '<abbr title="Klavier">Klav.</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Klavier oben">Klav. o.</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Gesang">Ges.</abbr>');
        expectToContain(pEl.innerHTML, '<abbr title="Paul Sacher Stiftung, Basel">CH-Bps</abbr>');
    });

    it('... should replace all given abbreviations with <abbr> elements', () => {
        component.text = Array.from(expectedAbbreviations.keys()).join(' ');
        fixture.detectChanges(); // Trigger initial data binding

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
        component.text = 'This is a test with Klaviert and Klav. o. and Ges.';
        fixture.detectChanges(); // Trigger data binding

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        expect(pEl.innerHTML).not.toContain('<abbr title="Klavier">Klaviert</abbr>');
        expect(pEl.innerHTML).toContain('<abbr title="Klavier oben">Klav. o.</abbr>');
        expect(pEl.innerHTML).toContain('<abbr title="Gesang">Ges.</abbr>');
    });

    it('... should handle empty text', () => {
        component.text = '';
        fixture.detectChanges(); // Trigger data binding

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl: HTMLParagraphElement = pDes[0].nativeElement;

        expect(pEl.innerHTML).toBe('');
    });
});
