export type OperationResult<Code extends string = string> =
  | {
      ok: true
    }
  | {
      ok: false
      code: Code
      message: string
    }
