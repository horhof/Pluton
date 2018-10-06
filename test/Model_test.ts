import { expect, log } from './common'
expect
log

import * as the from 'lodash'

import { Record } from '../src/data/Record'
import { Model } from '../src/data/Model'
import { Database } from '../src/models/Database';

interface TestFields {
  a?: number
  b?: string
}

class Test extends Record implements TestFields {
  a?: number
  b?: string

  constructor(x: any) {
    super(x, {
      a: x => the(x).isNumber(),
      b: x => the(x).isString(),
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

  it(`should be able to insert a record`, async () => {
    await model.add({ a: 530 })
    const records = await model.getAll()
    expect(records[0]).to.eql({ id: 1, a: 530 })
  })

  it(`should be able to get all records`, async () => {
    let records = await model.getAll()
    expect(records).to.be.empty
    await model.add({ a: 530 })
    records = await model.getAll()
    expect(records[0]).to.eql({ id: 1, a: 530 })
  })

  it(`should be able to get a record by its ID`, async () => {
    await model.add({ a: 10 })
    await model.add({ a: 20 })
    await model.add({ a: 30 })
    const record = await model.getById('3')
    expect(record.a).to.equal(30)
  })

  it(`should be able to edit a record by its ID`, async () => {
    await model.add({ a: 10 })
    await model.add({ a: 20 })
    await model.add({ a: 30 })
    const record = await model.edit('3', { a: 40 })
    expect(record.a).to.equal(40)
  })

  it(`should be able to partially update a record by its ID`, async () => {
    await model.add({ a: 10 })
    await model.add({ a: 20 })
    await model.add({ a: 30 })
    await model.edit('3', { b: '40' })
    const record = await model.getById('3')
    expect(record).to.include({ a: 30, b: '40' })
    log(record)
  })
})