import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UtilityService } from '@awg-core/services/utility-service/utility.service';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, GraphList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionGraph component.
 *
 * It contains the graph section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-graph',
    templateUrl: './edition-graph.component.html',
    styleUrls: ['./edition-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionGraphComponent implements OnInit {
    /**
     * Public readonly injection variable: utils.
     *
     * It keeps the instance of the injected UtilityService.
     */
    readonly utils = inject(UtilityService);

    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _fullscreenService.
     *
     * It keeps the instance of the injected FullscreenService.
     */
    private readonly _fullscreenService = inject(FullscreenService);

    /**
     * Public variable: editionComplex.
     *
     * It keeps the information about the current edition complex.
     */
    editionComplex: EditionComplex;

    /**
     * Public variable: editionGraphData$.
     *
     * It keeps the observable of the edition graph data.
     */
    editionGraphData$: Observable<GraphList | never>;

    /**
     * Public variable: errorObject.
     *
     * It keeps an errorObject for the service calls.
     */
    errorObject = null;

    /**
     * Readonly signal: isFullscreen.
     *
     * It holds the fullscreen mode status.
     */
    readonly isFullscreen = this._fullscreenService.isFullscreen;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionGraphComponent;

    /**
     * Readonly variable: GRAPH_IMAGES.
     *
     * It keeps the paths to static graph images.
     */
    readonly GRAPH_IMAGES = {
        OP12: '',
        OP25: EDITION_GRAPH_IMAGES_DATA.GRAPH_IMAGE_OP25.route,
    };

    /**
     * Constructor of the EditionGraphComponent.
     *
     * It initializes the self-referring variable needed for CompileHtml library.
     *
     */
    constructor() {
        this.ref = this;
    }

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getEditionGraphData();
    }

    /**
     * Public method: getEditionGraphData.
     *
     * It gets the current edition complex from the EditionStateService
     * and the observable of the corresponding graph data
     * from the EditionDataService.
     *
     * @returns {void} Gets the current edition complex and the corresponding graph data.
     */
    getEditionGraphData(): void {
        this.editionGraphData$ = this._editionStateService.getSelectedEditionComplex().pipe(
            switchMap((complex: EditionComplex) => {
                this.editionComplex = complex;
                return this._editionDataService.getEditionGraphData(this.editionComplex);
            }),
            catchError(err => {
                this.errorObject = err;
                return EMPTY;
            })
        );
    }
}
