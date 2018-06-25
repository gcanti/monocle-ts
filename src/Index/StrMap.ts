import { Index } from '../index'
import { atStrMap } from '../At/StrMap'
import { StrMap } from 'fp-ts/lib/StrMap'

export function indexStrMap<A = never>(): Index<StrMap<A>, string, A> {
  return Index.fromAt(atStrMap<A>())
}
