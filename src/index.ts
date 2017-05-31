import { HKT, HKTS } from 'fp-ts/lib/HKT'
import { StaticMonoid, monoidArray, monoidAll, monoidAny } from 'fp-ts/lib/Monoid'
import { StaticApplicative } from 'fp-ts/lib/Applicative'
import { StaticFoldable, foldMap } from 'fp-ts/lib/Foldable'
import { StaticTraversable } from 'fp-ts/lib/Traversable'
import * as option from 'fp-ts/lib/Option'
import { fromNullable, Option, none, some } from 'fp-ts/lib/Option'
import { identity, constant, Predicate } from 'fp-ts/lib/function'
import * as id from 'fp-ts/lib/Identity'
import * as con from 'fp-ts/lib/Const'

/*
  Laws:
  1. get . reverseGet = identity
  2. reversetGet . get = identity
*/
export class Iso<S, A> {
  constructor(
    public get: (s: S) => A,
    public reverseGet: (a: A) => S
  ) { }

  /** compose a Iso with a Iso */
  compose<B>(ab: Iso<A, B>): Iso<S, B> {
    return new Iso<S, B>(
      s => ab.get(this.get(s)),
      b => this.reverseGet(ab.reverseGet(b))
    )
  }

  modify(f: (a: A) => A, s: S): S {
    return this.reverseGet(f(this.get(s)))
  }

  /** view a ISO as a Lens */
  asLens(): Lens<S, A> {
    return new Lens(
      this.get,
      this.reverseGet
    )
  }

  /** view a ISO as a Prism */
  asPrism(): Prism<S, A> {
    return new Prism(
      s => some(this.get(s)),
      this.reverseGet
    )
  }
}

export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6], K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7], K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8], K10 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8][K9]>(path: [K1, K2, K3, K4, K5, K6, K7, K8, K9, K10]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7][K8][K9][K10]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6], K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7], K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8]>(path: [K1, K2, K3, K4, K5, K6, K7, K8, K9]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7][K8][K9]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6], K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]>(path: [K1, K2, K3, K4, K5, K6, K7, K8]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6]>(path: [K1, K2, K3, K4, K5, K6, K7]): Lens<T, T[K1][K2][K3][K4][K5][K6][K7]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5]>(path: [K1, K2, K3, K4, K5, K6]): Lens<T, T[K1][K2][K3][K4][K5][K6]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4]>(path: [K1, K2, K3, K4, K5]): Lens<T, T[K1][K2][K3][K4][K5]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(path: [K1, K2, K3, K4]): Lens<T, T[K1][K2][K3][K4]>
export function lensFromPath<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(path: [K1, K2, K3]): Lens<T, T[K1][K2][K3]>
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
  constructor(
    public get: (s: S) => A,
    public set: (a: A, s: S) => S
  ) { }

  /** generate a lens from a type and a prop */
  static fromProp<T, P extends keyof T>(prop: P): Lens<T, T[P]> {
    return new Lens<T, T[P]>(
      s => s[prop],
      (a, s) => Object.assign({}, s, { [prop as any]: a })
    )
  }

  static fromPath = lensFromPath

  modify(f: (a: A) => A, s: S): S {
    return this.set(f(this.get(s)), s)
  }

  /** compose a Lens with a Lens */
  compose<B>(ab: Lens<A, B>): Lens<S, B> {
    return new Lens<S, B>(
      s => ab.get(this.get(s)),
      (b, s) => this.set(ab.set(b, this.get(s)), s)
    )
  }

  /** view a Lens as a Option */
  asOptional(): Optional<S, A> {
    return new Optional(
      s => some(this.get(s)),
      this.set
    )
  }
}

/*
  Laws:
  1. getOption(s).fold(identity, reverseGet) = s
  2. getOption(reverseGet(a)) = Some(a)
*/
export class Prism<S, A> {
  constructor(
    public getOption: (s: S) => Option<A>,
    public reverseGet: (a: A) => S
  ) { }

  static fromPredicate<A>(predicate: Predicate<A>): Prism<A, A> {
    return new Prism<A, A>(
      s => predicate(s) ? some(s) : none,
      a => a
    )
  }

  modify(f: (a: A) => A, s: S): S {
    return this.modifyOption(f, s)
      .fold(constant(s), identity)
  }

  modifyOption(f: (a: A) => A, s: S): Option<S> {
    return this.getOption(s)
      .map(a => this.reverseGet(f(a)))
  }

  /** compose a Prism with a Prism */
  compose<B>(ab: Prism<A, B>): Prism<S, B> {
    return new Prism<S, B>(
      s => this.getOption(s).chain(a => ab.getOption(a)),
      b => this.reverseGet(ab.reverseGet(b))
    )
  }

  /** view a Prism as a Optional */
  asOptional(): Optional<S, A> {
    return new Optional(
      this.getOption,
      this.reverseGet
    )
  }
}

/*
  Laws:
  1. getOption(s).fold(identity, set(_, s)) = s
  2. getOption(set(a, s)) = getOption(s).map(_ => a)
  3. set(a, set(a, s)) = set(a, s)
*/
export class Optional<S, A> {
  constructor(
    public getOption: (s: S) => Option<A>,
    public set: (a: A, s: S) => S
  ){}

  /** generate an optional from a type and a prop which is a `Option` */
  static fromProp<T extends { [K in P]: Option<any> }, P extends keyof T>(prop: P): Optional<T, T[P]['_A']> {
    return new Optional<T, T[P]['_A']>(
      s => s[prop],
      (a, s) => Object.assign({}, s, { [prop as any]: fromNullable(a) })
    )
  }

  modify(f: (a: A) => A, s: S): S {
    return this.modifyOption(f, s)
      .fold(constant(s), identity)
  }

  modifyOption(f: (a: A) => A, s: S): Option<S> {
    return this.getOption(s)
      .map(a => this.set(f(a), s))
  }

  /** compose a Optional with a Optional */
  compose<B>(ab: Optional<A, B>): Optional<S, B> {
    return new Optional<S, B>(
      s => this.getOption(s).chain(a => ab.getOption(a)),
      (b, s) => this.modify(a => ab.set(b, a), s)
    )
  }

  /** view a Options as a Traversal */
  asTraversal(): Traversal<S, A> {
    return new Traversal<S, A>(
      <F extends HKTS>(applicative: StaticApplicative<F>, f: (a: A) => HKT<A>[F], s: S): HKT<S>[F] =>
        this.getOption(s).fold(
          () => applicative.of(s),
          a => applicative.map((a: A) => this.set(a, s), f(a))
        )
    )
  }
}

export class Traversal<S, A> {
  constructor(
    // Van Laarhoven representation
    public modifyF: <F extends HKTS>(applicative: StaticApplicative<F>, f: (a: A) => HKT<A>[F], s: S) => HKT<S>[F]
  ){}

  modify(f: (a: A) => A, s: S): S {
    return (this.modifyF(id, a => id.of(f(a)), s) as id.Identity<S>).extract()
  }

  set(a: A, s: S): S {
    return this.modify(constant(a), s)
  }

  /** compose a Traversal with a Traversal */
  compose<B>(ab: Traversal<A, B>): Traversal<S, B> {
    return new Traversal<S, B>(
      <F extends HKTS>(applicative: StaticApplicative<F>, f: (a: B) => HKT<B>[F], s: S): HKT<S>[F] =>
        this.modifyF(applicative, a => ab.modifyF(applicative, f, a), s)
    )
  }

  /** view a Traversal as a Fold */
  asFold(): Fold<S, A> {
    return new Fold(
      <M>(monoid: StaticMonoid<M>, f: (a: A) => M, s: S): M =>
        (this.modifyF(con.getApplicative(monoid), a => new con.Const<M, A>(f(a)), s) as con.Const<M, S>).fold(identity)
    )
  }
}

/** create a Traversal from a Traversable */
export function fromTraversable<T extends HKTS, A>(traversable: StaticTraversable<T>): Traversal<HKT<A>[T], A> {
  return new Traversal<HKT<A>[T], A>(
      <F extends HKTS>(applicative: StaticApplicative<F>, f: (a: A) => HKT<A>[F], s: HKT<A>[T]): HKT<HKT<A>[T]>[F] =>
        traversable.traverse<F>(applicative)<A, A>(f, s)
  )
}

export class Fold<S, A> {
  constructor(
    public foldMap: <M>(monoid: StaticMonoid<M>, f: (a: A) => M, s: S) => M
  ){}

  /** compose a Fold with a Fold */
  compose<B>(ab: Fold<A, B>): Fold<S, B> {
    return new Fold<S, B>(
      <M>(monoid: StaticMonoid<M>, f: (b: B) => M, s: S): M =>
        this.foldMap(monoid, a => ab.foldMap(monoid, f, a), s)
    )
  }

  /** get all the targets of a Fold */
  getAll(s: S): Array<A> {
    return this.foldMap(monoidArray, a => [a], s)
  }

  /** find the first target of a Fold matching the predicate */
  find(p: Predicate<A>, s: S): Option<A> {
    return this.foldMap(option.getFirstStaticMonoid(), a => p(a) ? option.of(a) : option.none, s)
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

/** create a Fold from a Foldable */
export function fromFoldable<F extends HKTS, A>(fold: StaticFoldable<F>): Fold<HKT<A>[F], A> {
  return new Fold(
      <M>(monoid: StaticMonoid<M>, f: (a: A) => M, s: HKT<A>[F]): M =>
        foldMap(fold, monoid, f, s)
  )
}
