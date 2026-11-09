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

// Start with every example visible in the HTML, then enable the controls.
for (const control of document.querySelectorAll('.choice')) {
  const select = control.querySelector('select');
  const results = document.getElementById(select.getAttribute('aria-controls'));
  function showExample() {
    for (const example of results.children) example.hidden = example.id !== select.value;
  }
  showExample();
  control.hidden = false;
  select.addEventListener('change', showExample);
  window.addEventListener('pageshow', showExample);
}

const professionalPreview = document.querySelector('.professional-preview');
if (professionalPreview) {
  const topicPicker = professionalPreview.querySelector('.topic-picker');
  const topicPanels = professionalPreview.querySelectorAll('.topic-panel');

  function showTopic() {
    const selected = topicPicker.querySelector('input:checked').value;
    for (const panel of topicPanels) panel.hidden = panel.id !== selected;
  }
  showTopic();
  topicPicker.hidden = false;
  topicPicker.addEventListener('change', showTopic);
  window.addEventListener('pageshow', showTopic);

  const preferenceOptions = document.querySelector('.preference-options');
  const preferenceInputs = preferenceOptions.querySelectorAll('input');
  const emptyNote = document.querySelector('.empty-pref');

  function updatePreferenceNote() {
    for (const input of preferenceInputs) {
      document.getElementById(input.value).hidden = !input.checked;
    }
    emptyNote.hidden = Boolean(preferenceOptions.querySelector('input:checked'));
  }
  updatePreferenceNote();
  preferenceOptions.hidden = false;
  preferenceOptions.addEventListener('change', updatePreferenceNote);
  window.addEventListener('pageshow', updatePreferenceNote);
}
