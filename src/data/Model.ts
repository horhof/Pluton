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
 * - Get by ID = <[record]>
 * - Add: fields = <record>
 */
export abstract class Model<Fields, Class> {
  /** A chain over the database table that the other methods will complete. */
  protected get table() {
    return this.database.get(this.relationName)
  }

  constructor(
    protected relationName: string,
    protected database: Database
  ) { }

  async getAll(): Promise<Class[]> {
    return (await this.table).value()
  }

  async getById(id: number): Promise<Class> {
    return (await this.table)
      .getById(id)
      .thru((x: any) => x && this.instantiate(x))
      .value()
  }

  /** I add a record to the data store. */
  async add(data: Fields): Promise<Class> {
    return this.instantiate(await this.insert(data))
  }

  protected async insert(data: Fields): Promise<Class> {
    const record = (await this.table)
      .insert(data)
      .write()
    return record
  }

  /** Instantiate a record from an untrusted source. */
  protected abstract instantiate(untrusted: any): Class
}