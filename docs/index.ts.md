---
title: index.ts
nav_order: 4
---

# LensFromPath

**Signature**

```ts
export interface LensFromPath<S> {
  <
    K1 extends keyof S,
    K2 extends keyof S[K1],
    K3 extends keyof S[K1][K2],
    K4 extends keyof S[K1][K2][K3],
    K5 extends keyof S[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5]
  ): Lens<S, S[K1][K2][K3][K4][K5]>
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3]>(
    path: [K1, K2, K3, K4]
  ): Lens<S, S[K1][K2][K3][K4]>
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(path: [K1, K2, K3]): Lens<S, S[K1][K2][K3]>
  <K1 extends keyof S, K2 extends keyof S[K1]>(path: [K1, K2]): Lens<S, S[K1][K2]>
  <K1 extends keyof S>(path: [K1]): Lens<S, S[K1]>
}
```

# ModifyF

**Signature**

```ts
export interface ModifyF<S, A> {
  <F extends URIS3>(F: Applicative3<F>): <U, L>(f: (a: A) => Type3<F, U, L, A>) => (s: S) => Type3<F, U, L, S>
  <F extends URIS3, U, L>(F: Applicative3C<F, U, L>): (f: (a: A) => Type3<F, U, L, A>) => (s: S) => Type3<F, U, L, S>
  <F extends URIS2>(F: Applicative2<F>): <L>(f: (a: A) => Type2<F, L, A>) => (s: S) => Type2<F, L, S>
  <F extends URIS2, L>(F: Applicative2C<F, L>): (f: (a: A) => Type2<F, L, A>) => (s: S) => Type2<F, L, S>
  <F extends URIS>(F: Applicative1<F>): (f: (a: A) => Type<F, A>) => (s: S) => Type<F, S>
  <F>(F: Applicative<F>): (f: (a: A) => HKT<F, A>) => (s: S) => HKT<F, S>
}
```

# fromTraversable

create a Traversal from a Traversable

**Signature**

```ts
export function fromTraversable<T>(T: Traversable<T>): <A>() => Traversal<HKT<T, A>, A>
```

# fromFoldable

create a Fold from a Foldable

**Signature**

```ts
export function fromFoldable<F>(F: Foldable<F>): <A>() => Fold<HKT<F, A>, A>
```

# Iso

**Signature**

```ts
export class Iso<S, A> {
  constructor(readonly get: (s: S) => A, readonly reverseGet: (a: A) => S) {}
  ...
}
```

## reverse

reverse the `Iso`: the source becomes the target and the target becomes the source

**Signature**

```ts
reverse(): Iso<A, S> { ... }
```

## modify

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## asLens

view an Iso as a Lens

**Signature**

```ts
asLens(): Lens<S, A> { ... }
```

## asPrism

view an Iso as a Prism

**Signature**

```ts
asPrism(): Prism<S, A> { ... }
```

## asOptional

view an Iso as a Optional

**Signature**

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal

view an Iso as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asFold

view an Iso as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## asGetter

view an Iso as a Getter

**Signature**

```ts
asGetter(): Getter<S, A> { ... }
```

## asSetter

view an Iso as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## compose

compose an Iso with an Iso

**Signature**

```ts
compose<B>(ab: Iso<A, B>): Iso<S, B> { ... }
```

## composeIso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Iso<S, B> { ... }
```

## composeLens

compose an Iso with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composePrism

compose an Iso with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composeOptional

compose an Iso with an Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose an Iso with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose an Iso with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeGetter

compose an Iso with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeSetter

compose an Iso with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

# Lens

**Signature**

```ts
export class Lens<S, A> {
  constructor(readonly get: (s: S) => A, readonly set: (a: A) => (s: S) => S) {}
  ...
}
```

## modify

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## asOptional

view a Lens as a Optional

**Signature**

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal

view a Lens as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asSetter

view a Lens as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## asGetter

view a Lens as a Getter

**Signature**

```ts
asGetter(): Getter<S, A> { ... }
```

## asFold

view a Lens as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## compose

compose a Lens with a Lens

**Signature**

```ts
compose<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composeLens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Lens<S, B> { ... }
```

## composeGetter

compose a Lens with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeFold

compose a Lens with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeOptional

compose a Lens with an Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose a Lens with an Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeSetter

compose a Lens with an Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeIso

compose a Lens with an Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Lens<S, B> { ... }
```

## composePrism

compose a Lens with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B> { ... }
```

# Prism

**Signature**

```ts
export class Prism<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly reverseGet: (a: A) => S) {}
  ...
}
```

## modify

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## modifyOption

**Signature**

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S> { ... }
```

## set

set the target of a Prism with a value

**Signature**

```ts
set(a: A): (s: S) => S { ... }
```

## asOptional

view a Prism as a Optional

**Signature**

```ts
asOptional(): Optional<S, A> { ... }
```

## asTraversal

view a Prism as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asSetter

view a Prism as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## asFold

view a Prism as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## compose

compose a Prism with a Prism

**Signature**

```ts
compose<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composePrism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Prism<S, B> { ... }
```

## composeOptional

compose a Prism with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose a Prism with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose a Prism with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter

compose a Prism with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeIso

compose a Prism with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Prism<S, B> { ... }
```

## composeLens

compose a Prism with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B> { ... }
```

## composeGetter

compose a Prism with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# Optional

**Signature**

```ts
export class Optional<S, A> {
  constructor(readonly getOption: (s: S) => Option<A>, readonly set: (a: A) => (s: S) => S) {}
  ...
}
```

## modify

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## modifyOption

**Signature**

```ts
modifyOption(f: (a: A) => A): (s: S) => Option<S> { ... }
```

## asTraversal

view a Optional as a Traversal

**Signature**

```ts
asTraversal(): Traversal<S, A> { ... }
```

## asFold

view an Optional as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## asSetter

view an Optional as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## compose

compose a Optional with a Optional

**Signature**

```ts
compose<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeOptional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Optional<S, B> { ... }
```

## composeTraversal

compose an Optional with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose an Optional with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter

compose an Optional with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeLens

compose an Optional with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Optional<S, B> { ... }
```

## composePrism

compose an Optional with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Optional<S, B> { ... }
```

## composeIso

compose an Optional with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Optional<S, B> { ... }
```

## composeGetter

compose an Optional with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# Traversal

**Signature**

```ts
export class Traversal<S, A> {
  constructor(
    // Van Laarhoven representation
    readonly modifyF: ModifyF<S, A>
  ) {}
  ...
}
```

## modify

**Signature**

```ts
modify(f: (a: A) => A): (s: S) => S { ... }
```

## set

**Signature**

```ts
set(a: A): (s: S) => S { ... }
```

## filter

focus the items matched by a traversal to those that match a predicate

**Signature**

```ts
filter(predicate: Predicate<A>): Traversal<S, A> { ... }
```

**Example**

```ts
import { fromTraversable } from 'monocle-ts'
import { array } from 'fp-ts/lib/Array'
interface Person {
  name: string
  cool: boolean
}
type People = Person[]
const peopleTraversal = fromTraversable(array)<Person>()
const coolLens = Lens.fromProp<Person>()('cool')
const people = [{ name: 'bill', cool: false }, { name: 'jill', cool: true }]
peopleTraversal
  .filter(p => p.name === 'bill')
  .composeLens(coolLens)
  .set(true)(people) // [{name: 'bill', cool: true}, {name: 'jill', cool: true}]
```

## asFold

view a Traversal as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## asSetter

view a Traversal as a Setter

**Signature**

```ts
asSetter(): Setter<S, A> { ... }
```

## compose

compose a Traversal with a Traversal

**Signature**

```ts
compose<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeTraversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> { ... }
```

## composeFold

compose a Traversal with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeSetter

compose a Traversal with a Setter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeOptional

compose a Traversal with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Traversal<S, B> { ... }
```

## composeLens

compose a Traversal with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Traversal<S, B> { ... }
```

## composePrism

compose a Traversal with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Traversal<S, B> { ... }
```

## composeIso

compose a Traversal with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Traversal<S, B> { ... }
```

## composeGetter

compose a Traversal with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

# At

**Signature**

```ts
export class At<S, I, A> {
  constructor(readonly at: (i: I) => Lens<S, A>) {}
  ...
}
```

## fromIso

lift an instance of `At` using an `Iso`

**Signature**

```ts
fromIso<T>(iso: Iso<T, S>): At<T, I, A> { ... }
```

# Index

**Signature**

```ts
export class Index<S, I, A> {
  constructor(readonly index: (i: I) => Optional<S, A>) {}
  ...
}
```

## fromIso

lift an instance of `Index` using an `Iso`

**Signature**

```ts
fromIso<T>(iso: Iso<T, S>): Index<T, I, A> { ... }
```

# Getter

**Signature**

```ts
export class Getter<S, A> {
  constructor(readonly get: (s: S) => A) {}
  ...
}
```

## asFold

view a Getter as a Fold

**Signature**

```ts
asFold(): Fold<S, A> { ... }
```

## compose

compose a Getter with a Getter

**Signature**

```ts
compose<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeGetter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Getter<S, B> { ... }
```

## composeFold

compose a Getter with a Fold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeLens

compose a Getter with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Getter<S, B> { ... }
```

## composeIso

compose a Getter with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Getter<S, B> { ... }
```

## composeTraversal

compose a Getter with a Optional

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> { ... }
```

## composeOptional

compose a Getter with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B> { ... }
```

## composePrism

compose a Getter with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B> { ... }
```

# Fold

**Signature**

```ts
export class Fold<S, A> {
  constructor(readonly foldMap: <M>(M: Monoid<M>) => (f: (a: A) => M) => (s: S) => M) {
    this.getAll = foldMap(getArrayMonoid<A>())(a => [a])
    this.exist = foldMap(monoidAny)
    this.all = foldMap(monoidAll)
    this.foldMapFirst = foldMap(getFirstMonoid())
  }
  ...
}
```

## compose

compose a Fold with a Fold

**Signature**

```ts
compose<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeFold

**Signature**

```ts
composeFold<B>(ab: Fold<A, B>): Fold<S, B> { ... }
```

## composeGetter

compose a Fold with a Getter

**Signature**

```ts
composeGetter<B>(ab: Getter<A, B>): Fold<S, B> { ... }
```

## composeTraversal

compose a Fold with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> { ... }
```

## composeOptional

compose a Fold with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Fold<S, B> { ... }
```

## composeLens

compose a Fold with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Fold<S, B> { ... }
```

## composePrism

compose a Fold with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Fold<S, B> { ... }
```

## composeIso

compose a Fold with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Fold<S, B> { ... }
```

## find

find the first target of a Fold matching the predicate

**Signature**

```ts
find(p: Predicate<A>): (s: S) => Option<A> { ... }
```

## headOption

get the first target of a Fold

**Signature**

```ts
headOption(s: S): Option<A> { ... }
```

# Setter

**Signature**

```ts
export class Setter<S, A> {
  constructor(readonly modify: (f: (a: A) => A) => (s: S) => S) {}
  ...
}
```

## set

**Signature**

```ts
set(a: A): (s: S) => S { ... }
```

## compose

compose a Setter with a Setter

**Signature**

```ts
compose<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeSetter

**Signature**

```ts
composeSetter<B>(ab: Setter<A, B>): Setter<S, B> { ... }
```

## composeTraversal

compose a Setter with a Traversal

**Signature**

```ts
composeTraversal<B>(ab: Traversal<A, B>): Setter<S, B> { ... }
```

## composeOptional

compose a Setter with a Optional

**Signature**

```ts
composeOptional<B>(ab: Optional<A, B>): Setter<S, B> { ... }
```

## composeLens

compose a Setter with a Lens

**Signature**

```ts
composeLens<B>(ab: Lens<A, B>): Setter<S, B> { ... }
```

## composePrism

compose a Setter with a Prism

**Signature**

```ts
composePrism<B>(ab: Prism<A, B>): Setter<S, B> { ... }
```

## composeIso

compose a Setter with a Iso

**Signature**

```ts
composeIso<B>(ab: Iso<A, B>): Setter<S, B> { ... }
```
