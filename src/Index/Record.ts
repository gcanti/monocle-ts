import { Index } from '../index'
import { atRecord } from '../At/Record'

export function indexRecord<A = never>(): Index<Record<string, A>, string, A> {
  return Index.fromAt(atRecord<A>())
}
