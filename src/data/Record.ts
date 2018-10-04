import * as the from 'lodash';

import { getLog } from '../Logger'
const debug = getLog(`Record`)
debug

export type Validators = { [name: string]: (x: any) => boolean }

/**
 * A data container created by the models.
 */
export abstract class Record {
  [property: string]: any

  constructor(
    untrusted: any,
    /**
     * A map of record property names to predicates that validate if an input
     * value is valid.
     */
    protected validators: Validators
  ) {
    debug(`New> Untr=%o`, untrusted)
    // This is empty when this runs
    debug(`New> Val=%o`, this.validators)
    this.validate(untrusted)
  }

  /**
   * I take an untrusted object, run my validator functions on each of its
   * properties and copy in the ones that pass.
   */
  protected validate(untrusted: { [property: string]: any } = {}) {
    this.id = untrusted['id']

    the(this.validators)
      .forEach((test: Function, key: string) => {
        const untrustedValue = untrusted[key]
        const propertyValid = test(untrustedValue)
        debug(`Validate> Untr=%o PropVal=%o`, untrustedValue, propertyValid)
        if (propertyValid)
          this[key] = untrustedValue
      })
  }
}