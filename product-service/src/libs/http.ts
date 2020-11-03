const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };
  
  const success = <T>(data: T) => ({
    statusCode: 200,
    headers: {
      ...cors,
    },
    body: JSON.stringify({
      code: "success",
      result: data,
    }),
  });
  
  const failure = <T>(e: T) => ({
    statusCode: 400,
    headers: {
      ...cors
    },
    body: JSON.stringify({
      code: "error",
      error: e,
    }),
  });
  
  export const httpResponse = {
    success,
    failure,
  };
  