export class AppError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404)
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403)
  }
}
