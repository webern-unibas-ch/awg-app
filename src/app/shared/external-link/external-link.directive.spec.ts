import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { expectToBe } from '@testing/expect-helper';
import { ExternalLinkDirective } from './external-link.directive';

// Test external link component
@Component({
    template: `<a href="https://coryrylan.com/blog/managing-external-links-safely-in-angular">Link External</a>

        <br /><br />
        <a href="{{ dynamicExternalLink }}">Link External Dynamic</a>

        <br /><br />
        <a href="{{ hostname }}#anchor">Link Internal</a>

        <br /><br />
        <a href="{{ dynamicInternalLink }}">Link Internal Dynamic</a>

        <br /><br />
        <a (click)="doSomething()" (keyup.enter)="doSomething()" role="link" tabindex="0">Link without href</a>`,
})
class TestExernalLinkComponent {
    hostname = location.hostname;
    dynamicInternalLink = this.hostname + '#anchor';
    dynamicExternalLink = 'https://coryrylan.com/blog/managing-external-links-safely-in-angular';

    doSomething() {
        console.info('Clicked on link without href');
    }
}

describe('ExternalLinkDirective', () => {
    let component: TestExernalLinkComponent;
    let fixture: ComponentFixture<TestExernalLinkComponent>;

    let aDes: DebugElement[];
    let bareADes: DebugElement[];

    const expectedExternalLink = 'https://coryrylan.com/blog/managing-external-links-safely-in-angular';
    const expectedNewExternalLink = 'https://anton-webern.ch/';
    const expectedInternalLink = '#anchor';
    const expectedRelAttr = 'noopener noreferrer';
    const expectedTargetAttr = '_blank';

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestExernalLinkComponent, ExternalLinkDirective],
        });

        fixture = TestBed.createComponent(TestExernalLinkComponent);
        component = fixture.componentInstance;

        fixture.detectChanges(); // Initial binding
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should have 4 anchor elements with href attributes', () => {
        // All elements with an attached ExternalLinkDirective (a[href])
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));

        expectToBe(aDes.length, 4);
    });

    it('... should have 1 anchor element without href attributes', () => {
        bareADes = fixture.debugElement.queryAll(By.css('a:not([href])'));

        expectToBe(bareADes.length, 1);
    });

    it('... should apply [href|target|rel] values to 1st anchor element (external)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl: HTMLAnchorElement = aDes[0].nativeElement;

        expectToBe(aEl.href, expectedExternalLink);
        expectToBe(aEl.rel, expectedRelAttr);
        expectToBe(aEl.target, expectedTargetAttr);
        expectToBe(aEl.innerText, 'Link External');
    });

    it('... should apply [href|target|rel] values to 2nd anchor element (dynamic external)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl: HTMLAnchorElement = aDes[1].nativeElement;

        expectToBe(aEl.href, expectedExternalLink);
        expectToBe(aEl.rel, expectedRelAttr);
        expectToBe(aEl.target, expectedTargetAttr);
        expectToBe(aEl.innerText, 'Link External Dynamic');
    });

    it('... should not apply [target|rel] values to 3rd anchor element (internal)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl: HTMLAnchorElement = aDes[2].nativeElement;

        const expectedHref = aEl.baseURI + aEl.hostname + expectedInternalLink;

        expectToBe(aEl.href, expectedHref);
        expectToBe(aEl.rel, '');
        expectToBe(aEl.target, '');
        expectToBe(aEl.innerText, 'Link Internal');
    });

    it('... should not apply [target|rel] values to 4th anchor element (dynamic internal)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl: HTMLAnchorElement = aDes[3].nativeElement;

        const expectedHref = aEl.baseURI + aEl.hostname + expectedInternalLink;

        expectToBe(aEl.href, expectedHref);
        expectToBe(aEl.rel, '');
        expectToBe(aEl.target, '');
        expectToBe(aEl.innerText, 'Link Internal Dynamic');
    });

    it('... should not apply [href|target|rel] values to bare anchor', () => {
        bareADes = fixture.debugElement.queryAll(By.css('a:not([href])'));

        expectToBe(bareADes[0].properties['href'], '');
        expectToBe(bareADes[0].properties['target'], '');
        expectToBe(bareADes[0].properties['rel'], '');
        expectToBe(bareADes[0].properties['innerText'], 'Link without href');
    });

    it('... should reflect input change for [href] values', () => {
        component.dynamicExternalLink = expectedNewExternalLink;

        // Apply changes
        fixture.detectChanges();

        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl: HTMLAnchorElement = aDes[1].nativeElement;

        expectToBe(aEl.href, expectedNewExternalLink);
        expectToBe(aEl.rel, expectedRelAttr);
        expectToBe(aEl.target, expectedTargetAttr);
        expectToBe(aEl.innerText, 'Link External Dynamic');
    });
});
