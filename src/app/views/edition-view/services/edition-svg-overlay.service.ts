import { inject, Injectable } from '@angular/core';

import {
    D3Selection,
    EditionSvgOverlay,
    EditionSvgOverlayActionTypes,
    EditionSvgOverlayState,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';

import { EditionSvgDrawingService } from './edition-svg-drawing.service';

/**
 * The EditionSvgOverlay service.
 *
 * It handles the creation and handling of the SVG overlays for the edition view.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionSvgOverlayService {
    /**
     * Public variable: linkBoxOverlayFillColor.
     *
     * It keeps the fill color for link boxes.
     */
    linkBoxOverlayFillColor = '#dddddd';

    /**
     * Public variable: linkBoxOverlayHoverFillColor.
     *
     * It keeps the fill color for hovered link boxes.
     */
    linkBoxOverlayHoverFillColor = '#eeeeee';

    /**
     * Public variable: tkkOverlayFillColor.
     *
     * It keeps the fill color for tkk overlays.
     */
    tkkOverlayFillColor = 'tomato';

    /**
     * Public variable: tkkOverlayHoverFillColor.
     *
     * It keeps the fill color for hovered tkk overlays.
     */
    tkkOverlayHoverFillColor = 'orange';

    /**
     * Public variable: tkkOverlayTransparentFillColor.
     *
     * It keeps the fill color for transparent tkk overlays.
     */
    tkkOverlayTransparentFillColor = 'transparent';

    /**
     * Public variable: tkkOverlaySelectionFillColor.
     *
     * It keeps the fill color for selected tkk overlays.
     */
    tkkOverlaySelectionFillColor = 'green';

    /**
     * Private variable: _tkkOverlaysState.
     *
     * It keeps the state of the tkk overlays for the svg sheet.
     */
    private _tkkOverlaysState: EditionSvgOverlayState = {
        available: [],
        selected: [],
    };

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
     * Private readonly injection variable: _svgDrawingService.
     *
     * It keeps the instance of the injected EditionSvgDrawingService.
     */
    private readonly _svgDrawingService = inject(EditionSvgDrawingService);

    /**
     * Getter variable: hasAvailableTkkOverlays.
     *
     * Returns true if there are available TKK overlays.
     */
    get hasAvailableTkkOverlays(): boolean {
        return !!this._tkkOverlaysState.available?.length;
    }

    /**
     * Public method: clearSvgOverlays.
     *
     * It clears all SVG overlays.
     *
     * @returns {void} Clears the SVG overlays.
     */
    clearSvgOverlays(): void {
        this._tkkOverlaysState = { available: [], selected: [] };
    }

    /**
     * Public method: createSvgOverlays.
     *
     * It creates the D3 SVG overlays for the textcritical comments and link boxes.
     *
     * @param {D3Selection} rootGroupSelection The given D3 selection of the SVG root group.
     * @param {Function} onLinkBoxSelectFn The callback function for the click event of the link box overlay, which receives the id of the clicked link box group.
     * @param {Function} onTkkOverlaySelectFn The callback function for the click event of the tkk overlay, which receives the list of selected tkk overlays.
     *
     * @returns {void} Creates the D3 SVG sheet overlays.
     */
    createSvgOverlays(
        rootGroupSelection: D3Selection,
        onLinkBoxSelectFn: (id: string) => void,
        onTkkOverlaySelectFn: (selected: EditionSvgOverlay[]) => void
    ): void {
        if (!rootGroupSelection) {
            return;
        }

        // Create link box overlays
        this._createOverlaysByType(
            EditionSvgOverlayTypes.linkBox,
            rootGroupSelection,
            this._tkkOverlaysState,
            () => {},
            group => this._createLinkBoxOverlay(rootGroupSelection, group, onLinkBoxSelectFn)
        );

        // Create tkk overlays
        this._createOverlaysByType(
            EditionSvgOverlayTypes.tkk,
            rootGroupSelection,
            this._tkkOverlaysState,
            onTkkOverlaySelectFn,
            group => this._createTkkOverlay(rootGroupSelection, this._tkkOverlaysState.available, group)
        );
    }

    /**
     * Public method: toggleTkkOverlayHighlights.
     *
     * Toggles highlight on or off for all tkk overlays in the given root group selection.
     *
     * @param {D3Selection} rootGroupSelection The D3 selection of the SVG root group.
     * @param {string} overlayType The overlay type (should be 'tkk').
     * @param {boolean} highlight Whether to highlight (true) or remove highlight (false).
     *
     * @returns {void}
     */
    toggleTkkOverlayHighlights(rootGroupSelection: D3Selection, overlayType: string, highlight: boolean): void {
        if (!rootGroupSelection) {
            return;
        }
        const overlayGroups = this._svgDrawingService.getGroupsBySelector(rootGroupSelection, overlayType);
        if (!overlayGroups) {
            return;
        }

        overlayGroups.nodes().forEach(overlayGroup => {
            const dataId = this._getSvgGroupDataId(overlayGroup as SVGGElement);
            const [overlays, overlayGroupRectSelection] = this._getOverlaysAndSelection(
                rootGroupSelection,
                this._tkkOverlaysState.available,
                dataId,
                overlayType
            );
            const color = highlight ? EditionSvgOverlayActionTypes.fill : EditionSvgOverlayActionTypes.transparent;
            this._updateTkkOverlayColor(overlays, overlayGroupRectSelection, color);
        });
    }

    /**
     * Private method: _createOverlaysByType.
     *
     * It creates the D3 SVG overlays for the given overlayType.
     *
     * @param {string} overlayType The type of the overlay to create.
     * @param {D3Selection} rootGroupSelection The given D3 selection of the SVG root group.
     * @param {EditionSvgOverlayState} overlaysState The state object for the overlays.
     * @param {Function} onTkkOverlaySelectFn The callback function for the click event of the tkk overlay.
     * @param {Function} createOverlayFn The function to create the overlay.
     *
     * @returns {void} Creates the D3 SVG link box overlays.
     */
    private _createOverlaysByType(
        overlayType: string,
        rootGroupSelection: D3Selection,
        overlaysState: EditionSvgOverlayState,
        onTkkOverlaySelectFn: (selectedOverlays: EditionSvgOverlay[]) => void,
        createOverlayFn: (group: SVGGElement, type: string) => void
    ): void {
        const overlayGroups = this._svgDrawingService.getGroupsBySelector(rootGroupSelection, overlayType);
        if (!overlayGroups) {
            return;
        }

        overlayGroups.nodes().forEach(overlayGroup => {
            createOverlayFn(overlayGroup as SVGGElement, overlayType);
        });

        if (overlayType === EditionSvgOverlayTypes.tkk) {
            this._createTkkOverlayHandlers(rootGroupSelection, overlaysState, onTkkOverlaySelectFn, overlayType);
        }
    }

    /**
     * Private method: _createLinkBoxOverlay.
     *
     * It creates the D3 SVG overlay for the given link box group.
     *
     * @param {D3Selection} svgRootGroupSelection The given D3 selection of the SVG root group.
     * @param {SVGGElement} group The given link box group.
     * @param {function} onSelectFn The given callback function for the click event of the link box overlay,
     *                              which receives the id of the clicked link box group.
     *
     * @returns {void} Creates the D3 SVG link box overlay.
     */
    private _createLinkBoxOverlay(
        svgRootGroupSelection: D3Selection,
        group: SVGGElement,
        onSelectFn: (id: string) => void
    ): void {
        const linkBoxGroupId: string = group.id;
        const linkBoxGroupSelection = this._svgDrawingService.getD3SelectionById(svgRootGroupSelection, linkBoxGroupId);
        if (!linkBoxGroupSelection) {
            return;
        }

        const linkBoxGroupPathSelection: D3Selection = linkBoxGroupSelection.select('path');
        linkBoxGroupPathSelection.style('fill', this.linkBoxOverlayFillColor);

        this._createLinkBoxOverlayHandlers(
            linkBoxGroupSelection,
            linkBoxGroupPathSelection,
            linkBoxGroupId,
            onSelectFn
        );
    }

    /**
     * Private method: _createLinkBoxOverlayHandlers.
     *
     * Attaches event handlers for link box overlays.
     *
     * @param {D3Selection} groupSelection The D3 selection of the link box group.
     * @param {D3Selection} pathSelection The D3 selection of the path element.
     * @param {string} groupId The id of the link box group.
     * @param {(id: string) => void} onSelectFn The callback for click events.
     *
     * @returns {void}
     */
    private _createLinkBoxOverlayHandlers(
        groupSelection: D3Selection,
        pathSelection: D3Selection,
        groupId: string,
        onSelectFn: (id: string) => void
    ): void {
        groupSelection
            .on('mouseover', () => {
                const hoverColor = this.linkBoxOverlayHoverFillColor;
                this._svgDrawingService.fillD3SelectionWithColor(pathSelection, hoverColor);
                groupSelection.style('cursor', 'pointer');
            })
            .on('mouseout', () => {
                const fillColor = this.linkBoxOverlayFillColor;
                this._svgDrawingService.fillD3SelectionWithColor(pathSelection, fillColor);
            })
            .on('click', () => {
                onSelectFn(groupId);
            });
    }

    /**
     * Private method: _createTkkOverlay.
     *
     * It creates the D3 SVG overlay for the given tkk group.
     *
     * @param {D3Selection} rootGroupSelection The given D3 selection of the SVG root group.
     * @param {EditionSvgOverlay[]} availableOverlays The given list of available overlays.
     * @param {SVGGElement} group The given tkk group.
     *
     * @returns {void} Creates the D3 SVG tkk overlay.
     */
    private _createTkkOverlay(
        rootGroupSelection: D3Selection,
        availableOverlays: EditionSvgOverlay[],
        group: SVGGElement
    ): void {
        const actualId: string = group.id;
        const dataId: string = this._getSvgGroupDataId(group);
        if (!actualId || !dataId) {
            return;
        }
        const dim: DOMRect = group.getBBox();

        if (!availableOverlays.some(o => o.id === actualId)) {
            availableOverlays.push(new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, actualId, dataId, false));
        }

        this._createTkkOverlayGroup(rootGroupSelection, actualId, dim);
    }

    /**
     * Private method: _createTkkOverlayGroup.
     *
     * It creates an overlay group with an overlay box (rect) for the given tkk group
     * and returns the D3 selection of the created overlay group.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} id The given id.
     * @param {DOMRect} dim The given dimensions of the SVG element.
     *
     * @returns {D3Selection | undefined} The selection of the overlay group, or undefined.
     */
    private _createTkkOverlayGroup(
        svgRootGroup: D3Selection | undefined,
        id: string,
        dim: DOMRect
    ): D3Selection | undefined {
        if (!svgRootGroup || !id) {
            return undefined;
        }

        const type = EditionSvgOverlayTypes.tkk;
        const overlayGroupClass = `${type}-overlay-group`;
        const overlayGroupBoxClass = `${overlayGroupClass}-box`;

        const targetGroupSelection = this._svgDrawingService.getD3SelectionById(svgRootGroup, id);
        if (!targetGroupSelection) {
            return undefined;
        }

        targetGroupSelection.append('g').attr('class', `${overlayGroupClass}`);
        const targetOverlayGroupSelection: D3Selection = targetGroupSelection.select(`g.${overlayGroupClass}`);

        // Create overlay box for target overlay group
        return targetOverlayGroupSelection
            .append('rect')
            .attr('width', dim.width + this._overlayBoxAdditionalSpace * 2)
            .attr('height', dim.height + this._overlayBoxAdditionalSpace * 2)
            .attr('x', dim.x - this._overlayBoxAdditionalSpace)
            .attr('y', dim.y - this._overlayBoxAdditionalSpace)
            .attr('rx', this._overlayBoxCornerRadius)
            .attr('fill', this.tkkOverlayFillColor)
            .attr('opacity', this._overlayBoxesOpacity)
            .attr('class', overlayGroupBoxClass);
    }

    /**
     * Private method: _createTkkOverlayHandlers.
     *
     * Creates event handlers for each unique dataId in tkk overlays.
     *
     * @param {D3Selection} rootGroupSelection The given D3 selection of the SVG root group.
     * @param {EditionSvgOverlayState} overlaysState The state object for the tkk overlays.
     * @param {string} overlayType The overlay type (should be 'tkk').
     * @param {Function} onTkkOverlaySelectFn The callback function for the click event of the tkk overlay,
     *                                        which receives the list of selected tkk overlays.
     *
     * @returns {void}
     */
    private _createTkkOverlayHandlers(
        rootGroupSelection: D3Selection,
        overlaysState: EditionSvgOverlayState,
        onTkkOverlaySelectFn: (selectedOverlays: EditionSvgOverlay[]) => void,
        overlayType: string = EditionSvgOverlayTypes.tkk
    ): void {
        // Get all unique dataIds from overlays
        const dataIds = Array.from(new Set(overlaysState.available.map(o => o.dataId)));
        dataIds.forEach(dataId => {
            const [overlays, overlayGroupRectSelection] = this._getOverlaysAndSelection(
                rootGroupSelection,
                overlaysState.available,
                dataId,
                overlayType
            );
            overlayGroupRectSelection
                .on('mouseover', () => {
                    this._updateTkkOverlayColor(
                        overlays,
                        overlayGroupRectSelection,
                        EditionSvgOverlayActionTypes.hover
                    );
                    overlayGroupRectSelection.style('cursor', 'pointer');
                })
                .on('mouseout', () => {
                    this._updateTkkOverlayColor(overlays, overlayGroupRectSelection, EditionSvgOverlayActionTypes.fill);
                })
                .on('click', () => {
                    if (overlays.length) {
                        overlays.forEach(overlay => (overlay.isSelected = !overlay.isSelected));
                    }
                    this._updateTkkOverlayColor(
                        overlays,
                        overlayGroupRectSelection,
                        EditionSvgOverlayActionTypes.hover
                    );
                    overlaysState.selected = this._getSelectedOverlays(overlaysState.available);
                    onTkkOverlaySelectFn(overlaysState.selected);
                });
        });
    }

    /**
     * Private method: _getOverlayGroupRectSelection.
     *
     * It selects an overlay group box (rect) with a given type from an element identified by the given dataId in the given svgRootGroup.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} dataId The given dataId.
     * @param {string} overlayType The given overlay type.
     *
     * @returns {D3Selection} The D3 selection of the found element.
     */
    private _getOverlayGroupRectSelection(svgRootGroup: D3Selection, dataId: string, overlayType: string): D3Selection {
        if (!svgRootGroup || !dataId || !overlayType) {
            return svgRootGroup?.selectAll(null);
        }
        // Get D3 selection of target group
        const targetGroupSelection = this._svgDrawingService.getD3SelectionByDataId(svgRootGroup, dataId);
        if (!targetGroupSelection) {
            return svgRootGroup.selectAll(null);
        }

        // Get D3 selection of overlay group box
        return targetGroupSelection.selectAll(`rect.${overlayType}-overlay-group-box`);
    }

    /**
     * Private method: _getOverlaysAndSelection.
     *
     * It gets the overlays and the D3 selection rectangle for the given data id and overlay type.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {EditionSvgOverlay[]} availableOverlays The given list of available overlays.
     * @param {string} dataId The given data id.
     * @param {string} overlayType The given overlay type.
     *
     * @returns {[EditionSvgOverlay[], D3Selection]} [overlays, overlayGroupRectSelection] The overlays and the D3 selection rect.
     */
    private _getOverlaysAndSelection(
        svgRootGroup: D3Selection,
        availableOverlays: EditionSvgOverlay[],
        dataId: string,
        overlayType: string
    ): [EditionSvgOverlay[], D3Selection] {
        const overlays = this._getOverlaysById(availableOverlays, dataId);
        const overlayGroupRectSelection = this._getOverlayGroupRectSelection(svgRootGroup, dataId, overlayType);

        return [overlays, overlayGroupRectSelection];
    }

    /**
     * Private method: _getOverlaysById.
     *
     * It filters overlays from a list of overlays by a given data id.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @param {string} dataId The given data id.
     *
     * @returns {EditionSvgOverlay[] } The found overlays.
     */
    private _getOverlaysById(overlays: EditionSvgOverlay[], dataId: string): EditionSvgOverlay[] {
        if (!Array.isArray(overlays)) {
            return [];
        }
        return overlays.filter((overlay: EditionSvgOverlay) => overlay.dataId === dataId);
    }

    /**
     * Private method: _getSelectedOverlays.
     *
     * It filters a given list of overlays by its selection status.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     *
     * @returns {EditionSvgOverlay[] } The selected overlays.
     */
    private _getSelectedOverlays(overlays: EditionSvgOverlay[]): EditionSvgOverlay[] {
        return overlays.filter(overlay => overlay.isSelected);
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
     * It returns the color of the given tkk overlay.
     *
     * @param {EditionSvgOverlay} overlay The given overlay.
     * @param {string} overlayActionType The type of the overlay action (`fill` or `hover`).
     *
     * @returns {string} The color of the given tkk overlay.
     */
    private _getTkkOverlayColor(overlay: EditionSvgOverlay, overlayActionType: EditionSvgOverlayActionTypes): string {
        if (!overlay) {
            return this.tkkOverlayFillColor;
        }

        if (overlayActionType === EditionSvgOverlayActionTypes.transparent) {
            return this.tkkOverlayTransparentFillColor;
        }

        if (overlay.isSelected) {
            return this.tkkOverlaySelectionFillColor;
        }

        return overlayActionType === EditionSvgOverlayActionTypes.hover
            ? this.tkkOverlayHoverFillColor
            : this.tkkOverlayFillColor;
    }

    /**
     * Private method: _updateTkkOverlayColor.
     *
     * It updates the color of the given tkk overlays.
     *
     * @param {EditionSvgOverlay[]} overlays The given overlays.
     * @param {D3Selection} overlayGroupRectSelection The given overlay group rect selection.
     * @param {string} overlayActionType The type of the overlay action (`fill` or `hover`).
     *
     * @returns {void} Updates the color of the given tkk overlays.
     */
    private _updateTkkOverlayColor(
        overlays: EditionSvgOverlay[],
        overlayGroupRectSelection: D3Selection,
        overlayActionType: EditionSvgOverlayActionTypes
    ): void {
        if (!overlays || overlays.length === 0 || !overlayGroupRectSelection || !overlayActionType) {
            return;
        }

        // Compute the color for each overlay
        const colors = overlays.map(overlay => this._getTkkOverlayColor(overlay, overlayActionType));

        // Overlays for the same group should not have different colors
        const uniqueColors = Array.from(new Set(colors));
        if (uniqueColors.length > 1) {
            // eslint-disable-next-line no-console
            console.warn(
                '[EditionSvgOverlayService] Multiple overlays for the same group have different colors:',
                uniqueColors,
                overlays
            );
        }
        const finalColor = uniqueColors[0];

        this._svgDrawingService.fillD3SelectionWithColor(overlayGroupRectSelection, finalColor);
    }
}
