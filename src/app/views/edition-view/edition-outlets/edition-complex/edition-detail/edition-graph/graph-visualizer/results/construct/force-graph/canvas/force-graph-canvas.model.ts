import type { ZoomTransform } from 'd3-zoom';

import type { CanvasPoint, CanvasViewport } from '@awg-shared/canvas/canvas.model';

import type { ResultGraphNodeKind } from '@awg-graph/graph-visualizer/models/result-graph.model';

import type { ForceGraphEdge, ForceGraphPoint, ForceGraphVisibleNode } from '../force-graph.model';

/**
 * The ForceGraphCanvasEdgeLabel interface.
 *
 * It represents the label of a force graph edge to be drawn at its position (in graph coordinates).
 */
export interface ForceGraphCanvasEdgeLabel {
    /**
     * The labeled force graph edge.
     */
    readonly edge: ForceGraphEdge;

    /**
     * The position of the label (in graph coordinates).
     */
    readonly position: ForceGraphPoint;
}

/**
 * The ForceGraphCanvasHoveredNode interface.
 *
 * It represents the node under the pointer and the position of its tooltip.
 */
export interface ForceGraphCanvasHoveredNode {
    /**
     * The hovered force graph node.
     */
    readonly node: ForceGraphVisibleNode;

    /**
     * The point of the tooltip (the drawn position of the node on the canvas).
     */
    readonly point: CanvasPoint;
}

/**
 * The ForceGraphCanvasLimits interface.
 *
 * It represents the level-of-detail limits of the drawing: by number in view (`MAX_…`)
 * and by size on the screen (`MIN_…`, in css pixels: graph units times the zoom factor).
 */
export interface ForceGraphCanvasLimits {
    /**
     * The maximum number of node labels (and of edge labels) touching the view that are drawn.
     */
    readonly MAX_LABELS: number;

    /**
     * The maximum number of arrowheads touching the view that are drawn.
     */
    readonly MAX_ARROWS: number;

    /**
     * The minimum radius of a node on the screen from which it is drawn as circle (in large graphs).
     */
    readonly MIN_NODE_CIRCLE_SCREEN_RADIUS: number;

    /**
     * The minimum length of an arrowhead on the screen from which arrowheads are drawn.
     */
    readonly MIN_ARROW_SCREEN_LENGTH: number;

    /**
     * The minimum font size of a node label on the screen from which node labels are drawn
     * (below the one of edge labels: node labels stay longer for orientation).
     */
    readonly MIN_NODE_LABEL_SCREEN_SIZE: number;

    /**
     * The minimum font size of an edge label on the screen from which edge labels are drawn.
     */
    readonly MIN_EDGE_LABEL_SCREEN_SIZE: number;
}

/**
 * The ForceGraphCanvasStyles interface.
 *
 * It represents the styles of the drawn graph. Sizes are in graph units (scaled with the zoom).
 */
export interface ForceGraphCanvasStyles {
    /**
     * The fill color of the node circles per kind of node.
     */
    readonly NODE_FILL: Readonly<Record<ResultGraphNodeKind, string>>;

    /**
     * The stroke color of the node circles.
     */
    readonly NODE_STROKE: string;

    /**
     * The stroke width of the node circles.
     */
    readonly NODE_STROKE_WIDTH: number;

    /**
     * The stroke color of the edges.
     */
    readonly EDGE_STROKE: string;

    /**
     * The stroke width of the edges.
     */
    readonly EDGE_STROKE_WIDTH: number;

    /**
     * The fill color of the arrowheads.
     */
    readonly ARROW_FILL: string;

    /**
     * The length of an arrowhead from its tip (at the target circle) to its base.
     */
    readonly ARROW_LENGTH: number;

    /**
     * The half width of the base of an arrowhead.
     */
    readonly ARROW_WIDTH: number;

    /**
     * The radius of the loop of a self edge along its major axis.
     */
    readonly LOOP_RADIUS_X: number;

    /**
     * The radius of the loop of a self edge along its minor axis.
     */
    readonly LOOP_RADIUS_Y: number;

    /**
     * The rotation of the major axis of the loop of a self edge (in radians, negative: upwards).
     */
    readonly LOOP_ROTATION: number;

    /**
     * The font size of the node labels (also used for their area in view).
     */
    readonly NODE_LABEL_FONT_SIZE: number;

    /**
     * The font of the node labels.
     */
    readonly NODE_LABEL_FONT: string;

    /**
     * The fill color of the node labels.
     */
    readonly NODE_LABEL_FILL: string;

    /**
     * The offset of the baseline start of a node label from the center of its node.
     */
    readonly NODE_LABEL_OFFSET: ForceGraphPoint;

    /**
     * The font size of the edge labels (also used for their area in view).
     */
    readonly EDGE_LABEL_FONT_SIZE: number;

    /**
     * The font of the edge labels.
     */
    readonly EDGE_LABEL_FONT: string;

    /**
     * The fill color of the edge labels.
     */
    readonly EDGE_LABEL_FILL: string;

    /**
     * The offset of the baseline start of an edge label from the center of its edge.
     */
    readonly EDGE_LABEL_OFFSET: ForceGraphPoint;

    /**
     * The offset of the baseline start of a self edge label from its node (above the loop).
     */
    readonly SELF_EDGE_LABEL_OFFSET: ForceGraphPoint;

    /**
     * The estimated maximum width of a label character as share of the font size
     * (rather too wide, so that no partly visible label is left out).
     */
    readonly LABEL_CHAR_WIDTH: number;
}

/**
 * The ForceGraphCanvasView interface.
 *
 * It represents the current view onto the graph: the zoom transform and the viewport of the canvas.
 */
export interface ForceGraphCanvasView {
    /**
     * The zoom transform.
     */
    readonly transform: ZoomTransform;

    /**
     * The viewport of the canvas (size and device pixel ratio).
     */
    readonly viewport: CanvasViewport;
}
