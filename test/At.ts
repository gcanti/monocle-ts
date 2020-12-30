import * as assert from 'assert'
import * as _ from '../src/At'
import * as R from 'fp-ts/ReadonlyRecord'
import { Iso } from '../src/Iso'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

it('fromIso', () => {
  const iso: Iso<Record<string, string>, Record<string, number>> = {
    get: R.map((v) => +v),
    reverseGet: R.map(String)
  }
  const at = pipe(_.atReadonlyRecord<number>(), _.fromIso(iso)).at('a')
  assert.deepStrictEqual(at.get({}), O.none)
  assert.deepStrictEqual(at.get({ a: '1' }), O.some(1))

  assert.deepStrictEqual(at.set(O.none)({}), {})
  assert.deepStrictEqual(at.set(O.some(1))({}), { a: '1' })
})
