# The Cache That Served the Wrong Image

A handful of users on our Android app reported that a screen was showing the wrong illustration. Where a friendly branded graphic should have been, they got the *error* illustration — a sad little coin with a frown. Nothing was actually broken on that screen. The image was just wrong.

I couldn't reproduce it. Same app version, same build, same screen — I got the correct image every time. That's the worst kind of bug: real, reported, and invisible to you.

This is the story of chasing it down to a single line in an open-source library, and the surprisingly deep pile of concepts underneath it.

## The three clues

Three facts shaped the whole investigation:

1. **Only some users saw it.** Not everyone on that version — a subset.
2. **It survived app updates.** Users updated the app and still saw the wrong image.
3. **Clearing the app cache fixed it.**

Clue 3 says it's a caching problem. Clue 2 says it's a *stubborn* caching problem — one that a new app build should have wiped but didn't. Clue 1 says it depends on some per-device history, not the code itself.

The code, for what it's worth, was innocent. The screen asked for image A. Every layer I could read passed image A along faithfully. And yet the bytes coming back were image B.

## How images get cached on Android

The app uses `expo-image`, which on Android sits on top of Glide, a mature image-loading and caching library. When you render an image, Glide decodes it once and files the result in a cache so the next render is instant. To find things again, it needs a **key**.

For a bundled image — one shipped inside the app binary — that key is essentially the image's **numeric Android resource ID**. Every drawable compiled into an Android app gets an integer ID like `2131165890`.

Here's the landmine: **those IDs are assigned at build time and are not stable across builds.** Add or remove a resource and the compiler renumbers the table. The ID that pointed at image B in one build can point at image A in the next.

Think of a coat check that hands out numbered tickets, then renovates and renumbers every hook overnight. You come back with ticket #847 expecting your coat, and get whatever is now hanging on hook #847.

## The trigger

Shortly before the reports, we'd moved the affected illustration from being **served over a CDN** to being **bundled into the app**.

That move matters more than it sounds. A CDN image is fetched by URL, and Glide caches it under that URL — a unique, content-addressed string that can never collide with anything. A bundled image is fetched by numeric resource ID — the unstable kind.

So the switch dropped the image out of the collision-proof filing system and into the one with reused ticket numbers. When it got bundled, the resource table was recompiled and the IDs shifted. Our image inherited an ID that, on users' *previously installed* build, had belonged to the error illustration. That error image's bytes were still sitting in Glide's disk cache under that ID — and nothing had invalidated them. Request the new image, get the old error bytes. Sad coin.

Only users who had the *previous* build installed had that poisoned cache entry, which is exactly why fresh installs — and my device — were fine.

## Why the app update didn't save anyone

Glide's maintainers know about the unstable-ID problem, and so do the `expo-image` authors. The intended defense is to stamp every cached resource with the app's version. When the version changes, the stamp changes, and stale entries are ignored. There's even a comment in the source spelling out the exact failure it prevents:

```kotlin
// Every local resource (drawable) in Android has its own unique numeric id, which are
// generated at build time. Although these ids are unique, they are not guaranteed unique
// across builds. ... To make sure the cache does not return the wrong image, we should
// clear the cache when the application version changes.
apply(RequestOptions.signatureOf(ApplicationVersionSignature.obtain(context)))
```

The comment is correct. The bug is one line up:

```kotlin
.customize(`when` = isResourceUri()) {   // only the "android.resource://" scheme
```

`isResourceUri()` only matches URIs with the `android.resource://` scheme. But React Native's bundled drawables resolve to a *different* scheme — `res:/` — hardcoded in React Native itself. `expo-image` even handles `res:/` a few lines earlier, converting it so Glide can load it. It just forgot to apply the version stamp to that same path.

So for every React Native bundled image, the one guard designed to prevent exactly this bug was **dead code**. It looked correct. It compiled. It did nothing.

## The fix

Upstream, the fix is a single added condition:

```kotlin
.customize(`when` = isResourceUri() || isLocalResourceUri()) {
```

That's it. Stamp the `res:/` scheme too. It shipped in `expo-image` 56.0.0. Our short-term mitigation was to tell the component to skip the disk cache entirely for bundled images — no stale entry, no collision, independent of the library version.

## What I took away

- **Flipping an asset from remote to bundled isn't free.** It changes how the platform caches it — from collision-proof URLs to unstable numeric IDs. "Just bundle it" quietly changed the failure surface.
- **Content addressing is a feature.** The CDN version couldn't have this bug because its cache key *was* its content. The moment the key became a reused integer, the door opened.
- **A guard that looks right can still be doing nothing.** The version-stamp logic was written, commented, and shipped — but gated on a scheme the real inputs never used. Tests pass, code reviews pass, and the protection silently covers zero of the cases that need it.
- **"I can't reproduce it" is a clue, not a dead end.** It meant the bug lived in per-device history, which pointed straight at the cache.

The best bugs teach you about a layer you thought you understood. I knew what an image cache was. I did not, until this week, know that it was keyed on an integer that changes every time you rebuild.
