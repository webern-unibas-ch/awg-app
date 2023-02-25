import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { ExternalLinkDirective } from './external-link.directive';

@Component({
    template: `<a href="https://coryrylan.com/blog/managing-external-links-safely-in-angular">Link External</a>

        <br /><br />
        <a href="{{ dynamicExternalLink }}">Link External Dynamic</a>

        <br /><br />
        <a href="{{ hostname }}#anchor">Link Internal</a>

        <br /><br />
        <a href="{{ dynamicInternalLink }}">Link Internal Dynamic</a>

        <br /><br />
        <a (click)="doSomething()">Link without href</a>`,
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

    it('should have 4 anchor elements with href attributes', () => {
        // All elements with an attached ExternalLinkDirective (a[href])
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));

        expect(aDes).toBeDefined();
        expect(aDes.length).withContext('should be 4').toBe(4);
    });

    it('should have 1 anchor element without href attributes', () => {
        bareADes = fixture.debugElement.queryAll(By.css('a:not([href])'));

        expect(bareADes).toBeDefined();
        expect(bareADes.length).withContext('should be 1').toBe(1);
    });

    it('should apply [href|target|rel] values to 1st anchor element (external)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl = aDes[0].nativeElement;

        expect(aEl.href).toBeTruthy();
        expect(aEl.href).withContext(`should be ${expectedExternalLink}`).toBe(expectedExternalLink);

        expect(aEl.rel).toBeTruthy();
        expect(aEl.rel).withContext(`should be ${expectedRelAttr}`).toBe(expectedRelAttr);

        expect(aEl.target).toBeTruthy();
        expect(aEl.target).withContext(`should be ${expectedTargetAttr}`).toBe(expectedTargetAttr);

        expect(aEl.innerText).withContext('should be "Link External"').toBe('Link External');
    });

    it('should apply [href|target|rel] values to 2nd anchor element (dynamic external)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl = aDes[1].nativeElement;

        expect(aEl.href).toBeTruthy();
        expect(aEl.href).withContext(`should be ${expectedExternalLink}`).toBe(expectedExternalLink);

        expect(aEl.rel).toBeTruthy();
        expect(aEl.rel).withContext(`should be ${expectedRelAttr}`).toBe(expectedRelAttr);

        expect(aEl.target).toBeTruthy();
        expect(aEl.target).withContext(`should be ${expectedTargetAttr}`).toBe(expectedTargetAttr);

        expect(aEl.innerText).withContext('should be "Link External Dynamic"').toBe('Link External Dynamic');
    });

    it('should not apply [target|rel] values to 3rd anchor element (internal)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl = aDes[2].nativeElement;

        const expectedHref = aEl.baseURI + aEl.hostname + expectedInternalLink;

        expect(aEl.href).toBeTruthy();
        expect(aEl.href).withContext(`should be ${expectedHref}`).toBe(expectedHref);

        expect(aEl.rel).withContext('should be empty string').not.toBeTruthy();
        expect(aEl.target).withContext('should be empty string').not.toBeTruthy();

        expect(aEl.innerText).withContext('should be "Link Internal"').toBe('Link Internal');
    });

    it('should not apply [target|rel] values to 4th anchor element (dynamic internal)', () => {
        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl = aDes[3].nativeElement;

        const expectedHref = aEl.baseURI + aEl.hostname + expectedInternalLink;

        expect(aEl.href).toBeTruthy();
        expect(aEl.href).withContext(`should be ${expectedHref}`).toBe(expectedHref);

        expect(aEl.rel).withContext('should be empty string').not.toBeTruthy();
        expect(aEl.target).withContext('should be empty string').not.toBeTruthy();

        expect(aEl.innerText).withContext('should be "Link Internal Dynamic"').toBe('Link Internal Dynamic');
    });

    it('should not apply [href|target|rel] values to bare anchor', () => {
        bareADes = fixture.debugElement.queryAll(By.css('a:not([href])'));

        expect(bareADes[0].properties['href']).withContext('should be empty string').not.toBeTruthy();
        expect(bareADes[0].properties['target']).withContext('should be empty string').not.toBeTruthy();
        expect(bareADes[0].properties['rel']).withContext('should be empty string').not.toBeTruthy();
        expect(bareADes[0].properties['innerText'])
            .withContext('should be "Link without href"')
            .toBe('Link without href');
    });

    it('should reflect input change for [href] values', () => {
        component.dynamicExternalLink = expectedNewExternalLink;

        // Apply changes
        fixture.detectChanges();

        aDes = fixture.debugElement.queryAll(By.directive(ExternalLinkDirective));
        const aEl = aDes[1].nativeElement;

        expect(aEl.href).toBeTruthy();
        expect(aEl.href).withContext(`should be ${expectedNewExternalLink}`).toBe(expectedNewExternalLink);

        expect(aEl.rel).toBeTruthy();
        expect(aEl.rel).withContext(`should be ${expectedRelAttr}`).toBe(expectedRelAttr);

        expect(aEl.target).toBeTruthy();
        expect(aEl.target).withContext(`should be ${expectedTargetAttr}`).toBe(expectedTargetAttr);

        expect(aEl.innerText).withContext('should be "Link External Dynamic"').toBe('Link External Dynamic');
    });
});
