import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import csvParser from "csv-parser";
import request from "request";

import { httpResponse } from "./libs/http";

import "source-map-support/register";

// TODO: refactor this file

const BUCKET_NAME = process.env.BUCKET_NAME;

type Product = {
  title: string;
  count: number;
  description: string;
  price: number;
  imageName?: string;
};

const addProduct = (product: Product) => {
  const url =
    "https://qt1ja1wqr9.execute-api.eu-west-1.amazonaws.com/dev/products";

  const form = {
    title: product.title,
    description: product.description,
    price: product.price,
    count: product.count,
    imageName: product.imageName,
  };

  return new Promise((resolve, reject) => {
    request.post({ url, form }, (err, _r, body) => {
      if (err) {
        console.error(err);

        reject(err);
      }

      resolve(body);
    });
  });
};

// TODO: streams/promises pipeline later
const addProductWithStreamLogging = (s3, objectKey: string) =>
  new Promise((resolve, reject) => {
    const streamParams = {
      Bucket: BUCKET_NAME,
      Key: objectKey,
    };

    const s3Object = s3.getObject(streamParams);

    s3Object
      .createReadStream()
      .pipe(csvParser())
      .on("data", (product) => {
        console.info(product);

        // temp: only for demo file uploading
        addProduct(product).then(resolve).catch(reject);
      })
      .on("error", reject)
      .on("close", () => console.info("stream closed"))
      .on("end", () => console.info("stream finished"));
  });

export const importsFileParser: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  console.info(event);

  const s3 = new AWS.S3({
    region: "eu-west-1",
    signatureVersion: "v4", // if eu region )
  });

  const records = event.Records || [];

  for (const record of records) {
    const recordObjectKey = record.s3.object.key;

    console.info(recordObjectKey);

    try {
      await addProductWithStreamLogging(s3, recordObjectKey);

      const copyCfg = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${recordObjectKey}`,
        Key: recordObjectKey.replace("uploaded", "parsed"),
      };

      const deleteCfg = {
        Bucket: BUCKET_NAME,
        Key: recordObjectKey,
      };

      console.info("done");

      await s3.copyObject(copyCfg).promise();
      await s3.deleteObject(deleteCfg).promise();
    } catch (e) {
      console.error(e);

      return httpResponse.failureResult({ message: "something went wrong" });
    }
  }

  return httpResponse.success({
    statusCode: 202,
    result: null,
  });
};
