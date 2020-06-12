---
title: Iso.ts
nav_order: 15
parent: Modules
---

## Iso overview

Added in v2.3.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [modify](#modify)
- [compositions](#compositions)
  - [compose](#compose)
  - [composeLens](#composelens)
  - [composeOptional](#composeoptional)
  - [composePrism](#composeprism)
  - [composeTraversal](#composetraversal)
- [constructors](#constructors)
  - [id](#id)
  - [reverse](#reverse)
- [converters](#converters)
  - [asLens](#aslens)
  - [asOptional](#asoptional)
  - [asPrism](#asprism)
  - [asTraversal](#astraversal)
- [model](#model)
  - [Iso (interface)](#iso-interface)

---

# combinators

## modify

**Signature**

```ts
export declare const modify: <A>(f: (a: A) => A) => <S>(iso: Iso<S, A>) => (s: S) => S
```

Added in v2.3.0

# compositions

## compose

Compose an `Iso` with an `Iso`

**Signature**

```ts
export declare const compose: <A, B>(ab: Iso<A, B>) => <S>(sa: Iso<S, A>) => Iso<S, B>
```

Added in v2.3.0

## composeLens

Compose an `Iso` with a `Lens`

**Signature**

```ts
export declare const composeLens: <A, B>(ab: Lens<A, B>) => <S>(sa: Iso<S, A>) => Lens<S, B>
```

Added in v2.3.0

## composeOptional

Compose an `Iso` with a `Optional`

**Signature**

```ts
export declare const composeOptional: <A, B>(ab: Optional<A, B>) => <S>(sa: Iso<S, A>) => Optional<S, B>
```

Added in v2.3.0

## composePrism

Compose an `Iso` with a `Prism`

**Signature**

```ts
export declare const composePrism: <A, B>(ab: Prism<A, B>) => <S>(sa: Iso<S, A>) => Prism<S, B>
```

Added in v2.3.0

## composeTraversal

Compose an `Iso` with a `Traversal`

**Signature**

```ts
export declare const composeTraversal: <A, B>(ab: Traversal<A, B>) => <S>(sa: Iso<S, A>) => Traversal<S, B>
```

Added in v2.3.0

# constructors

## id

**Signature**

```ts
export declare const id: <S>() => Iso<S, S>
```

Added in v2.3.0

## reverse

**Signature**

```ts
export declare const reverse: <S, A>(iso: Iso<S, A>) => Iso<A, S>
```

Added in v2.3.0

# converters

## asLens

View an `Iso` as a `Lens`

**Signature**

```ts
export declare const asLens: <S, A>(sa: Iso<S, A>) => Lens<S, A>
```

Added in v2.3.0

## asOptional

View an `Iso` as a `Optional`

**Signature**

```ts
export declare const asOptional: <S, A>(sa: Iso<S, A>) => Optional<S, A>
```

Added in v2.3.0

## asPrism

View an `Iso` as a `Prism`

**Signature**

```ts
export declare const asPrism: <S, A>(sa: Iso<S, A>) => Prism<S, A>
```

Added in v2.3.0

## asTraversal

View an `Iso` as a `Traversal`

**Signature**

```ts
export declare const asTraversal: <S, A>(sa: Iso<S, A>) => Traversal<S, A>
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
