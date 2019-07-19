import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Intro component.
 *
 * It contains the intro section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroComponent {}
