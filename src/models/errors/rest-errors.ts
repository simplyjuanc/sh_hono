abstract class ClientSideError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ClientSideError";
  }
}

export class BadRequestError extends ClientSideError {
  constructor(message?: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends ClientSideError {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
