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
  - [indexReadonlyArray](#indexreadonlyarray)
  - [indexReadonlyRecord](#indexreadonlyrecord)
- [model](#model)
  - [Index (interface)](#index-interface)

---

# constructors

## fromAt

**Signature**

```ts
export declare const fromAt: <T, J, B>(at: At<T, J, Option<B>>) => Index<T, J, B>
```

Added in v3.0.0

## fromIso

Lift an instance of `Index` using an `Iso`.

**Signature**

```ts
export declare const fromIso: <T, S>(iso: Iso<T, S>) => <I, A>(sia: Index<S, I, A>) => Index<T, I, A>
```

Added in v3.0.0

## indexReadonlyArray

**Signature**

```ts
export declare const indexReadonlyArray: <A = never>() => Index<readonly A[], number, A>
```

Added in v3.0.0

## indexReadonlyRecord

**Signature**

```ts
export declare const indexReadonlyRecord: <A = never>() => Index<Readonly<Record<string, A>>, string, A>
```

Added in v3.0.0

# model

## Index (interface)

**Signature**

```ts
export interface Index<S, I, A> {
  readonly index: (i: I) => Optional<S, A>
}
```

Added in v3.0.0
