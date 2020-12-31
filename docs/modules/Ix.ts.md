---
title: Ix.ts
nav_order: 5
parent: Modules
---

## Ix overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromAt](#fromat)
  - [fromIso](#fromiso)
  - [ixReadonlyArray](#ixreadonlyarray)
  - [ixReadonlyRecord](#ixreadonlyrecord)
- [model](#model)
  - [Ix (interface)](#ix-interface)

---

# constructors

## fromAt

**Signature**

```ts
export declare const fromAt: <T, J, B>(at: At<T, J, Option<B>>) => Ix<T, J, B>
```

Added in v3.0.0

## fromIso

Lift an instance of `Index` using an `Iso`

**Signature**

```ts
export declare const fromIso: <T, S>(iso: Iso<T, S>) => <I, A>(sia: Ix<S, I, A>) => Ix<T, I, A>
```

Added in v3.0.0

## ixReadonlyArray

**Signature**

```ts
export declare const ixReadonlyArray: <A = never>() => Ix<readonly A[], number, A>
```

Added in v3.0.0

## ixReadonlyRecord

**Signature**

```ts
export declare const ixReadonlyRecord: <A = never>() => Ix<Readonly<Record<string, A>>, string, A>
```

Added in v3.0.0

# model

## Ix (interface)

**Signature**

```ts
export interface Ix<S, I, A> {
  readonly ix: (i: I) => Optional<S, A>
}
```

Added in v3.0.0
