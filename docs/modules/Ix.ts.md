---
title: Ix.ts
nav_order: 5
parent: Modules
---

## Ix overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [fromAt](#fromat)
  - [fromIso](#fromiso)
  - [index](#index)
  - [indexReadonlyArray](#indexreadonlyarray)
  - [indexReadonlyMap](#indexreadonlymap)
  - [indexReadonlyNonEmptyArray](#indexreadonlynonemptyarray)
  - [indexReadonlyRecord](#indexreadonlyrecord)
- [model](#model)
  - [Index (interface)](#index-interface)

---

# constructors

## fromAt

**Signature**

```ts
export declare const fromAt: <T, J, B>(at: At<T, J, O.Option<B>>) => Index<T, J, B>
```

Added in v2.3.0

## fromIso

Lift an instance of `Index` using an `Iso`.

**Signature**

```ts
export declare const fromIso: <T, S>(iso: Iso<T, S>) => <I, A>(sia: Index<S, I, A>) => Index<T, I, A>
```

Added in v2.3.0

## index

**Signature**

```ts
export declare const index: <S, I, A>(index: (i: I) => Optional<S, A>) => Index<S, I, A>
```

Added in v2.3.8

## indexReadonlyArray

**Signature**

```ts
export declare const indexReadonlyArray: <A = never>() => Index<readonly A[], number, A>
```

Added in v2.3.7

## indexReadonlyMap

**Signature**

```ts
export declare const indexReadonlyMap: <K>(E: Eq<K>) => <A = never>() => Index<ReadonlyMap<K, A>, K, A>
```

Added in v2.3.7

## indexReadonlyNonEmptyArray

**Signature**

```ts
export declare const indexReadonlyNonEmptyArray: <A = never>() => Index<ReadonlyNonEmptyArray<A>, number, A>
```

Added in v2.3.8

## indexReadonlyRecord

**Signature**

```ts
export declare const indexReadonlyRecord: <A = never>() => Index<Readonly<Record<string, A>>, string, A>
```

Added in v2.3.7

# model

## Index (interface)

**Signature**

```ts
export interface Index<S, I, A> {
  readonly index: (i: I) => Optional<S, A>
}
```

Added in v2.3.0
