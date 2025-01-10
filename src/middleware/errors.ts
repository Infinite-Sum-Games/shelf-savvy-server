// Use it to stop prisma transactions in between
export class CustomError extends Error {
  statusCode: number;

  constructor(error: number, message: string) {
    super(message);
    this.statusCode = error;
    this.name = "CustomError";
  }
}
