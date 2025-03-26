export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class EntityNotFoundError extends DatabaseError {
  constructor(entityType: string, id: string) {
    super(`${entityType}  "${id}" not found`);
    this.name = "EntityNotFoundError";
  }
}

export class MissingRequiredFieldError extends DatabaseError {
  constructor(fieldName: string) {
    super(`Missing required field: ${fieldName}`);
    this.name = "MissingRequiredFieldError";
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(entityType: string, entityId: string) {
    super(`Unique constraint violation for field ${entityType}: ${entityId} already exists.`);
    this.name = "UniqueConstraintError";
  }
}
