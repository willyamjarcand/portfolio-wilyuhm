# React + TypeScript Tips I Wish I Knew

A handful of patterns that took me longer than they should have to internalize.

## Don't fight the type system

When you find yourself writing `as any` or `// @ts-ignore`, stop. The type system is usually telling you something real. Take 10 minutes to understand the error before suppressing it.

## Discriminated unions over booleans

Instead of:

```ts
interface State {
  loading: boolean;
  data: string | null;
  error: string | null;
}
```

Use:

```ts
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: string };
```

This makes impossible states unrepresentable. The compiler enforces it.

## `satisfies` is underrated

```ts
const colors = {
  red: '#ff0000',
  blue: '#0000ff',
} satisfies Record<string, string>;
```

You get the narrow type (`colors.red` is `'#ff0000'`, not `string`) while still validating the shape. Introduced in TS 4.9 and I use it constantly now.

## Keep components dumb

If a component takes more than 4-5 props, it's probably doing too much. Extract logic into hooks, keep components as pure render functions. They're easier to type and easier to test.
