export class InfraError extends Error {
  readonly _tag = 'InfraError' as const

  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message)
    this.name = 'InfraError'
  }
}
