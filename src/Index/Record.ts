/**
 * @since 1.7.0
 */
import { Index } from '..'
import { atRecord } from '../At/Record'

/**
 * @category constructor
 * @since 1.7.0
 */
export function indexRecord<A = never>(): Index<Record<string, A>, string, A> {
  return Index.fromAt(atRecord<A>())
}
