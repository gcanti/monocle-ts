/**
 * @since 1.7.0
 */
import { Index } from '../index'
import { atRecord } from '../At/Record'

/**
 * @since 1.7.0
 */
export function indexRecord<A = never>(): Index<Record<string, A>, string, A> {
  return Index.fromAt(atRecord<A>())
}
