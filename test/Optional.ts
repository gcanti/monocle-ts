import { Option, none, some } from 'fp-ts/lib/Option'
import { Optional, Lens } from '../src'
import { eqOptions as eq } from './helpers'

type A = {
  a: Option<number>
}

const optional = new Optional<A, number>(s => s.a, a => s => s.a.fold<A>(() => s, () => ({ ...s, a: some(a) })))

describe('Optional', () => {
  it('getOption', () => {
    eq(optional.getOption({ a: none }), none)
    eq(optional.getOption({ a: some(1) }), some(1))
  })

  it('set', () => {
    eq(optional.set(2)({ a: some(1) }).a, some(2))
  })

  it('fromNullableProp', () => {
    interface Phone {
      number: string
    }
    interface Employment {
      phone?: Phone
    }
    interface Info {
      employment?: Employment
    }
    interface Response {
      info?: Info
    }

    const info = Optional.fromNullableProp<Response, Info, 'info'>('info')
    const employment = Optional.fromNullableProp<Info, Employment, 'employment'>('employment')
    const phone = Optional.fromNullableProp<Employment, Phone, 'phone'>('phone')
    const number = Lens.fromProp<Phone, 'number'>('number')
    const numberFromResponse = info
      .compose(employment)
      .compose(phone)
      .composeLens(number)

    const response1: Response = {
      info: {
        employment: {
          phone: {
            number: '555-1234'
          }
        }
      }
    }
    const response2: Response = {
      info: {
        employment: {}
      }
    }

    eq(numberFromResponse.getOption(response1), some('555-1234'))
    eq(numberFromResponse.getOption(response2), none)
  })
})
