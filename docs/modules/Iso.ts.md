---
title: Iso.ts
nav_order: 4
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
  - [atKey](#atkey)
  - [component](#component)
  - [filter](#filter)
  - [findFirst](#findfirst)
  - [findFirstNonEmpty](#findfirstnonempty)
  - [fromNullable](#fromnullable)
  - [index](#index)
  - [indexNonEmpty](#indexnonempty)
  - [key](#key)
  - [left](#left)
  - [modify](#modify)
  - [modifyF](#modifyf)
  - [prop](#prop)
  - [props](#props)
  - [right](#right)
  - [some](#some)
  - [traverse](#traverse)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeIso](#composeiso)
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
  - [Category](#category)
  - [Invariant](#invariant-1)
  - [Semigroupoid](#semigroupoid)
  - [URI (type alias)](#uri-type-alias)
- [model](#model)
  - [Iso (interface)](#iso-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Iso<E, A>) => Iso<E, B>
```

Added in v2.3.0

# combinators

## atKey

Return a `Lens` from a `Iso` focused on a required key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const atKey: (key: string) => <S, A>(sa: Iso<S, Readonly<Record<string, A>>>) => Lens<S, Option<A>>
```

Added in v2.3.8

## component

Return a `Lens` from a `Iso` focused on a component of a tuple.

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Iso<S, A>) => Lens<S, A[P]>
```

Added in v2.3.8

## filter

**Signature**

```ts
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Iso<S, A>) => Prism<S, B>
export declare function filter<A>(predicate: Predicate<A>): <S>(sa: Iso<S, A>) => Prism<S, A>
```

Added in v2.3.8

## findFirst

**Signature**

```ts
export declare function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Iso<S, ReadonlyArray<A>>) => Optional<S, B>
export declare function findFirst<A>(predicate: Predicate<A>): <S>(sa: Iso<S, ReadonlyArray<A>>) => Optional<S, A>
```

Added in v2.3.8

## findFirstNonEmpty

**Signature**

```ts
export declare function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Iso<S, ReadonlyNonEmptyArray<A>>) => Optional<S, B>
export declare function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Iso<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
```

Added in v2.3.8

## fromNullable

Return a `Prism` from a `Iso` focused on a nullable value.

**Signature**

```ts
export declare const fromNullable: <S, A>(sa: Iso<S, A>) => Prism<S, NonNullable<A>>
```

Added in v2.3.8

## index

Return a `Optional` from a `Iso` focused on an index of a `ReadonlyArray`.

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Iso<S, readonly A[]>) => Optional<S, A>
```

Added in v2.3.8

## indexNonEmpty

Return a `Optional` from a `Iso` focused on an index of a `ReadonlyNonEmptyArray`.

**Signature**

```ts
export declare const indexNonEmpty: (i: number) => <S, A>(sa: Iso<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
```

Added in v2.3.8

## key

Return a `Optional` from a `Iso` focused on a key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const key: (key: string) => <S, A>(sa: Iso<S, Readonly<Record<string, A>>>) => Optional<S, A>
```

Added in v2.3.8

## left

Return a `Prism` from a `Iso` focused on the `Left` of a `Either` type.

**Signature**

```ts
export declare const left: <S, E, A>(sea: Iso<S, Either<E, A>>) => Prism<S, E>
```

Added in v2.3.8

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

## prop

Return a `Lens` from a `Iso` and a prop.

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Iso<S, A>) => Lens<S, A[P]>
```

Added in v2.3.8

## props

Return a `Lens` from a `Iso` and a list of props.

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Iso<S, A>) => Lens<S, { [K in P]: A[K] }>
```

Added in v2.3.8

## right

Return a `Prism` from a `Iso` focused on the `Right` of a `Either` type.

**Signature**

```ts
export declare const right: <S, E, A>(sea: Iso<S, Either<E, A>>) => Prism<S, A>
```

Added in v2.3.8

## some

Return a `Prism` from a `Iso` focused on the `Some` of a `Option` type.

**Signature**

```ts
export declare const some: <S, A>(soa: Iso<S, Option<A>>) => Prism<S, A>
```

Added in v2.3.8

## traverse

Return a `Traversal` from a `Iso` focused on a `Traversable`.

**Signature**

```ts
export declare function traverse<T extends URIS>(T: Traversable1<T>): <S, A>(sta: Iso<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.8

# compositions

## compose

Compose an `Iso` with an `Iso`.

**Signature**

```ts
export declare const compose: <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>) => Iso<S, B>
```

Added in v2.3.0

## composeIso

Alias of `compose`.

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>) => Iso<S, B>
```

Added in v2.3.8

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

## Category

**Signature**

```ts
export declare const Category: Category2<'monocle-ts/Iso'>
```

Added in v2.3.0

## Invariant

**Signature**

```ts
export declare const Invariant: Invariant2<'monocle-ts/Iso'>
```

Added in v2.3.0

## Semigroupoid

**Signature**

```ts
export declare const Semigroupoid: Semigroupoid2<'monocle-ts/Iso'>
```

Added in v3.0.0

## URI (type alias)

**Signature**

```ts
export type URI = 'monocle-ts/Iso'
```

Added in v3.0.0

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
