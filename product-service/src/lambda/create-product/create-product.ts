import { APIGatewayProxyHandler } from "aws-lambda";
import querystring from 'querystring'

import { httpResponse } from "../../libs/http";
import { lambda } from "../../libs/lambda";
import { productService } from "../../services/product-service";
import { validateProductBody } from "./validation-scheme";


// TODO: investigate why event.base comes in base64, avoid any
// event.pathParamters, event.queryStringParamters are null
const parse = (body: any) => {
  const query = Buffer.from(body, 'base64').toString('UTF-8');

  return querystring.parse(query);
}

export const createProduct: APIGatewayProxyHandler = lambda(async (event) => {
  const body = parse(event.body);
  const [isInvalid, errorText] = validateProductBody(body);

  if (isInvalid) {
    return httpResponse.failure({
      statusCode: 400,
      error: { message: `validation errors: ${errorText}` },
    });
  }

  const result = await productService.addProduct(body as any);

  return httpResponse.success({
    result,
    statusCode: 201
  });
});
