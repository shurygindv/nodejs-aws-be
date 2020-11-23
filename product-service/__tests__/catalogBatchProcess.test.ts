import * as jestPlugin from "serverless-jest-plugin";

import * as mod from "./../handler";

// tests for getAllProducts
// Generated by serverless-jest-plugin

const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: "catalogBatchProcess" });

const snsInstance = {
  publish: jest.fn(),
};

jest.mock("aws-sdk", () => ({ SNS: jest.fn(() => snsInstance) }));

const fakeEventProduct = JSON.stringify({
  count: 12,
  description: "Test Short Product Description",
  price: 15,
  title: "Product ##4",
});

const fakeEvent = {
  Records: [
    {
      body: fakeEventProduct,
    },
  ],
};

const fakeProduct = {
  count: 12,
  description: "Short Product Description7",
  id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
  price: 15,
  title: "Product ##4",
};

const pgClient = {
  // @ts-ignore
  query: jest.fn(() =>
    Promise.resolve({
      rows: [fakeProduct, fakeProduct],
    })
  ),
  release: jest.fn(),
};

jest.mock("pg", () => ({
  Pool: jest.fn(() => ({
    connect: jest.fn(() => Promise.resolve(pgClient)),
  })),
}));


describe("catalogBatchProcess.test", () => {
  beforeAll((done) => {
    done();
  });

  it("should run", () => {
    return wrapped.run({}).then((res) => {
      expect(res).toBeDefined();
    });
  });

  it("should contain correct statusCode", () => {
    return wrapped.run({ Records: [] }).then((res) => {
      expect(res.statusCode).toEqual(202);
    });
  });

  it("should call SNS once", async () => {
    await snsInstance.publish.mockClear();
    
    return wrapped.run(fakeEvent).then(() => {
      expect(snsInstance.publish).toHaveBeenCalledTimes(1);
    });
  });

  it("should call SNS with body", async () => {
    await snsInstance.publish.mockClear();

    return wrapped.run(fakeEvent).then(() => {
      const expectedParams = {
        Message: fakeEventProduct,
        TopicArn: process.env.PRODUCT_TOPIC_ARN,
        Subject: `Hey! Somebody has uploaded files`
      };

      expect(snsInstance.publish).lastCalledWith(expectedParams, expect.any(Function));
    });
  });

  it("PG: should release connection once", async () => {
    await pgClient.release.mockClear();

    return wrapped.run(fakeEvent).then(() => {
      expect(pgClient.release).toHaveBeenCalledTimes(1);
    });
  });
});
