import { Index, Optional } from '../index'
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'

export function indexNonEmptyArray<A = never>(): Index<NonEmptyArray<A>, number, A> {
  return new Index(i => new Optional(s => s.index(i), a => s => s.updateAt(i, a).getOrElse(s)))
}
