import * as assert from 'assert'
import { Option } from 'fp-ts/lib/Option'

export function eqOptions<A>(x: Option<A>, y: Option<A>) {
  if (x.isSome() && y.isSome()) {
    assert.deepEqual(x.value, y.value)
  } else {
    assert.strictEqual(x.isNone(), y.isNone())
  }
}
