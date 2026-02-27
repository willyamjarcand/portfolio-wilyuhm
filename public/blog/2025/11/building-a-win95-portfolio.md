# Building a Win95 Portfolio

Most developer portfolios look the same: dark background, name in big type, list of projects, LinkedIn link. I wanted something people would actually spend time in.

## The Concept

Windows 95 is the perfect aesthetic for a developer portfolio. It's instantly recognizable, it's fun, and it gives you a natural metaphor for organizing content — files, folders, applications.

## Technical Choices

The draggable windows were the hardest part. Each window tracks its own position and z-index, and drag events have to be attached to `window` (not the element) to avoid losing the cursor.

Resizing was similar — you listen globally on `mousemove` and clean up on `mouseup`.

## What I'd Do Differently

The app registry in `Desktop.tsx` is a flat object. It works fine for 5 apps, but if this grew to 20 it'd get messy. A proper plugin system would be cleaner.

## The Fun Part

Doom runs in the browser via js-dos. That alone made it worth building.
