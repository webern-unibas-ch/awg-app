import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { SliderConfig } from '@awg-shared/shared-models/slider-config.model';
import { SliderZoomComponent } from '@awg-shared/slider-zoom/slider-zoom.component';

import { PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { GraphVisualizerService } from '../services/graph-visualizer.service';

import { ForceGraphComponent } from './force-graph.component';

describe('ForceGraphComponent', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;
    let compDe: DebugElement;

    let onReCenterSpy: Spy;
    let onZoomChangeSpy: Spy;

    let expectedSliderConfig: SliderConfig;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, SliderZoomComponent],
            declarations: [ForceGraphComponent, PrefixPipe],
            providers: [GraphVisualizerService, PrefixPipe],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ForceGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSliderConfig = new SliderConfig(1, 0.1, 3, 0.01);

        // Spies
        onReCenterSpy = vi.spyOn(component, 'onReCenter');
        onZoomChangeSpy = vi.spyOn(component, 'onZoomChange');
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `sliderConfig`', () => {
            expectToEqual(component.sliderConfig, expectedSliderConfig);
        });

        it('... should have signal `zoomValue` to hold the initial zoom value', () => {
            expectToBe(component.zoomValue(), expectedSliderConfig.initial);
        });

        describe('VIEW', () => {
            it('... should contain one SliderZoomComponent in div.awg-force-graph-icon-bar', () => {
                const iconBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-icon-bar', 1, 1);

                getAndExpectDebugElementByDirective(iconBarDes[0], SliderZoomComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            describe('... SliderZoomComponent', () => {
                it('... should pass down `config` and `value` to the SliderZoomComponent', () => {
                    const sliderZoomDes = getAndExpectDebugElementByDirective(compDe, SliderZoomComponent, 1, 1);
                    const sliderZoomCmp = sliderZoomDes[0].injector.get(SliderZoomComponent);

                    expectToEqual(sliderZoomCmp.config(), expectedSliderConfig);
                    expectToBe(sliderZoomCmp.value(), expectedSliderConfig.initial);
                });

                it('... should trigger `onZoomChange` on value change of the SliderZoomComponent', () => {
                    const rangeDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom input[type="range"]', 1, 1);
                    const rangeEl: HTMLInputElement = rangeDes[0].nativeElement;

                    rangeEl.value = '2.5';
                    rangeEl.dispatchEvent(new Event('input'));

                    expectSpyCall(onZoomChangeSpy, 1, 2.5);
                });

                it('... should trigger `onReCenter` on reset request of the SliderZoomComponent', async () => {
                    const buttonDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom button', 1, 1);

                    await clickAndAwaitChanges(buttonDes[0], fixture);

                    expectSpyCall(onReCenterSpy, 1);
                });
            });
        });

        describe('METHODS', () => {
            describe('#onZoomChange()', () => {
                it('... should have a method `onZoomChange`', () => {
                    expect(component.onZoomChange).toBeDefined();
                });

                it.each([0.5, 2, 1])('... should set `zoomValue` to the given zoom value %s', expectedZoom => {
                    component.onZoomChange(expectedZoom);

                    expectToBe(component.zoomValue(), expectedZoom);
                });
            });
        });
    });
});
