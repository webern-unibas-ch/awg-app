import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    HostListener,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';

import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

import { UtilityService } from '@awg-core/services';
import { EDITION_GRAPH_IMAGES_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, GraphList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

import { GraphVisualizerComponent } from './graph-visualizer';

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
})
export class EditionGraphComponent implements OnInit {
    /**
     * ViewChild variable: child.
     *
     * It keeps the reference to the GraphVisualizerComponent child.
     */
    @ViewChild(GraphVisualizerComponent) child: GraphVisualizerComponent;

    /**
     * HostBinding: isFullscreen.
     *
     * It binds to the is-fullscreen CSS class.
     */
    @HostBinding('class.is-fullscreen') isFullscreen = false;

    /**
     * Public variable: faExpand.
     *
     * It instantiates fontawesome's faExpand icon.
     */
    faExpand = faExpand;

    /**
     * Public variable: faCompress.
     *
     * It instantiates fontawesome's faCompress icon.
     */
    faCompress = faCompress;

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
     * Public readonly injection variable: UTILS.
     *
     * It keeps the instance of the injected UtilityService.
     */
    readonly UTILS = inject(UtilityService);

    /**
     * Private readonly injection variable: _document.
     *
     * It keeps the instance of the injected DOCUMENT.
     */
    private readonly _document: any = inject(DOCUMENT);

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
     * HostListener: document:fullscreenchange.
     *
     * It listens for fullscreen exit with ESC key.
     */
    @HostListener('document:fullscreenchange', ['$event']) onKeydownHandler(_event: KeyboardEvent) {
        if (
            !this._document.fullscreenElement && // Alternative standard method
            !this._document.mozFullScreenElement &&
            !this._document.webkitFullscreenElement
        ) {
            this.isFullscreen = false;
        }
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

    /**
     * Public method: openFullscreen.
     *
     * It activates fullscreen mode and sets isFullscreen flag to true.
     *
     * @returns {void} Sets isFullscreen flag to true.
     */
    openFullscreen(): void {
        const el = this.child.fs.nativeElement;

        this.isFullscreen = true;
        if (
            !this._document.fullscreenElement && // Alternative standard method
            !this._document.mozFullScreenElement &&
            !this._document.webkitFullscreenElement
        ) {
            // Current working methods
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                /* Firefox */
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
                /* IE/Edge */
                el.msRequestFullscreen();
            }
        }
    }

    /**
     * Public method: closeFullscreen.
     *
     * It closes fullscreen mode and sets isFullscreen flag to false.
     *
     * @returns {void} Sets isFullscreen flag to false.
     */
    closeFullscreen(): void {
        if (this._document.exitFullscreen) {
            this._document.exitFullscreen();
        } else if (this._document.mozCancelFullScreen) {
            /* Firefox */
            this._document.mozCancelFullScreen();
        } else if (this._document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this._document.webkitExitFullscreen();
        } else if (this._document.msExitFullscreen) {
            /* IE/Edge */
            this._document.msExitFullscreen();
        }
        this.isFullscreen = false;
    }
}
