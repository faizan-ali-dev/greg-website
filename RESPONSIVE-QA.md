# Responsive layout verification

All eight pages were checked in Microsoft Edge using browser viewport overrides.

## Layout matrix

| Width | Height | Coverage |
| --- | --- | --- |
| 252 | 590 | Every page |
| 280 | 653 | Every page |
| 320 | 568 | Every page |
| 360 | 640 | Every page |
| 375 | 667 | Every page |
| 390 | 844 | Every page |
| 430 | 932 | Every page |
| 568 | 320 | Every page; landscape menu and dialog |
| 600 | 524 | Every page |
| 700 | 800 | Every page |
| 701 | 800 | Every page |
| 768 | 1024 | Every page |
| 820 | 1180 | Every page |
| 999 | 768 | Every page |
| 1000 | 768 | Every page |
| 1024 | 768 | Every page |
| 1280 | 800 | Every page |
| 1440 | 900 | Every page |
| 1920 | 1080 | Every page |
| 2560 | 1440 | Every page |
| 3840 | 2160 | Every page; ticker track coverage |

168 page/viewport combinations passed checks for horizontal document overflow, overflowing text blocks and broken images. Contact inputs were checked again at all 21 sizes after increasing tablet input text to 16px.

## Interaction checks

- Expanded navigation fits a 320px-high landscape viewport and scrolls to its remaining items.
- Service navigation links have at least 44px touch targets.
- Escape closes navigation and returns keyboard focus appropriately.
- The desktop service dropdown fits at the 1000px breakpoint.
- Long contact messages wrap in the preview; the dialog stays inside the viewport and scrolls internally when necessary.
- Form testing stopped at the preview. No test email was sent.
- Ticker groups expand to the available width, preventing empty stretches on ultra-wide screens.
- Pause and play work while the control retains focus.
- Reduced-motion styles retain readable content without continuous animation.
- Source syntax checks and the static verifier pass for 196 internal links/assets.

## Implementation notes

Grid children can shrink to their available space. Narrow-screen cards, credentials, buttons and diagrams reflow without masking document overflow. The larger portrait and separate service ticker are preserved.

Viewport testing covers responsive geometry in Edge; this record is not a claim of physical-device or other-browser testing.
