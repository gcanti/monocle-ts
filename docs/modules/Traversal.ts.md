---
title: Traversal.ts
nav_order: 20
parent: Modules
---

## Traversal overview

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [filter](#filter)
  - [modify](#modify)
  - [prop](#prop)
  - [props](#props)
  - [set](#set)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeIso](#composeiso)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
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

# compositions

## compose

Compose a `Traversal` with a `Traversal`

**Signature**

```ts
export declare const compose: typeof I.traversalComposeTraversal
```

Added in v2.3.0

## composeIso

Compose a `Traversal` with an `Iso`

**Signature**

```ts
export declare const composeIso: typeof I.traversalComposeIso
```

Added in v2.3.0

## composeLens

Compose a `Traversal` with a `Lens`

**Signature**

```ts
export declare const composeLens: typeof I.traversalComposeLens
```

Added in v2.3.0

## composeOptional

Compose a `Traversal` with a `Optional`

**Signature**

```ts
export declare const composeOptional: typeof I.traversalComposeOptional
```

Added in v2.3.0

## composePrism

Compose a `Traversal` with a `Prism`

**Signature**

```ts
export declare const composePrism: typeof I.traversalComposePrism
```

Added in v2.3.0

# constructor

## fromTraversable

Create a `Traversal` from a `Traversable`

**Signature**

```ts
export declare function fromTraversable<T extends URIS3>(
  T: Traversable3<T>
): <R, E, A>() => Traversal<Kind3<T, R, E, A>, A>
export declare function fromTraversable<T extends URIS2>(T: Traversable2<T>): <E, A>() => Traversal<Kind2<T, E, A>, A>
export declare function fromTraversable<T extends URIS>(T: Traversable1<T>): <A>() => Traversal<Kind<T, A>, A>
export declare function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
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
