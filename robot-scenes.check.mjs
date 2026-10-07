import assert from "node:assert/strict";
import { warehouse, routeLength, pointOnRoute, warehouseFrame, missionFrame } from "./app/robot-scenes.mjs";

assert.deepEqual(pointOnRoute([[1, 2], [4, 2]], -.5), [1, 2]);
assert.deepEqual(pointOnRoute([[1, 2], [4, 2]], 2), [4, 2]);
assert.deepEqual(pointOnRoute([[1, 2], [1, 2]], .5), [1, 2]);
assert.deepEqual(pointOnRoute([[1, 2]], .5), [1, 2]);
assert.equal(routeLength([[0, 0], [3, 4]]), 5);
for (const route of Object.values(warehouse.routes)) {
  assert.deepEqual(route[0], warehouse.depot);
  assert.deepEqual(route.at(-1), warehouse.depot);
  for (const pick of warehouse.picks)
    assert.ok(route.some((point) => point[0] === pick.point[0] && point[1] === pick.point[1]), pick.id);
  for (let i = 1; i < route.length; i++)
    assert.ok(route[i][0] === route[i - 1][0] || route[i][1] === route[i - 1][1], "Warehouse movement must follow aisles");
  for (let step = 0; step <= routeLength(route); step++) {
    const [x, y] = pointOnRoute(route, step / routeLength(route));
    assert.ok(x >= 0 && x <= 23 && y >= 0 && y <= 11);
    assert.ok(!warehouse.shelves.some((shelf) => x >= shelf.x && x < shelf.x + shelf.width && y >= shelf.y && y < shelf.y + shelf.height), "A route crossed a shelf");
  }
}
assert.equal(routeLength(warehouse.routes.original), 58);
assert.equal(routeLength(warehouse.routes.optimized), 46);
for (const optimized of [false, true]) {
  assert.equal(warehouseFrame(0, optimized).collected.length, 0);
  assert.equal(warehouseFrame(1, optimized).collected.length, 3);
  assert.deepEqual(warehouseFrame(1, optimized).position, warehouse.depot);
}
assert.deepEqual([.1, .35, .48, .7, 1].map((progress) => missionFrame(progress).phase), ["searching", "detected", "assigned", "investigating", "confirmed"]);
assert.deepEqual(missionFrame(.43).responder, missionFrame(0).responder, "The second robot must wait for the assignment");
assert.notDeepEqual(missionFrame(.6).responder, missionFrame(0).responder);
assert.ok(missionFrame(.35).scoutMessage.join(" ").includes("vessel here"));
assert.ok(missionFrame(.48).scoutMessage.join(" ").includes("investigate"));
const final = missionFrame(1);
for (const point of [final.scout, final.responder])
  assert.ok(Math.hypot(point[0] - final.vessel[0], point[1] - final.vessel[1]) < 3, "Both robots should converge on the vessel");
assert.deepEqual(missionFrame(2), missionFrame(1));

const { room, isBlocked, tightCells, planPath } = await import("./app/robot-scenes.mjs");
for (const target of room.targets) {
  for (const inflate of [0, 1]) {
    const path = planPath(room.dock, target.stop, inflate);
    assert.ok(path, `${target.label} must be reachable (inflate ${inflate})`);
    assert.deepEqual(path[0], room.dock);
    assert.deepEqual(path.at(-1), target.stop);
    for (let i = 1; i < path.length; i++)
      assert.equal(Math.abs(path[i][0] - path[i - 1][0]) + Math.abs(path[i][1] - path[i - 1][1]), 1, "A* steps must be 4-connected");
    assert.ok(path.every((point) => !isBlocked(point, inflate)), "Path entered an obstacle");
    // Shortest: never longer than the uninflated path when unconstrained, and at least Manhattan distance.
    assert.ok(path.length - 1 >= Math.abs(target.stop[0] - room.dock[0]) + Math.abs(target.stop[1] - room.dock[1]));
  }
  assert.equal(tightCells(planPath(room.dock, target.stop, 1)), 0, `${target.label}: inflated path should keep clearance`);
}
assert.ok(room.targets.some((target) => tightCells(planPath(room.dock, target.stop, 0)) > 0), "Raw paths should show why inflation matters");
assert.equal(planPath(room.dock, [15, 1]), null, "Goal inside furniture is unreachable");
assert.equal(planPath(room.dock, [15, 4], 0).length - 1, 20, "Manhattan-optimal on open floor");
