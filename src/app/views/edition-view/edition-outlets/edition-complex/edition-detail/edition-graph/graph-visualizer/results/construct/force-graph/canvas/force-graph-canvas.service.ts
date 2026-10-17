/*
 * The visual style of the drawing (node colours per kind, loops of self edges, labels) follows
 * Mads Holten's SPARQL Visualizer, cf. https://github.com/MadsHolten/sparql-visualizer
 */

import { Injectable } from '@angular/core';

import { ForceGraphData, ForceGraphEdge, ForceGraphVisibleNode } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

import { ForceGraphCanvasEdgeLabel, ForceGraphCanvasView } from './force-graph-canvas.model';
import {
    FORCE_GRAPH_CANVAS_LIMITS,
    FORCE_GRAPH_CANVAS_STYLES,
    FORCE_GRAPH_CANVAS_UTILS,
} from './force-graph-canvas.utils';

/**
 * The ForceGraphCanvas service.
 *
 * It draws the data of a force graph onto a canvas in a given view (by level of detail).
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class ForceGraphCanvasService {
    /**
     * Public method: drawGraph.
     *
     * It draws the items of the given force graph data touching the given view (also partly visible ones),
     * by level of detail: arrowheads and labels only if not too many or too small, small nodes as squares.
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphData} graphData The given force graph data (with positions).
     * @param {ForceGraphCanvasView} view The given view (zoom transform and viewport of the canvas).
     * @returns {void} Draws the graph.
     */
    drawGraph(ctx: CanvasRenderingContext2D, graphData: ForceGraphData, view: ForceGraphCanvasView): void {
        const { edges, nodes, visibleNodes } = graphData;
        const { k } = view.transform;
        const {
            MAX_ARROWS,
            MAX_LABELS,
            MIN_ARROW_SCREEN_LENGTH,
            MIN_EDGE_LABEL_SCREEN_SIZE,
            MIN_NODE_LABEL_SCREEN_SIZE,
        } = FORCE_GRAPH_CANVAS_LIMITS;
        const { ARROW_LENGTH, EDGE_LABEL_FONT_SIZE, NODE_LABEL_FONT_SIZE } = FORCE_GRAPH_CANVAS_STYLES;

        // Cleared canvas and area in view
        this._prepareCanvas(ctx, view);
        const viewBounds = FORCE_GRAPH_CANVAS_UTILS.toViewBounds(view);

        // Level of detail by size on the screen (css pixels: graph units times the zoom factor)
        const isArrowVisible = ARROW_LENGTH * k >= MIN_ARROW_SCREEN_LENGTH;
        const isNodeLabelVisible = NODE_LABEL_FONT_SIZE * k >= MIN_NODE_LABEL_SCREEN_SIZE;
        const isEdgeLabelVisible = EDGE_LABEL_FONT_SIZE * k >= MIN_EDGE_LABEL_SCREEN_SIZE;
        const minCircleRadius = FORCE_GRAPH_CANVAS_UTILS.minCircleRadius(nodes.length, k);

        // Collect items touching the view
        const edgesInView = edges.filter(edge => FORCE_GRAPH_CANVAS_UTILS.isEdgeInView(edge, viewBounds));
        const edgesWithArrowInView = isArrowVisible
            ? edgesInView.filter(edge => FORCE_GRAPH_CANVAS_UTILS.isArrowInView(edge, viewBounds))
            : [];
        const nodesInView = visibleNodes.filter(node => FORCE_GRAPH_CANVAS_UTILS.isNodeInView(node, viewBounds));
        // A label lies to the right of its node or edge, so it may reach into the view from outside
        const nodeLabelsInView = isNodeLabelVisible
            ? visibleNodes.filter(node => FORCE_GRAPH_CANVAS_UTILS.isNodeLabelInView(node, viewBounds))
            : [];
        const edgeLabelsInView = isEdgeLabelVisible
            ? edges
                  .map(edge => ({ edge, position: FORCE_GRAPH_CANVAS_UTILS.edgeLabelPosition(edge) }))
                  .filter(edgeLabel => FORCE_GRAPH_CANVAS_UTILS.isEdgeLabelInView(edgeLabel, viewBounds))
            : [];

        // Draw the items (later ones on top): edges, arrowheads, nodes, labels (up to their maximum number)
        this._drawEdges(ctx, edgesInView);
        if (isArrowVisible && edgesWithArrowInView.length <= MAX_ARROWS) {
            this._drawArrows(ctx, edgesWithArrowInView);
        }

        this._drawNodes(ctx, nodesInView, minCircleRadius);
        if (isEdgeLabelVisible && edgeLabelsInView.length <= MAX_LABELS) {
            this._drawEdgeLabels(ctx, edgeLabelsInView);
        }
        if (isNodeLabelVisible && nodeLabelsInView.length <= MAX_LABELS) {
            this._drawNodeLabels(ctx, nodeLabelsInView);
        }
    }

    /**
     * Private method: _drawArrows.
     *
     * It draws an arrowhead at the target of each given (non-self) force graph edge, touching the target circle.
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphEdge[]} edges The given force graph edges.
     * @returns {void} Draws the arrowheads.
     */
    private _drawArrows(ctx: CanvasRenderingContext2D, edges: ForceGraphEdge[]): void {
        const { ARROW_FILL, ARROW_LENGTH, ARROW_WIDTH } = FORCE_GRAPH_CANVAS_STYLES;

        ctx.beginPath();
        edges.forEach(edge => {
            if (FORCE_GRAPH_UTILS.isSelfEdge(edge)) {
                return;
            }
            const { source, target } = edge;
            const { x: sx, y: sy } = source;
            const { x: tx, y: ty } = target;
            const length = Math.hypot(tx - sx, ty - sy);
            // The source lies within the target circle: no room for an arrowhead
            if (length <= target.radius) {
                return;
            }
            // Unit direction from source to target
            const dirX = (tx - sx) / length;
            const dirY = (ty - sy) / length;
            const tipX = tx - dirX * target.radius;
            const tipY = ty - dirY * target.radius;
            const baseX = tipX - dirX * ARROW_LENGTH;
            const baseY = tipY - dirY * ARROW_LENGTH;

            ctx.moveTo(tipX, tipY);
            ctx.lineTo(baseX - dirY * ARROW_WIDTH, baseY + dirX * ARROW_WIDTH);
            ctx.lineTo(baseX + dirY * ARROW_WIDTH, baseY - dirX * ARROW_WIDTH);
            ctx.closePath();
        });
        ctx.fillStyle = ARROW_FILL;
        ctx.fill();
    }

    /**
     * Private method: _drawEdges.
     *
     * It draws all force graph edges as one path: straight lines from source to target
     * and loops (rotated ellipses) for self edges.
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphEdge[]} edges The given force graph edges.
     * @returns {void} Draws the edges.
     */
    private _drawEdges(ctx: CanvasRenderingContext2D, edges: ForceGraphEdge[]): void {
        const { EDGE_STROKE, EDGE_STROKE_WIDTH, LOOP_RADIUS_X, LOOP_RADIUS_Y, LOOP_ROTATION } =
            FORCE_GRAPH_CANVAS_STYLES;

        ctx.beginPath();
        edges.forEach(edge => {
            const { source, target } = edge;
            const { x: sx, y: sy } = source;
            ctx.moveTo(sx, sy);
            if (FORCE_GRAPH_UTILS.isSelfEdge(edge)) {
                // The loop starts and ends at the node, its major axis points to the upper right
                const loopCenterX = sx + LOOP_RADIUS_X * Math.cos(LOOP_ROTATION);
                const loopCenterY = sy + LOOP_RADIUS_X * Math.sin(LOOP_ROTATION);
                ctx.ellipse(
                    loopCenterX,
                    loopCenterY,
                    LOOP_RADIUS_X,
                    LOOP_RADIUS_Y,
                    LOOP_ROTATION,
                    Math.PI,
                    3 * Math.PI
                );
            } else {
                ctx.lineTo(target.x, target.y);
            }
        });
        ctx.strokeStyle = EDGE_STROKE;
        ctx.lineWidth = EDGE_STROKE_WIDTH;
        ctx.stroke();
    }

    /**
     * Private method: _drawEdgeLabels.
     *
     * It draws the given edge labels (the labels of the force graph edges at their positions).
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphCanvasEdgeLabel[]} edgeLabels The given edge labels.
     * @returns {void} Draws the edge labels.
     */
    private _drawEdgeLabels(ctx: CanvasRenderingContext2D, edgeLabels: ForceGraphCanvasEdgeLabel[]): void {
        const { EDGE_LABEL_FILL, EDGE_LABEL_FONT } = FORCE_GRAPH_CANVAS_STYLES;

        ctx.font = EDGE_LABEL_FONT;
        ctx.fillStyle = EDGE_LABEL_FILL;
        edgeLabels.forEach(({ edge, position }) => {
            ctx.fillText(edge.resultEdge.label, position.x, position.y);
        });
    }

    /**
     * Private method: _drawNodes.
     *
     * It draws the given nodes, batched by fill color: as circles from the given minimum radius,
     * smaller ones as squares of the same area.
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphVisibleNode[]} nodes The given nodes.
     * @param {number} minCircleRadius The given minimum radius of a circle (in graph units; 0: only circles).
     * @returns {void} Draws the nodes.
     */
    private _drawNodes(ctx: CanvasRenderingContext2D, nodes: ForceGraphVisibleNode[], minCircleRadius: number): void {
        const { NODE_FILL, NODE_STROKE, NODE_STROKE_WIDTH } = FORCE_GRAPH_CANVAS_STYLES;

        const fills = new Set(Object.values(NODE_FILL));

        ctx.strokeStyle = NODE_STROKE;
        ctx.lineWidth = NODE_STROKE_WIDTH;
        fills.forEach(fill => {
            // The nodes of this fill color, as circles or (if too small) as squares
            const circleNodes: ForceGraphVisibleNode[] = [];
            const squareNodes: ForceGraphVisibleNode[] = [];
            nodes.forEach(node => {
                if (NODE_FILL[node.resultNode.kind] === fill) {
                    (node.radius >= minCircleRadius ? circleNodes : squareNodes).push(node);
                }
            });
            ctx.fillStyle = fill;
            if (squareNodes.length) {
                this._drawNodeSquares(ctx, squareNodes);
            }
            if (circleNodes.length) {
                this._drawNodeCircles(ctx, circleNodes);
            }
        });
    }

    /**
     * Private method: _drawNodeCircles.
     *
     * It draws the given nodes as one path of circles, filled and stroked with the current styles.
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphVisibleNode[]} nodes The given nodes (not empty).
     * @returns {void} Draws the circles.
     */
    private _drawNodeCircles(ctx: CanvasRenderingContext2D, nodes: ForceGraphVisibleNode[]): void {
        ctx.beginPath();
        nodes.forEach(({ x, y, radius }) => {
            ctx.moveTo(x + radius, y);
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
        });
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Private method: _drawNodeLabels.
     *
     * It draws the label of each given node next to it: its short name
     * (the `label` of the result node is shown in the tooltip).
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphVisibleNode[]} nodes The given nodes.
     * @returns {void} Draws the node labels.
     */
    private _drawNodeLabels(ctx: CanvasRenderingContext2D, nodes: ForceGraphVisibleNode[]): void {
        const { NODE_LABEL_FILL, NODE_LABEL_FONT, NODE_LABEL_OFFSET } = FORCE_GRAPH_CANVAS_STYLES;

        ctx.font = NODE_LABEL_FONT;
        ctx.fillStyle = NODE_LABEL_FILL;
        nodes.forEach(({ resultNode, x, y }) => {
            ctx.fillText(resultNode.shortName, x + NODE_LABEL_OFFSET.x, y + NODE_LABEL_OFFSET.y);
        });
    }

    /**
     * Private method: _drawNodeSquares.
     *
     * It draws the given nodes as one path of squares with the area of their circles, filled with the current style.
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphVisibleNode[]} nodes The given nodes (not empty).
     * @returns {void} Draws the squares.
     */
    private _drawNodeSquares(ctx: CanvasRenderingContext2D, nodes: ForceGraphVisibleNode[]): void {
        ctx.beginPath();
        nodes.forEach(({ x, y, radius }) => {
            // A square with the area of the circle (side r * √π), so that the switch keeps the weight
            const halfSide = (radius * Math.sqrt(Math.PI)) / 2;
            ctx.rect(x - halfSide, y - halfSide, 2 * halfSide, 2 * halfSide);
        });
        ctx.fill();
    }

    /**
     * Private method: _prepareCanvas.
     *
     * It clears the canvas and maps graph coordinates to canvas pixels:
     * graph origin in the viewport center, then zoom, then device pixel ratio.
     *
     * @param {CanvasRenderingContext2D} ctx The given 2D context of the canvas.
     * @param {ForceGraphCanvasView} view The given view (zoom transform and viewport of the canvas).
     * @returns {void} Prepares the canvas for drawing.
     */
    private _prepareCanvas(ctx: CanvasRenderingContext2D, view: ForceGraphCanvasView): void {
        const { width, height, dpr } = view.viewport;
        const { k, x, y } = view.transform;

        // The backing store has whole pixels (rounded at a fractional device pixel ratio)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const scale = dpr * k;
        const translateX = dpr * (x + (k * width) / 2);
        const translateY = dpr * (y + (k * height) / 2);
        ctx.setTransform(scale, 0, 0, scale, translateX, translateY);
    }
}
