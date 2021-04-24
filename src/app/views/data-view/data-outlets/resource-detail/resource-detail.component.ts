import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { DataStreamerService, GndService, LoadingService } from '@awg-core/services';
import { GndEvent } from '@awg-core/services/gnd-service';
import { DataApiService } from '@awg-views/data-view/services';

import { ResourceData } from '@awg-views/data-view/models';

/**
 * The ResourceDetail component.
 *
 * It contains the resource detail section
 * of the data (search) view of the app
 * with a {@link TwelveToneSpinnerComponent}
 * and an ng-bootstrap navbar that contains
 * the {@link ResourceDetailHeaderComponent},
 * {@link ResourceDetailHtmlComponent},
 * {@link ResourceDetailJsonConvertedComponent}
 * and the {@link ResourceDetailJsonRawComponent}.
 */
@Component({
    selector: 'awg-resource-detail',
    templateUrl: './resource-detail.component.html',
    styleUrls: ['./resource-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ResourceDetailComponent implements OnInit, OnDestroy {
    /**
     * Public variable: errorMessage.
     *
     * It keeps an errorMessage for the resource data subscription.
     */
    errorMessage: any = undefined;

    /**
     * Public variable: oldId.
     *
     * It keeps the id of the previous resource detail.
     */
    oldId: string;

    /**
     * Public variable: resourceData.
     *
     * It keeps the data of the resource detail.
     */
    resourceData: ResourceData;

    /**
     * Public variable: resourceId.
     *
     * It keeps the id of the current resource detail.
     */
    resourceId: string;

    /**
     * Public variable: tabTitles.
     *
     * It keeps the titles for the tab panels.
     */
    tabTitles = {
        html: 'Detail',
        raw: 'JSON (raw)',
        converted: 'JSON (converted)',
    };

    /**
     * Getter for the httpGetUrl of the {@link DataApiService}.
     */
    get httpGetUrl(): string {
        return this.dataApiService.httpGetUrl;
    }

    /**
     * Getter for the loading status observable of the {@link LoadingService}.
     */
    get isLoading$(): Observable<boolean> {
        return this.loadingService.getLoadingStatus();
    }

    /**
     * Private variable: _destroy$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the ResourceDetailComponent.
     *
     * It declares private instances of the Angular ActivatedRoute,
     * the Angular Router, the DataApiService, the DataStreamerService,
     * the GndService, and the LoadingService.
     *
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {Router} router Instance of the Angular Router.
     * @param {DataApiService} dataApiService Instance of the DataApiService.
     * @param {DataStreamerService} dataStreamerService Instance of the DataStreamerService.
     * @param {GndService} gndService Instance of the GndService.
     * @param {LoadingService} loadingService Instance of the LoadingService.
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataApiService: DataApiService,
        private dataStreamerService: DataStreamerService,
        private gndService: GndService,
        private loadingService: LoadingService
    ) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.routeToSidenav();
        this.getResourceData();
    }

    /**
     * Public method: getResourceData.
     *
     * It gets the resource id from the route params
     * and fetches the corresponding resource data
     * from the {@link DataApiService}.
     *
     * @returns {void} Sets the resource data.
     */
    getResourceData(): void {
        // Observe route params
        this.route.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    // Short cut for id param
                    const id = params.get('id');

                    // Update current resource id via streamer service
                    this.updateResourceId(id);

                    // Fetch resource data depending on param id
                    return this.dataApiService.getResourceData(id);
                }),
                takeUntil(this._destroy$)
            )
            .subscribe(
                (data: ResourceData) => {
                    // Subscribe to resource data to trigger loading service
                    this.resourceData = data;
                },
                err => (this.errorMessage = err)
            );
    }

    /**
     * Public method: updateResourceId.
     *
     * It updates the resource id in the component
     * and the streamer service.
     *
     * @param {string} id The given resource id.
     *
     * @returns {void} Sets the resource id.
     */
    updateResourceId(id: string): void {
        // Store current resource id
        this.resourceId = id;

        // Share current id via streamer service
        this.dataStreamerService.updateResourceId(id);
    }

    /**
     * Public method: navigateToResource.
     *
     * It navigates to the '/data/resource' route
     * with the given id.
     *
     * If nextId is emitted, use nextId for navigation,
     * else navigate to oldId (backButton). If oldId
     * not exists (first call), use resourceId.
     *
     * @param {string} [id] The given resource id.
     * @returns {void} Navigates to the resource.
     */
    navigateToResource(id?: string): void {
        const nextId = id ? id : this.oldId ? this.oldId : this.resourceId;

        // Save resourceId as oldId
        this.oldId = this.resourceId;

        // Navigate to new resource
        this.router.navigate(['/data/resource', +nextId]);
    }

    /**
     * Public method: exposeGnd.
     *
     * It delegates a given gnd event type ('set', 'get', 'remove')
     * with a given value to the {@link GndService}.
     * The gnd event is emitted from the {@link ResourceDetailHtmlContentPropsComponent}.
     *
     * @param {{type: string, value: string}} gndEvent The given event.
     *
     * @returns {void} Delegates the event to the GndService.
     */
    exposeGnd(gndEvent: GndEvent): void {
        if (!gndEvent) {
            return;
        }
        this.gndService.exposeGnd(gndEvent);
    }

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the resource-info.
     *
     * @returns {void} Activates the resource-info side outlet.
     */
    routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve',
        });
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroy$.next(true);

        // Now let's also unsubscribe from the subject itself:
        this._destroy$.unsubscribe();
    }
}
