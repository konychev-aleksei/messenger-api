type ErrorsListType = {
  [key: string]: number;
};

const errorsList: ErrorsListType = {
  "Bad request": 400,
  "Not authorized": 401,
  Forbidden: 403,
  "Not found": 404,
  Conflict: 409,
  Unprocessable: 422,
};

const errorHandler = (error: unknown): number => {
  const parsedError = String(error).split("Error: ")[1];
  return errorsList[parsedError] ?? 500;
};

export default errorHandler;
