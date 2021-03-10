const schema = `
  type MemberNote {
    id: String!
    note: String!
    memberId: String!
    updatedAt: DateTime
    updatedBy: User
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
