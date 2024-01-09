/**
 * Class representing a successful API response.
 */
export class ResponseSuccess<T> {
  public status: string;
  public data: T | undefined;

  constructor(data?: T) {
    this.status = "success";
    this.data = data;
  }
}

/**
 * Class representing an failed API response.
 */
export class ResponseFailed<T> {
  public status: string;
  public message: string;
  public errors: T | undefined;

  constructor(message: string, errors?: T) {
    this.status = "failed";
    this.message = message;
    this.errors = errors;
  }
}

/**
 * Class representing an error API response.
 */
export class ResponseError {
  public status: string;
  public message: string;

  constructor(message: string) {
    this.status = "error";
    this.message = message;
  }
}
