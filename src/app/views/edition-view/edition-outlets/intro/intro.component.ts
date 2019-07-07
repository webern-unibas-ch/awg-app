import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'awg-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroComponent {}
