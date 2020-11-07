import { APIGatewayProxyHandler } from "aws-lambda";

import { productService } from "../services/product-service";
import { httpResponse } from "../libs/http";

type Params = {
  productId?: string;
};

const isInvalidParams = (p: Params) => !p.hasOwnProperty("productId")

export const getProductById: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const params = Object(event.pathParameters);

  console.info(event);

  if (isInvalidParams(params)) {
    return httpResponse.failureResult({ name: "validation error" });
  }

  const productId = params["productId"];

  try {
    const product = await productService.getProductById(productId);

    if (!product) {
      return httpResponse.failureResult({
        name: `Product not found by id: ${productId}`,
      });
    }

    return httpResponse.successResult({ data: product });
  } catch (e) {
    console.error(e.message);

    return httpResponse.failureResult({ name: "Something went wrong" });
  }
};
