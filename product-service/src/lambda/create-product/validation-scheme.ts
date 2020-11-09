import Ajv from "ajv";

// todo: refactor

const ajv = new Ajv({ allErrors: true, schemaId: "id" });
ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));

// TODO: return type coercion
const createProductScheme = {
  $id: "http://json-schema.org/draft-04/schema#",
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  required: ["title", "price", "count", "description"],
  properties: {
    title: {
      type: "string"
    },
    description: {
      type: "string"
    },
    price: {
      type: "string",
    },
    count: {
      type: "string",
    },
    imageName: {
      type: "string",
    },
  },
};

ajv.addSchema(createProductScheme, "createProductScheme");

export const validateProductBody = <T>(body: T) => {
  const isValid = ajv.validate("createProductScheme", body);
  
  return [!isValid, ajv.errorsText()] as const;
};
