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
  - [composeIso](#composeiso)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
- [constructor](#constructor)
  - [fromTraversable](#fromtraversable)
- [model](#model)
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
  ...props: P[]
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
export declare const traverse: <T extends
  | 'ReadonlyRecord'
  | 'Ord'
  | 'Eq'
  | 'Option'
  | 'Identity'
  | 'NonEmptyArray'
  | 'Array'
  | 'Record'>(
  T: Traversable1<T>
) => <S, A>(sta: Traversal<S, Kind<T, A>>) => Traversal<S, A>
```

Added in v2.3.0

# compositions

## composeIso

Compose a `Traversal` with an `Iso`

**Signature**

```ts
export declare const composeIso: <A, B>(ab: Iso<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.0

## composeLens

Compose a `Traversal` with a `Lens`

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.0

## composeOptional

Compose a `Traversal` with a `Optional`

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.0

## composePrism

Compose a `Traversal` with a `Prism`

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.0

## composeTraversal

Compose a `Traversal` with a `Traversal`

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Traversal<S, A>) => Traversal<S, B>
```

Added in v2.3.0

# constructor

## fromTraversable

Create a `Traversal` from a `Traversable`

**Signature**

```ts
export declare const fromTraversable: typeof I.fromTraversable
```

Added in v2.3.0

# model

## Traversal (interface)

**Signature**

```ts
export interface Traversal<S, A> {
  readonly modifyF: ModifyF<S, A>
}
```

Added in v2.3.0
