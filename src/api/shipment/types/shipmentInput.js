const schema = `
  input ShipmentInput {
    sku: [ SkuWithQuantityInput! ]!
    shipped: Boolean
    member: String!
    shipmentYear: Int
    trackingId: String
    notes: String
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
