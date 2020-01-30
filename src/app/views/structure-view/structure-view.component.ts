import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The StructureView component.
 *
 * It contains the structure view section of the app
 * with an {@link HeadingComponent} and a structure overview.
 */
@Component({
    selector: 'awg-structure-view',
    templateUrl: './structure-view.component.html',
    styleUrls: ['./structure-view.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureViewComponent implements OnInit {
    /**
     * Public variable: structureViewTitle.
     *
     * It keeps the title for the heading component
     * of the structure view section.
     */
    structureViewTitle = 'Datenstrukturmodell';

    /**
     * Public variable: structureId.
     *
     * It keeps the id for the heading component
     * of the structure view section.
     */
    structureViewId = 'awg-structure-view';

    /**
     * Constructor of the StructureViewComponent.
     *
     * It declares a private Router instance.
     *
     * @param {Router} router Instance of the Angular router.
     */
    constructor(private router: Router) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.routeToSidenav();
    }

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the structure-info.
     *
     * @returns {void} Activates the structure-info side outlet.
     */
    routeToSidenav(): void {
        // opens the side-info outlet while preserving the router fragment for scrolling
        this.router.navigate([{ outlets: { side: 'structureInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
