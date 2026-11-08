// Role links point to the same sections when JavaScript is unavailable.
const picker = document.querySelector('.role-picker');
const roleLinks = Array.from(picker.querySelectorAll('a'));
const workspaces = Array.from(document.querySelectorAll('.workspace'));

function showWorkspace(id, moveFocus = false) {
  const active = workspaces.find(section => section.id === id);
  if (!active) return;
  for (const section of workspaces) section.hidden = section !== active;
  for (const link of roleLinks) {
    if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (moveFocus) active.querySelector('h2').focus({preventScroll: true});
}

function restoreWorkspace() {
  const id = location.hash.slice(1);
  if (workspaces.some(section => section.id === id)) showWorkspace(id);
  else if (!workspaces.some(section => section.hidden) || !id) showWorkspace(workspaces[0].id);
}

for (const link of roleLinks) {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    showWorkspace(link.hash.slice(1), true);
  });
}
window.addEventListener('hashchange', restoreWorkspace);
window.addEventListener('popstate', restoreWorkspace);
window.addEventListener('pageshow', restoreWorkspace);
restoreWorkspace();

// All worked examples are available in the HTML. The selector narrows each
// preview to the situation the visitor chooses.
for (const preview of document.querySelectorAll('.preview')) {
  const control = preview.querySelector('.choice');
  const select = control.querySelector('select');
  const examples = preview.querySelectorAll('.example-output');
  function showExample() {
    for (const example of examples) example.hidden = example.id !== select.value;
  }
  showExample();
  control.hidden = false;
  select.addEventListener('change', showExample);
  window.addEventListener('pageshow', showExample);
}
