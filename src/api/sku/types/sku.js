const schema = `
  type Sku {
    id: String!
    year: Int
    name: String
    description: String
    photos: [ File! ]
    createdAt: DateTime
    updatedAt: DateTime
    shipmentSku: ShipmentSku
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
