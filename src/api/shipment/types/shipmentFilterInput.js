const schema = `
  input ShipmentFilterInput {
    id: String
    shipped: Boolean
    member: String
    shipmentYearRange: [ Int ]
    createdAtRange: [ DateTime ]
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
