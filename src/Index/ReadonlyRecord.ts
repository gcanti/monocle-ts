/**
 * @since 2.2.0
 */
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import { Index } from '..'
import * as R from './Record'

/**
 * @category constructor
 * @since 2.2.0
 */
export const indexReadonlyRecord: <A = never>() => Index<ReadonlyRecord<string, A>, string, A> = R.indexRecord
