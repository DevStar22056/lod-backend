const schema = `
  type MemberPage {
    rows: [Member!]!
    count: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
