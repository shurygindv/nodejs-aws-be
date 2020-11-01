import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

import { productDb } from "./product-db";
import { httpResponse } from "./libs";

export const getAllProducts: APIGatewayProxyHandler = async (
  _event,
  _context
) => {
  try {
    const products = await productDb.selectAllProducts();

    return httpResponse.success({ items: products });
  } catch (e) {
    console.error(e.message);

    return httpResponse.failure({ name: 'Something went wrong'});
  }
};
