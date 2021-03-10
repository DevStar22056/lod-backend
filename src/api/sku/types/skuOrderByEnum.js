const schema = `
  enum SkuOrderByEnum {
    id_ASC
    id_DESC
    year_ASC
    year_DESC
    name_ASC
    name_DESC
    createdAt_ASC
    createdAt_DESC
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
