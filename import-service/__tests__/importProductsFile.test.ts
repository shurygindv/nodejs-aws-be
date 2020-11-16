import jestPlugin from "serverless-jest-plugin";
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

import * as mod from "./../handler";
// tests for getAllProducts
// Generated by serverless-jest-plugin

const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: "importProductsFile" });

const validBody = {
  queryStringParameters: { name: 'test.csv' },
};

const invalidBody = {
  queryStringParameters: { name: "invalidfilename" },
};

describe("importProductsFile", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore("S3");
  });

  it("shoul present response body", () => {
    return wrapped.run({}).then((response) => {
      expect(response).toBeDefined();
    });
  });

  it("should contain correct uploading link", () => {
    return wrapped.run(validBody).then((response) => {
      const body = JSON.parse(response.body);

      expect(body.code).toEqual("success");
      expect(body.result).toContain('https://rsschool-import-service.s3.eu-west-1.amazonaws.com/uploaded/test.csv')
    });
  });

  it("should be fail when invalid", () => {
    const SIGNED_URL_MOCK = "https://some-resource.com";
    const getSignedUrlPromiseMocked = jest.fn(() => SIGNED_URL_MOCK);

    AWSMock.mock("S3", "getSignedUrlPromise", getSignedUrlPromiseMocked);

    return wrapped.run(invalidBody).then((response) => {
      expect(JSON.parse(response.body)).toEqual({
        code: "fail",
        error: {
          message: `invalid filename, got: invalidfilename`,
        },
      });
    });
  });

  it("should be call getSignedUrlPromise", () => {
    const mockedFn = jest.fn(() => void 0);

    AWSMock.mock("S3", "getSignedUrlPromise", mockedFn);

    return wrapped.run(validBody).then(() => {
      expect(mockedFn.mock.calls.length).toBe(1);
    });
  });
});