import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";

import { httpResponse } from "../libs/http";
import { lambda } from "../libs/lambda";
import { productService } from "../services/product-service";

const PRODUCT_TOPIC_ARN = process.env.PRODUCT_TOPIC_ARN;

type ProductDto = {
  title: string;
  description: string;
  price: number;
  count: number;
  imageName?: string;
};

const MessageSubject = (p: ProductDto) => `Hey! ${p.title} was uploaded`;

const MessageProductAttributes = (product: ProductDto) => ({
  title: {
    DataType: "String",
    StringValue: `${product.title}`,
  },
  description: {
    DataType: "String",
    StringValue: `${product.description}`,
  },
  count: {
    DataType: "Number",
    StringValue: `${product.count}`,
  },
  price: {
    DataType: "Number",
    StringValue: `${product.price}`,
  },
});

const withParams = (product: ProductDto) => ({
  Message: JSON.stringify(product),
  TopicArn: PRODUCT_TOPIC_ARN,
  Subject: MessageSubject(product),
  MessageAttributes: MessageProductAttributes(product)
});

const handleResult = (e: Error) => {
  if (e) {
    console.info(">> EMERGENCY <<");
    console.error(e.message);
    return;
  }

  console.info("Successfuly emailed with product");
};

const notifyBySNSEmailSubscription = async (products: any[]) => {
  const sns = new AWS.SNS();

  for (const p of products) {
    const params = withParams(p);
    console.info(params);

    await sns.publish(params, handleResult).promise();
  }
};

const isEmpty = (products: ProductDto[]) => !products.length;

export const catalogBatchProcess: APIGatewayProxyHandler = lambda(
  async (event) => {
    const products = (event.Records || []).map((record) =>
      JSON.parse(record.body)
    );

    if (isEmpty(products)) {
      return httpResponse.success({
        statusCode: 202,
        result: [],
      });
    }

    const results = await productService.addManyProducts(products);

    await notifyBySNSEmailSubscription(products);

    return httpResponse.success({
      statusCode: 202,
      result: results,
    });
  }
);
