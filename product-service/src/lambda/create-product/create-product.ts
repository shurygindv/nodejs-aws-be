import { APIGatewayProxyHandler } from "aws-lambda";

import { httpResponse } from "../../libs/http";
import { lambda } from "../../libs/lambda";
import { productService } from "../../services/product-service";
import { isProductBodyInvalid } from "./validation-scheme";
// TODO: refactor this

type Product = {
  id?: string;
  title: string;
  description: string;
  price: number;
  imageName?: string;
};

export const createProduct: APIGatewayProxyHandler = lambda(async (event) => {
  const body = event.queryStringParameters;

  if (isProductBodyInvalid(body)) {
    return httpResponse.failure({
      statusCode: 400,
      error: { message: "validation error" },
    });
  }

  const result = await productService.addProduct(body);

  return httpResponse.successResult(result);
});
