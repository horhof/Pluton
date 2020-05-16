import { db } from '../db/conn'
import { stampLog } from '../log'

const log = stampLog(`data:user`)

export interface User {
  id: number
  username: string
  password: string
  token: string
}

export const createUser =
  async (username: string, password: string, planetId: number): Promise<number | undefined | Error> => {
    const res = await db.get(`
        INSERT INTO users
          (username, password, planet_id)
        VALUES
          (
            $1
          , $2
          , $3
          )
        RETURNING id
      `,
      [username, password, planetId],
      a => a.id as number)
    if (res instanceof Error) {
      return res
    }
    const [id] = res
    if (id === undefined) {
      return new Error(`Failed to create new user`)
    }

    return id
  }

export const getPlanetIdForUser =
  async (username?: string, token?: string): Promise<number | undefined | Error> => {
    const $ = log(`getStar`)

    if (username === undefined || token === undefined) {
      return
    }

    const getRes = await db.get(`
        SELECT
          id
        , token
        , planet_id
        FROM users
        WHERE username = $1
      `,
      [username],
      (r: any) => ({
        id: r.id,
        dbToken: r.token,
        planetId: r.planet_id
      }))
    if (getRes instanceof Error) {
      $(`Failed to get user token: %o.`, getRes.message)
      throw getRes
    }
    const [row] = getRes

    if (row === undefined) {
      return
    }

    const { dbToken, planetId } = row

    return token === dbToken
      ? planetId
      : undefined
  }

// const cast =
//   (a: any): User => {
//     return {
//       id: a.id as number,
//       index: a.index as number,
//       cluster: a.cluster as number,
//       name: a.name as string,
//     }
//   }
