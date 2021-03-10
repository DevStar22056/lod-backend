const schema = `
  type Shipment {
    id: String!
    sku: [ Sku! ]
    shipped: Boolean
    member: Member
    shipmentYear: Int
    trackingId: String
    notes: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
