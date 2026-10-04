import { inject, Injectable } from '@angular/core';

import {
    D3Selection,
    EditionSvgOverlay,
    EditionSvgOverlaysState,
    EditionSvgOverlayTkk,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';
import { DATA_TKK_ID } from '@awg-views/edition-view/models/edition-svg-overlay.model';

import { EditionSvgDrawingService } from './edition-svg-drawing.service';

/**
 * The EditionSvgOverlay service.
 *
 * It draws the SVG overlays for the edition view (tkk overlay boxes)
 * and provides stateless helpers for their interaction (target resolution, state transitions, colors).
 * The state itself and the events are held and handled by the consuming component.
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
     * @returns {EditionSvgOverlayTkk[]} The available tkk overlays.
     */
    createSvgOverlays(rootGroupSelection: D3Selection | undefined): EditionSvgOverlayTkk[] {
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

        const overlaysById = new Map<string, EditionSvgOverlayTkk>();
        tkkGroups.nodes().forEach(node => {
            const group = node as SVGGElement;
            const actualId = group.id;
            const dataId = this._getSvgGroupDataId(group);
            if (!actualId || !dataId) {
                return;
            }

            if (!overlaysById.has(actualId)) {
                overlaysById.set(actualId, { type: EditionSvgOverlayTypes.tkk, id: actualId, dataId });
            }
            this._createTkkOverlayGroup(rootGroupSelection, actualId, group.getBBox());
        });

        return [...overlaysById.values()];
    }

    /**
     * Public method: getSvgOverlay.
     *
     * It resolves the svg overlay (tkk overlay or link box overlay) hit by a given event target.
     *
     * @param {EventTarget | null} target The given event target.
     *
     * @returns {EditionSvgOverlay | undefined} The hit svg overlay, or undefined.
     */
    getSvgOverlay(target: EventTarget | null): EditionSvgOverlay | undefined {
        if (!(target instanceof Element)) {
            return undefined;
        }

        const tkkGroup = target.closest(`rect.${this._tkkOverlayBoxClass}`)?.closest(`g.${EditionSvgOverlayTypes.tkk}`);
        if (tkkGroup) {
            return {
                type: EditionSvgOverlayTypes.tkk,
                id: tkkGroup.id,
                dataId: this._getSvgGroupDataId(tkkGroup as SVGGElement),
            };
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
        const overlay = this.getSvgOverlay(target);
        return overlay?.type === EditionSvgOverlayTypes.tkk ? overlay.dataId : undefined;
    }

    /**
     * Public method: createSvgOverlaysState.
     *
     * It returns the initial state of the svg overlays with the given tkk overlays
     * (nothing selected or hovered, highlighted).
     *
     * @param {EditionSvgOverlayTkk[]} [tkkOverlays] The given tkk overlays (default: none).
     *
     * @returns {EditionSvgOverlaysState} The initial state of the svg overlays.
     */
    createSvgOverlaysState(tkkOverlays: EditionSvgOverlayTkk[] = []): EditionSvgOverlaysState {
        return { tkkOverlays, selectedDataIds: new Set(), hoveredDataId: undefined, isHighlighted: true };
    }

    /**
     * Public method: getSelectedTkkOverlays.
     *
     * It returns all selected tkk overlays of the given state
     * (including all parts of multi-part overlays) in their original order.
     *
     * @param {EditionSvgOverlaysState} state The given state of the svg overlays.
     *
     * @returns {EditionSvgOverlayTkk[]} The selected tkk overlays.
     */
    getSelectedTkkOverlays(state: EditionSvgOverlaysState): EditionSvgOverlayTkk[] {
        return state.tkkOverlays.filter(overlay => state.selectedDataIds.has(overlay.dataId));
    }

    /**
     * Public method: setTkkOverlayHover.
     *
     * It returns the given state with the given data id as hovered tkk overlay
     * (the same state if it is already hovered).
     *
     * @param {EditionSvgOverlaysState} state The given state of the svg overlays.
     * @param {string | undefined} dataId The given data id of the hovered tkk overlay, or undefined.
     *
     * @returns {EditionSvgOverlaysState} The updated state of the svg overlays.
     */
    setTkkOverlayHover(state: EditionSvgOverlaysState, dataId: string | undefined): EditionSvgOverlaysState {
        return state.hoveredDataId === dataId ? state : { ...state, hoveredDataId: dataId };
    }

    /**
     * Public method: setTkkOverlaysHighlight.
     *
     * It returns the given state with the given highlighting of the tkk overlays
     * (the same state if unchanged). Hiding the tkk overlays also clears their selection.
     *
     * @param {EditionSvgOverlaysState} state The given state of the svg overlays.
     * @param {boolean} isHighlighted The given flag whether the tkk overlays are highlighted.
     *
     * @returns {EditionSvgOverlaysState} The updated state of the svg overlays.
     */
    setTkkOverlaysHighlight(state: EditionSvgOverlaysState, isHighlighted: boolean): EditionSvgOverlaysState {
        if (state.isHighlighted === isHighlighted) {
            return state;
        }
        const selectedDataIds =
            isHighlighted || !state.selectedDataIds.size ? state.selectedDataIds : new Set<string>();
        return { ...state, isHighlighted, selectedDataIds };
    }

    /**
     * Public method: toggleTkkOverlaySelection.
     *
     * It returns the given state with the selection of the tkk overlay(s) with the given data id toggled
     * (added or removed).
     *
     * @param {EditionSvgOverlaysState} state The given state of the svg overlays.
     * @param {string} dataId The given data id to toggle.
     *
     * @returns {EditionSvgOverlaysState} The updated state of the svg overlays.
     */
    toggleTkkOverlaySelection(state: EditionSvgOverlaysState, dataId: string): EditionSvgOverlaysState {
        const selectedDataIds = new Set(state.selectedDataIds);
        if (!selectedDataIds.delete(dataId)) {
            selectedDataIds.add(dataId);
        }
        return { ...state, selectedDataIds };
    }

    /**
     * Public method: updateTkkOverlays.
     *
     * It updates the tkk overlay boxes according to the given state:
     * it colors them (transparent if not highlighted, otherwise selected before hovered before default),
     * sets their pressed state (aria-pressed) according to the selection,
     * and disables not highlighted overlay boxes for pointer and keyboard interaction.
     *
     * @param {D3Selection | undefined} rootGroupSelection The given D3 selection of the SVG root group, or undefined.
     * @param {EditionSvgOverlaysState} state The given state of the svg overlays.
     *
     * @returns {void} Updates the tkk overlay boxes.
     */
    updateTkkOverlays(rootGroupSelection: D3Selection | undefined, state: EditionSvgOverlaysState): void {
        if (!rootGroupSelection || !state.tkkOverlays.length) {
            return;
        }

        const dataIds = new Set(state.tkkOverlays.map(overlay => overlay.dataId));
        dataIds.forEach(dataId => {
            const rectSelection = this._getOverlayGroupRectSelection(rootGroupSelection, dataId);
            this._svgDrawingService.fillD3SelectionWithColor(rectSelection, this._getTkkOverlayColor(dataId, state));
            rectSelection
                .attr('aria-pressed', state.selectedDataIds.has(dataId))
                // Hidden (not highlighted) overlay boxes are neither clickable nor focusable
                .attr('tabindex', state.isHighlighted ? 0 : -1)
                .attr('aria-hidden', state.isHighlighted ? null : true)
                .attr('pointer-events', state.isHighlighted ? null : 'none');
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
        return group.getAttribute(DATA_TKK_ID) || group.id;
    }

    /**
     * Private method: _getTkkOverlayColor.
     *
     * It returns the color of the tkk overlays with the given data id for the given state.
     *
     * @param {string} dataId The given data id.
     * @param {EditionSvgOverlaysState} state The given state of the svg overlays.
     *
     * @returns {string} The color of the tkk overlays.
     */
    private _getTkkOverlayColor(dataId: string, state: EditionSvgOverlaysState): string {
        if (!state.isHighlighted) {
            return this._tkkOverlayColors.transparent;
        }
        if (state.selectedDataIds.has(dataId)) {
            return this._tkkOverlayColors.selected;
        }
        if (state.hoveredDataId === dataId) {
            return this._tkkOverlayColors.hover;
        }
        return this._tkkOverlayColors.fill;
    }
}
