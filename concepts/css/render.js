// Tiny render helpers shared by the mockups. No framework: these are static
// comparison mocks, and the real build will be the existing Next.js app.

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape untrusted-ish text before it goes into a template literal. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c]);

/** Write markup into a selector and append the shared concept switcher. */
export function mount(selector, html) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`mount: no element matches ${selector}`);
  el.innerHTML = html;
  document.body.insertAdjacentHTML('beforeend', switcher());
}

// Only the catalogue line survives here: the other three concepts live
// on the mockups-v2 branch. `desk` is the refined build.
const CONCEPTS = [
  ['desk.html', 'Desk (refined)'],
  ['catalog.html', 'Catalog (v1)'],
];

function switcher() {
  const here = location.pathname.split('/').pop() || 'desk.html';
  return `<nav class="sw switcher" aria-label="Concept switcher">${CONCEPTS.map(
    ([href, label]) =>
      `<a href="./${href}"${href === here ? ' aria-current="page"' : ''}>${label}</a>`
  ).join('')}</nav>`;
}

// self-check: run with `node css/render.js`
if (typeof window === 'undefined') {
  console.assert(esc('<b>&"x"</b>') === '&lt;b&gt;&amp;&quot;x&quot;&lt;/b&gt;', 'esc failed');
  console.assert(esc(null) === '' && esc(undefined) === '', 'esc nullish failed');
  console.log('render.js ok');
}
