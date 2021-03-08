---
title: Prism.ts
nav_order: 8
parent: Modules
---

## Prism overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

A `Prism` is an optic used to select part of a sum type.

Laws:

1. `pipe(getOption(s), fold(() => s, reverseGet)) = s`
2. `getOption(reverseGet(a)) = some(a)`

Added in v3.0.0

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
  - [modifyOption](#modifyoption)
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
- [constructors](#constructors)
  - [fromPredicate](#frompredicate)
  - [id](#id)
  - [prism](#prism)
- [converters](#converters)
  - [asOptional](#asoptional)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [Category](#category)
  - [Invariant](#invariant-1)
  - [Semigroupoid](#semigroupoid)
  - [URI (type alias)](#uri-type-alias)
- [model](#model)
  - [Prism (interface)](#prism-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Prism<E, A>) => Prism<E, B>
```

Added in v3.0.0

# combinators

## atKey

Return a `Optional` from a `Prism` focused on a required key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const atKey: (
  key: string
) => <S, A>(sa: Prism<S, Readonly<Record<string, A>>>) => Optional<S, O.Option<A>>
```

Added in v3.0.0

## component

Return a `Optional` from a `Prism` focused on a component of a tuple.

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Prism<S, A>) => Optional<S, A[P]>
```

Added in v3.0.0

## filter

**Signature**

```ts
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Prism<S, A>) => Prism<S, B>
export declare function filter<A>(predicate: Predicate<A>): <S>(sa: Prism<S, A>) => Prism<S, A>
```

Added in v3.0.0

## findFirst

**Signature**

```ts
export declare function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Prism<S, ReadonlyArray<A>>) => Optional<S, B>
export declare function findFirst<A>(predicate: Predicate<A>): <S>(sa: Prism<S, ReadonlyArray<A>>) => Optional<S, A>
```

Added in v3.0.0

## findFirstNonEmpty

**Signature**

```ts
export declare function findFirstNonEmpty<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Prism<S, ReadonlyNonEmptyArray<A>>) => Optional<S, B>
export declare function findFirstNonEmpty<A>(
  predicate: Predicate<A>
): <S>(sa: Prism<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
```

Added in v3.0.0

## fromNullable

Return a `Prism` from a `Prism` focused on a nullable value.

**Signature**

```ts
export declare const fromNullable: <S, A>(sa: Prism<S, A>) => Prism<S, NonNullable<A>>
```

Added in v3.0.0

## index

Return a `Optional` from a `Prism` focused on an index of a `ReadonlyArray`.

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Prism<S, readonly A[]>) => Optional<S, A>
```

Added in v3.0.0

## indexNonEmpty

Return a `Optional` from a `Prism` focused on an index of a `ReadonlyNonEmptyArray`.

**Signature**

```ts
export declare const indexNonEmpty: (i: number) => <S, A>(sa: Prism<S, ReadonlyNonEmptyArray<A>>) => Optional<S, A>
```

Added in v3.0.0

## key

Return a `Optional` from a `Prism` focused on a key of a `ReadonlyRecord`.

**Signature**

```ts
export declare const key: (key: string) => <S, A>(sa: Prism<S, Readonly<Record<string, A>>>) => Optional<S, A>
```

Added in v3.0.0

## left

Return a `Prism` from a `Prism` focused on the `Left` of a `Either` type.

**Signature**

```ts
export declare const left: <S, E, A>(sea: Prism<S, Either<E, A>>) => Prism<S, E>
```

Added in v3.0.0

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => S
```

Added in v3.0.0

## modifyF

**Signature**

```ts
export declare function modifyF<F extends URIS3>(
  F: Applicative3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Prism<S, A>) => (s: S) => Kind3<F, R, E, S>
export declare function modifyF<F extends URIS2>(
  F: Applicative2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Prism<S, A>) => (s: S) => Kind2<F, E, S>
export declare function modifyF<F extends URIS>(
  F: Applicative1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Prism<S, A>) => (s: S) => Kind<F, S>
export declare function modifyF<F>(
  F: Applicative<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Prism<S, A>) => (s: S) => HKT<F, S>
```

Added in v3.0.0

## modifyOption

**Signature**

```ts
export declare const modifyOption: <A>(f: (a: A) => A) => <S>(sa: Prism<S, A>) => (s: S) => O.Option<S>
```

Added in v3.0.0

## prop

Return a `Optional` from a `Prism` and a prop.

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Prism<S, A>) => Optional<S, A[P]>
```

Added in v3.0.0

## props

Return a `Optional` from a `Prism` and a list of props.

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Prism<S, A>) => Optional<S, { [K in P]: A[K] }>
```

Added in v3.0.0

## right

Return a `Prism` from a `Prism` focused on the `Right` of a `Either` type.

**Signature**

```ts
export declare const right: <S, E, A>(sea: Prism<S, Either<E, A>>) => Prism<S, A>
```

Added in v3.0.0

## set

**Signature**

```ts
export declare const set: <A>(a: A) => <S>(sa: Prism<S, A>) => (s: S) => S
```

Added in v3.0.0

## some

Return a `Prism` from a `Prism` focused on the `Some` of a `Option` type.

**Signature**

```ts
export declare const some: <S, A>(soa: Prism<S, O.Option<A>>) => Prism<S, A>
```

Added in v3.0.0

## traverse

Return a `Traversal` from a `Prism` focused on a `Traversable`.

**Signature**

```ts
export declare function traverse<T extends URIS>(
  T: Traversable1<T>
): <S, A>(sta: Prism<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v3.0.0

# compositions

## compose

Compose a `Prism` with a `Prism`.

**Signature**

```ts
export declare const compose: <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B>
```

Added in v3.0.0

## composeIso

Compose a `Prism` with a `Iso`.

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B>
```

Added in v3.0.0

## composeLens

Compose a `Prism` with a `Lens`.

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B>
```

Added in v3.0.0

## composeOptional

Compose a `Prism` with an `Optional`.

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Prism<S, A>) => Optional<S, B>
```

Added in v3.0.0

## composePrism

Alias of `compose`.

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Prism<S, A>) => Prism<S, B>
```

Added in v3.0.0

## composeTraversal

Compose a `Prism` with an `Traversal`.

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Prism<S, A>) => Traversal<S, B>
```

Added in v3.0.0

# constructors

## fromPredicate

**Signature**

```ts
export declare const fromPredicate: {
  <S, A extends S>(refinement: Refinement<S, A>): Prism<S, A>
  <A>(predicate: Predicate<A>): Prism<A, A>
}
```

Added in v3.0.0

## id

**Signature**

```ts
export declare const id: <S>() => Prism<S, S>
```

Added in v3.0.0

## prism

**Signature**

```ts
export declare const prism: <S, A>(getOption: (s: S) => O.Option<A>, reverseGet: (a: A) => S) => Prism<S, A>
```

Added in v3.0.0

# converters

## asOptional

View a `Prism` as a `Optional`.

**Signature**

```ts
export declare const asOptional: <S, A>(sa: Prism<S, A>) => Optional<S, A>
```

Added in v3.0.0

## asTraversal

View a `Prism` as a `Traversal`.

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Prism<S, A>) => Traversal<S, A>
```

Added in v3.0.0

# instances

## Category

**Signature**

```ts
export declare const Category: Category2<'monocle-ts/Prism'>
```

Added in v3.0.0

## Invariant

**Signature**

```ts
export declare const Invariant: Invariant2<'monocle-ts/Prism'>
```

Added in v3.0.0

## Semigroupoid

**Signature**

```ts
export declare const Semigroupoid: Semigroupoid2<'monocle-ts/Prism'>
```

Added in v3.0.0

## URI (type alias)

**Signature**

```ts
export type URI = 'monocle-ts/Prism'
```

Added in v3.0.0

# model

## Prism (interface)

**Signature**

```ts
export interface Prism<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly reverseGet: (a: A) => S
}
```

Added in v3.0.0
