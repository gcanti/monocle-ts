/**
 * @since 2.2.0
 */
import { Option } from 'fp-ts/lib/Option'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'
import { At } from '..'
import * as R from './Record'

/**
 * @category constructor
 * @since 2.2.0
 */
export const atReadonlyRecord: <A = never>() => At<ReadonlyRecord<string, A>, string, Option<A>> = R.atRecord
