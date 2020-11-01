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
  const params = event.pathParameters || {};

  console.info(event);

  if (isInvalidParams(params)) {
    return httpResponse.failure({ name: "validation error" });
  }

  const productId = params["productId"];

  try {
    const product = await productDb.selectProductById(productId);

    if (!product) {
      return httpResponse.failure({
        name: `Product not found by id: ${productId}`,
      });
    }

    return httpResponse.success({ data: product || null });
  } catch (e) {
    console.error(e.message);

    return httpResponse.failure({ name: "Something went wrong" });
  }
};
