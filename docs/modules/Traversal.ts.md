---
title: Traversal.ts
nav_order: 20
parent: Modules
---

## Traversal overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

A `Traversal` is the generalisation of an `Optional` to several targets. In other word, a `Traversal` allows to focus
from a type `S` into `0` to `n` values of type `A`.

The most common example of a `Traversal` would be to focus into all elements inside of a container (e.g.
`ReadonlyArray`, `Option`). To do this we will use the relation between the typeclass `Traversable` and `Traversal`.

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [atKey](#atkey)
  - [component](#component)
  - [filter](#filter)
  - [findFirst](#findfirst)
  - [findFirstNonEmpty](#findfirstnonempty)
  - [fold](#fold)
  - [foldMap](#foldmap)
  - [fromNullable](#fromnullable)
  - [getAll](#getall)
  - [index](#index)
  - [indexNonEmpty](#indexnonempty)
  - [key](#key)
  - [left](#left)
  - [modify](#modify)
  - [prop](#prop)
  - [props](#props)
  - [right](#right)
  - [set](#set)
  - [some](#some)
  - [traverse](#traverse)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeIso](#composeiso)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
- [constructor](#constructor)
  - [fromTraversable](#fromtraversable)
- [constructors](#constructors)
  - [id](#id)
  - [traversal](#traversal)
- [instances](#instances)
  - [Category](#category)
  - [Semigroupoid](#semigroupoid)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [model](#model)
  - [ModifyF (interface)](#modifyf-interface)
  - [Traversal (interface)](#traversal-interface)

---

# combinators

## atKey

Return a `Traversal` from a `Traversal` focused on a required key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const atKey: (
  key: string
) => <S, A>(sa: Traversal<S, Readonly<Record<string, A>>>) => Traversal<S, Option<A>>
```

Added in v2.3.0

## component

Return a `Traversal` from a `Traversal` focused on a component of a tuple.

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Traversal<S, A>) => Traversal<S, A[P]>
```

Added in v2.3.0

## filter

**Signature**

```ts
export declare function filter<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Traversal<S, A>) => Traversal<S, B>
export declare function filter<A>(predicate: Predicate<A>): <S>(sa: Traversal<S, A>) => Traversal<S, A>
```

Added in v2.3.0

## findFirst

**Signature**

```ts
export declare function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Traversal<S, ReadonlyArray<A>>) => Traversal<S, B>
export declare function findFirst<A>(
  predicate: Predicate<A>
): <S>(sa: Traversal<S, ReadonlyArray<A>>) => Traversal<S, A>
```

Added in v2.3.8

## findFirstNonEmpty

Alias of `findFirst`.

**Signature**

```ts
export declare function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Traversal<S, ReadonlyNonEmptyArray<A>>) => Traversal<S, B>
export declare function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Traversal<S, ReadonlyNonEmptyArray<A>>) => Traversal<S, A>
```

Added in v2.3.8

## fold

Map each target to a `Monoid` and combine the results.

**Signature**

```ts
export declare const fold: <A>(M: Monoid<A>) => <S>(sa: Traversal<S, A>) => (s: S) => A
```

Added in v2.3.0

## foldMap

Map each target to a `Monoid` and combine the results.

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <S>(sa: Traversal<S, A>) => (s: S) => M
```

Added in v2.3.0

## fromNullable

Return a `Traversal` from a `Traversal` focused on a nullable value.

**Signature**

```ts
export declare const fromNullable: <S, A>(sa: Traversal<S, A>) => Traversal<S, NonNullable<A>>
```

Added in v2.3.0

## getAll

Get all the targets of a `Traversal`.

**Signature**

```ts
export declare const getAll: <S>(s: S) => <A>(sa: Traversal<S, A>) => readonly A[]
```

Added in v2.3.0

## index

Return a `Traversal` from a `Traversal` focused on an index of a `ReadonlyArray`.

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Traversal<S, readonly A[]>) => Traversal<S, A>
```

Added in v2.3.0

## indexNonEmpty

Alias of `index`.

**Signature**

```ts
export declare const indexNonEmpty: (i: number) => <S, A>(sa: Traversal<S, ReadonlyNonEmptyArray<A>>) => Traversal<S, A>
```

Added in v2.3.8

## key

Return a `Traversal` from a `Traversal` focused on a key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const key: (key: string) => <S, A>(sa: Traversal<S, Readonly<Record<string, A>>>) => Traversal<S, A>
```

Added in v2.3.0

## left

Return a `Traversal` from a `Traversal` focused on the `Left` of a `Either` type.

**Signature**

```ts
export declare const left: <S, E, A>(sea: Traversal<S, Either<E, A>>) => Traversal<S, E>
```

Added in v2.3.0

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(sa: Traversal<S, A>) => (s: S) => S
```

Added in v2.3.0

## prop

Return a `Traversal` from a `Traversal` and a prop.

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Traversal<S, A>) => Traversal<S, A[P]>
```

Added in v2.3.0

## props

Return a `Traversal` from a `Traversal` and a list of props.

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Traversal<S, A>) => Traversal<S, { [K in P]: A[K] }>
```

Added in v2.3.0

## right

Return a `Traversal` from a `Traversal` focused on the `Right` of a `Either` type.

**Signature**

```ts
export declare const right: <S, E, A>(sea: Traversal<S, Either<E, A>>) => Traversal<S, A>
```

Added in v2.3.0

## set

**Signature**

```ts
export declare const set: <A>(a: A) => <S>(sa: Traversal<S, A>) => (s: S) => S
```

Added in v2.3.0

## some

Return a `Traversal` from a `Traversal` focused on the `Some` of a `Option` type.

**Signature**

```ts
export declare const some: <S, A>(soa: Traversal<S, Option<A>>) => Traversal<S, A>
```

Added in v2.3.0

## traverse

Return a `Traversal` from a `Traversal` focused on a `Traversable`.

**Signature**

```ts
export declare const traverse: <T extends
  | 'Option'
  | 'ReadonlyRecord'
  | 'Ord'
  | 'Eq'
  | 'ReadonlyNonEmptyArray'
  | 'ReadonlyArray'
  | 'Identity'
  | 'NonEmptyArray'
  | 'Array'
  | 'Record'>(
  T: Traversable1<T>
) => <S, A>(sta: Traversal<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.0

# compositions

## compose

Compose a `Traversal` with a `Traversal`.

**Signature**

```ts
export declare const compose: <A, B>(ab: Traversal<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.0

## composeIso

Compose a `Traversal` with a `Iso`.

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.8

## composeLens

Compose a `Traversal` with a `Lens`.

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.8

## composeOptional

Compose a `Traversal` with a `Optional`.

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.8

## composePrism

Compose a `Traversal` with a `Prism`.

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.8

## composeTraversal

Alias of `compose`.

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.8

# constructor

## fromTraversable

Create a `Traversal` from a `Traversable`.

**Signature**

```ts
export declare const fromTraversable: {
  <T extends never>(T: Traversable3<T>): <R, E, A>() => Traversal<Kind3<T, R, E, A>, A>
  <
    T extends
      | 'monocle-ts/Iso'
      | 'monocle-ts/Lens'
      | 'monocle-ts/Optional'
      | 'monocle-ts/Prism'
      | 'Either'
      | 'ReadonlyMap'
      | 'Const'
      | 'monocle-ts/Traversal'
  >(
    T: Traversable2<T>
  ): <E, A>() => Traversal<Kind2<T, E, A>, A>
  <
    T extends
      | 'Option'
      | 'ReadonlyRecord'
      | 'Ord'
      | 'Eq'
      | 'ReadonlyNonEmptyArray'
      | 'ReadonlyArray'
      | 'Identity'
      | 'NonEmptyArray'
      | 'Array'
      | 'Record'
  >(
    T: Traversable1<T>
  ): <A>() => Traversal<Kind<T, A>, A>
  <T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
}
```

Added in v2.3.0

# constructors

## id

**Signature**

```ts
export declare const id: <S>() => Traversal<S, S>
```

Added in v2.3.0

## traversal

**Signature**

```ts
export declare const traversal: <S, A>(modifyF: ModifyF<S, A>) => Traversal<S, A>
```

Added in v2.3.8

# instances

## Category

**Signature**

```ts
export declare const Category: Category2<'monocle-ts/Traversal'>
```

Added in v2.3.0

## Semigroupoid

**Signature**

```ts
export declare const Semigroupoid: Semigroupoid2<'monocle-ts/Traversal'>
```

Added in v2.3.8

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Traversal'
```

Added in v2.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.3.0

# model

## ModifyF (interface)

**Signature**

```ts
export interface ModifyF<S, A> {
  <F extends URIS3>(F: Applicative3<F>): <R, E>(f: (a: A) => Kind3<F, R, E, A>) => (s: S) => Kind3<F, R, E, S>
  <F extends URIS2>(F: Applicative2<F>): <E>(f: (a: A) => Kind2<F, E, A>) => (s: S) => Kind2<F, E, S>
  <F extends URIS2, E>(F: Applicative2C<F, E>): (f: (a: A) => Kind2<F, E, A>) => (s: S) => Kind2<F, E, S>
  <F extends URIS>(F: Applicative1<F>): (f: (a: A) => Kind<F, A>) => (s: S) => Kind<F, S>
  <F>(F: Applicative<F>): (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>
}
```

Added in v2.3.0

## Traversal (interface)

**Signature**

```ts
export interface Traversal<S, A> {
  readonly modifyF: ModifyF<S, A>
}
```

Added in v2.3.0
