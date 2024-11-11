import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

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
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Private readonly injection variable: _dataApiService.
     *
     * It keeps the instance of the injected DataApiService.
     */
    private readonly _dataApiService = inject(DataApiService);

    /**
     * Private readonly injection variable: _dataStreamerService.
     *
     * It keeps the instance of the injected DataStreamerService.
     */
    private readonly _dataStreamerService = inject(DataStreamerService);

    /**
     * Private readonly injection variable: _gndService.
     *
     * It keeps the instance of the injected GndService.
     */
    private readonly _gndService = inject(GndService);

    /**
     * Private readonly injection variable: _loadingService.
     *
     * It keeps the instance of the injected LoadingService.
     */
    private readonly _loadingService = inject(LoadingService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Private readonly injection variable: _router.
     *
     * It keeps the instance of the injected Angular Router.
     */
    private readonly _router = inject(Router);

    /**
     * Gets the httpGetUrl from the {@link DataApiService}.
     *
     * @returns {string}
     */
    get httpGetUrl(): string {
        return this._dataApiService.httpGetUrl;
    }

    /**
     * Gets the loading status observable from the {@link LoadingService}.
     *
     * @returns {Observable<boolean>}
     */
    get isLoading$(): Observable<boolean> {
        return this._loadingService.getLoadingStatus();
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.navigateToSideOutlet();
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
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this._route),
                switchMap((route: ActivatedRoute) => {
                    // Snapshot of current route query params
                    const params = this._route.snapshot.paramMap;

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
                    return this._dataApiService.getResourceData(resourceId);
                }),
                takeUntil(this._destroyed$)
            )
            .subscribe({
                next: (data: ResourceData) => {
                    // Subscribe to resource data to trigger loading service
                    this.resourceData = data;
                },
                error: err => (this.errorMessage = err),
            });
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
        this._router.navigate([route], {
            relativeTo: this._route,
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
        this._dataStreamerService.updateResourceId(id);
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
     *
     * @returns {void} Navigates to the resource.
     */
    navigateToResource(id?: string): void {
        const nextId = id ?? this.oldId ?? this.resourceId;

        // Save current resourceId as oldId
        this.oldId = this.resourceId;

        // Navigate to resource with the nextId
        this._router.navigate(['/data/resource', +nextId]);
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
        this._gndService.exposeGnd(gndEvent);
    }

    /**
     * Public method: navigateToSideOutlet.
     *
     * It activates the side outlet with the resource-info.
     *
     * @returns {void} Activates the resource-info side outlet.
     */
    navigateToSideOutlet(): void {
        this._router.navigate([{ outlets: { side: 'resourceInfo' } }], {
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
        // Navigate to an empty outlet to clear the side outlet
        this._router.navigate([{ outlets: { side: null } }]);

        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself:
        this._destroyed$.complete();
    }
}
