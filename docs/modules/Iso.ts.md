---
title: Iso.ts
nav_order: 15
parent: Modules
---

## Iso overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

An `Iso` is an optic which converts elements of type `S` into elements of type `A` without loss.

Laws:

1. `reverseGet(get(s)) = s`
2. `get(reversetGet(a)) = a`

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [Invariant](#invariant)
  - [imap](#imap)
- [combinators](#combinators)
  - [modify](#modify)
  - [modifyF](#modifyf)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
- [constructors](#constructors)
  - [id](#id)
  - [iso](#iso)
  - [reverse](#reverse)
- [converters](#converters)
  - [asLens](#aslens)
  - [asOptional](#asoptional)
  - [asPrism](#asprism)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [categoryIso](#categoryiso)
  - [invariantIso](#invariantiso)
- [model](#model)
  - [Iso (interface)](#iso-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <S>(sa: Iso<S, A>) => Iso<S, B>
```

Added in v2.3.0

# combinators

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(sa: Iso<S, A>) => (s: S) => S
```

Added in v2.3.0

## modifyF

**Signature**

```ts
export declare function modifyF<F extends URIS3>(
  F: Functor3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Iso<S, A>) => (s: S) => Kind3<F, R, E, S>
export declare function modifyF<F extends URIS2>(
  F: Functor2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Iso<S, A>) => (s: S) => Kind2<F, E, S>
export declare function modifyF<F extends URIS>(
  F: Functor1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Iso<S, A>) => (s: S) => Kind<F, S>
export declare function modifyF<F>(
  F: Functor<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Iso<S, A>) => (s: S) => HKT<F, S>
```

Added in v2.3.5

# compositions

## compose

Compose an `Iso` with an `Iso`.

**Signature**

```ts
export declare const compose: <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>) => Iso<S, B>
```

Added in v2.3.0

## composeLens

Compose an `Iso` with a `Lens`.

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Iso<S, A>) => Lens<S, B>
```

Added in v2.3.8

## composeOptional

Compose an `Iso` with a `Optional`.

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Iso<S, A>) => Optional<S, B>
```

Added in v2.3.8

## composePrism

Compose an `Iso` with a `Prism`.

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Iso<S, A>) => Prism<S, B>
```

Added in v2.3.8

## composeTraversal

Compose an `Iso` with a `Traversal`.

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Iso<S, A>) => Traversal<S, B>
```

Added in v2.3.8

# constructors

## id

**Signature**

```ts
export declare const id: <S>() => Iso<S, S>
```

Added in v2.3.0

## iso

**Signature**

```ts
export declare const iso: <S, A>(get: (s: S) => A, reverseGet: (a: A) => S) => Iso<S, A>
```

Added in v2.3.8

## reverse

**Signature**

```ts
export declare const reverse: <S, A>(sa: Iso<S, A>) => Iso<A, S>
```

Added in v2.3.0

# converters

## asLens

View an `Iso` as a `Lens`.

**Signature**

```ts
export declare const asLens: <S, A>(sa: Iso<S, A>) => Lens<S, A>
```

Added in v2.3.0

## asOptional

View an `Iso` as a `Optional`.

**Signature**

```ts
export declare const asOptional: <S, A>(sa: Iso<S, A>) => Optional<S, A>
```

Added in v2.3.0

## asPrism

View an `Iso` as a `Prism`.

**Signature**

```ts
export declare const asPrism: <S, A>(sa: Iso<S, A>) => Prism<S, A>
```

Added in v2.3.0

## asTraversal

View an `Iso` as a `Traversal`.

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Iso<S, A>) => Traversal<S, A>
```

Added in v2.3.0

# instances

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Iso'
```

Added in v2.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.3.0

## categoryIso

**Signature**

```ts
export declare const categoryIso: Category2<'monocle-ts/Iso'>
```

Added in v2.3.0

## invariantIso

**Signature**

```ts
export declare const invariantIso: Invariant2<'monocle-ts/Iso'>
```

Added in v2.3.0

# model

## Iso (interface)

**Signature**

```ts
export interface Iso<S, A> {
  readonly get: (s: S) => A
  readonly reverseGet: (a: A) => S
}
```

Added in v2.3.0
