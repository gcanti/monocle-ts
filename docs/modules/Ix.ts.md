---
title: Ix.ts
nav_order: 16
parent: Modules
---

## Ix overview

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromAt](#fromat)
  - [fromIso](#fromiso)
- [model](#model)
  - [Index (interface)](#index-interface)

---

# constructors

## fromAt

**Signature**

```ts
export declare const fromAt: <T, J, B>(at: At<T, J, Option<B>>) => Index<T, J, B>
```

Added in v2.3.0

## fromIso

Lift an instance of `Index` using an `Iso`

**Signature**

```ts
export declare const fromIso: <T, S>(iso: Iso<T, S>) => <I, A>(sia: Index<S, I, A>) => Index<T, I, A>
```

Added in v2.3.0

# model

## Index (interface)

**Signature**

```ts
export interface Index<S, I, A> {
  readonly index: (i: I) => Optional<S, A>
}
```

Added in v2.3.0
