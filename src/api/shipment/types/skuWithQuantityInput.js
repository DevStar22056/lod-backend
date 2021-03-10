const schema = `
  input SkuWithQuantityInput {
    id: String!
    quantity: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
