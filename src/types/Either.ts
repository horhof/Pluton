export type Either<L, R> = R | Left<L>

export type AsyncEither<L, R> = Promise<R | Left<L>>

export type Maybe<L> = void | Left<L>

export class Left<T> {
  constructor(
    public code: T,
    public message?: string,
  ) { }
}

export const left =
  <T>(code: T, message?: string): Left<T> =>
    new Left(code, message)

export const isLeft =
  <T>(x: any): x is Left<T> =>
    x instanceof Left
