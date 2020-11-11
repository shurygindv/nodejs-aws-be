import { APIGatewayProxyHandler } from "aws-lambda";

import { httpResponse } from "../libs/http";
import { lambda } from "../libs/lambda";
import { productService } from "../services/product-service";

export const getAllProducts: APIGatewayProxyHandler = lambda(async () => {
  const result = await productService.getAllProducts();

  return httpResponse.successResult({items: result});
});
