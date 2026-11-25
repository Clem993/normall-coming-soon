# normALL public website

Static public website for normall.io. This repository is separate from the signed-in normall-app application.

## Local preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` from this directory, then open http://127.0.0.1:4173/.

## Minimalist redesign

- The homepage contains the existing headline, the agreed single-sentence introduction, and one primary link into the workspace explorer.
- The explorer starts with four choices. Selecting one opens that workspace on the same page. Direct role links and browser history remain supported.
- Workspace overviews use familiar workspace names, a one-sentence introduction, original normALL artwork and illustrated, native expandable tool descriptions. Embedded example forms, simulated tasks and example selection controls remain removed.
- Each workspace has one primary action, Open normALL, linking to the existing sign-in page. It does not promise to preserve a selected role through sign-in; the application retains its existing role-routing behaviour.
- These pages collect, submit and persist no visitor inputs. All four overviews and their descriptions remain available without JavaScript.
- Demo requests remain mail links in the footer. No account-creation flow or signed-in application behaviour has changed.
- The approved light background, #FCFCFA, is restored. Workspace introductions use teal, blue and warm orange colour treatments drawn from the existing brand. The homepage headline and introduction are unchanged.
- The visual direction now uses original illustrations and icons rather than product screenshots. No application sign-in or private user data is needed for this preview. Do not describe these illustrations as application screenshots.
- About retains its existing founder and company text, with navigation matching the new presentation.
- Legacy homepage links for the founder section and workspaces continue to their current destinations. The contact fragment now targets the footer.

## Checks

Run `node --test tests/explorer.test.cjs` and `node --check workspaces/explorer.js`.

The 19 automated checks cover homepage content, local links and assets, unique IDs, label targets, role selection, direct links, browser-history restoration, modified clicks, no-script content availability, removal of simulated controls, one application action per role, concise opening copy, stylesheet versions, brand imagery and accessible image attributes. Navigation tests use a small DOM test double; they do not replace browser testing.

Browser checks for the branded workspace revision, 25 November 2026:

- All four role selections, selected-heading focus, return to the chooser, and browser back and forward.
- Native tool descriptions opened and closed with Enter.
- All four roles at 768-, 390- and 320-pixel widths, with no horizontal overflow; desktop compositions inspected visually.
- Workspace illustrations and tool icons use existing normALL assets. The revision has not been published.

Historical checks for the preceding release, 24 November 2026:

- Desktop, 768-pixel tablet, and 390- and 320-pixel mobile widths, with no horizontal overflow on the checked pages.
- Four role selections, return to all workspaces, browser back and forward, task checkboxes, energy comparison, manager review outcome, colleague clarification and HR hiring stages.
- Keyboard activation of expandable descriptions, selected-heading focus and skip-to-content navigation.
- Sample-message edits retained when switching roles, without transmitting or saving the text.
- Homepage with a 200 per cent root-text-size fixture at 320 pixels, with no horizontal overflow. This is a text-enlargement check, not a full assistive-technology audit.
- Existing app sign-in endpoint returned HTTP 200. The test did not submit credentials or send demo emails.

The development browser reported an extension-style asynchronous-message-channel error. No failure in the site's example controls was observed. A full screen-reader audit has not been performed.

## Release

The preceding minimalist homepage release was merged at e32e5a56c0bcbe71b3f9bf60837a69b7645e5ca0. The text-led workspace preview was rejected. This replacement is a local preview on codex/branded-workspace-preview. Do not merge or publish this revision until it has been reviewed. The deployment target and existing CNAME remain unchanged.
