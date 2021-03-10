const schema = `
  type SubscriptionPaymentPage {
    rows: [SubscriptionPayment!]!
    count: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
