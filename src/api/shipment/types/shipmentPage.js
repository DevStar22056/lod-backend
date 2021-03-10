const schema = `
  type ShipmentPage {
    rows: [Shipment!]!
    count: Int!
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
