import { computed, Service, Signal } from '@angular/core';

import { LabeledRoute } from '@awg-shared/models/labeled-route.model';

import { EDITION_ROUTE_CONSTANTS } from '../edition-routes.constants';
import { EditionComplex } from '../models/edition-complex.model';
import { EditionViewContext } from '../models/edition-data.model';
import {
    EditionOutlineComplexItem,
    EditionOutlineSection,
    EditionOutlineSeries,
} from '../models/edition-outline.model';

/**
 * The EditionBreadcrumbService.
 *
 * It provides the labeled route items for the breadcrumb of the edition view.
 */
@Service()
export class EditionBreadcrumbService {
    /**
     * Public method: getBreadcrumbItems.
     *
     * It returns the labeled route items for the breadcrumb of the edition view.
     *
     * @param {Signal<EditionViewContext>} viewContext The current view context.
     * @param {Signal<EditionComplex | null>} editionComplex The selected edition complex.
     * @param {Signal<EditionOutlineComplexItem | null>} editionOutlineComplexItem The outline item of the selected edition complex.
     * @param {Signal<EditionOutlineSeries | null>} editionSeries The selected edition series.
     * @param {Signal<EditionOutlineSection | null>} editionSection The selected edition section.
     * @returns {Signal<LabeledRoute[]>} The labeled route items for the breadcrumb of the edition view.
     */
    getBreadcrumbItems(
        viewContext: Signal<EditionViewContext>,
        editionComplex: Signal<EditionComplex | null>,
        editionOutlineComplexItem: Signal<EditionOutlineComplexItem | null>,
        editionSeries: Signal<EditionOutlineSeries | null>,
        editionSection: Signal<EditionOutlineSection | null>
    ): Signal<LabeledRoute[]> {
        return computed<LabeledRoute[]>(() => {
            const context = viewContext();
            const complex = editionComplex();
            const outlineComplexItem = editionOutlineComplexItem();
            const series = editionSeries();
            const section = editionSection();

            const { EDITION, SERIES, PREFACE, ROWTABLES } = EDITION_ROUTE_CONSTANTS;

            const editionRootRoute = [EDITION.route, SERIES.route];
            const editionRootItem: LabeledRoute = { label: EDITION.short, route: editionRootRoute };

            if (context.isPreface) {
                return [editionRootItem, { label: PREFACE.short, route: [] }];
            }

            if (context.isRowtables) {
                return [editionRootItem, { label: ROWTABLES.full, route: [] }];
            }

            if (complex) {
                return this._getComplexBreadcrumbs(editionRootItem, complex, outlineComplexItem);
            }

            return this._getOverviewBreadcrumbs(editionRootItem, context, series, section);
        });
    }

    /**
     * Private method: _getComplexBreadcrumbs.
     *
     * It returns the labeled route items for the breadcrumb of a selected edition complex.
     * For a part of a composite edition complex, the composite complex (e.g. Op. 12)
     * is placed before the part (e.g. M 217).
     *
     * @param {LabeledRoute} rootItem The root labeled route item.
     * @param {EditionComplex} complex The selected edition complex.
     * @param {EditionOutlineComplexItem | null} outlineComplexItem The outline item of the selected edition complex.
     * @returns {LabeledRoute[]} The labeled route items for the breadcrumb of a selected edition complex.
     */
    private _getComplexBreadcrumbs(
        rootItem: LabeledRoute,
        complex: EditionComplex,
        outlineComplexItem: EditionOutlineComplexItem | null
    ): LabeledRoute[] {
        const { series, section, labeledSectionRoute } = complex.pubStatement;
        const composite = outlineComplexItem?.compositeComplexes?.[0];

        return [
            rootItem,
            { label: series.full, route: [...rootItem.route, series.route] },
            { label: section.full, route: labeledSectionRoute.route },
            ...(composite
                ? [
                      {
                          label: composite.complex.complexId.short,
                          route: composite.disabled ? [] : [composite.complex.baseRoute],
                      },
                  ]
                : []),
            { label: complex.complexId.short, route: [] },
        ];
    }

    /**
     * Private method: _getOverviewBreadcrumbs.
     *
     * It returns the labeled route items for the breadcrumb of the overview pages (series, section, intro).
     *
     * @param {LabeledRoute} rootItem The root labeled route item.
     * @param {EditionViewContext} context The current view context.
     * @param {EditionOutlineSeries | null} series The selected edition series.
     * @param {EditionOutlineSection | null} section The selected edition section.
     * @returns {LabeledRoute[]} The labeled route items for the breadcrumb of the overview page.
     */
    private _getOverviewBreadcrumbs(
        rootItem: LabeledRoute,
        context: EditionViewContext,
        series: EditionOutlineSeries | null,
        section: EditionOutlineSection | null
    ): LabeledRoute[] {
        const { EDITION_INTRO, SERIES } = EDITION_ROUTE_CONSTANTS;

        if (series) {
            const seriesRouteSegment = section ? [...rootItem.route, series.series.route] : [];

            return [
                rootItem,
                { label: series.series.full, route: seriesRouteSegment },
                ...(section
                    ? [
                          {
                              label: section.section.full,
                              route: context.isIntro ? section.labeledRoute.route : [],
                          },
                      ]
                    : []),
                ...(section && context.isIntro ? [{ label: EDITION_INTRO.full, route: [] }] : []),
            ];
        }

        return [
            { ...rootItem, route: [] },
            { label: SERIES.full, route: [] },
        ];
    }
}
