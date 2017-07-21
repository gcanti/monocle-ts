import { HKT } from 'fp-ts/lib/HKT'
import { Monoid, monoidArray, monoidAll, monoidAny } from 'fp-ts/lib/Monoid'
import { Applicative } from 'fp-ts/lib/Applicative'
import { Foldable, foldMap } from 'fp-ts/lib/Foldable'
import { Traversable } from 'fp-ts/lib/Traversable'
import * as option from 'fp-ts/lib/Option'
import { Option, none, some } from 'fp-ts/lib/Option'
import { identity, constant, Predicate } from 'fp-ts/lib/function'
import * as id from 'fp-ts/lib/Identity'
import * as con from 'fp-ts/lib/Const'

/*
  Laws:
  1. get . reverseGet = identity
  2. reversetGet . get = identity
*/
export class Iso<S, A> {
  readonly _tag: 'Iso' = 'Iso'
  constructor(public get: (s: S) => A, public reverseGet: (a: A) => S) {}

  modify(f: (a: A) => A, s: S): S {
    return this.reverseGet(f(this.get(s)))
  }

  /** view an Iso as a Lens */
  asLens(): Lens<S, A> {
    return new Lens(this.get, this.reverseGet)
  }

  /** view an Iso as a Prism */
  asPrism(): Prism<S, A> {
    return new Prism(s => some(this.get(s)), this.reverseGet)
  }

  /** view an Iso as a Optional */
  asOptional(): Optional<S, A> {
    return new Optional(s => some(this.get(s)), (a, s) => this.reverseGet(a))
  }

  /** view an Iso as a Traversal */
  asTraversal(): Traversal<S, A> {
    return new Traversal(<F>(F: Applicative<F>, f: (a: A) => HKT<F, A>, s: S): HKT<F, S> =>
      F.map((a: A) => this.reverseGet(a), f(this.get(s)))
    )
  }

  /** view an Iso as a Fold */
  asFold(): Fold<S, A> {
    return new Fold(<M>(M: Monoid<M>, f: (a: A) => M, s: S): M => f(this.get(s)))
  }

  /** view an Iso as a Getter */
  asGetter(): Getter<S, A> {
    return new Getter((s: S) => this.get(s))
  }

  /** view an Iso as a Setter */
  asSetter(): Setter<S, A> {
    return new Setter((f: (a: A) => A, s: S) => this.modify(f, s))
  }

  /** compose an Iso with an Iso */
  compose<B>(ab: Iso<A, B>): Iso<S, B> {
    return new Iso(s => ab.get(this.get(s)), b => this.reverseGet(ab.reverseGet(b)))
  }

  /** compose an Iso with a Lens */
  composeLens<B>(ab: Lens<A, B>): Lens<S, B> {
    return this.asLens().compose(ab)
  }

  /** compose an Iso with a Prism */
  composePrism<B>(ab: Prism<A, B>): Prism<S, B> {
    return this.asPrism().compose(ab)
  }

  /** compose an Iso with an Optional */
  composeOptional<B>(ab: Optional<A, B>): Optional<S, B> {
    return this.asOptional().compose(ab)
  }

  /** compose an Iso with a Traversal */
  composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> {
    return this.asTraversal().compose(ab)
  }

  /** compose an Iso with a Fold */
  composeFold<B>(ab: Fold<A, B>): Fold<S, B> {
    return this.asFold().compose(ab)
  }

  /** compose an Iso with a Getter */
  composeGetter<B>(ab: Getter<A, B>): Getter<S, B> {
    return this.asGetter().compose(ab)
  }

  /** compose an Iso with a Setter */
  composeSetter<B>(ab: Setter<A, B>): Setter<S, B> {
    return this.asSetter().compose(ab)
  }
}

export function lensFromPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6],
  K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
  K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8],
  K10 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8][K9]
>(path: [K1, K2, K3, K4, K5, K6, K7, K8, K9, K10]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7][K8][K9][K10]>
export function lensFromPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6],
  K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
  K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8]
>(path: [K1, K2, K3, K4, K5, K6, K7, K8, K9]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7][K8][K9]>
export function lensFromPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6],
  K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
>(path: [K1, K2, K3, K4, K5, K6, K7, K8]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>
export function lensFromPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5],
  K7 extends keyof T[K1][K2][K3][K4][K5][K6]
>(path: [K1, K2, K3, K4, K5, K6, K7]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7]>
export function lensFromPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4],
  K6 extends keyof T[K1][K2][K3][K4][K5]
>(path: [K1, K2, K3, K4, K5, K6]): Lens<T, T[K1][K2][K3][K4][K5][K6]>
export function lensFromPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  K5 extends keyof T[K1][K2][K3][K4]
>(path: [K1, K2, K3, K4, K5]): Lens<T, T[K1][K2][K3][K4][K5]>
export function lensFromPath<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3]
>(path: [K1, K2, K3, K4]): Lens<T, T[K1][K2][K3][K4]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(
  path: [K1, K2, K3]
): Lens<T, T[K1][K2][K3]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1]>(path: [K1, K2]): Lens<T, T[K1][K2]>
export function lensFromPath<T, K1 extends keyof T>(path: [K1]): Lens<T, T[K1]>
export function lensFromPath(path: Array<any>) {
  const lens = Lens.fromProp<any, any>(path[0])
  return path.slice(1).reduce((acc, prop) => acc.compose(Lens.fromProp<any, any>(prop)), lens)
}

/*
  Laws:
  1. get(set(a, s)) = a
  2. set(get(s), s) = s
  3. set(a, set(a, s)) = set(a, s)
*/
export class Lens<S, A> {
  static fromPath = lensFromPath
  readonly _tag: 'Lens' = 'Lens'
  constructor(public get: (s: S) => A, public set: (a: A, s: S) => S) {}

  /** generate a lens from a type and a prop */
  static fromProp<T, P extends keyof T>(prop: P): Lens<T, T[P]> {
    return new Lens(s => s[prop], (a, s) => Object.assign({}, s, { [prop as any]: a }))
  }

  modify(f: (a: A) => A, s: S): S {
    return this.set(f(this.get(s)), s)
  }

  /** view a Lens as a Optional */
  asOptional(): Optional<S, A> {
    return new Optional(s => some(this.get(s)), this.set)
  }

  /** view a Lens as a Traversal */
  asTraversal(): Traversal<S, A> {
    return new Traversal(<F>(F: Applicative<F>, f: (a: A) => HKT<F, A>, s: S): HKT<F, S> =>
      F.map(a => this.set(a, s), f(this.get(s)))
    )
  }

  /** view a Lens as a Setter */
  asSetter(): Setter<S, A> {
    return new Setter((f, s) => this.modify(f, s))
  }

  /** view a Lens as a Getter */
  asGetter(): Getter<S, A> {
    return new Getter<S, A>(s => this.get(s))
  }

  /** view a Lens as a Fold */
  asFold(): Fold<S, A> {
    return new Fold<S, A>(<M>(M: Monoid<M>, f: (a: A) => M, s: S): M => f(this.get(s)))
  }

  /** compose a Lens with a Lens */
  compose<B>(ab: Lens<A, B>): Lens<S, B> {
    return new Lens(s => ab.get(this.get(s)), (b, s) => this.set(ab.set(b, this.get(s)), s))
  }

  /** compose a Lens with a Getter */
  composeGetter<B>(ab: Getter<A, B>): Getter<S, B> {
    return this.asGetter().compose(ab)
  }

  /** compose a Lens with a Fold */
  composeFold<B>(ab: Fold<A, B>): Fold<S, B> {
    return this.asFold().compose(ab)
  }

  /** compose a Lens with an Optional */
  composeOptional<B>(ab: Optional<A, B>): Optional<S, B> {
    return this.asOptional().compose(ab)
  }

  /** compose a Lens with an Traversal */
  composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> {
    return this.asTraversal().compose(ab)
  }

  /** compose a Lens with an Setter */
  composeSetter<B>(ab: Setter<A, B>): Setter<S, B> {
    return this.asSetter().compose(ab)
  }

  /** compose a Lens with an Iso */
  composeIso<B>(ab: Iso<A, B>): Lens<S, B> {
    return this.compose(ab.asLens())
  }

  /** compose a Lens with a Prism */
  composePrism<B>(ab: Prism<A, B>): Optional<S, B> {
    return this.asOptional().compose(ab.asOptional())
  }
}

/*
  Laws:
  1. getOption(s).fold(identity, reverseGet) = s
  2. getOption(reverseGet(a)) = Some(a)
*/
export class Prism<S, A> {
  readonly _tag: 'Prism' = 'Prism'
  constructor(public getOption: (s: S) => Option<A>, public reverseGet: (a: A) => S) {}

  static fromPredicate<A>(predicate: Predicate<A>): Prism<A, A> {
    return new Prism(s => (predicate(s) ? some(s) : none), a => a)
  }

  static some<A>(): Prism<Option<A>, A> {
    return somePrism
  }

  modify(f: (a: A) => A, s: S): S {
    return this.modifyOption(f, s).fold(constant(s), identity)
  }

  modifyOption(f: (a: A) => A, s: S): Option<S> {
    return this.getOption(s).map(a => this.reverseGet(f(a)))
  }

  /** view a Prism as a Optional */
  asOptional(): Optional<S, A> {
    return new Optional(this.getOption, this.reverseGet)
  }

  /** view a Prism as a Traversal */
  asTraversal(): Traversal<S, A> {
    return new Traversal(<F>(F: Applicative<F>, f: (a: A) => HKT<F, A>, s: S): HKT<F, S> =>
      this.getOption(s).fold(() => F.of(s), a => F.map(fa => this.reverseGet(a), f(a)))
    )
  }

  /** view a Prism as a Setter */
  asSetter(): Setter<S, A> {
    return new Setter((f, s) => this.modify(f, s))
  }

  /** view a Prism as a Fold */
  asFold(): Fold<S, A> {
    return new Fold(<M>(M: Monoid<M>, f: (a: A) => M, s: S): M => this.getOption(s).fold(() => M.empty(), f))
  }

  /** compose a Prism with a Prism */
  compose<B>(ab: Prism<A, B>): Prism<S, B> {
    return new Prism(s => this.getOption(s).chain(a => ab.getOption(a)), b => this.reverseGet(ab.reverseGet(b)))
  }

  /** compose a Prism with a Optional */
  composeOptional<B>(ab: Optional<A, B>): Optional<S, B> {
    return this.asOptional().compose(ab)
  }

  /** compose a Prism with a Traversal */
  composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> {
    return this.asTraversal().compose(ab)
  }

  /** compose a Prism with a Fold */
  composeFold<B>(ab: Fold<A, B>): Fold<S, B> {
    return this.asFold().compose(ab)
  }

  /** compose a Prism with a Setter */
  composeSetter<B>(ab: Setter<A, B>): Setter<S, B> {
    return this.asSetter().compose(ab)
  }

  /** compose a Prism with a Iso */
  composeIso<B>(ab: Iso<A, B>): Prism<S, B> {
    return this.compose(ab.asPrism())
  }

  /** compose a Prism with a Lens */
  composeLens<B>(ab: Lens<A, B>): Optional<S, B> {
    return this.asOptional().compose(ab.asOptional())
  }

  /** compose a Prism with a Getter */
  composeGetter<B>(ab: Getter<A, B>): Fold<S, B> {
    return this.asFold().compose(ab.asFold())
  }
}

const somePrism = new Prism<Option<any>, any>(s => s, a => some(a))

/*
  Laws:
  1. getOption(s).fold(identity, a => set(a, s)) = s
  2. getOption(set(a, s)) = getOption(s).map(_ => a)
  3. set(a, set(a, s)) = set(a, s)
*/
export class Optional<S, A> {
  readonly _tag: 'Optional' = 'Optional'
  constructor(public getOption: (s: S) => Option<A>, public set: (a: A, s: S) => S) {}

  modify(f: (a: A) => A, s: S): S {
    return this.modifyOption(f, s).fold(constant(s), identity)
  }

  modifyOption(f: (a: A) => A, s: S): Option<S> {
    return this.getOption(s).map(a => this.set(f(a), s))
  }

  /** view a Optional as a Traversal */
  asTraversal(): Traversal<S, A> {
    return new Traversal(<F>(F: Applicative<F>, f: (a: A) => HKT<F, A>, s: S): HKT<F, S> =>
      this.getOption(s).fold(() => F.of(s), a => F.map((a: A) => this.set(a, s), f(a)))
    )
  }

  /** view an Optional as a Fold */
  asFold(): Fold<S, A> {
    return new Fold(<M>(M: Monoid<M>, f: (a: A) => M, s: S): M => this.getOption(s).fold(() => M.empty(), f))
  }

  /** view an Optional as a Setter */
  asSetter(): Setter<S, A> {
    return new Setter((f, s) => this.modify(f, s))
  }

  /** compose a Optional with a Optional */
  compose<B>(ab: Optional<A, B>): Optional<S, B> {
    return new Optional<S, B>(
      s => this.getOption(s).chain(a => ab.getOption(a)),
      (b, s) => this.modify(a => ab.set(b, a), s)
    )
  }

  /** compose an Optional with a Traversal */
  composeTraversal<B>(ab: Traversal<A, B>): Traversal<S, B> {
    return this.asTraversal().compose(ab)
  }

  /** compose an Optional with a Fold */
  composeFold<B>(ab: Fold<A, B>): Fold<S, B> {
    return this.asFold().compose(ab)
  }

  /** compose an Optional with a Setter */
  composeSetter<B>(ab: Setter<A, B>): Setter<S, B> {
    return this.asSetter().compose(ab)
  }

  /** compose an Optional with a Lens */
  composeLens<B>(ab: Lens<A, B>): Optional<S, B> {
    return this.compose(ab.asOptional())
  }

  /** compose an Optional with a Prism */
  composePrism<B>(ab: Prism<A, B>): Optional<S, B> {
    return this.compose(ab.asOptional())
  }

  /** compose an Optional with a Iso */
  composeIso<B>(ab: Iso<A, B>): Optional<S, B> {
    return this.compose(ab.asOptional())
  }

  /** compose an Optional with a Getter */
  composeGetter<B>(ab: Getter<A, B>): Fold<S, B> {
    return this.asFold().compose(ab.asFold())
  }
}

export class Traversal<S, A> {
  readonly _tag: 'Traversal' = 'Traversal'
  constructor(
    // Van Laarhoven representation
    public modifyF: <F>(F: Applicative<F>, f: (a: A) => HKT<F, A>, s: S) => HKT<F, S>
  ) {}

  modify(f: (a: A) => A, s: S): S {
    return (this.modifyF(id, a => id.of(f(a)), s) as id.Identity<S>).extract()
  }

  set(a: A, s: S): S {
    return this.modify(constant(a), s)
  }

  /** view a Traversal as a Fold */
  asFold(): Fold<S, A> {
    return new Fold(<M>(M: Monoid<M>, f: (a: A) => M, s: S): M =>
      (this.modifyF(con.getApplicative(M), a => new con.Const(f(a)), s) as con.Const<M, S>).fold(identity)
    )
  }

  /** view a Traversal as a Setter */
  asSetter(): Setter<S, A> {
    return new Setter((f, s) => this.modify(f, s))
  }

  /** compose a Traversal with a Traversal */
  compose<B>(ab: Traversal<A, B>): Traversal<S, B> {
    return new Traversal<S, B>(<F>(F: Applicative<F>, f: (a: B) => HKT<F, B>, s: S): HKT<F, S> =>
      this.modifyF(F, a => ab.modifyF(F, f, a), s)
    )
  }

  /** compose a Traversal with a Fold */
  composeFold<B>(ab: Fold<A, B>): Fold<S, B> {
    return this.asFold().compose(ab)
  }

  /** compose a Traversal with a Setter */
  composeSetter<B>(ab: Setter<A, B>): Setter<S, B> {
    return this.asSetter().compose(ab)
  }

  /** compose a Traversal with a Optional */
  composeOptional<B>(ab: Optional<A, B>): Traversal<S, B> {
    return this.compose(ab.asTraversal())
  }

  /** compose a Traversal with a Lens */
  composeLens<B>(ab: Lens<A, B>): Traversal<S, B> {
    return this.compose(ab.asTraversal())
  }

  /** compose a Traversal with a Prism */
  composePrism<B>(ab: Prism<A, B>): Traversal<S, B> {
    return this.compose(ab.asTraversal())
  }

  /** compose a Traversal with a Iso */
  composeIso<B>(ab: Iso<A, B>): Traversal<S, B> {
    return this.compose(ab.asTraversal())
  }

  /** compose a Traversal with a Getter */
  composeGetter<B>(ab: Getter<A, B>): Fold<S, B> {
    return this.asFold().compose(ab.asFold())
  }
}

export class Getter<S, A> {
  readonly _tag: 'Getter' = 'Getter'
  constructor(public get: (s: S) => A) {}

  /** view a Getter as a Fold */
  asFold(): Fold<S, A> {
    return new Fold<S, A>(<M>(M: Monoid<M>, f: (a: A) => M, s: S): M => f(this.get(s)))
  }

  /** compose a Getter with a Getter */
  compose<B>(ab: Getter<A, B>): Getter<S, B> {
    return new Getter((s: S) => ab.get(this.get(s)))
  }

  /** compose a Getter with a Fold */
  composeFold<B>(ab: Fold<A, B>): Fold<S, B> {
    return this.asFold().compose(ab)
  }

  /** compose a Getter with a Lens */
  composeLens<B>(ab: Lens<A, B>): Getter<S, B> {
    return this.compose(ab.asGetter())
  }

  /** compose a Getter with a Iso */
  composeIso<B>(ab: Iso<A, B>): Getter<S, B> {
    return this.compose(ab.asGetter())
  }

  /** compose a Getter with a Optional */
  composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> {
    return this.asFold().compose(ab.asFold())
  }

  /** compose a Getter with a Optional */
  composeOptional<B>(ab: Optional<A, B>): Fold<S, B> {
    return this.asFold().compose(ab.asFold())
  }

  /** compose a Getter with a Prism */
  composePrism<B>(ab: Prism<A, B>): Fold<S, B> {
    return this.asFold().compose(ab.asFold())
  }
}

export class Fold<S, A> {
  readonly _tag: 'Fold' = 'Fold'
  constructor(public foldMap: <M>(M: Monoid<M>, f: (a: A) => M, s: S) => M) {}

  /** compose a Fold with a Fold */
  compose<B>(ab: Fold<A, B>): Fold<S, B> {
    return new Fold<S, B>(<M>(M: Monoid<M>, f: (b: B) => M, s: S): M => this.foldMap(M, a => ab.foldMap(M, f, a), s))
  }

  /** compose a Fold with a Getter */
  composeGetter<B>(ab: Getter<A, B>): Fold<S, B> {
    return this.compose(ab.asFold())
  }

  /** compose a Fold with a Traversal */
  composeTraversal<B>(ab: Traversal<A, B>): Fold<S, B> {
    return this.compose(ab.asFold())
  }

  /** compose a Fold with a Optional */
  composeOptional<B>(ab: Optional<A, B>): Fold<S, B> {
    return this.compose(ab.asFold())
  }

  /** compose a Fold with a Lens */
  composeLens<B>(ab: Lens<A, B>): Fold<S, B> {
    return this.compose(ab.asFold())
  }

  /** compose a Fold with a Prism */
  composePrism<B>(ab: Prism<A, B>): Fold<S, B> {
    return this.compose(ab.asFold())
  }

  /** compose a Fold with a Iso */
  composeIso<B>(ab: Iso<A, B>): Fold<S, B> {
    return this.compose(ab.asFold())
  }

  /** get all the targets of a Fold */
  getAll(s: S): Array<A> {
    return this.foldMap(monoidArray, a => [a], s)
  }

  /** find the first target of a Fold matching the predicate */
  find(p: Predicate<A>, s: S): Option<A> {
    return this.foldMap(option.getFirstMonoid(), a => (p(a) ? option.of(a) : option.none), s)
  }

  /** get the first target of a Fold */
  headOption(s: S): Option<A> {
    return this.find(() => true, s)
  }

  /** check if at least one target satisfies the predicate */
  exist(p: Predicate<A>, s: S): boolean {
    return this.foldMap(monoidAny, p, s)
  }

  /** check if all targets satisfy the predicate */
  all(p: Predicate<A>, s: S): boolean {
    return this.foldMap(monoidAll, p, s)
  }
}

export class Setter<S, A> {
  readonly _tag: 'Setter' = 'Setter'
  constructor(public modify: (f: (a: A) => A, s: S) => S) {}

  set(a: A, s: S): S {
    return this.modify(constant(a), s)
  }

  /** compose a Setter with a Setter */
  compose<B>(ab: Setter<A, B>): Setter<S, B> {
    return new Setter<S, B>((f: (b: B) => B, s: S) => this.modify((a: A) => ab.modify(f, a), s))
  }

  /** compose a Setter with a Traversal */
  composeTraversal<B>(ab: Traversal<A, B>): Setter<S, B> {
    return this.compose(ab.asSetter())
  }

  /** compose a Setter with a Optional */
  composeOptional<B>(ab: Optional<A, B>): Setter<S, B> {
    return this.compose(ab.asSetter())
  }

  /** compose a Setter with a Lens */
  composeLens<B>(ab: Lens<A, B>): Setter<S, B> {
    return this.compose(ab.asSetter())
  }

  /** compose a Setter with a Prism */
  composePrism<B>(ab: Prism<A, B>): Setter<S, B> {
    return this.compose(ab.asSetter())
  }

  /** compose a Setter with a Iso */
  composeIso<B>(ab: Iso<A, B>): Setter<S, B> {
    return this.compose(ab.asSetter())
  }
}

export class Ops {
  /** create a Traversal from a Traversable */
  fromTraversable<T, A>(T: Traversable<T>): Traversal<HKT<T, A>, A>
  fromTraversable<T, A>(T: Traversable<T>): Traversal<HKT<T, A>, A> {
    return new Traversal(<F>(F: Applicative<F>, f: (a: A) => HKT<F, A>, s: HKT<T, A>): HKT<F, HKT<T, A>> =>
      T.traverse(F)(f, s)
    )
  }

  /** create a Fold from a Foldable */
  fromFoldable<F, A>(F: Foldable<F>): Fold<HKT<F, A>, A>
  fromFoldable<F, A>(F: Foldable<F>): Fold<HKT<F, A>, A> {
    return new Fold(<M>(M: Monoid<M>, f: (a: A) => M, s: HKT<F, A>): M => foldMap(F, M)(f, s))
  }
}

const ops = new Ops()
export const fromTraversable: Ops['fromTraversable'] = ops.fromTraversable
export const fromFoldable: Ops['fromFoldable'] = ops.fromFoldable

//
// overloadings
//

import { ArrayURI } from 'fp-ts/lib/overloadings'

export interface Ops {
  fromTraversable<A>(T: Traversable<ArrayURI>): Traversal<Array<A>, A>

  fromFoldable<A>(F: Foldable<ArrayURI>): Fold<Array<A>, A>
}
