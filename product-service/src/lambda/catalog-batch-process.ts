import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";

import { httpResponse } from "../libs/http";
import { lambda } from "../libs/lambda";
import { productService } from "../services/product-service";

const PRODUCT_TOPIC_ARN = process.env.PRODUCT_TOPIC_ARN;

const notifyBySNSEmailSubscription = async (products: any[]) => {
  const sns = new AWS.SNS();

  const withParams = p => ({
    Message: JSON.stringify(p),
    TopicArn: PRODUCT_TOPIC_ARN,
  })

  const handleResult = (e: Error) => {
    if (e) {
      console.info(">> EMERGENCY <<")
      console.error(e.message);
      return;
    }

    console.info("Successfuly emailed with product");
  }

  for (const p of products) {
    const params = withParams(p);
    console.info(params);
    
    await sns.publish(params, handleResult);
  }
}

export const catalogBatchProcess: APIGatewayProxyHandler = lambda(
  async (event) => {
    const products = (event.Records || []).map((record) =>
      JSON.parse(record.body)
    );

    const results = await productService.addManyProducts(products);

    await notifyBySNSEmailSubscription(products);

    return httpResponse.success({
      statusCode: 202,
      result: results,
    });
  }
);
