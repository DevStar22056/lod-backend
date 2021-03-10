const schema = `
  input SubscriptionPaymentInput {
    stripeInvoice: String
    member: String
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
