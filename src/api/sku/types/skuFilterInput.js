const schema = `
  input SkuFilterInput {
    id: String
    yearRange: [ Int ]
    name: String
    createdAtRange: [ DateTime ]
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
