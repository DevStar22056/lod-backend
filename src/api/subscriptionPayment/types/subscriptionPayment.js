const schema = `
  type SubscriptionPayment {
    id: String!
    stripeInvoice: String
    member: Member
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
