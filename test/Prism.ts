import * as assert from 'assert'
import { none, some, Option } from 'fp-ts/lib/Option'
import { Prism, Lens } from '../src'
import { eqOptions as eq } from './helpers'

describe('Prism', () => {
  it('fromPredicate', () => {
    const prism = Prism.fromPredicate<number>(n => n % 1 === 0)
    eq(prism.getOption(1), some(1))
    eq(prism.getOption(1.1), none)
  })

  it('some', () => {
    interface Bar {
      s: Option<string>
    }

    interface Foo {
      bar: Option<Bar>
    }

    const foo1: Foo = {
      bar: some({
        s: some('a')
      })
    }
    const foo2: Foo = {
      bar: some({
        s: none
      })
    }
    const foo3: Foo = {
      bar: none
    }

    const barLens = Lens.fromProp<Foo, 'bar'>('bar')
    const sLens = Lens.fromProp<Bar, 's'>('s')

    const sOptional = barLens.composePrism(Prism.some<Bar>()).composeLens(sLens).composePrism(Prism.some<string>())

    assert.deepEqual(sOptional.set('b', foo1), {
      bar: some({
        s: some('b')
      })
    })
    assert.deepEqual(sOptional.set('c', foo2), {
      bar: some({
        s: some('c')
      })
    })
    assert.deepEqual(sOptional.set('d', foo3), {
      bar: none
    })
  })
})
