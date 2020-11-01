const success = <T>(data: T) => ({
  statusCode: 200,
  body: JSON.stringify({
    code: "success",
    result: data,
  }),
});

const failure = <T>(e: T) => ({
  statusCode: 400,
  body: JSON.stringify({
    code: "error",
    error: e,
  }),
});


export const httpResponse = {
    success,
    failure,
};