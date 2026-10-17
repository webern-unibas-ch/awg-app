/*
 * The visual style of the drawing (node colours per kind, loops of self edges, labels) follows
 * Mads Holten's SPARQL Visualizer, cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { CanvasBounds, CanvasPoint } from '@awg-shared/canvas/canvas.model';

import { ResultGraphNodeKind } from '@awg-graph/graph-visualizer/models/result-graph.model';

import {
    ForceGraphBounds,
    ForceGraphData,
    ForceGraphEdge,
    ForceGraphPoint,
    ForceGraphVisibleNode,
} from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

import {
    ForceGraphCanvasEdgeLabel,
    ForceGraphCanvasLimits,
    ForceGraphCanvasStyles,
    ForceGraphCanvasView,
} from './force-graph-canvas.model';

/**
 * Object constant: LABEL_FONT_SIZE.
 *
 * It keeps the font sizes of the node and edge labels (in graph units), shared by their fonts and areas.
 */
const LABEL_FONT_SIZE = Object.freeze({ node: 15, edge: 13 });

/**
 * Object constant: FORCE_GRAPH_CANVAS_STYLES.
 *
 * It keeps the styles of the drawn graph (in graph units, scaled with the zoom).
 */
export const FORCE_GRAPH_CANVAS_STYLES = Object.freeze<ForceGraphCanvasStyles>({
    NODE_FILL: Object.freeze<Record<ResultGraphNodeKind, string>>({
        blank: '#000',
        class: 'rgb(158, 0, 0)',
        instance: 'rgb(32, 178, 170)',
        literal: '#ddd',
        resource: '#ddd',
    }),
    NODE_STROKE: '#fff',
    NODE_STROKE_WIDTH: 1.5,
    EDGE_STROKE: 'rgba(153, 153, 153, 0.6)',
    EDGE_STROKE_WIDTH: 1,
    ARROW_FILL: '#999',
    ARROW_LENGTH: 6,
    ARROW_WIDTH: 3,
    LOOP_RADIUS_X: 30,
    LOOP_RADIUS_Y: 20,
    LOOP_ROTATION: -Math.PI / 4,
    NODE_LABEL_FONT_SIZE: LABEL_FONT_SIZE.node,
    NODE_LABEL_FONT: `${LABEL_FONT_SIZE.node}px 'Roboto', sans-serif`,
    NODE_LABEL_FILL: 'black',
    NODE_LABEL_OFFSET: Object.freeze<ForceGraphPoint>({ x: 12, y: 3 }),
    EDGE_LABEL_FONT_SIZE: LABEL_FONT_SIZE.edge,
    EDGE_LABEL_FONT: `${LABEL_FONT_SIZE.edge}px 'Roboto', sans-serif`,
    EDGE_LABEL_FILL: 'grey',
    EDGE_LABEL_OFFSET: Object.freeze<ForceGraphPoint>({ x: 10, y: 4 }),
    SELF_EDGE_LABEL_OFFSET: Object.freeze<ForceGraphPoint>({ x: 20, y: -40 }),
    LABEL_CHAR_WIDTH: 0.7,
});

/**
 * Object constant: FORCE_GRAPH_CANVAS_LIMITS.
 *
 * It keeps the level-of-detail limits: the maximum number in view of labels and arrowheads,
 * and the minimum screen sizes (css pixels) of circles, arrowheads, node labels and edge labels.
 */
export const FORCE_GRAPH_CANVAS_LIMITS = Object.freeze<ForceGraphCanvasLimits>({
    MAX_LABELS: 300,
    MAX_ARROWS: 2000,
    MIN_NODE_CIRCLE_SCREEN_RADIUS: 3,
    MIN_ARROW_SCREEN_LENGTH: 3,
    MIN_NODE_LABEL_SCREEN_SIZE: 4,
    MIN_EDGE_LABEL_SCREEN_SIZE: 6.5,
});

/**
 * Constant: FORCE_GRAPH_CANVAS_HIT_TOLERANCE.
 *
 * It keeps the tolerance around the circle of a node (in graph units) within which the node is hit.
 */
export const FORCE_GRAPH_CANVAS_HIT_TOLERANCE = 2;

/**
 * Utils method: isBoxInView.
 *
 * It checks if the given box touches the given view bounds (never for a box without a position, NaN).
 *
 * @param {number} minX The given left side of the box.
 * @param {number} minY The given top side of the box.
 * @param {number} maxX The given right side of the box.
 * @param {number} maxY The given bottom side of the box.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isBoxInView(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    viewBounds: ForceGraphBounds
): boolean {
    const { min, max } = viewBounds;
    return maxX >= min.x && minX <= max.x && maxY >= min.y && minY <= max.y;
}

/**
 * Utils method: isHit.
 *
 * It checks if a given point hits a given node, i.e. lies within its circle
 * widened by the hit tolerance (never for a node without a position).
 *
 * @param {ForceGraphVisibleNode} node The given node.
 * @param {ForceGraphPoint} point The given point in graph coordinates.
 * @returns {boolean} The result of the check.
 */
export function isHit(node: ForceGraphVisibleNode, point: ForceGraphPoint): boolean {
    const hitRadius = node.radius + FORCE_GRAPH_CANVAS_HIT_TOLERANCE;
    const dx = node.x - point.x;
    const dy = node.y - point.y;
    return dx * dx + dy * dy <= hitRadius * hitRadius;
}

/**
 * Utils method: isSquareInView.
 *
 * It checks if the square around a given center with the given half size touches the given view bounds.
 *
 * @param {number} x The given horizontal center of the square.
 * @param {number} y The given vertical center of the square.
 * @param {number} halfSize The given half size of the square.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isSquareInView(x: number, y: number, halfSize: number, viewBounds: ForceGraphBounds): boolean {
    return isBoxInView(x - halfSize, y - halfSize, x + halfSize, y + halfSize, viewBounds);
}

/**
 * Utils method: isLabelInView.
 *
 * It checks if a label with the given text at the given baseline start touches the given view bounds.
 * Its width is estimated rather too wide (no text measuring needed).
 *
 * @param {number} x The given left start of the label.
 * @param {number} y The given baseline of the label.
 * @param {string} text The given text of the label.
 * @param {number} fontSize The given font size of the label.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isLabelInView(
    x: number,
    y: number,
    text: string,
    fontSize: number,
    viewBounds: ForceGraphBounds
): boolean {
    const width = text.length * fontSize * FORCE_GRAPH_CANVAS_STYLES.LABEL_CHAR_WIDTH;
    // From the ascent above the baseline down to the descent below it
    return isBoxInView(x, y - fontSize, x + width, y + fontSize * 0.3, viewBounds);
}

/**
 * Utils method: toCanvasPoint.
 *
 * It converts a given point in graph coordinates into a point of the canvas (in css pixels).
 *
 * @param {ForceGraphPoint} point The given point in graph coordinates.
 * @param {ForceGraphCanvasView} view The given view (zoom transform and viewport of the canvas).
 * @returns {CanvasPoint} The point of the canvas.
 */
export function toCanvasPoint(point: ForceGraphPoint, view: ForceGraphCanvasView): CanvasPoint {
    const { transform, viewport } = view;
    const [x, y] = transform.apply([point.x + viewport.width / 2, point.y + viewport.height / 2]);
    return { x, y };
}

/**
 * Utils method: toGraphPoint.
 *
 * It converts a given point of the canvas (in css pixels) into graph coordinates.
 *
 * @param {CanvasPoint} point The given point of the canvas.
 * @param {ForceGraphCanvasView} view The given view (zoom transform and viewport of the canvas).
 * @returns {ForceGraphPoint} The point in graph coordinates.
 */
export function toGraphPoint(point: CanvasPoint, view: ForceGraphCanvasView): ForceGraphPoint {
    const { transform, viewport } = view;
    const [x, y] = transform.invert([point.x, point.y]);
    return { x: x - viewport.width / 2, y: y - viewport.height / 2 };
}

/**
 * Utils method: edgeLabelPosition.
 *
 * It gets the label position of a force graph edge: the center of its nodes,
 * shifted to the right (above the loop for self edges).
 *
 * @param {ForceGraphEdge} edge The given force graph edge.
 * @returns {ForceGraphPoint} The position of the label.
 */
export function edgeLabelPosition(edge: ForceGraphEdge): ForceGraphPoint {
    const { EDGE_LABEL_OFFSET, SELF_EDGE_LABEL_OFFSET } = FORCE_GRAPH_CANVAS_STYLES;

    const points = FORCE_GRAPH_UTILS.edgePath(edge);
    const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    const offset = FORCE_GRAPH_UTILS.isSelfEdge(edge) ? SELF_EDGE_LABEL_OFFSET : EDGE_LABEL_OFFSET;

    return { x: centerX + offset.x, y: centerY + offset.y };
}

/**
 * Utils method: findVisibleNode.
 *
 * It finds the visible node at a given point of the canvas (in css pixels).
 * The invisible middle nodes of edges are never found.
 *
 * @param {ForceGraphData} graphData The given force graph data (with positions).
 * @param {CanvasPoint} point The given point of the canvas.
 * @param {ForceGraphCanvasView} view The given view (zoom transform and viewport of the canvas).
 * @returns {ForceGraphVisibleNode | undefined} The found node or undefined.
 */
export function findVisibleNode(
    graphData: ForceGraphData,
    point: CanvasPoint,
    view: ForceGraphCanvasView
): ForceGraphVisibleNode | undefined {
    const graphPoint = toGraphPoint(point, view);
    const { visibleNodes } = graphData;

    // For overlapping nodes (rare due to the collision force), the last node of the list wins
    for (let index = visibleNodes.length - 1; index >= 0; index--) {
        const node = visibleNodes[index];
        if (isHit(node, graphPoint)) {
            return node;
        }
    }
    return undefined;
}

/**
 * Utils method: isArrowInView.
 *
 * It checks if the arrowhead of a given force graph edge touches the given view bounds:
 * it touches the target circle and reaches the arrow length beyond it.
 *
 * @param {ForceGraphEdge} edge The given force graph edge.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isArrowInView(edge: ForceGraphEdge, viewBounds: ForceGraphBounds): boolean {
    const { ARROW_LENGTH } = FORCE_GRAPH_CANVAS_STYLES;
    const { x, y, radius } = edge.target;
    return isSquareInView(x, y, radius + ARROW_LENGTH, viewBounds);
}

/**
 * Utils method: isEdgeInView.
 *
 * It checks if the line of a given force graph edge may touch the given view bounds:
 * the box around source and target (also if both lie outside), or around the loop of a self edge.
 *
 * @param {ForceGraphEdge} edge The given force graph edge.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isEdgeInView(edge: ForceGraphEdge, viewBounds: ForceGraphBounds): boolean {
    const { LOOP_RADIUS_X } = FORCE_GRAPH_CANVAS_STYLES;
    const { x: sx, y: sy } = edge.source;
    const { x: tx, y: ty } = edge.target;

    if (FORCE_GRAPH_UTILS.isSelfEdge(edge)) {
        // A generous square around the rotated loop
        return isSquareInView(sx, sy, 2 * LOOP_RADIUS_X, viewBounds);
    }
    return isBoxInView(Math.min(sx, tx), Math.min(sy, ty), Math.max(sx, tx), Math.max(sy, ty), viewBounds);
}

/**
 * Utils method: isEdgeLabelInView.
 *
 * It checks if a given edge label (starting at its position) touches the given view bounds.
 *
 * @param {ForceGraphCanvasEdgeLabel} edgeLabel The given edge label.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isEdgeLabelInView(edgeLabel: ForceGraphCanvasEdgeLabel, viewBounds: ForceGraphBounds): boolean {
    const { EDGE_LABEL_FONT_SIZE } = FORCE_GRAPH_CANVAS_STYLES;
    const { edge, position } = edgeLabel;
    return isLabelInView(position.x, position.y, edge.resultEdge.label, EDGE_LABEL_FONT_SIZE, viewBounds);
}

/**
 * Utils method: isNodeInView.
 *
 * It checks if the circle of a given node touches the given view bounds.
 *
 * @param {ForceGraphVisibleNode} node The given node.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isNodeInView(node: ForceGraphVisibleNode, viewBounds: ForceGraphBounds): boolean {
    const { x, y, radius } = node;
    return isSquareInView(x, y, radius, viewBounds);
}

/**
 * Utils method: isNodeLabelInView.
 *
 * It checks if the label of a given node (to the right of it) touches the given view bounds,
 * also if the node itself lies outside.
 *
 * @param {ForceGraphVisibleNode} node The given node.
 * @param {ForceGraphBounds} viewBounds The given view bounds.
 * @returns {boolean} The result of the check.
 */
export function isNodeLabelInView(node: ForceGraphVisibleNode, viewBounds: ForceGraphBounds): boolean {
    const { NODE_LABEL_FONT_SIZE, NODE_LABEL_OFFSET } = FORCE_GRAPH_CANVAS_STYLES;
    const { x, y, resultNode } = node;
    return isLabelInView(
        x + NODE_LABEL_OFFSET.x,
        y + NODE_LABEL_OFFSET.y,
        resultNode.shortName,
        NODE_LABEL_FONT_SIZE,
        viewBounds
    );
}

/**
 * Utils method: minCircleRadius.
 *
 * It gets the minimum radius (in graph units) of a circle at the given zoom factor
 * (0 for smaller graphs: only circles).
 *
 * @param {number} nodeCount The given number of force graph nodes (including the middle nodes).
 * @param {number} k The given zoom factor.
 * @returns {number} The minimum circle radius (0: only circles).
 */
export function minCircleRadius(nodeCount: number, k: number): number {
    const { MIN_NODE_CIRCLE_SCREEN_RADIUS } = FORCE_GRAPH_CANVAS_LIMITS;
    return FORCE_GRAPH_UTILS.isLargeGraph(nodeCount) ? MIN_NODE_CIRCLE_SCREEN_RADIUS / k : 0;
}

/**
 * Utils method: toCanvasBounds.
 *
 * It converts given bounds in graph coordinates into bounds of the canvas (in css pixels).
 *
 * @param {ForceGraphBounds} bounds The given bounds in graph coordinates.
 * @param {ForceGraphCanvasView} view The given view (zoom transform and viewport of the canvas).
 * @returns {CanvasBounds} The bounds of the canvas.
 */
export function toCanvasBounds(bounds: ForceGraphBounds, view: ForceGraphCanvasView): CanvasBounds {
    return {
        min: toCanvasPoint(bounds.min, view),
        max: toCanvasPoint(bounds.max, view),
    };
}

/**
 * Utils method: toViewBounds.
 *
 * It gets the area of the canvas in view in graph coordinates.
 *
 * @param {ForceGraphCanvasView} view The given view (zoom transform and viewport of the canvas).
 * @returns {ForceGraphBounds} The area in view.
 */
export function toViewBounds(view: ForceGraphCanvasView): ForceGraphBounds {
    const { width, height } = view.viewport;
    return {
        min: toGraphPoint({ x: 0, y: 0 }, view),
        max: toGraphPoint({ x: width, y: height }, view),
    };
}

/**
 * Utils constants: FORCE_GRAPH_CANVAS_UTILS.
 *
 * It keeps a namespace reference to the force graph canvas utils methods.
 */
export const FORCE_GRAPH_CANVAS_UTILS = {
    edgeLabelPosition,
    findVisibleNode,
    isArrowInView,
    isBoxInView,
    isEdgeInView,
    isEdgeLabelInView,
    isHit,
    isLabelInView,
    isNodeInView,
    isNodeLabelInView,
    isSquareInView,
    minCircleRadius,
    toCanvasBounds,
    toCanvasPoint,
    toGraphPoint,
    toViewBounds,
} as const;
