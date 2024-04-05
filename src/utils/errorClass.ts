export class ApplicationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Maintenir l'instance de cette classe dans la pile des traces
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class MethodNotAllowedError extends ApplicationError {
  constructor(message: string = "Method Not Allowed") {
    super(message, 405);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class InternalServerError extends ApplicationError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}

export class NotImplementedError extends ApplicationError {
  constructor(message: string = "Not Implemented") {
    super(message, 501);
  }
}

export class BadGatewayError extends ApplicationError {
  constructor(message: string = "Bad Gateway") {
    super(message, 502);
  }
}

export class ServiceUnavailableError extends ApplicationError {
  constructor(message: string = "Service Unavailable") {
    super(message, 503);
  }
}

export class GatewayTimeoutError extends ApplicationError {
  constructor(message: string = "Gateway Timeout") {
    super(message, 504);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 400); // 400 est généralement utilisé pour les erreurs de validation
    this.name = "ValidationError";
  }
}

export class ExpiredResourceError extends ApplicationError {
  constructor(message: string) {
    super(message, 410); // Utilise le code d'état HTTP 410 pour indiquer qu'une ressource a expiré
  }
}
