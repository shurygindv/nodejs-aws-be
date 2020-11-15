import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import csvParser from "csv-parser";

import { httpResponse } from "./libs/http";

import "source-map-support/register";

const s3 = new AWS.S3({
  region: "eu-west-1",
  signatureVersion: "v4", // if eu region )
});

const BUCKET_NAME = process.env.BUCKET_NAME;

const logFileWithS3Stream = (s3ObjectKey: string) =>
  new Promise((resolve, reject) => {
    const streamParams = {
      Bucket: BUCKET_NAME,
      Key: s3ObjectKey,
    };

    const stream = s3.getObject(streamParams).createReadStream();

    console.info(streamParams);

    stream
      .pipe(csvParser())
      .on("data", console.log)
      .on("error", reject)
      .on("end", resolve);
  });

export const importsFileParser: APIGatewayProxyHandler = async (
  event: any,
  _context
) => {
  console.info(event);

  for (const record of event.Records) {
    const recordObjectKey = record.s3.object.key;

    console.info(record.s3.object);

    try {
      await logFileWithS3Stream(recordObjectKey)

      const copyCfg = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${recordObjectKey}`,
        Key: recordObjectKey.replace("uploaded", "parsed"),
      };
  
      const deleteCfg = {
        Bucket: BUCKET_NAME,
        Key: recordObjectKey,
      };
  
      console.info(copyCfg);
  
      await s3.copyObject(copyCfg).promise();
      await s3.deleteObject(deleteCfg).promise();
    } catch (e) {
      console.error(e);

      return httpResponse.failureResult({message: 'something went wrong'})
    }
  }


  return httpResponse.successResult({});
};
