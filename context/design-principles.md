# Design principles

These principles are shared context for prototypes in this Studio. They are not
visual recipes. Apply them according to the user's task and the product domain.

## Reveal the task structure

Organise interfaces around what the user is trying to understand or accomplish,
not around implementation structure or the shape of backend data.

## Human control at consequential moments

Automation can remove mechanical work, but decisions with meaningful
consequences should remain visible, reviewable and overridable.

## Make system state legible

Users should be able to tell what has happened, what is happening, what needs
attention and what will happen next.

## Design exceptions, not only happy paths

Complex product workflows are defined by blockers, partial completion,
conflicting states and recovery. Treat these as first-class design material.

## Progressive disclosure is structural, not decorative

Do not collapse content merely to make a page appear shorter. First use clear
hierarchy, grouping, fieldsets, layout and conditional relevance. Collapse only
when hiding content reflects the user's mental model or task state.

## Stay close to the product without losing exploratory freedom

Use trusted blueprints, existing interaction patterns and real content where
helpful. Diverge deliberately when exploring a better model; do not drift into a
plausible but unrelated redesign.
