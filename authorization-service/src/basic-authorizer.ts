import { APIGatewayProxyHandler } from "aws-lambda";

const isNotTokenReq = (type: string) => type !== "TOKEN";

const parseCredentials = (principalId: string) => {
  const buffer = Buffer.from(principalId, "base64");
  const [username, password] = buffer.toString("utf-8").split(":");

  return [username, password] as const;
};

const getAccessTypeForUser = ([userName, password]: [string, string]) => {
  const userPassword = process.env[userName];

  const isValid = userPassword && userPassword === password;

  const effect = isValid ? "Allow" : "Deny";
  const description = isValid ? "" : `Invalid credentials for ${userName}`;

  return [effect, description] as const;
};

const generatePolicy = ({ principalId, resource, effect, description }) => ({
  principalId: principalId,
  // TODO: maybe https://stackoverflow.com/questions/47921803/how-to-throw-custom-error-message-from-api-gateway-custom-authorizer/49806967#49806967
  context: {
    description,
  },
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

export const basicAuthorizer: APIGatewayProxyHandler = (event, _, callback) => {
  console.info(event);

  const authToken = event.authorizationToken || "";
  
  const [, principalId] = authToken.split(" ");

  if (!principalId || isNotTokenReq(event.type)) {
    callback("Unauthorized");
    return;
  }

  try {
    const [effect, denyDescription] = getAccessTypeForUser(
      parseCredentials(principalId)
    );

    console.info(effect);

    const policy = generatePolicy({
      effect,
      principalId,
      resource: event.methodArn,
      description: denyDescription,
    });

    console.info(policy);

    callback(null, policy);
  } catch (e) {
    console.error(e);

    return callback(`Unauthorized: ${e.message}`);
  }
};
