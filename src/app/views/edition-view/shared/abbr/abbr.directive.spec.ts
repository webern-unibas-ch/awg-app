import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { AbbrDirective } from './abbr.directive';
import { ABBR_UTILS } from './abbr.utils';

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

    let applyAbbreviationsSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestAbbrComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Spies
        applyAbbreviationsSpy = vi.spyOn(ABBR_UTILS, 'applyAbbreviations').mockImplementation(() => {});

        // Create component fixture
        fixture = TestBed.createComponent(TestAbbrComponent);
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should delegate non-empty input to ABBR_UTILS', () => {
        fixture.detectChanges();

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl = pDes[0].nativeElement;

        expectToBe(pEl.innerHTML, 'This is a test with Klav. and Klav. o. and Ges. It is located in CH-Bps.');
        expectSpyCall(applyAbbreviationsSpy, 1, pEl);

        fixture.componentRef.setInput('text', '9 <br />bis 10');
        fixture.detectChanges();

        expectToBe(pEl.innerHTML, '9 <br>bis 10');
        expectSpyCall(applyAbbreviationsSpy, 2, pEl);
    });

    it('... should clear the host and skip delegation for empty input', () => {
        fixture.detectChanges();

        fixture.componentRef.setInput('text', '');
        fixture.detectChanges();

        const pDes = getAndExpectDebugElementByCss(compDe, 'p', 1, 1);
        const pEl = pDes[0].nativeElement;

        expectToBe(pEl.innerHTML, '');
        expectSpyCall(applyAbbreviationsSpy, 1, pEl);
    });
});
