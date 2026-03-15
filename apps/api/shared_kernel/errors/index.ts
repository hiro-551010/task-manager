export class DomainError extends Error {
  readonly name = "DomainError";

  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class ApplicationError extends Error {
  readonly name = "ApplicationError";

  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export class InfrastructureError extends Error {
  readonly name = "InfrastructureError";

  constructor(
    readonly code: string,
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
  }
}
