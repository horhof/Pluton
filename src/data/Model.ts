import { getLog } from '../Logger'
const debug = getLog(`Model`)
debug

import { Database } from './Database'

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
    return this.database.get(this.relationName)
  }

  constructor(
    protected relationName: string,
    protected database: Database
  ) { }

  async getAll(): Promise<T[]> {
    debug(`Get all>`)
    return (await this.table).value()
  }

  async getById(id: number): Promise<T> {
    debug(`Get by ID> ID=%O`, id)
    return (await this.table)
      // @ts-ignore: Doesn't exist on standard lodash wrapper.
      .getById(id)
      .thru((x: any) => x && this.instantiate(x))
      .value()
  }

  async getWhere(search: any): Promise<T> {
    return (await this.table)
      .filter(search)
      .value()
  }

  /** I add a record to the data store. */
  async add(data: A): Promise<T> {
    return this.instantiate(await this.insert(data))
  }

  protected async insert(data: A): Promise<T> {
    debug(`Insert> Data=%O`, data)
    const record = (await this.table)
      // @ts-ignore: Doesn't exist on standard lodash wrapper.
      .insert(data)
      .write()
    debug(`Insert> Record=%O`, record)
    return record
  }

  /** Instantiate a record from an untrusted source. */
  protected abstract instantiate(untrusted: any): T
}