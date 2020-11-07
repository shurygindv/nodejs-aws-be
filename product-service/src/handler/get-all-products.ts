import { APIGatewayProxyHandler } from "aws-lambda";

import { productService } from "../services/product-service";
import { httpResponse } from "../libs/http";

export const getAllProducts: APIGatewayProxyHandler = async (
  _event,
  _context
) => {
  try {
    const products = await productService.getAllProducts();

    return httpResponse.successResult({ items: products });
  } catch (e) {
    console.error(e.message);

    return httpResponse.failureResult({ name: 'Something went wrong'});
  }
};
