import { productService } from "../services/product-service";
import { lambda } from "../libs/lambda";
import { httpResponse } from "../libs/http";

type Params = {
  productId?: string;
};

const isInvalidParams = (p: Params) => !p.hasOwnProperty("productId");

const notProductFoundResponse = (productId: string) => {
  return httpResponse.failure({
    statusCode: 404,
    error: { name: `Product not found by id: ${productId}` },
  });
}

export const getProductById = lambda(async (event) => {
  const params = Object(event.pathParameters);

  if (isInvalidParams(params)) {
    return httpResponse.failureResult({ name: "validation error" });
  }

  const productId = params["productId"];

  const product = await productService.getProductById(productId);

  if (!product) {
    return notProductFoundResponse(productId);
  }

  return httpResponse.successResult({ data: product });
});
