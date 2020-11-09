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
  const buff = Buffer.from(event.body, 'base64'); // TODO: because event.pathParamters null, queryStringParamters null
  const body = JSON.parse(buff.toString('UTF-8'));

  if (isProductBodyInvalid(body)) {
    return httpResponse.failure({
      statusCode: 400,
      error: { message: "validation error" },
    });
  }

  console.log(body);

  const result = await productService.addProduct(body as any);

  return httpResponse.successResult(result);
});
