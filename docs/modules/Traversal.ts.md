---
title: Traversal.ts
nav_order: 20
parent: Modules
---

## Traversal overview

A `Traversal` is the generalisation of an `Optional` to several targets. In other word, a `Traversal` allows to focus
from a type `S` into `0` to `n` values of type `A`.

The most common example of a `Traversal` would be to focus into all elements inside of a container (e.g.
`ReadonlyArray`, `Option`). To do this we will use the relation between the typeclass `Traversable` and `Traversal`.

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [filter](#filter)
  - [index](#index)
  - [modify](#modify)
  - [prop](#prop)
  - [props](#props)
  - [set](#set)
  - [some](#some)
  - [traverse](#traverse)
- [compositions](#compositions)
  - [compose](#compose)
- [constructor](#constructor)
  - [fromTraversable](#fromtraversable)
- [constructors](#constructors)
  - [id](#id)
- [instances](#instances)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [categoryTraversal](#categorytraversal)
- [model](#model)
  - [ModifyF (interface)](#modifyf-interface)
  - [Traversal (interface)](#traversal-interface)

---

# combinators

## filter

**Signature**

```ts
export declare function filter<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(traversal: Traversal<S, A>) => Traversal<S, B>
export declare function filter<A>(predicate: Predicate<A>): <S>(traversal: Traversal<S, A>) => Traversal<S, A>
```

Added in v2.3.0

## index

Return a `Traversal` from a `Traversal` focused on a `ReadonlyArray`

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Traversal<S, readonly A[]>) => Traversal<S, A>
```

Added in v2.3.0

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(sa: Traversal<S, A>) => (s: S) => S
```

Added in v2.3.0

## prop

Return a `Traversal` from a `Traversal` and a prop

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Traversal<S, A>) => Traversal<S, A[P]>
```

Added in v2.3.0

## props

Return a `Traversal` from a `Traversal` and a list of props

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Traversal<S, A>) => Traversal<S, { [K in P]: A[K] }>
```

Added in v2.3.0

## set

**Signature**

```ts
export declare const set: <A>(a: A) => <S>(sa: Traversal<S, A>) => (s: S) => S
```

Added in v2.3.0

## some

Return a `Traversal` from a `Traversal` focused on a `Option` type

**Signature**

```ts
export declare const some: <S, A>(soa: Traversal<S, Option<A>>) => Traversal<S, A>
```

Added in v2.3.0

## traverse

Return a `Traversal` from a `Traversal` focused on a `Traversable`

**Signature**

```ts
export declare function traverse<T extends URIS>(
  T: Traversable1<T>
): <S, A>(sta: Traversal<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.0

# compositions

## compose

Compose a `Traversal` with a `Traversal`

**Signature**

```ts
export declare const compose: <A, B>(ab: Traversal<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.0

# constructor

## fromTraversable

Create a `Traversal` from a `Traversable`

**Signature**

```ts
export declare const fromTraversable: typeof _.fromTraversable
```

Added in v2.3.0

# constructors

## id

**Signature**

```ts
export declare const id: <S>() => Traversal<S, S>
```

Added in v2.3.0

# instances

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

## categoryTraversal

**Signature**

```ts
export declare const categoryTraversal: Category2<'monocle-ts/Traversal'>
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
