import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";

import { validator as v } from "./libs/validator";
import { httpResponse } from "./libs/http";

import "source-map-support/register";

const isInvalidFileName = (name: string) => !v.isCSVFileName(name);

const s3 = () =>
  new AWS.S3({
    region: "eu-west-1",
    signatureVersion: "v4", // if eu region )
  });

const getSignedUrlAsync = (validFileName: string) =>
  s3().getSignedUrlPromise("putObject", {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${validFileName}`,
    Expires: 30,
    ContentType: "text/csv",
  });

export const importProductsFile: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const csvFileName = decodeURIComponent(Object(event.queryStringParameters).name || '');

  console.info(event);

  if (isInvalidFileName(csvFileName)) {
    return httpResponse.failureResult({
      message: `invalid filename, got: ${csvFileName}`,
    });
  }

  try {
    const signedUrl = await getSignedUrlAsync(csvFileName);

    console.info(signedUrl);

    return httpResponse.successResult(signedUrl);
  } catch (e) {
    console.error(e);

    return httpResponse.failureResult({
      message: "something went wrong",
    });
  }
};
