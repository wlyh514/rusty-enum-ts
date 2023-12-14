type Option<T> = {
  Some: T,
  None: null,
}
type Result<T, E> = {
  Ok: T,
  Err: E
}

export type { Result, Option };