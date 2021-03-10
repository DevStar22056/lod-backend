const schema = `
  enum SubscriptionPaymentOrderByEnum {
    id_ASC
    id_DESC
    stripeInvoice_ASC
    stripeInvoice_DESC
    createdAt_ASC
    createdAt_DESC
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
