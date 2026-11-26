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
- About retains its founder statement, with a smaller navy subheading, capitalised Founder attribution and secondary company details in the footer.
- Workspace choices and introductions retain their brand colours without decorative border accents. The first workspace heading is Neurodivergent workspace; its existing deep link remains unchanged.
- Expanded toolboxes share their workspace header's pale tint. Closed toolboxes remain off-white, including on hover; keyboard focus and plus/minus disclosure indicators are retained.
- Legacy homepage links for the founder section and workspaces continue to their current destinations. The contact fragment now targets the footer.

## Checks

Run `node --test tests/explorer.test.cjs` and `node --check workspaces/explorer.js`.

The 25 automated checks cover homepage content, local links and assets, unique IDs, label targets, role selection, direct links, browser-history restoration, modified clicks, no-script content availability, removal of simulated controls, one application action per role, concise opening copy, stylesheet versions, brand imagery, accessible image attributes, border treatment, workspace naming, shared tool-card row sizing, workspace-specific expanded colours and About-page hierarchy and company details. Navigation tests use a small DOM test double; they do not replace browser testing.

Workspace toolbox colours, 26 November 2026:

- Shared workspace colour variables keep expanded toolboxes identical to their header background, with no change to text or disclosure behaviour.
- Forty-eight browser combinations passed across four workspaces, three widths (1446, 700 and 390 pixels), and closed, mixed, expanded and reclosed states. Colours matched the required state, row heights remained equal, and no clipping or horizontal overflow was observed.
- The lowest measured text contrast across the tested toolbox colours was 5.43:1.

Tool-panel height correction, 26 November 2026:

- Each card stretches to the tallest card in its own grid row, including when descriptions are expanded. Closed summaries fill the available card height so their clickable area and focus treatment stay aligned.
- Native disclosure behaviour, keyboard activation and content are unchanged. Single-column mobile cards retain natural content heights.
- Browser geometry checks passed for all four workspaces at 1446, 1024, 768, 700, 390 and 320 pixels, with all cards closed, only the first open, only the last open and all open: 96 combinations. No unequal same-row heights, clipped content or horizontal overflow were observed.

Browser checks for the approved refinements, 26 November 2026:

- Border removal on all four workspace introductions and the chooser, with the existing selection and keyboard-focus indicators preserved.
- Neurodivergent workspace naming and unchanged role links.
- About-page heading hierarchy and navy colour at 1446-, 768-, 390- and 320-pixel widths; company details remain 12-pixel secondary text.
- The earlier panel-height audit found unequal tool panels where text wraps. This is addressed by the subsequent tool-panel height correction above.

Browser checks for the branded workspace revision, 25 November 2026:

- All four role selections, selected-heading focus, return to the chooser, and browser back and forward.
- Native tool descriptions opened and closed with Enter.
- All four roles at 768-, 390- and 320-pixel widths, with no horizontal overflow; desktop compositions inspected visually.
- Workspace illustrations and tool icons use existing normALL assets. This revision was reviewed locally before publication.

Historical checks for the preceding release, 24 November 2026:

- Desktop, 768-pixel tablet, and 390- and 320-pixel mobile widths, with no horizontal overflow on the checked pages.
- Four role selections, return to all workspaces, browser back and forward, task checkboxes, energy comparison, manager review outcome, colleague clarification and HR hiring stages.
- Keyboard activation of expandable descriptions, selected-heading focus and skip-to-content navigation.
- Sample-message edits retained when switching roles, without transmitting or saving the text.
- Homepage with a 200 per cent root-text-size fixture at 320 pixels, with no horizontal overflow. This is a text-enlargement check, not a full assistive-technology audit.
- Existing app sign-in endpoint returned HTTP 200. The test did not submit credentials or send demo emails.

The development browser reported an extension-style asynchronous-message-channel error. No failure in the site's example controls was observed. A full screen-reader audit has not been performed.

## Release

The preceding minimalist homepage release was merged at e32e5a56c0bcbe71b3f9bf60837a69b7645e5ca0. The text-led workspace preview was rejected. The replacement branded preview and subsequent refinements were published through PR #4 at 291eeb5138019ce1810108664cc0629f354c975e on 26 November 2026. The tool-panel height correction is a follow-up to that release. The deployment target and existing CNAME remain unchanged. Confirm the GitHub Pages deployment and live pages before reporting publication as complete.
