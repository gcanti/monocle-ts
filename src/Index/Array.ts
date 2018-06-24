import { Index, Optional } from '../index'
import { index, updateAt } from 'fp-ts/lib/Array'

export function indexArray<A = never>(): Index<Array<A>, number, A> {
  return new Index(i => new Optional(s => index(i, s), a => s => updateAt(i, a, s).getOrElse(s)))
}
