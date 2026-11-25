const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = file => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', 'workspaces/index.html', 'about/index.html'];
const script = html('workspaces/explorer.js');
const roleIds = ['professionals', 'managers', 'colleagues', 'hr'];

function navigation(hash = '') {
  const windowEvents = {}, classes = new Set(), historyEntries = [];
  const location = { hash, pathname: '/workspaces/', search: '' };
  function element(id) {
    return { id, hidden: false, attrs: {}, events: {}, focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; },
      addEventListener(name, fn) { this.events[name] = fn; }, setAttribute(name, value) { this.attrs[name] = value; }, removeAttribute(name) { delete this.attrs[name]; } };
  }
  const title = element('chooser-title'), back = element('back');
  const links = roleIds.map(id => Object.assign(element(id), { hash: '#' + id }));
  const sections = roleIds.map(id => { const heading = element(id + '-title'); return Object.assign(element(id), { heading, querySelector: () => heading }); });
  const picker = { querySelectorAll: () => links };
  const document = {
    body: { classList: { toggle(name, value) { if (value) classes.add(name); else classes.delete(name); } } },
    querySelector(selector) { return ({ '.workspace-choices': picker, '.back-to-chooser': back })[selector] || null; },
    querySelectorAll(selector) { return selector === '.workspace' ? sections : []; },
    getElementById() { return title; },
  };
  const history = { pushState(_state, _unused, url) { historyEntries.push(url); location.hash = new URL(url, 'https://normall.io/workspaces/').hash; } };
  vm.runInNewContext(script, { document, location, history, window: { addEventListener(name, fn) { windowEvents[name] = fn; } } });
  const click = (element, extra = {}) => { let prevented = false; element.events.click({ button: 0, preventDefault() { prevented = true; }, ...extra }); return prevented; };
  return { links, sections, back, title, classes, location, windowEvents, historyEntries, click, visible: () => sections.filter(s => !s.hidden).map(s => s.id) };
}

test('the homepage contains the agreed headline, sentence and one workspace action', () => {
  const page = html('index.html');
  assert.match(page, /<h1 id="headline">Workplace tools for different ways of thinking\.<\/h1>/);
  assert.match(page, /<p class="intro">normALL helps neurodivergent professionals plan their day and communicate at work\.<\/p>/);
  assert.equal((page.match(/href="\/workspaces\/"/g) || []).length, 1);
  assert.doesNotMatch(page, /role-picker|role-grid|overview-intro|class="contact"/);
});

for (const file of pages) {
  test(`${file}: internal links, assets and fragment targets exist`, () => {
    const page = html(file);
    const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, 'IDs must be unique');
    for (const [, value] of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:)/.test(value)) continue;
      const url = new URL(value, 'https://normall.io/' + file);
      const filename = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
      assert.ok(fs.existsSync(path.join(root, filename)), value);
      if (url.hash) assert.ok(html(filename).includes(`id="${url.hash.slice(1)}"`), value);
    }
    for (const [, value] of page.matchAll(/(?:aria-controls|aria-labelledby|for)="([^"]+)"/g)) {
      for (const id of value.split(' ')) assert.ok(ids.includes(id), `Missing target ${id}`);
    }
    assert.equal((page.match(/<h1\b/g) || []).length, 1);
    assert.match(page, /lang="en-GB"/);
  });
}

test('all roles remain readable without JavaScript, with native expandable descriptions', () => {
  const page = html('workspaces/index.html');
  for (const id of roleIds) assert.match(page, new RegExp(`<section class="workspace" id="${id}" aria-labelledby="${id}-title">`));
  assert.equal((page.match(/<details>/g) || []).length, 13);
  assert.doesNotMatch(page, /<details open/);
  assert.match(page, /<noscript>/);
  assert.equal((page.match(/class="button workspace-action"/g) || []).length, 4);
});

test('no role is chosen on first arrival', () => {
  const app = navigation();
  assert.deepEqual(app.visible(), []);
  assert.equal(app.classes.has('has-selection'), false);
  assert.equal(app.back.hidden, true);
});

for (const id of roleIds) test(`${id}: direct link selects only the requested workspace`, () => {
  const app = navigation('#' + id);
  assert.deepEqual(app.visible(), [id]);
  assert.equal(app.links.find(l => l.id === id).attrs['aria-current'], 'location');
  assert.equal(app.back.hidden, false);
});

test('unknown hash returns to the chooser', () => assert.deepEqual(navigation('#unknown').visible(), []));

test('selection updates the URL and focuses the selected heading', () => {
  const app = navigation();
  assert.equal(app.click(app.links[1]), true);
  assert.deepEqual(app.visible(), ['managers']);
  assert.equal(app.location.hash, '#managers');
  assert.equal(app.sections[1].heading.focused, true);
  assert.equal(app.sections[1].heading.scrolled, true);
  app.click(app.links[1]);
  assert.equal(app.historyEntries.length, 1, 'Repeated selection must not add history');
});

test('modified clicks retain normal browser link behaviour', () => {
  for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const app = navigation();
    assert.equal(app.click(app.links[0], modifier), false);
    assert.deepEqual(app.visible(), []);
  }
});

test('returning to all workspaces clears the hash and focuses the chooser', () => {
  const app = navigation('#hr');
  app.click(app.back);
  assert.deepEqual(app.visible(), []);
  assert.equal(app.location.hash, '');
  assert.equal(app.title.focused, true);
  assert.equal(app.back.hidden, true);
});

test('browser history and hash changes restore the visible workspace', () => {
  const app = navigation('#professionals');
  app.location.hash = '#colleagues'; app.windowEvents.popstate();
  assert.deepEqual(app.visible(), ['colleagues']);
  app.location.hash = ''; app.windowEvents.hashchange();
  assert.deepEqual(app.visible(), []);
  app.location.hash = '#hr'; app.windowEvents.pageshow();
  assert.deepEqual(app.visible(), ['hr']);
});

test('workspace overviews have no simulated application controls', () => {
  const page = html('workspaces/index.html');
  assert.doesNotMatch(page, /<select|<textarea|<input|<form|topic-panel|example-output|Try an example/i);
  assert.doesNotMatch(script, /showExample|showTopic|updatePreferenceNote/);
  assert.doesNotMatch(script, /fetch\(|localStorage|sessionStorage/);
});

test('each overview has one explicit application action and short opening copy', () => {
  const page = html('workspaces/index.html');
  for (const id of roleIds) {
    const section = page.match(new RegExp(`<section class="workspace" id="${id}"[\\s\\S]*?<\\/section>`))[0];
    assert.equal((section.match(/class="button workspace-action"/g) || []).length, 1);
    assert.match(section, /href="https:\/\/normall\.vercel\.app\/login">Open normALL/);
    assert.match(section, /Sign in to use the tools\./);
    const opening = section.replace(/<details>([\s\S]*?)<\/details>/g, (_match, content) => content.match(/<summary>([\s\S]*?)<\/summary>/)[1]);
    const words = opening.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
    assert.ok(words < 110, `${id}: ${words} initial words`);
  }
});

test('public pages retain the approved light background and load current styles', () => {
  for (const file of pages) assert.match(html(file), /minimal\.css\?v=3/);
  assert.match(html('minimal.css'), /background: #fcfcfa;/);
  assert.match(html('workspaces/index.html'), /explorer\.css\?v=9/);
});

test('every workspace has its original brand illustration and illustrated tool descriptions', () => {
  const page = html('workspaces/index.html');
  const illustrations = ['professional', 'manager', 'colleague', 'hr'];
  for (const [index, id] of roleIds.entries()) {
    const section = page.match(new RegExp(`<section class="workspace" id="${id}"[\\s\\S]*?<\\/section>`))[0];
    assert.match(section, new RegExp(`src="/assets/brand/${illustrations[index]}\\.png"`));
    assert.equal((section.match(/class="tool-icon"/g) || []).length, index === 0 ? 4 : 3);
    const images = [...section.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
    for (const image of images) {
      assert.match(image, /alt=""/);
      assert.match(image, /width="\d+" height="\d+"/);
    }
  }
  assert.equal((page.match(/class="workspace-choice-icon"/g) || []).length, 4);
  assert.doesNotMatch(page, /Make work fit|Help your team <br>|Put inclusion <br>/);
});
