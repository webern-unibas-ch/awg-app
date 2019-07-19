import { Component } from '@angular/core';

/**
 * The ViewContainer component.
 *
 * It contains the views section of the app and
 * declares the main outlet that loads the
 * views components and the secondary outlet ('side')
 * that loads the side-info components.
 */
@Component({
    selector: 'awg-view-container',
    templateUrl: './view-container.component.html',
    styleUrls: ['./view-container.component.css']
})
export class ViewContainerComponent {}
