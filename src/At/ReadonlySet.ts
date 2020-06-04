/**
 * @since 2.2.0
 */
import { Eq } from 'fp-ts/lib/Eq'
import { At } from '../index'
import * as S from './Set'

/**
 * @since 2.2.0
 */
export const atReadonlySet: <A = never>(E: Eq<A>) => At<ReadonlySet<A>, A, boolean> = S.atSet as any
