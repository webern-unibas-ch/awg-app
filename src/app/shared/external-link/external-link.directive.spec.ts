import { Component, DebugElement, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';

import {
    expectToBe,
    expectToContain,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { ExternalLinkDirective } from './external-link.directive';

// Test external link component
@Component({
    template: `<a [href]="'https://coryrylan.com/blog/managing-external-links-safely-in-angular'"
            >Static External Link</a
        >

        <br /><br />
        <a [href]="dynamicExternalLink">Dynamic External Link</a>

        <br /><br />
        <a [href]="'https://evil-' + hostname">Phishing Domain Link</a>

        <br /><br />
        <a [href]="hostname + '#anchor'">Internal Link</a>

        <br /><br />
        <a [href]="dynamicInternalLink">Dynamic Internal Link</a>

        <br /><br />
        <a [href]="'/about'">Relative URL Link</a>

        <br /><br />
        <a [href]="'mailto:test@example.com'">Mailto Link</a>

        <br /><br />
        <a [href]="'https://coryrylan.com/blog/'" rel="nofollow">External Link with static rel</a>

        <br /><br />
        <a [href]="'https://coryrylan.com/blog/'" rel="noopener nofollow">External Link with duplicate rel</a>

        <br /><br />
        <a [href]="'/about'" rel="help">Internal Link with static rel</a>,

        <br /><br />
        <a (click)="doSomething()" (keyup.enter)="doSomething()" role="link" tabindex="0">Link without href</a>`,
    imports: [ExternalLinkDirective],
})
class TestExternalLinkComponent {
    hostname = location.hostname;
    dynamicInternalLink = this.hostname + '#anchor';
    dynamicExternalLink = 'https://coryrylan.com/blog/managing-external-links-safely-in-angular';

    doSomething() {
        console.info('Clicked on link without href');
    }
}

describe('ExternalLinkDirective (DONE)', () => {
    let component: TestExternalLinkComponent;
    let fixture: ComponentFixture<TestExternalLinkComponent>;
    let compDe: DebugElement;

    const expectedHrefCount = 10;
    const expectedExternalLink = 'https://coryrylan.com/blog/managing-external-links-safely-in-angular';
    const expectedNewExternalLink = 'https://anton-webern.ch/';
    const expectedBaseURI = `${location.origin}/`;
    const expectedInternalLink = `${location.hostname}#anchor`;
    const expectedRelAttr = 'noopener noreferrer';
    const expectedTargetAttr = '_blank';
    const expectedClassAttr = 'awg-external-link';

    const evilDomain = `https://evil-${location.hostname}/`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestExternalLinkComponent],
        });

        // Create component fixture
        fixture = TestBed.createComponent(TestExternalLinkComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Initial binding
        fixture.detectChanges();
    });

    const getAnchorDes = () =>
        getAndExpectDebugElementByDirective(compDe, ExternalLinkDirective, expectedHrefCount, expectedHrefCount);

    it('... should detect all anchor elements with href attributes', () => {
        getAnchorDes();
    });

    describe('... should correctly apply target and rel attributes for', () => {
        it.each([
            {
                index: 0,
                label: 'Static External Link',
                href: expectedExternalLink,
            },
            {
                index: 1,
                label: 'Dynamic External Link',
                href: expectedExternalLink,
            },
            {
                index: 2,
                label: 'Phishing Domain Link',
                href: evilDomain,
            },
        ])('... $label', ({ index, label, href }) => {
            const anchorDes = getAnchorDes();
            const anchorEl = anchorDes[index].nativeElement as HTMLAnchorElement;

            expectToBe(anchorEl.textContent?.trim(), label);
            expectToBe(anchorEl.href, href);
            expectToBe(anchorEl.target, expectedTargetAttr);
            expectToBe(anchorEl.rel, expectedRelAttr);
            expectToContain(anchorEl.classList, expectedClassAttr);
        });
    });

    describe('... should correctly handle existing rel attributes', () => {
        it('... should merge existing rel attributes for external links', () => {
            const anchorDes = getAnchorDes();
            const anchorWithRelEl = anchorDes[7].nativeElement as HTMLAnchorElement;

            expectToBe(anchorWithRelEl.target, expectedTargetAttr);
            expectToContain(anchorWithRelEl.rel, 'nofollow');
            expectToContain(anchorWithRelEl.rel, 'noopener');
            expectToContain(anchorWithRelEl.rel, 'noreferrer');
        });

        it('... should avoid duplicates for external links', () => {
            const anchorDes = getAnchorDes();
            const anchorWithDuplicateRelEl = anchorDes[8].nativeElement as HTMLAnchorElement;

            const relParts = anchorWithDuplicateRelEl.rel.split(/\s+/);
            const noopenerCount = relParts.filter(p => p === 'noopener').length;

            expectToBe(anchorWithDuplicateRelEl.target, expectedTargetAttr);
            expectToContain(anchorWithDuplicateRelEl.rel, 'nofollow');
            expectToContain(anchorWithDuplicateRelEl.rel, 'noopener');
            expectToContain(anchorWithDuplicateRelEl.rel, 'noreferrer');
            expectToBe(noopenerCount, 1);
        });

        it('... should keep existing rel attributes untouched for internal links', () => {
            const anchorDes = getAnchorDes();
            const anchorWithRelEl = anchorDes[9].nativeElement as HTMLAnchorElement;

            expectToBe(anchorWithRelEl.target, '');
            expectToBe(anchorWithRelEl.rel, 'help');
            expectToNotContain(anchorWithRelEl.rel, 'noopener');
            expectToNotContain(anchorWithRelEl.rel, 'noreferrer');
            expectToNotContain(anchorWithRelEl.classList, expectedClassAttr);
        });
    });

    it('... should recompute attributes dynamically when input signal changes', async () => {
        component.dynamicExternalLink = expectedNewExternalLink;

        await detectChangesOnPush(fixture);

        const anchorDes = getAnchorDes();
        const anchorEl: HTMLAnchorElement = anchorDes[1].nativeElement;

        expectToBe(anchorEl.textContent, 'Dynamic External Link');
        expectToBe(anchorEl.href, expectedNewExternalLink);
        expectToBe(anchorEl.rel, expectedRelAttr);
        expectToBe(anchorEl.target, expectedTargetAttr);
        expectToContain(anchorEl.classList, expectedClassAttr);
    });

    it('... should detect anchor elements without href attributes', () => {
        getAndExpectDebugElementByCss(compDe, 'a:not([href])', 1, 1);
    });

    describe('... should not apply target and rel attributes', () => {
        it.each([
            { index: 3, label: 'Internal Link', href: expectedBaseURI + expectedInternalLink },
            { index: 4, label: 'Dynamic Internal Link', href: expectedBaseURI + expectedInternalLink },
            { index: 5, label: 'Relative URL Link', href: expectedBaseURI + 'about' },
            { index: 6, label: 'Mailto Link', href: 'mailto:test@example.com' },
        ])('... for $label', ({ index, label, href }) => {
            const anchorDes = getAnchorDes();
            const anchorEl = anchorDes[index].nativeElement as HTMLAnchorElement;

            expectToBe(anchorEl.textContent?.trim(), label);
            expectToBe(anchorEl.href, href);
            expectToBe(anchorEl.target, '');
            expectToBe(anchorEl.rel, '');
            expectToNotContain(anchorEl.classList, expectedClassAttr);
        });

        it('... for bare anchors (without href)', () => {
            const bareAnchorDes = getAndExpectDebugElementByCss(compDe, 'a:not([href])', 1, 1);
            const bareAnchorEl: HTMLAnchorElement = bareAnchorDes[0].nativeElement;

            expectToBe(bareAnchorEl.textContent?.trim(), 'Link without href');
            expectToBe(bareAnchorEl.href, '');
            expectToBe(bareAnchorEl.target, '');
            expectToBe(bareAnchorEl.rel, '');
            expectToNotContain(bareAnchorEl.classList, expectedClassAttr);
        });

        it('... if href is an empty string', async () => {
            component.dynamicExternalLink = '';

            await detectChangesOnPush(fixture);

            const anchorDes = getAnchorDes();
            const anchorEl = anchorDes[1].nativeElement as HTMLAnchorElement;

            expectToBe(anchorEl.target, '');
            expectToBe(anchorEl.rel, '');
            expectToNotContain(anchorEl.classList, expectedClassAttr);
        });

        it('... if href is a malformed URL (catch error)', async () => {
            component.dynamicExternalLink = 'https://\\\\:invalid-url';

            await detectChangesOnPush(fixture);

            const anchorDes = getAnchorDes();
            const anchorEl = anchorDes[1].nativeElement as HTMLAnchorElement;

            expectToBe(anchorEl.target, '');
            expectToBe(anchorEl.rel, '');
            expectToNotContain(anchorEl.classList, expectedClassAttr);
        });

        it('... if running on the server (SSR)', () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [TestExternalLinkComponent],
                providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
            });

            const ssrFixture = TestBed.createComponent(TestExternalLinkComponent);
            const ssrCompDe = ssrFixture.debugElement;

            ssrFixture.detectChanges();

            const ssrAnchorDes = getAndExpectDebugElementByDirective(
                ssrCompDe,
                ExternalLinkDirective,
                expectedHrefCount,
                expectedHrefCount
            );
            const ssrAnchorEl = ssrAnchorDes[0].nativeElement as HTMLAnchorElement;

            expectToBe(ssrAnchorEl.target, '');
            expectToBe(ssrAnchorEl.rel, '');
            expectToNotContain(ssrAnchorEl.classList, expectedClassAttr);
        });
    });
});
