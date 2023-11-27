class CustomError {
  // borrowed from https://github.com/Airtable/airtable.js/blob/master/src/airtable_error.ts
  error: string;
  message: string;
  statusCode: number;

  constructor(error: string, message: string, statusCode: number) {
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }

  toString(): string {
    return [
      this.message,
      "(",
      this.error,
      ")",
      this.statusCode ? `[Http code ${this.statusCode}]` : "",
    ].join("");
  }
}

export default async (req, context) => {
  throw new CustomError("lorem ipsum", "lorem ipsum dolor sit amet", 404);
};
