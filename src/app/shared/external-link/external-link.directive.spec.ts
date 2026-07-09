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
    template: `<a href="https://coryrylan.com/blog/managing-external-links-safely-in-angular">Static External Link</a>

        <br /><br />
        <a [href]="dynamicExternalLink">Dynamic External Link</a>

        <br /><br />
        <a [href]="hostname + '#anchor'">Internal Link</a>

        <br /><br />
        <a [href]="dynamicInternalLink">Dynamic Internal Link</a>

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

    const expectedExternalLink = 'https://coryrylan.com/blog/managing-external-links-safely-in-angular';
    const expectedNewExternalLink = 'https://anton-webern.ch/';
    const expectedBaseURI = `${location.origin}/`;
    const expectedInternalLink = `${location.hostname}#anchor`;
    const expectedRelAttr = 'noopener noreferrer';
    const expectedTargetAttr = '_blank';
    const expectedClassAttr = 'awg-external-link';

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

    const getAnchorDes = () => getAndExpectDebugElementByDirective(compDe, ExternalLinkDirective, 4, 4);

    it('... should detect all anchor elements with href attributes', () => {
        getAnchorDes();
    });

    describe('... should correctly configure target and rel attributes for', () => {
        it.each([
            {
                index: 0,
                label: 'Static External Link',
                href: expectedExternalLink,
                target: expectedTargetAttr,
                rel: expectedRelAttr,
                shouldHaveClass: true,
            },
            {
                index: 1,
                label: 'Dynamic External Link',
                href: expectedExternalLink,
                target: expectedTargetAttr,
                rel: expectedRelAttr,
                shouldHaveClass: true,
            },
            {
                index: 2,
                label: 'Internal Link',
                href: expectedBaseURI + expectedInternalLink,
                target: '',
                rel: '',
                shouldHaveClass: false,
            },
            {
                index: 3,
                label: 'Dynamic Internal Link',
                href: expectedBaseURI + expectedInternalLink,
                target: '',
                rel: '',
                shouldHaveClass: false,
            },
        ])('... $label', ({ index, label, href, target, rel, shouldHaveClass }) => {
            const aDes = getAnchorDes();
            const aEl = aDes[index].nativeElement as HTMLAnchorElement;

            expectToBe(aEl.textContent?.trim(), label);
            expectToBe(aEl.href, href);
            expectToBe(aEl.target, target);
            expectToBe(aEl.rel, rel);

            if (shouldHaveClass) {
                expectToContain(aEl.classList, expectedClassAttr);
            } else {
                expectToNotContain(aEl.classList, expectedClassAttr);
            }
        });
    });

    it('... should recompute attributes dynamically when input signal changes', async () => {
        component.dynamicExternalLink = expectedNewExternalLink;

        await detectChangesOnPush(fixture);

        const aDes = getAnchorDes();
        const aEl: HTMLAnchorElement = aDes[1].nativeElement;

        expectToBe(aEl.href, expectedNewExternalLink);
        expectToBe(aEl.rel, expectedRelAttr);
        expectToBe(aEl.target, expectedTargetAttr);
        expectToBe(aEl.textContent, 'Dynamic External Link');
        expectToContain(aEl.classList, expectedClassAttr);
    });

    it('... should detect anchor elements without href attributes', () => {
        getAndExpectDebugElementByCss(compDe, 'a:not([href])', 1, 1);
    });

    describe('... should not apply target and rel attributes', () => {
        it('... for bare anchors', () => {
            const bareADes = getAndExpectDebugElementByCss(compDe, 'a:not([href])', 1, 1);
            const bareAEl: HTMLAnchorElement = bareADes[0].nativeElement;

            expectToBe(bareAEl.href, '');
            expectToBe(bareAEl.target, '');
            expectToBe(bareAEl.rel, '');
            expectToBe(bareAEl.textContent?.trim(), 'Link without href');
            expectToNotContain(bareAEl.classList, expectedClassAttr);
        });

        it('... if href is an empty string', async () => {
            component.dynamicExternalLink = '';

            await detectChangesOnPush(fixture);

            const aDes = getAnchorDes();
            const aEl = aDes[1].nativeElement as HTMLAnchorElement;

            expectToBe(aEl.target, '');
            expectToBe(aEl.rel, '');
            expectToNotContain(aEl.classList, expectedClassAttr);
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

            const ssrADes = getAndExpectDebugElementByDirective(ssrCompDe, ExternalLinkDirective, 4, 4);
            const ssrAEl = ssrADes[0].nativeElement as HTMLAnchorElement;

            expectToBe(ssrAEl.target, '');
            expectToBe(ssrAEl.rel, '');
            expectToNotContain(ssrAEl.classList, expectedClassAttr);
        });
    });
});
