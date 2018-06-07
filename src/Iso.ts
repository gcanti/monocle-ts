/*
  Laws:
  1. get . reverseGet = identity
  2. reversetGet . get = identity
*/
export class Iso<S, A> {
  unwrap: this['get']
  to: this['get']
  wrap: this['reverseGet']
  from: this['reverseGet']
  readonly _tag: 'Iso' = 'Iso'
  constructor(readonly get: (s: S) => A, readonly reverseGet: (a: A) => S) {
    this.unwrap = this.to = get
    this.wrap = this.from = reverseGet
  }

  /** reverse the `Iso`: the source becomes the target and the target becomes the source */
  reverse(): Iso<A, S> {
    return new Iso(this.reverseGet, this.get)
  }

  modify(f: (a: A) => A): (s: S) => S {
    return s => this.reverseGet(f(this.get(s)))
  }

  /** compose an Iso with an Iso */
  compose<B>(ab: Iso<A, B>): Iso<S, B> {
    return new Iso(s => ab.get(this.get(s)), b => this.reverseGet(ab.reverseGet(b)))
  }
}
