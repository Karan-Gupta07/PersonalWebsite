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
