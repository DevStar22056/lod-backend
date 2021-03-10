const schema = `
  input SubscriptionPaymentFilterInput {
    id: String
    member: String
    createdAtRange: [ DateTime ]
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
