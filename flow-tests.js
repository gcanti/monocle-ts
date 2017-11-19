// @flow

import { Iso, Lens, Prism, Optional } from '.'
import type { Option } from 'fp-ts/lib/Option'
import { some } from 'fp-ts/lib/Option'

//
// Iso
//

const mTokm: Iso<number, number> = new Iso(m => m / 1000, km => km * 1000)

// $FlowFixMe
mTokm.get('foo')
// $FlowFixMe
mTokm.reverseGet('foo')
const x1: number = mTokm.get(1000)
// $FlowFixMe
const x2: string = mTokm.get(1000)

//
// Lens
//

type Street = {
  num: number,
  name: string
}
type Address = {
  city: string,
  street: Street
}
type Company = {
  name: string,
  address: Address
}
type Employee = {
  name: string,
  company: Company
}

const companyLens: Lens<Employee, Company> = new Lens(s => s.company, a => s => ({ ...s, company: a }))

declare var e1: Employee
// $FlowFixMe
const company1: number = companyLens.get(e1)
const company2: Company = companyLens.get(e1)

const addressLens: Lens<Company, Address> = Lens.fromProp('address')
// $FlowFixMe
const address1: string = addressLens.get(company2)
const address2: Address = addressLens.get(company2)

const streetLens: Lens<Employee, Street> = Lens.fromPath(['company', 'address', 'street'])

//
// Prism
//
const prism: Prism<Option<number>, number> = Prism.some()
// $FlowFixMe
prism.reverseGet('foo')
// $FlowFixMe
;(prism.reverseGet(2): Option<string>)
;(prism.reverseGet(2): Option<number>)

//
// Optional
//

interface A {
  a: Option<number>
}

const optional: Optional<A, number> = new Optional(s => s.a, a => s => s.a.fold(() => s, () => ({ ...s, a: some(a) })))
// $FlowFixMe
;(optional.getOption({ a: some(1) }): Option<string>)
;(optional.getOption({ a: some(1) }): Option<number>)
