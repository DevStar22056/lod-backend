const schema = `
  input MemberNoteInput {
    note: String!
    memberId: String!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
