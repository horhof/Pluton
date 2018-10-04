import { IDebugger } from 'debug'

import { Database } from './Database'

import { getLog } from '../Logger'
const debug = getLog(`Model`)
debug

/**
 * I am the abstract data model that can be extended to produce an object that
 * handles queries for one specific type of Record.
 *
 * When you want access to e.g. committees, you'll talk to an object that
 * extends this table. The output will be an object that extends Record.
 *
 * I use the Database object to get the data.
 *
 * API:
 * - Instantiate: fields = record
 * - Get all = <list of records>
 * - Get by ID = <record>
 * - Add: fields = <record>
 */
export abstract class Model<A, T> {
  /** A chain over the database table that the other methods will complete. */
  protected get table() {
    this.log(`Table> Name=%O`, this.relationName)
    return this.database.get(this.relationName)
  }

  protected log: IDebugger

  constructor(
    protected relationName: string,
    protected database: Database
  ) {
    this.log = getLog(`Table:${relationName}`)
  }

  async getAll(): Promise<T[]> {
    this.log(`Get all>`)
    return (await this.table).value()
  }

  async getById(id: number): Promise<T> {
    this.log(`Get by ID> ID=%O`, id)
    return (await this.table)
      // @ts-ignore: Doesn't exist on standard lodash wrapper.
      .getById(id)
      .thru((x: any) => this.instantiate(x))
      .tap((x: any) => {
        this.log(`Get by ID> x=%O`, x)
      })
      .value()
  }

  /** I add a record to the data store. */
  async add(data: A): Promise<T> {
    return this.instantiate(await this.insert(data))
  }

  protected async insert(data: A): Promise<T> {
    this.log(`Insert> Data=%O`, data)
    const record = (await this.table)
      // @ts-ignore: Doesn't exist on standard lodash wrapper.
      .insert(data)
      .write()
    this.log(`Insert> Record=%O`, record)
    return record
  }

  /** Instantiate a record from an untrusted source. */
  protected abstract instantiate(untrusted: any): T
}