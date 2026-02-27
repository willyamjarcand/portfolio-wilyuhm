# Framer Motion: Making Things Move

Animation libraries have a bad reputation for being either too simple or too complex. Framer Motion is neither.

## The mental model

Everything is a `motion` component. Swap `<div>` for `<motion.div>` and you get access to `animate`, `initial`, `exit`, and `transition` props.

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Hello
</motion.div>
```

That's a fade-in-up. Three props.

## `AnimatePresence` for exit animations

React removes elements immediately from the DOM. `AnimatePresence` lets them animate out first:

```tsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      key="item"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

The `key` prop is required — it's how Framer Motion knows which element is leaving.

## Layout animations

The `layout` prop animates between layout changes automatically. Resize a container, reorder a list — it figures out the transition.

```tsx
<motion.div layout>
```

This one prop does more work than it has any right to.

## When not to use it

If you're doing a simple CSS transition (hover state, color change), just use CSS. Framer Motion has overhead. Reach for it when you need sequence, physics, or exit animations.
