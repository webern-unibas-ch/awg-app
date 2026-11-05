import { createEnvironmentInjector, EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';

import { expectSpyCall, expectToBe, expectToEqual, getItemAt } from '@testing/expect-helper';

import { EditionGraphComponent } from './edition-graph.component';
import { EDITION_GRAPH_ROUTES } from './edition-graph.routes';
import { RdfStoreService } from './graph-visualizer/rdf-store/rdf-store.service';

describe('EDITION_GRAPH_ROUTES (DONE)', () => {
    let rdfStoreService: RdfStoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        rdfStoreService = TestBed.inject(RdfStoreService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should have one route for the EditionGraphComponent', () => {
        const graphRoute = getItemAt(EDITION_GRAPH_ROUTES, 0);

        expectToBe(EDITION_GRAPH_ROUTES.length, 1);
        expectToBe(graphRoute.path, '');
        expectToBe(graphRoute.component, EditionGraphComponent);
        expectToEqual(graphRoute.data, { title: 'AWG Online Edition – Graph' });
    });

    it('... should preload the rdfstore module when the route injector is created', () => {
        const preloadSpy = vi.spyOn(rdfStoreService, 'preload').mockResolvedValue(undefined);
        const graphRoute = getItemAt(EDITION_GRAPH_ROUTES, 0);

        const routeInjector = createEnvironmentInjector(
            graphRoute.providers ?? [],
            TestBed.inject(EnvironmentInjector)
        );

        expectSpyCall(preloadSpy, 1);

        routeInjector.destroy();
    });
});
