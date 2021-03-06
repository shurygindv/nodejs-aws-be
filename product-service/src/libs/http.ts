const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

enum HttpResult {
  fail = "fail",
  success = "success",
  fileNotFound = "fileNotFound",
}

const res = (payload: any) => ({
  statusCode: payload.statusCode,
  headers: payload.headers,
  body: JSON.stringify(payload.body),
});

const success = <T>(payload: { result: T, statusCode?: number }) =>
  res({
    statusCode: payload.statusCode || 200,
    headers: {
      ...cors,
    },
    body: {
      code: HttpResult.success,
      result: payload.result,
    },
  });

const successResult = <T>(result: T) => success({ result });

const failure = <T>(payload: {
  statusCode?: number;
  result?: HttpResult;
  error: T;
}) =>
  res({
    statusCode: payload.statusCode || 500,
    headers: {
      ...cors,
    },
    body: {
      code: payload.result || HttpResult.fail,
      error: payload.error,
    },
  });

const failureResult = <T>(result: T) =>
  failure({
    error: result,
    statusCode: 400,
  });

const fileNotFound = <T>(payload?: T) =>
  failure({
    statusCode: 404,
    result: HttpResult.fileNotFound,
    error: payload,
  });

const lambdaFile = ({
  fileContent,
  contentType,
}: {
  contentType: string;
  fileContent: Buffer;
}) => ({
  statusCode: 200,
  isBase64Encoded: true,
  body: fileContent.toString("base64"),
  headers: {
    "Content-Type": contentType,
  },
});

export const httpResponse = {
  failure,
  success,

  successResult,
  failureResult,

  fileNotFound,
  lambdaFile,
};
