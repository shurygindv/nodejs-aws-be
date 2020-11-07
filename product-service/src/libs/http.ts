const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
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

const success = <T>(payload: { result: T }) =>
  res({
    statusCode: 200,
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
  result: HttpResult;
  error: T;
}) =>
  res({
    statusCode: payload.statusCode || 400,
    headers: {
      ...cors,
    },
    body: {
      code: payload.result,
      error: payload.error,
    },
  });

const failureResult = <T>(result: T) =>
  failure({
    error: result,
    result: HttpResult.fail,
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
}) =>
  res({
    statusCode: 200,
    isBase64Encoded: true,
    body: fileContent.toString("base64"),
    headers: {
      "Content-Type": contentType,
    },
  });

export const httpResponse = {
  successResult,
  failureResult,

  fileNotFound,
  lambdaFile,
};
