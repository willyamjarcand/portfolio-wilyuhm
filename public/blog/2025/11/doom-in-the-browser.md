# Doom in the Browser

Running a 1993 DOS game in a modern browser is easier than it should be.

## js-dos

[js-dos](https://js-dos.com) is a DOSBox port to WebAssembly. You give it a `.jsdos` bundle — a zip containing your game files and a `dosbox.conf` — and it runs the whole DOS environment in a canvas element.

## The Setup

```html
<script src="/emulators/emulators.js"></script>
<script src="/emulators-ui/emulators-ui.js"></script>
```

Then in React:

```ts
Dos(canvasRef.current).run('/doom.jsdos');
```

That's genuinely most of it. The heavy lifting is all in js-dos.

## Gotchas

- The canvas needs a fixed size or the aspect ratio goes wrong
- Keyboard events get swallowed by the browser in some situations — you may need to click the canvas to focus it
- Mobile is rough; DOS games weren't designed for touch

## Worth Adding

Absolutely. It's the first thing people click on.
