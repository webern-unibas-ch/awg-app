import { inject, Injectable } from '@angular/core';

import {
    D3Selection,
    EditionSvgOverlay,
    EditionSvgOverlayColorState,
    EditionSvgOverlayTarget,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';

import { EditionSvgDrawingService } from './edition-svg-drawing.service';

/**
 * The EditionSvgOverlay service.
 *
 * It draws the SVG overlays for the edition view (tkk overlay boxes)
 * and provides stateless helpers for their interaction (target resolution, colors).
 * The interaction itself (events, selection state) is handled by the consuming component.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionSvgOverlayService {
    /**
     * Private readonly injection variable: _svgDrawingService.
     *
     * It keeps the instance of the injected EditionSvgDrawingService.
     */
    private readonly _svgDrawingService = inject(EditionSvgDrawingService);

    /**
     * Private readonly variable: _tkkOverlayColors.
     *
     * It keeps the fill colors of the tkk overlay boxes per state.
     */
    private readonly _tkkOverlayColors = {
        fill: 'tomato',
        hover: 'orange',
        selected: 'green',
        transparent: 'transparent',
    } as const;

    /**
     * Private readonly variable: _overlayBoxesOpacity.
     *
     * It keeps the default opacity for an overlay box.
     */
    private readonly _overlayBoxesOpacity = 0.3;

    /**
     * Private readonly variable: _overlayBoxAdditionalSpace.
     *
     * It keeps a magic number for (optional) additional space of an overlay box.
     */
    private readonly _overlayBoxAdditionalSpace = 1.5;

    /**
     * Private readonly variable: _overlayBoxCornerRadius.
     *
     * It keeps a magic number for (optional) corner radius of an overlay box.
     */
    private readonly _overlayBoxCornerRadius = 1;

    /**
     * Private readonly variable: _tkkOverlayBoxClass.
     *
     * It keeps the class name of the tkk overlay boxes (rect).
     */
    private readonly _tkkOverlayBoxClass = `${EditionSvgOverlayTypes.tkk}-overlay-group-box`;

    /**
     * Private readonly variable: _tkkOverlayLabel.
     *
     * It keeps the accessible label of the tkk overlay boxes.
     */
    private readonly _tkkOverlayLabel = 'Textkritische Anmerkungen anzeigen';

    /**
     * Private readonly variable: _linkBoxLabel.
     *
     * It keeps the accessible label of the link boxes.
     */
    private readonly _linkBoxLabel = 'Verknüpfte Skizze öffnen';

    /**
     * Public method: createSvgOverlays.
     *
     * It draws the overlay boxes for the tkk groups of the given SVG root group,
     * makes tkk overlay boxes and link boxes keyboard accessible (focusable buttons/links),
     * and returns the available tkk overlays.
     *
     * @param {D3Selection | undefined} rootGroupSelection The given D3 selection of the SVG root group, or undefined.
     *
     * @returns {EditionSvgOverlay[]} The available tkk overlays.
     */
    createSvgOverlays(rootGroupSelection: D3Selection | undefined): EditionSvgOverlay[] {
        if (!rootGroupSelection) {
            return [];
        }

        this._svgDrawingService
            .getGroupsBySelector(rootGroupSelection, EditionSvgOverlayTypes.linkBox)
            ?.attr('tabindex', 0)
            .attr('role', 'link')
            .attr('aria-label', this._linkBoxLabel);

        const tkkGroups = this._svgDrawingService.getGroupsBySelector(rootGroupSelection, EditionSvgOverlayTypes.tkk);
        if (!tkkGroups) {
            return [];
        }

        const overlaysById = new Map<string, EditionSvgOverlay>();
        tkkGroups.nodes().forEach(node => {
            const group = node as SVGGElement;
            const actualId = group.id;
            const dataId = this._getSvgGroupDataId(group);
            if (!actualId || !dataId) {
                return;
            }

            if (!overlaysById.has(actualId)) {
                overlaysById.set(actualId, new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, actualId, dataId));
            }
            this._createTkkOverlayGroup(rootGroupSelection, actualId, group.getBBox());
        });

        return [...overlaysById.values()];
    }

    /**
     * Public method: getSvgOverlayTarget.
     *
     * It resolves the svg overlay (tkk overlay or link box) hit by a given event target.
     *
     * @param {EventTarget | null} target The given event target.
     *
     * @returns {EditionSvgOverlayTarget | undefined} The hit svg overlay, or undefined.
     */
    getSvgOverlayTarget(target: EventTarget | null): EditionSvgOverlayTarget | undefined {
        if (!(target instanceof Element)) {
            return undefined;
        }

        const tkkGroup = target.closest(`rect.${this._tkkOverlayBoxClass}`)?.closest(`g.${EditionSvgOverlayTypes.tkk}`);
        if (tkkGroup) {
            return { type: EditionSvgOverlayTypes.tkk, dataId: this._getSvgGroupDataId(tkkGroup as SVGGElement) };
        }

        const linkBoxGroup = target.closest(`g.${EditionSvgOverlayTypes.linkBox}`);
        if (linkBoxGroup?.id) {
            return { type: EditionSvgOverlayTypes.linkBox, id: linkBoxGroup.id };
        }

        return undefined;
    }

    /**
     * Public method: getTkkDataId.
     *
     * It returns the data id of the tkk overlay hit by a given event target, if any.
     *
     * @param {EventTarget | null} target The given event target.
     *
     * @returns {string | undefined} The data id of the hit tkk overlay, or undefined.
     */
    getTkkDataId(target: EventTarget | null): string | undefined {
        const overlayTarget = this.getSvgOverlayTarget(target);
        return overlayTarget?.type === EditionSvgOverlayTypes.tkk ? overlayTarget.dataId : undefined;
    }

    /**
     * Public method: getTkkOverlaysByDataIds.
     *
     * It returns all tkk overlays (including all parts of multi-part overlays) with one of the given data ids,
     * in their original order.
     *
     * @param {EditionSvgOverlay[]} overlays The given tkk overlays.
     * @param {ReadonlySet<string>} dataIds The given data ids.
     *
     * @returns {EditionSvgOverlay[]} The tkk overlays with one of the given data ids.
     */
    getTkkOverlaysByDataIds(overlays: EditionSvgOverlay[], dataIds: ReadonlySet<string>): EditionSvgOverlay[] {
        return overlays.filter(overlay => dataIds.has(overlay.dataId));
    }

    /**
     * Public method: toggleTkkSelection.
     *
     * It returns a new set of selected data ids with the given data id toggled (added or removed).
     *
     * @param {ReadonlySet<string>} selectedDataIds The given set of selected data ids.
     * @param {string} dataId The given data id to toggle.
     *
     * @returns {ReadonlySet<string>} The new set of selected data ids.
     */
    toggleTkkSelection(selectedDataIds: ReadonlySet<string>, dataId: string): ReadonlySet<string> {
        const updated = new Set(selectedDataIds);
        if (!updated.delete(dataId)) {
            updated.add(dataId);
        }
        return updated;
    }

    /**
     * Public method: updateTkkOverlayColors.
     *
     * It colors the tkk overlay boxes of the given overlays according to the given state
     * (transparent if not highlighted, otherwise selected before hovered before default)
     * and sets their pressed state (aria-pressed) according to the selection.
     * Not highlighted overlay boxes are additionally disabled for pointer and keyboard interaction.
     *
     * @param {D3Selection | undefined} rootGroupSelection The given D3 selection of the SVG root group, or undefined.
     * @param {EditionSvgOverlay[]} overlays The given tkk overlays.
     * @param {EditionSvgOverlayColorState} colorState The given color state.
     *
     * @returns {void} Colors the tkk overlay boxes.
     */
    updateTkkOverlayColors(
        rootGroupSelection: D3Selection | undefined,
        overlays: EditionSvgOverlay[],
        colorState: EditionSvgOverlayColorState
    ): void {
        if (!rootGroupSelection) {
            return;
        }

        const dataIds = new Set(overlays.map(overlay => overlay.dataId));
        dataIds.forEach(dataId => {
            const rectSelection = this._getOverlayGroupRectSelection(rootGroupSelection, dataId);
            this._svgDrawingService.fillD3SelectionWithColor(
                rectSelection,
                this._getTkkOverlayColor(dataId, colorState)
            );
            rectSelection
                .attr('aria-pressed', colorState.selectedDataIds.has(dataId))
                // Hidden (not highlighted) overlay boxes are neither clickable nor focusable
                .attr('tabindex', colorState.isHighlighted ? 0 : -1)
                .attr('aria-hidden', colorState.isHighlighted ? null : true)
                .attr('pointer-events', colorState.isHighlighted ? null : 'none');
        });
    }

    /**
     * Private method: _createTkkOverlayGroup.
     *
     * It creates an overlay group with an overlay box (rect) for the given tkk group.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} id The given id.
     * @param {DOMRect} dim The given dimensions of the SVG element.
     *
     * @returns {void} Creates the overlay group.
     */
    private _createTkkOverlayGroup(svgRootGroup: D3Selection, id: string, dim: DOMRect): void {
        const targetGroupSelection = this._svgDrawingService.getD3SelectionById(svgRootGroup, id);
        if (!targetGroupSelection) {
            return;
        }

        targetGroupSelection
            .append('g')
            .attr('class', `${EditionSvgOverlayTypes.tkk}-overlay-group`)
            .append('rect')
            .attr('width', dim.width + this._overlayBoxAdditionalSpace * 2)
            .attr('height', dim.height + this._overlayBoxAdditionalSpace * 2)
            .attr('x', dim.x - this._overlayBoxAdditionalSpace)
            .attr('y', dim.y - this._overlayBoxAdditionalSpace)
            .attr('rx', this._overlayBoxCornerRadius)
            .attr('fill', this._tkkOverlayColors.fill)
            .attr('opacity', this._overlayBoxesOpacity)
            .attr('class', this._tkkOverlayBoxClass)
            .attr('tabindex', 0)
            .attr('role', 'button')
            .attr('aria-pressed', false)
            .attr('aria-label', this._tkkOverlayLabel);
    }

    /**
     * Private method: _getOverlayGroupRectSelection.
     *
     * It selects the tkk overlay boxes (rect) of the elements identified by the given data id.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} dataId The given data id.
     *
     * @returns {D3Selection} The D3 selection of the found overlay boxes.
     */
    private _getOverlayGroupRectSelection(svgRootGroup: D3Selection, dataId: string): D3Selection {
        const targetGroupSelection = dataId
            ? this._svgDrawingService.getD3SelectionByDataId(svgRootGroup, dataId)
            : undefined;
        if (!targetGroupSelection) {
            return svgRootGroup.selectAll(null);
        }

        return targetGroupSelection.selectAll(`rect.${this._tkkOverlayBoxClass}`);
    }

    /**
     * Private helper: _getSvgGroupDataId.
     *
     * Returns the dataId for a given SVG group.
     * Uses data-tkk-id if present (for multiple SVG refs to the same tkk entry),
     * otherwise uses group id (default).
     *
     * @param {SVGGElement} group The SVG group element.
     *
     * @returns {string} The resolved data id.
     */
    private _getSvgGroupDataId(group: SVGGElement): string {
        return group.getAttribute(EditionSvgOverlayTypes.dataTkkId) || group.id;
    }

    /**
     * Private method: _getTkkOverlayColor.
     *
     * It returns the color of the tkk overlays with the given data id for the given state.
     *
     * @param {string} dataId The given data id.
     * @param {EditionSvgOverlayColorState} colorState The given color state.
     *
     * @returns {string} The color of the tkk overlays.
     */
    private _getTkkOverlayColor(dataId: string, colorState: EditionSvgOverlayColorState): string {
        if (!colorState.isHighlighted) {
            return this._tkkOverlayColors.transparent;
        }
        if (colorState.selectedDataIds.has(dataId)) {
            return this._tkkOverlayColors.selected;
        }
        if (colorState.hoveredDataId === dataId) {
            return this._tkkOverlayColors.hover;
        }
        return this._tkkOverlayColors.fill;
    }
}
