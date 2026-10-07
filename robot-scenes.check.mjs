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

const { room, isBlocked, tightCells, planPath, reactivePath, cleanApproaches, cleanRoutes } = await import("./app/robot-scenes.mjs");
const steps = (path) => path.length - 1;
const adjacent = (path) => path.every((point, i) => !i || Math.abs(point[0] - path[i - 1][0]) + Math.abs(point[1] - path[i - 1][1]) === 1);
for (const inflate of [0, 1]) {
  const path = planPath(room.dock, room.pickup.stop, inflate);
  assert.deepEqual([path[0], path.at(-1)], [room.dock, room.pickup.stop]);
  assert.ok(adjacent(path), "A* steps must be 4-connected");
  assert.ok(path.every((point) => !isBlocked(point, inflate)), "Path entered an obstacle");
}
assert.equal(tightCells(planPath(room.dock, room.pickup.stop, 1)), 0, "Inflated path keeps clearance");
assert.ok(tightCells(planPath(room.dock, room.pickup.stop, 0)) > 0, "Raw path shows why inflation matters");
assert.equal(steps(planPath(room.dock, room.pickup.stop, 0)), 20, "Manhattan-optimal on open floor");
assert.equal(planPath(room.dock, [15, 1]), null, "Goal inside furniture is unreachable");
assert.equal(reactivePath(room.dock, [15, 1]), null, "Reactive search gives up on an unreachable goal");
assert.equal(cleanApproaches.length, 3);
for (const { id } of cleanApproaches) {
  const { out, back } = cleanRoutes(id);
  assert.deepEqual([out[0], out.at(-1), back[0], back.at(-1)], [room.dock, room.pickup.stop, room.pickup.stop, room.dock], id);
  assert.ok(adjacent(out) && adjacent(back), id);
  assert.ok([...out, ...back].every((point) => !isBlocked(point, 1)), `${id} hit furniture`);
}
assert.ok(steps(cleanRoutes("fly").out) + steps(cleanRoutes("fly").back) > steps(cleanRoutes("stack").out) + steps(cleanRoutes("stack").back), "Reactive control should travel further than A*");

// Sandbox: visitor-placed boxes force A* around them, and a full wall makes the goal unreachable.
const { canPlaceBox, cleanLeg } = await import("./app/robot-scenes.mjs");
const open = planPath(room.dock, room.pickup.stop, 1);
const box = open[Math.floor(open.length / 2)];
assert.ok(canPlaceBox(box, [room.dock, room.pickup.stop]), "Mid-route cell accepts a box");
assert.ok(!canPlaceBox([2, 1]), "Boxes cannot go on furniture");
assert.ok(!canPlaceBox([2, 10], [room.dock]), "Boxes cannot crowd the robot or dock");
const detour = cleanLeg("stack", room.dock, room.pickup.stop, [box]);
assert.ok(adjacent(detour) && detour.every((point) => !isBlocked(point, 1, [box])), "Re-planned path avoids the inflated box");
assert.ok(!detour.some(([x, y]) => x === box[0] && y === box[1]));
assert.ok(steps(detour) >= steps(open));
assert.ok(adjacent(cleanLeg("fly", room.dock, room.pickup.stop, [box])), "Reactive mode also routes around boxes");
const wall = Array.from({ length: room.height }, (_, y) => [5, y]);
assert.equal(cleanLeg("stack", room.dock, room.pickup.stop, wall), null, "A wall of boxes blocks every route");
assert.equal(cleanLeg("fly", room.dock, room.pickup.stop, wall), null);
