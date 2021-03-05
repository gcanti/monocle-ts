---
title: Optional.ts
nav_order: 18
parent: Modules
---

## Optional overview

**This module is experimental**

Experimental features are published in order to get early feedback from the community.

A feature tagged as _Experimental_ is in a high state of flux, you're at risk of it changing without notice.

An `Optional` is an optic used to zoom inside a product. Unlike the `Lens`, the element that the `Optional` focuses
on may not exist.

`Optional`s have two type parameters generally called `S` and `A`: `Optional<S, A>` where `S` represents the product
and `A` an optional element inside of `S`.

Laws:

1. `pipe(getOption(s), fold(() => s, a => set(a)(s))) = s`
2. `getOption(set(a)(s)) = pipe(getOption(s), map(_ => a))`
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
  - [fromNullable](#fromnullable)
  - [index](#index)
  - [key](#key)
  - [left](#left)
  - [modify](#modify)
  - [modifyF](#modifyf)
  - [modifyOption](#modifyoption)
  - [prop](#prop)
  - [props](#props)
  - [right](#right)
  - [setOption](#setoption)
  - [some](#some)
  - [traverse](#traverse)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeIso](#composeiso)
  - [composeLens](#composelens)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
- [constructors](#constructors)
  - [id](#id)
- [converters](#converters)
  - [asTraversal](#astraversal)
- [instances](#instances)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
  - [categoryOptional](#categoryoptional)
  - [invariantOptional](#invariantoptional)
- [model](#model)
  - [Optional (interface)](#optional-interface)

---

# Invariant

## imap

**Signature**

```ts
export declare const imap: <A, B>(f: (a: A) => B, g: (b: B) => A) => <E>(fa: Optional<E, A>) => Optional<E, B>
```

Added in v2.3.0

# combinators

## atKey

Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a required key.

**Signature**

```ts
export declare const atKey: (
  key: string
) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>) => Optional<S, O.Option<A>>
```

Added in v2.3.0

## component

Return a `Optional` from a `Optional` and a component.

**Signature**

```ts
export declare const component: <A extends readonly unknown[], P extends keyof A>(
  prop: P
) => <S>(sa: Optional<S, A>) => Optional<S, A[P]>
```

Added in v2.3.0

## filter

**Signature**

```ts
export declare function filter<A, B extends A>(refinement: Refinement<A, B>): <S>(sa: Optional<S, A>) => Optional<S, B>
export declare function filter<A>(predicate: Predicate<A>): <S>(sa: Optional<S, A>) => Optional<S, A>
```

Added in v2.3.0

## findFirst

**Signature**

```ts
export declare function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, B>
export declare function findFirst<A>(predicate: Predicate<A>): <S>(sa: Optional<S, ReadonlyArray<A>>) => Optional<S, A>
```

Added in v2.3.2

## fromNullable

Return an `Optional` from a `Optional` focused on a nullable value.

**Signature**

```ts
export declare const fromNullable: <S, A>(sa: Optional<S, A>) => Optional<S, NonNullable<A>>
```

Added in v2.3.3

## index

Return a `Optional` from a `Optional` focused on a `ReadonlyArray`.

**Signature**

```ts
export declare const index: (i: number) => <S, A>(sa: Optional<S, readonly A[]>) => Optional<S, A>
```

Added in v2.3.0

## key

Return a `Optional` from a `Optional` focused on a `ReadonlyRecord` and a key.

**Signature**

```ts
export declare const key: (key: string) => <S, A>(sa: Optional<S, Readonly<Record<string, A>>>) => Optional<S, A>
```

Added in v2.3.0

## left

Return a `Optional` from a `Optional` focused on the `Left` of a `Either` type.

**Signature**

```ts
export declare const left: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, E>
```

Added in v2.3.0

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => S
```

Added in v2.3.0

## modifyF

**Signature**

```ts
export declare function modifyF<F extends URIS3>(
  F: Applicative3<F>
): <A, R, E>(f: (a: A) => Kind3<F, R, E, A>) => <S>(sa: Optional<S, A>) => (s: S) => Kind3<F, R, E, S>
export declare function modifyF<F extends URIS2>(
  F: Applicative2<F>
): <A, E>(f: (a: A) => Kind2<F, E, A>) => <S>(sa: Optional<S, A>) => (s: S) => Kind2<F, E, S>
export declare function modifyF<F extends URIS>(
  F: Applicative1<F>
): <A>(f: (a: A) => Kind<F, A>) => <S>(sa: Optional<S, A>) => (s: S) => Kind<F, S>
export declare function modifyF<F>(
  F: Applicative<F>
): <A>(f: (a: A) => HKT<F, A>) => <S>(sa: Optional<S, A>) => (s: S) => HKT<F, S>
```

Added in v2.3.5

## modifyOption

**Signature**

```ts
export declare const modifyOption: <A>(f: (a: A) => A) => <S>(optional: Optional<S, A>) => (s: S) => O.Option<S>
```

Added in v2.3.0

## prop

Return a `Optional` from a `Optional` and a prop.

**Signature**

```ts
export declare const prop: <A, P extends keyof A>(prop: P) => <S>(sa: Optional<S, A>) => Optional<S, A[P]>
```

Added in v2.3.0

## props

Return a `Optional` from a `Optional` and a list of props.

**Signature**

```ts
export declare const props: <A, P extends keyof A>(
  props_0: P,
  props_1: P,
  ...props_2: P[]
) => <S>(sa: Optional<S, A>) => Optional<S, { [K in P]: A[K] }>
```

Added in v2.3.0

## right

Return a `Optional` from a `Optional` focused on the `Right` of a `Either` type.

**Signature**

```ts
export declare const right: <S, E, A>(sea: Optional<S, Either<E, A>>) => Optional<S, A>
```

Added in v2.3.0

## setOption

**Signature**

```ts
export declare const setOption: <A>(a: A) => <S>(optional: Optional<S, A>) => (s: S) => O.Option<S>
```

Added in v2.3.7

## some

Return a `Optional` from a `Optional` focused on the `Some` of a `Option` type.

**Signature**

```ts
export declare const some: <S, A>(soa: Optional<S, O.Option<A>>) => Optional<S, A>
```

Added in v2.3.0

## traverse

Return a `Traversal` from a `Optional` focused on a `Traversable`.

**Signature**

```ts
export declare function traverse<T extends URIS>(
  T: Traversable1<T>
): <S, A>(sta: Optional<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.0

# compositions

## compose

Compose a `Optional` with a `Optional`.

**Signature**

```ts
export declare const compose: <A, B>(ab: Optional<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composeIso

Compose a `Optional` with a `Iso`.

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B>
```

Added in v2.3.8

## composeLens

Compose a `Optional` with a `Lens`.

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B>
```

Added in v2.3.7

## composePrism

Compose a `Optional` with a `Prism`.

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Optional<S, A>) => Optional<S, B>
```

Added in v2.3.7

## composeTraversal

Compose a `Optional` with an `Traversal`.

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Optional<S, A>) => Traversal<S, B>
```

Added in v2.3.8

# constructors

## id

**Signature**

```ts
export declare const id: <S>() => Optional<S, S>
```

Added in v2.3.0

# converters

## asTraversal

View a `Optional` as a `Traversal`.

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Optional<S, A>) => Traversal<S, A>
```

Added in v2.3.0

# instances

## URI

**Signature**

```ts
export declare const URI: 'monocle-ts/Optional'
```

Added in v2.3.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.3.0

## categoryOptional

**Signature**

```ts
export declare const categoryOptional: Category2<'monocle-ts/Optional'>
```

Added in v2.3.0

## invariantOptional

**Signature**

```ts
export declare const invariantOptional: Invariant2<'monocle-ts/Optional'>
```

Added in v2.3.0

# model

## Optional (interface)

**Signature**

```ts
export interface Optional<S, A> {
  readonly getOption: (s: S) => Option<A>
  readonly set: (a: A) => (s: S) => S
}
```

Added in v2.3.0
