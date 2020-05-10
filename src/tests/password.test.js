const { ok, notOk } = require('chai').assert
const Faker = require('faker')
const PasswordHelper = require('../utils/passwordHelper')

const generatePassword = () => Faker.internet.password()

describe('Password test suite', function () {
  let Password = {}
  const PASSWORD_MOCK = generatePassword()
  let HASH_MOCK

  this.beforeAll(async () => {
    Password = new PasswordHelper(process.env.SALT_ROUNDS)
    HASH_MOCK = await Password.create(PASSWORD_MOCK)
  })

  it('Can generate a password hash', async () => {
    const hash = await Password.create(PASSWORD_MOCK)
    ok(hash.slice(0, 3), '$2b')
  })

  it('Can validate a passowrd from hash', async () => {
    const validate = await Password.compare(PASSWORD_MOCK, HASH_MOCK)
    ok(validate)
  })

  it('Must return false for non matching password', async () => {
    const validate = await Password.compare(generatePassword(), HASH_MOCK)
    notOk(validate)
  })
})
