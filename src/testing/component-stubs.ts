import { Component, input } from '@angular/core';

// ============================================================================
// SHARED STUBS
// ============================================================================

@Component({
    selector: 'awg-alert-error',
    template: '',
})
export class AlertErrorStubComponent {
    readonly errorObject = input.required<any>();
}

@Component({
    selector: 'awg-fullscreen-toggle',
    template: '',
})
export class FullscreenToggleStubComponent {
    readonly fsElement = input.required<HTMLElement>();
}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
})
export class TwelveToneSpinnerStubComponent {
    readonly spinnerText = input<string>('loading');
}
