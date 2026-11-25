# normALL public website

Static public website for normall.io. This repository is separate from the signed-in normall-app application.

## Local preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173/.

## Minimalist redesign

- The homepage contains the existing headline, the agreed single-sentence introduction, and one primary link into the workspace explorer.
- The explorer starts with four choices. Selecting one opens that workspace on the same page. Direct role links and browser history remain supported.
- Tool descriptions use native expandable sections. One example is displayed at a time when JavaScript is available; all example content remains available without JavaScript.
- Example controls are local to the page. This redesign adds no collection, submission or persistence of visitor inputs.
- Demo requests remain mail links. Sign in points to the existing application; no account-creation flow or application behaviour has changed.
- About retains its existing founder and company text, with navigation matching the new presentation.
- Legacy homepage links for the founder section and workspaces continue to their current destinations. The contact fragment now targets the footer.

## Checks

Run `node --test tests/explorer.test.cjs` and `node --check workspaces/explorer.js`.

The 16 automated checks cover homepage content, local links and assets, unique IDs, label targets, role selection, direct links, browser-history restoration, modified clicks, no-script content availability, and example-panel references. Navigation tests use a small DOM test double; they do not replace browser testing.

Browser checks completed on 24 November 2026:

- Desktop, 768-pixel tablet, and 390- and 320-pixel mobile widths, with no horizontal overflow on the checked pages.
- Four role selections, return to all workspaces, browser back and forward, task checkboxes, energy comparison, manager review outcome, colleague clarification and HR hiring stages.
- Keyboard activation of expandable descriptions, selected-heading focus and skip-to-content navigation.
- Sample-message edits retained when switching roles, without transmitting or saving the text.
- Homepage with a 200 per cent root-text-size fixture at 320 pixels, with no horizontal overflow. This is a text-enlargement check, not a full assistive-technology audit.
- Existing app sign-in endpoint returned HTTP 200. The test did not submit credentials or send demo emails.

The development browser reported an extension-style asynchronous-message-channel error. No failure in the site's example controls was observed. A full screen-reader audit has not been performed.

## Release

This change is a preview for review. Do not merge to the published branch until the homepage and workspace chooser have been approved. The deployment target and existing CNAME remain unchanged.
