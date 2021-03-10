const schema = `
  input SkuInput {
    year: Int!
    name: String!
    description: String
    photos: [ FileInput! ]
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
