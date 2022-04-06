---
title: Lens.ts
nav_order: 17
parent: Modules
---

## Lens overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

A `Lens` is an optic used to zoom inside a product.

`Lens`es have two type parameters generally called `S` and `A`: `Lens<S, A>` where `S` represents the product and `A`
an element inside of `S`.

Laws:

1. `get(set(a)(s)) = a`
2. `set(get(s))(s) = s`
3. `set(a)(set(a)(s)) = set(a)(s)`

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
  - [omit](#omit)
  - [pick](#pick)
  - [prop](#prop)
  - [right](#right)
  - [some](#some)
  - [traverse](#traverse)
  - [~~props~~](#props)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeIso](#composeiso)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
- [constructors](#constructors)
  - [id](#id)
  - [lens](#lens)
- [converters](#converters)
  - [asOptional](#asoptional)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [Category](#category)
  - [Invariant](#invariant-1)
  - [Semigroupoid](#semigroupoid)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [model](#model)
  - [Lens (interface)](#lens-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(sa: Lens<E, A>) => Lens<E, B>
```

Added in v2.3.0

# combinators

## atKey

Return a `Lens` from a `Lens` focused on a required key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const atKey: (key: string) => <S, A>(sa: Lens<S, Readonly<Record<string, A>>>) => Lens<S, Option<A>>
```

Added in v2.3.0

## component

Return a `Lens` from a `Lens` focused on a component of a tuple.

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Lens<S, A>) => Lens<S, A[P]>
```

Added in v2.3.0

## filter

**Signature**

```ts
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Lens<S, A>) => Optional<S, B>
export declare function filter<A>(predicate: Predicate<A>): <S>(sa: Lens<S, A>) => Optional<S, A>
```

Added in v2.3.0

## findFirst

**Signature**

```ts
export declare function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Lens<S, ReadonlyArray<A>>) => Optional<S, B>
export declare function findFirst<A>(predicate: Predicate<A>): <S>(sa: Lens<S, ReadonlyArray<A>>) => Optional<S, A>
```

Added in v2.3.2

## findFirstNonEmpty

**Signature**

```ts
export declare function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Lens<S, ReadonlyNonEmptyArray<A>>) => Optional<S, B>
export declare function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Lens<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
```

Added in v2.3.8

## fromNullable

Return a `Optional` from a `Lens` focused on a nullable value.

**Signature**

```ts
export declare const fromNullable: <S, A>(sa: Lens<S, A>) => Optional<S, NonNullable<A>>
```

Added in v2.3.0

## index

Return a `Optional` from a `Lens` focused on an index of a `ReadonlyArray`.

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Lens<S, readonly A[]>) => Optional<S, A>
```

Added in v2.3.0

## indexNonEmpty

Return a `Optional` from a `Lens` focused on an index of a `ReadonlyNonEmptyArray`.

**Signature**

```ts
export declare const indexNonEmpty: (i: number) => <S, A>(sa: Lens<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
```

Added in v2.3.8

## key

Return a `Optional` from a `Lens` focused on a key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const key: (key: string) => <S, A>(sa: Lens<S, Readonly<Record<string, A>>>) => Optional<S, A>
```

Added in v2.3.0

## left

Return a `Optional` from a `Lens` focused on the `Left` of a `Either` type.

**Signature**

```ts
export declare const left: <S, E, A>(sea: Lens<S, Either<E, A>>) => Optional<S, E>
```

Added in v2.3.0

## modify

**Signature**

```ts
export declare const modify: <A, B extends A = A>(f: (a: A) => B) => <S>(sa: Lens<S, A>) => (s: S) => S
```

Added in v2.3.0

## modifyF

**Signature**

```ts
export declare function modifyF<F extends URIS3>(
  F: Functor3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Lens<S, A>) => (s: S) => Kind3<F, R, E, S>
export declare function modifyF<F extends URIS2>(
  F: Functor2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Lens<S, A>) => (s: S) => Kind2<F, E, S>
export declare function modifyF<F extends URIS>(
  F: Functor1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Lens<S, A>) => (s: S) => Kind<F, S>
export declare function modifyF<F>(
  F: Functor<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Lens<S, A>) => (s: S) => HKT<F, S>
```

Added in v2.3.5

## omit

Return a `Lens` from a `Lens` and a list of props to remove.
A value-level 'Omit' (typescript utility type)

**Signature**

```ts
export declare const omit: <A, P extends keyof A>(
  props_0: P,
  ...props_1: P[]
) => <S>(sa: Lens<S, A>) => Lens<S, { [K in Exclude<keyof A, P>]: A[K] }>
```

Added in v2.3.13

## pick

Return a `Lens` from a `Lens` and a list of props.
A value-level 'Pick' (typescript utility type)

**Signature**

```ts
export declare const pick: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Lens<S, A>) => Lens<S, { [K in P]: A[K] }>
```

Added in v2.3.13

## prop

Return a `Lens` from a `Lens` and a prop.

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Lens<S, A>) => Lens<S, A[P]>
```

Added in v2.3.0

## right

Return a `Optional` from a `Lens` focused on the `Right` of a `Either` type.

**Signature**

```ts
export declare const right: <S, E, A>(sea: Lens<S, Either<E, A>>) => Optional<S, A>
```

Added in v2.3.0

## some

Return a `Optional` from a `Lens` focused on the `Some` of a `Option` type.

**Signature**

```ts
export declare const some: <S, A>(soa: Lens<S, Option<A>>) => Optional<S, A>
```

Added in v2.3.0

## traverse

Return a `Traversal` from a `Lens` focused on a `Traversable`.

**Signature**

```ts
export declare function traverse<T extends URIS>(
  T: Traversable1<T>
): <S, A>(sta: Lens<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.0

## ~~props~~

Use `fromStruct` instead.

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Lens<S, A>) => Lens<S, { [K in P]: A[K] }>
```

Added in v2.3.0

# compositions

## compose

Compose a `Lens` with a `Lens`.

**Signature**

```ts
export declare const compose: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B>
```

Added in v2.3.0

## composeIso

Compose a `Lens` with a `Iso`.

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B>
```

Added in v2.3.8

## composeLens

Alias of `compose`.

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Lens<S, A>) => Lens<S, B>
```

Added in v2.3.8

## composeOptional

Compose a `Lens` with an `Optional`.

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composePrism

Compose a `Lens` with a `Prism`.

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Lens<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composeTraversal

Compose a `Lens` with an `Traversal`.

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Lens<S, A>) => Traversal<S, B>
```

Added in v2.3.8

# constructors

## id

**Signature**

```ts
export declare const id: <S>() => Lens<S, S>
```

Added in v2.3.0

## lens

**Signature**

```ts
export declare const lens: <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S) => Lens<S, A>
```

Added in v2.3.8

# converters

## asOptional

View a `Lens` as a `Optional`.

**Signature**

```ts
export declare const asOptional: <S, A>(sa: Lens<S, A>) => Optional<S, A>
```

Added in v2.3.0

## asTraversal

View a `Lens` as a `Traversal`.

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Lens<S, A>) => Traversal<S, A>
```

Added in v2.3.0

# instances

## Category

**Signature**

```ts
export declare const Category: Category2<'monocle-ts/Lens'>
```

Added in v2.3.0

## Invariant

**Signature**

```ts
export declare const Invariant: Invariant2<'monocle-ts/Lens'>
```

Added in v2.3.0

## Semigroupoid

**Signature**

```ts
export declare const Semigroupoid: Semigroupoid2<'monocle-ts/Lens'>
```

Added in v2.3.8

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Lens'
```

Added in v2.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.3.0

# model

## Lens (interface)

**Signature**

```ts
export interface Lens<S, A> {
  readonly get: (s: S) => A
  readonly set: (a: A) => (s: S) => S
}
```

Added in v2.3.0
