import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    HostListener,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

import { EditionComplex, EditionGraphImageConstants, GraphList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';
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
     * Readonly constant: GRAPH_IMAGES.
     *
     * It keeps the paths to static graph images.
     */
    readonly GRAPH_IMAGES = {
        OP12: '',
        OP25: EditionGraphImageConstants.GRAPH_IMAGE_OP25.route,
    };

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
     * Constructor of the EditionGraphComponent.
     *
     * It declares a private instances of
     * the EditionDataService and EditionService.
     *
     * @param {EditionDataService} editionDataService Instance of the EditionDataService.
     * @param {EditionService} editionService Instance of the EditionService.
     * @param {DOCUMENT} document Instance of DOCUMENT:
     */
    constructor(
        private editionDataService: EditionDataService,
        private editionService: EditionService,
        @Inject(DOCUMENT) private document: any
    ) {
        this.ref = this;
    }

    /**
     * HostListener: document:fullscreenchange.
     *
     * It listens for fullscreen exit with ESC key.
     */
    @HostListener('document:fullscreenchange', ['$event']) onKeydownHandler(_event: KeyboardEvent) {
        if (
            !this.document.fullscreenElement && // Alternative standard method
            !this.document.mozFullScreenElement &&
            !this.document.webkitFullscreenElement
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
     * It gets the current edition complex of the edition service
     * and the observable of the corresponding graph data
     * from the EditionDataService.
     *
     * @returns {void} Gets the current edition complex and the corresponding graph data.
     */
    getEditionGraphData(): void {
        this.editionGraphData$ = this.editionService
            // Get current editionComplex from editionService
            .getEditionComplex()
            .pipe(
                switchMap((complex: EditionComplex) => {
                    // Set current editionComplex
                    this.editionComplex = complex;
                    // Get graph data from editionDataService
                    return this.editionDataService.getEditionGraphData(this.editionComplex);
                }),
                // Error handling
                catchError(err => {
                    // Set error object
                    this.errorObject = err;
                    // Return empty observable to complete observable without data
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
            !this.document.fullscreenElement && // Alternative standard method
            !this.document.mozFullScreenElement &&
            !this.document.webkitFullscreenElement
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
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        } else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        } else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        } else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }
        this.isFullscreen = false;
    }
}
