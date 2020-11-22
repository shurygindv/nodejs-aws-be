import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import csvParser from "csv-parser";

import { httpResponse } from "./libs/http";

import "source-map-support/register";

// TODO: refactor this file

const BUCKET_NAME = process.env.BUCKET_NAME;
const SQS_PRODUCT_URL = process.env.SQS_PRODUCT_URL;

type Options = {
  s3Provider: AWS.S3;
  objectKey: string;
  onProductAdd(product: any): Promise<any>;
};

// TODO: streams/promises pipeline later
const pullProductByStream = ({
  s3Provider,
  objectKey,
  onProductAdd,
}: Options) =>
  new Promise((resolve, reject) => {
    const streamParams = {
      Bucket: BUCKET_NAME,
      Key: objectKey,
    };

    const s3Object = s3Provider.getObject(streamParams);

    s3Object
      .createReadStream()
      .pipe(csvParser())
      .on("data", (product) => {
        console.info(product);

        // temp: only for demo file uploading
        onProductAdd(product).then(resolve).catch(reject);
      })
      .on("error", reject)
      .on("close", () => console.info("stream closed"))
      .on("end", () => console.info("stream finished"));
  });

const copyObject = (s3: AWS.S3, recordObjectKey: string) => {
  const copyCfg = {
    Bucket: BUCKET_NAME,
    CopySource: `${BUCKET_NAME}/${recordObjectKey}`,
    Key: recordObjectKey.replace("uploaded", "parsed"),
  };

  return s3.copyObject(copyCfg).promise();
};

const deleteObject = (s3: AWS.S3, recordObjectKey: string) => {
  const deleteCfg = {
    Bucket: BUCKET_NAME,
    Key: recordObjectKey,
  };

  return s3.deleteObject(deleteCfg).promise();
};

const getRecordS3PathKey = (record: any) => {
  const s3ObjectKey = record.s3.object.key;
  // why here decode? GOOD QUESTION
  // because spaces +, src: https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example-deployment-pkg.html#with-s3-example-deployment-pkg-nodejs

  return decodeURIComponent(s3ObjectKey.replace(/\+/g, " "));
};

const addToProductSQS = (sqs: AWS.SQS, product: any) => {
  const params = {
    QueueUrl: SQS_PRODUCT_URL,
    MessageBody: JSON.stringify(product)
  };

  console.info(`product queued`);

  const handleResult = (e: Error) => {
    if (e) {
      console.info('>> EMERGENCY! ERROR HAPPENS WHEN SQS PUSHING <<')
      console.error(e);
      console.info('>> EMERGENCY! ERROR HAPPENS WHEN SQS PUSHING <<');
      return;
    }

    console.info("product successfully popped")
  }

  return sqs.sendMessage(params, handleResult).promise();
};

const createAWSProviders = () => {
  const s3Provider = new AWS.S3({
    region: "eu-west-1",
    signatureVersion: "v4", // if eu region )
  });

  const sqsProvider = new AWS.SQS({
    region: "eu-west-1",
  });

  return {
    s3Provider,
    sqsProvider,
  };
};

export const importsFileParser: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  console.info(event);
  const { s3Provider, sqsProvider } = createAWSProviders();

  for (const record of event.Records || []) {
    const recordS3Key = getRecordS3PathKey(record);

    try {
      await pullProductByStream({
        s3Provider: s3Provider,
        objectKey: recordS3Key,
        onProductAdd: (product) => addToProductSQS(sqsProvider, product),
      });

      console.info("done");

      await copyObject(s3Provider, recordS3Key);
      await deleteObject(s3Provider, recordS3Key);
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
