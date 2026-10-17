import { beforeEach, describe, expect, it } from 'vitest';

import { expectToEqual } from '@testing/expect-helper';

import { ForceGraphVisibleNode } from '../force-graph.model';

import { ForceGraphSimulationPin } from './force-graph-simulation-pin';
import { ForceGraphSimulationCommand } from './force-graph-simulation.model';

describe('ForceGraphSimulationPin (DONE)', () => {
    let simulationPin: ForceGraphSimulationPin;
    let commands: ForceGraphSimulationCommand[];
    let node: ForceGraphVisibleNode;

    beforeEach(() => {
        simulationPin = new ForceGraphSimulationPin();
        commands = [];
        simulationPin.commands$.subscribe(command => commands.push(command));

        node = {
            id: 'b',
            radius: 10,
            resultNode: { id: 'b', shortName: 'awg:B', label: 'awg:B', kind: 'class' },
            x: 100,
            y: 0,
        };
    });

    it('... should create', () => {
        expect(simulationPin).toBeTruthy();
    });

    describe('METHODS', () => {
        describe('#pin()', () => {
            it('... should have a method `pin`', () => {
                expect(simulationPin.pin).toBeDefined();
            });

            it('... should send a pin command with the given point to the simulation', () => {
                simulationPin.pin(node, { x: 30, y: 40 });

                expectToEqual(commands, [{ type: 'pin', node, point: { x: 30, y: 40 } }]);
            });

            it('... should move the node to the given point at once', () => {
                simulationPin.pin(node, { x: 30, y: 40 });

                expectToEqual([node.x, node.y], [30, 40]);
            });
        });

        describe('#release()', () => {
            it('... should have a method `release`', () => {
                expect(simulationPin.release).toBeDefined();
            });

            it('... should send a release command for the given node to the simulation', () => {
                simulationPin.release(node);

                expectToEqual(commands, [{ type: 'release', node }]);
            });
        });

        describe('#apply()', () => {
            it('... should have a method `apply`', () => {
                expect(simulationPin.apply).toBeDefined();
            });

            it('... should move the pinned node back to its point after a result of the simulation', () => {
                simulationPin.pin(node, { x: 30, y: 40 });
                // A result of the simulation computed before the pin arrived
                node.x = 100;
                node.y = 0;

                simulationPin.apply();

                expectToEqual([node.x, node.y], [30, 40]);
            });

            it('... should keep the node in place without a pin', () => {
                simulationPin.apply();

                expectToEqual([node.x, node.y], [100, 0]);
            });

            it('... should keep the node in place after its release', () => {
                simulationPin.pin(node, { x: 30, y: 40 });
                simulationPin.release(node);
                node.x = 100;
                node.y = 0;

                simulationPin.apply();

                expectToEqual([node.x, node.y], [100, 0]);
            });
        });
    });
});
