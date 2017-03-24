import { HKT } from 'fp-ts/lib/HKT'
import { StaticMonoid, monoidArray, monoidAll, monoidAny } from 'fp-ts/lib/Monoid'
import { StaticApplicative } from 'fp-ts/lib/Applicative'
import { StaticFoldable, ops } from 'fp-ts/lib/Foldable'
import { StaticTraversable } from 'fp-ts/lib/Traversable'
import * as option from 'fp-ts/lib/Option'
import { Some, Option } from 'fp-ts/lib/Option'
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
      s => new Some(this.get(s)),
      this.reverseGet
    )
  }
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
      s => new Some(this.get(s)),
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

  /** generate an optional from a type and a prop */
  static fromProp<T extends { [K in P]: Option<any> }, P extends keyof T>(prop: P): Optional<T, T[P]> {
    return new Optional<T, T[P]>(
      s => s[prop],
      (a, s) => Object.assign({}, s, { [prop as any]: a })
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
      <F>(applicative: StaticApplicative<F>, f: (a: A) => HKT<F, A>, s: S): HKT<F, S> =>
        this.getOption(s).fold(
          () => applicative.of(s),
          a => applicative.map(a => this.set(a, s), f(a))
        )
    )
  }
}

export class Traversal<S, A> {
  constructor(
    // Van Laarhoven representation
    public modifyF: <F>(applicative: StaticApplicative<F>, f: (a: A) => HKT<F, A>, s: S) => HKT<F, S>
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
      <F>(applicative: StaticApplicative<F>, f: (a: B) => HKT<F, B>, s: S): HKT<F, S> =>
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
export function fromTraversable<T, A>(traversable: StaticTraversable<T>): Traversal<HKT<T, A>, A> {
  return new Traversal<HKT<T, A>, A>(
      <F>(applicative: StaticApplicative<F>, f: (a: A) => HKT<F, A>, s: HKT<T, A>): HKT<F, HKT<T, A>> =>
        traversable.traverse(applicative, f, s)
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
export function fromFoldable<F, A>(fold: StaticFoldable<F>): Fold<HKT<F, A>, A> {
  return new Fold(
      <M>(monoid: StaticMonoid<M>, f: (a: A) => M, s: HKT<F, A>): M =>
        ops.foldMapS(fold, monoid, f, s)
  )
}
