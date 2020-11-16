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


const copyObject = (s3, recordObjectKey: string) => {
  const copyCfg = {
    Bucket: BUCKET_NAME,
    CopySource: `${BUCKET_NAME}/${recordObjectKey}`,
    Key: recordObjectKey.replace("uploaded", "parsed"),
  };

  return s3.copyObject(copyCfg).promise();
} 


const deleteObject = (s3, recordObjectKey: string) => {
  const deleteCfg = {
    Bucket: BUCKET_NAME,
    Key: recordObjectKey,
  };

  return s3.deleteObject(deleteCfg).promise();
} 


const getRecordS3PathKey = (record: any) => {
  const s3ObjectKey = record.s3.object.key;
  // why here decode? GOOD QUESTION
  // because spaces +, src: https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-deployment-pkg.html#with-s3-example-deployment-pkg-nodejs

  return decodeURIComponent(s3ObjectKey.replace(/\+/g, " "));
}

export const importsFileParser: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  console.info(event);

  const s3 = new AWS.S3({
    region: "eu-west-1",
    signatureVersion: "v4", // if eu region )
  });

  for (const record of event.Records || []) {
    const recordS3Key = getRecordS3PathKey(record);

    try {
      await addProductWithStreamLogging(s3, recordS3Key);

      console.info("done");

      await copyObject(s3, recordS3Key)
      await deleteObject(s3, recordS3Key)
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
