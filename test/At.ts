import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/ReadonlyRecord'
import * as _ from '../src/At'
import { Iso } from '../src/Iso'
import { deepStrictEqual } from './util'

it('fromIso', () => {
  const iso: Iso<Record<string, string>, Record<string, number>> = {
    get: R.map((v) => +v),
    reverseGet: R.map(String)
  }
  const at = pipe(_.atReadonlyRecord<number>(), _.fromIso(iso)).at('a')
  deepStrictEqual(at.get({}), O.none)
  deepStrictEqual(at.get({ a: '1' }), O.some(1))

  deepStrictEqual(at.set(O.none)({}), {})
  deepStrictEqual(at.set(O.some(1))({}), { a: '1' })
})
