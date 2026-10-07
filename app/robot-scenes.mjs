const clamp = (value) => Math.max(0, Math.min(1, value));

export const warehouse = {
  depot: [1, 10],
  shelves: [4, 10, 16].flatMap((x) => [2, 6].map((y) => ({ x, y, width: 3, height: 3 }))),
  picks: [{ id: "A", point: [3, 3] }, { id: "B", point: [15, 7] }, { id: "C", point: [9, 3] }],
  routes: {
    original: [[1, 10], [1, 9], [15, 9], [15, 7], [15, 5], [3, 5], [3, 3], [3, 1], [9, 1], [9, 3], [9, 5], [1, 5], [1, 10]],
    optimized: [[1, 10], [1, 3], [3, 3], [3, 5], [9, 5], [9, 3], [9, 5], [15, 5], [15, 7], [15, 9], [1, 9], [1, 10]],
  },
};

export function routeLength(route) {
  return route.reduce((length, point, i) => i ? length + Math.hypot(point[0] - route[i - 1][0], point[1] - route[i - 1][1]) : length, 0);
}

export function pointOnRoute(route, progress) {
  let remaining = routeLength(route) * clamp(progress);
  for (let i = 1; i < route.length; i++) {
    const [x, y] = route[i - 1];
    const [nextX, nextY] = route[i];
    const length = Math.hypot(nextX - x, nextY - y);
    if (length && remaining <= length)
      return [x + (nextX - x) * remaining / length, y + (nextY - y) * remaining / length];
    remaining -= length;
  }
  return route.at(-1);
}

export function warehouseFrame(progress, optimized) {
  const route = warehouse.routes[optimized ? "optimized" : "original"];
  const distance = routeLength(route);
  const collected = warehouse.picks.filter(({ point }) => {
    const index = route.findIndex(([x, y]) => x === point[0] && y === point[1]);
    return routeLength(route.slice(0, index + 1)) <= clamp(progress) * distance;
  }).map(({ id }) => id);
  return { route, distance, collected, position: pointOnRoute(route, progress) };
}

export function missionFrame(progress) {
  const p = clamp(progress);
  const phase = p < .28 ? "searching" : p < .44 ? "detected" : p < .55 ? "assigned" : p < .9 ? "investigating" : "confirmed";
  const messages = {
    searching: { label: "Scout A is searching. Scout B is standing by.", scoutMessage: ["Scanning the area."], responderMessage: [] },
    detected: { label: "Scout A spotted a vessel and shared its location.", scoutMessage: ["Hey, there's a", "vessel here."], responderMessage: [] },
    assigned: { label: "Scout A asks Scout B to investigate.", scoutMessage: ["Scout B,", "investigate."], responderMessage: ["On my way."] },
    investigating: { label: "Both robots are converging on the vessel.", scoutMessage: ["Tracking the vessel."], responderMessage: ["Approaching."] },
    confirmed: { label: "The vessel is confirmed. Both robots have arrived.", scoutMessage: ["Vessel confirmed."], responderMessage: ["Investigation", "complete."] },
  };
  return {
    phase,
    ...messages[phase],
    vessel: [21, 4.5],
    scout: p < .28 ? pointOnRoute([[3, 3], [8, 2], [14, 3]], p / .28) : pointOnRoute([[14, 3], [19, 3.5]], (p - .55) / .35),
    responder: pointOnRoute([[4, 9], [12, 8], [19, 6]], (p - .44) / .46),
  };
}

// Mr. Clean: a toy living room on a 24 × 12 grid. Obstacles are cell rectangles.
export const room = {
  width: 24,
  height: 12,
  dock: [1, 10],
  obstacles: [
    { name: "ACT TABLE", x: 2, y: 1, w: 2, h: 2 },
    { name: "COUCH", x: 6, y: 0, w: 4, h: 3 },
    { name: "CUBE TABLE", x: 14, y: 1, w: 3, h: 2 },
    { name: "COFFEE TABLE", x: 9, y: 6, w: 4, h: 3 },
    { name: "PLANT", x: 16, y: 6, w: 1, h: 2 },
    { name: "BALL TABLE", x: 19, y: 8, w: 3, h: 3 },
  ],
  targets: [
    { label: "Cube table", task: "Tidy the cubes", stop: [15, 4] },
    { label: "Ball table", task: "Pick up the ball", stop: [20, 6] },
    { label: "ACT table", task: "Run the ACT policy", stop: [2, 4] },
  ],
};

export function isBlocked([x, y], inflate = 0) {
  return x < 0 || y < 0 || x >= room.width || y >= room.height || room.obstacles.some((o) => x >= o.x - inflate && x < o.x + o.w + inflate && y >= o.y - inflate && y < o.y + o.h + inflate);
}

// Cells that touch a real obstacle (8-neighbourhood): where a robot body would scrape furniture.
export function tightCells(path) {
  const furniture = ([x, y]) => x >= 0 && y >= 0 && x < room.width && y < room.height && isBlocked([x, y]);
  return path.filter(([x, y]) => [-1, 0, 1].some((dx) => [-1, 0, 1].some((dy) => furniture([x + dx, y + dy])))).length;
}

// 4-connected A* with a Manhattan heuristic. A tiny turn penalty keeps paths from zig-zagging.
export function planPath(start, goal, inflate = 0) {
  if (isBlocked(start, inflate) || isBlocked(goal, inflate)) return null;
  const key = ([x, y]) => `${x},${y}`;
  const h = ([x, y]) => Math.abs(x - goal[0]) + Math.abs(y - goal[1]);
  const cost = new Map([[key(start), 0]]);
  const from = new Map();
  const open = [start];
  while (open.length) {
    // ponytail: sorted array as the open set — fine for 288 cells; swap in a binary heap for real maps.
    open.sort((a, b) => cost.get(key(a)) + h(a) - cost.get(key(b)) - h(b));
    const current = open.shift();
    if (key(current) === key(goal)) {
      const path = [current];
      while (from.has(key(path[0]))) path.unshift(from.get(key(path[0])));
      return path;
    }
    const previous = from.get(key(current));
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const next = [current[0] + dx, current[1] + dy];
      if (isBlocked(next, inflate)) continue;
      const turn = previous && (current[0] - previous[0] !== dx || current[1] - previous[1] !== dy) ? .001 : 0;
      const nextCost = cost.get(key(current)) + 1 + turn;
      if (nextCost < (cost.get(key(next)) ?? Infinity)) {
        cost.set(key(next), nextCost);
        from.set(key(next), current);
        if (!open.some((point) => key(point) === key(next))) open.push(next);
      }
    }
  }
  return null;
}
