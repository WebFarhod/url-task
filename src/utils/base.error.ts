class BaseError extends Error {
  status: number;
  errors: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new BaseError(401, "User is not authorized");
  }

  static BadRequest(message: string, errors: any[] = []) {
    return new BaseError(400, message, errors);
  }

  static ForbiddenError(message = "Access denied") {
    return new BaseError(403, message);
  }

  static NotFoundError(message: string) {
    return new BaseError(404, message);
  }
}

export default BaseError;
