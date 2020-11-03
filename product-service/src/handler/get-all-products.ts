import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { productService } from "../services/product-service";
import { httpResponse } from "../libs/http";

export const getAllProducts: APIGatewayProxyHandler = async (
  _event,
  _context
) => {
  try {
    const products = await productService.getAllProducts();

    return httpResponse.success({ items: products });
  } catch (e) {
    console.error(e.message);

    return httpResponse.failure({ name: 'Something went wrong'});
  }
};
