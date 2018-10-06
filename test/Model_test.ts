import { expect, log } from './common'
expect
log

import * as the from 'lodash'

import { Record } from '../src/data/Record'
import { Model } from '../src/data/Model'
import { Database } from '../src/data/Database';

interface TestFields {
  a: number
}

class Test extends Record implements TestFields {
  a: number

  constructor(x: any) {
    super(x, {
      a: x => the(x).isNumber(),
    })
  }
}

class Tests extends Model<TestFields, Test> {
  constructor(database: Database) {
    super('tests', database)
  }

  protected instantiate(untrusted: any) {
    return new Test(untrusted)
  }
}

describe(`Model`, () => {
  let db: Database
  let model: Tests

  beforeEach(async () => {
    db = new Database('data/test.json', { defaultsFile: 'data/testDefaults.json', wipe: true })
    model = new Tests(db)
  })

  it(`should be able to get all records`, async () => {
    await model.add({ a: 530 })
    const records = await model.getAll()
    expect(records[0]).to.eql({ id: 1, a: 530 })
  })
})