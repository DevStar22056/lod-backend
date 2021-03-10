const schema = `
  type SkuPage {
    rows: [Sku!]!
    count: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
