import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Inject,
    OnInit,
    ViewChild
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

import { EditionConstants, EditionWork, GraphList } from '@awg-views/edition-view/models';
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
    styleUrls: ['./edition-graph.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
     * Public variable: editionWork.
     *
     * It keeps the information about the current composition.
     */
    editionWork: EditionWork;

    /**
     * Public variable: editionGraphData$.
     *
     * It keeps the observable of the edition graph data.
     */
    editionGraphData$: Observable<GraphList | never>;

    /**
     * Readonly constant: graphImages.
     *
     * It keeps the paths to static graph images.
     */
    readonly graphImages = {
        op12: '',
        op25: EditionConstants.graphImageOp25.route
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
     * HostListener: document:fullscreenchange.
     *
     * It listens for fullscreen exit with ESC key.
     */
    @HostListener('document:fullscreenchange', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (
            !this.document.fullscreenElement && // alternative standard method
            !this.document.mozFullScreenElement &&
            !this.document.webkitFullscreenElement
        ) {
            this.isFullscreen = false;
        }
    }

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
     * It gets the the current edition work of the edition service
     * and the observable of the corresponding graph data
     * from the EditionDataService.
     *
     * @returns {void} Gets the current edition work and the corresponding graph data.
     */
    getEditionGraphData(): void {
        this.editionGraphData$ = this.editionService
            // get current editionWork from editionService
            .getEditionWork()
            .pipe(
                switchMap((work: EditionWork) => {
                    // set current editionWork
                    this.editionWork = work;
                    // get graph data from editionDataService
                    return this.editionDataService.getEditionGraphData(this.editionWork);
                }),
                // error handling
                catchError(err => {
                    // set error object
                    this.errorObject = err;
                    // return empty observable to complete observable without data
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
            !this.document.fullscreenElement && // alternative standard method
            !this.document.mozFullScreenElement &&
            !this.document.webkitFullscreenElement
        ) {
            // current working methods
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
