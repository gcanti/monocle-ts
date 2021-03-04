---
title: At.ts
nav_order: 1
parent: Modules
---

## At overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [atReadonlyRecord](#atreadonlyrecord)
  - [fromIso](#fromiso)
  - [~~atRecord~~](#atrecord)
- [model](#model)
  - [At (interface)](#at-interface)

---

# constructors

## atReadonlyRecord

**Signature**

```ts
export declare const atReadonlyRecord: <A = never>() => At<Readonly<Record<string, A>>, string, Option<A>>
```

Added in v2.3.7

## fromIso

Lift an instance of `At` using an `Iso`

**Signature**

```ts
export declare const fromIso: <T, S>(iso: Iso<T, S>) => <I, A>(sia: At<S, I, A>) => At<T, I, A>
```

Added in v2.3.0

## ~~atRecord~~

Use `atReadonlyRecord` instead.

**Signature**

```ts
export declare const atRecord: <A = never>() => At<Readonly<Record<string, A>>, string, Option<A>>
```

Added in v2.3.2

# model

## At (interface)

**Signature**

```ts
export interface At<S, I, A> {
  readonly at: (i: I) => Lens<S, A>
}
```

Added in v2.3.0
