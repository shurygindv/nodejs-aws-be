
import { httpResponse } from "./http";

import type { APIGatewayProxyEvent, Context } from "aws-lambda";

export const lambda = (fn: Function) => async (
  event: APIGatewayProxyEvent,
  ctx: Context
) => {
  console.info("=============");

  console.info(event);
  console.info(ctx);

  console.info("=============");

  try {
    const res = await fn(event);

    return res;
  } catch (e) {
    console.error(e);

    return httpResponse.failure({
      statusCode: 500,
      error: { message: "something went wrong" }
    });
  }
};

