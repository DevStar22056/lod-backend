const schema = `
  type MemberNotePage {
    rows: [MemberNote!]!
    count: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
