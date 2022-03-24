import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

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
    styleUrls: ['./resource-detail.component.scss'],
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
     * Public variable: resourceDetailTabTitles.
     *
     * It keeps the titles for the tab panels.
     */
    resourceDetailTabTitles = {
        html: 'Detail',
        raw: 'JSON (raw)',
        converted: 'JSON (converted)',
    };

    /**
     * Public variable: selectedResourceDetailTabId.
     *
     * It keeps the id of the selected tab panel.
     */
    selectedResourceDetailTabId: string;

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

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
     * Gets the httpGetUrl from the {@link DataApiService}.
     *
     * @returns {string}
     */
    get httpGetUrl(): string {
        return this.dataApiService.httpGetUrl;
    }

    /**
     * Gets the loading status observable from the {@link LoadingService}.
     *
     * @returns {Observable<boolean>}
     */
    get isLoading$(): Observable<boolean> {
        return this.loadingService.getLoadingStatus();
    }

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
     * It gets the resource id from the route params and fetches
     * the corresponding resource data from the {@link DataApiService}.
     *
     * @returns {void} Sets the resource data.
     */
    getResourceData(): void {
        // Observe route params
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.route),
                switchMap((route: ActivatedRoute) => {
                    // Snapshot of current route query params
                    const params = this.route.snapshot.paramMap;

                    // Shortcut for resource id param
                    const resourceId = params.get('id');

                    while (route.firstChild) {
                        route = route.firstChild;
                    }

                    // Snapshot of tab route
                    this.selectedResourceDetailTabId = route.snapshot.url[0].path;

                    // Update current resource id via streamer service
                    this.updateResourceId(resourceId);

                    // Fetch resource data depending on param id
                    return this.dataApiService.getResourceData(resourceId);
                }),
                takeUntil(this._destroyed$)
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
     * Public method: onResourceDetailTabChange.
     *
     * It triggers the {@link _routeToSelf} method after a
     * tab change request to update the URL.
     *
     * @param {NgbNavChangeEvent} tabEvent The given tabEvent with an id of the next route (nextId).
     *
     * @returns {void} Routes to itself with the given id as route.
     */
    onResourceDetailTabChange(tabEvent: NgbNavChangeEvent): void {
        const route = tabEvent.nextId;
        // Route to new tab
        this.router.navigate([route], {
            relativeTo: this.route,
        });
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
     * It calls the containing methods when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself:
        this._destroyed$.complete();
    }
}
