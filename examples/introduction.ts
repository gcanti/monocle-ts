interface Street { num: number, name: string }
interface Address { city: string, street: Street }
interface Company { name: string, address: Address }
interface Employee { name: string, company: Company }

const employee: Employee = {
  name: "john",
  company: {
    name: "awesome inc",
    address: {
      city: "london",
      street: {
        num: 23,
        name: "high street"
      }
    }
  }
}

const employee2 = {
  ...employee,
  company: {
    ...employee.company,
    address: {
      ...employee.company.address,
      street: {
        ...employee.company.address.street,
        name: employee.company.address.street.name.toUpperCase()
      }
    }
  }
}

console.log(JSON.stringify(employee2, null, 2))

