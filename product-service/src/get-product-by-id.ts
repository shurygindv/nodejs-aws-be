import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { productDb } from "./product-db";
import { httpResponse } from "./libs";

type Params = {
  productId?: string;
};

const isInvalidParams = (p: Params) => !p["productId"];

export const getProductById: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const params = event.queryStringParameters || {};

  if (isInvalidParams(params)) {
    return httpResponse.failure({ name: "validation error" });
  }

  try {
    const product = await productDb.selectProductById(params["productId"]);

    console.info(product);

    return httpResponse.success({ data: product || null });
  } catch (e) {
    console.error(e.message);

    return httpResponse.failure({ name: "Something went wrong" });
  }
};
