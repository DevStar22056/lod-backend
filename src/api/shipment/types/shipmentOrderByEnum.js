const schema = `
  enum ShipmentOrderByEnum {
    id_ASC
    id_DESC
    shipped_ASC
    shipped_DESC
    shipmentYear_ASC
    shipmentYear_DESC
    createdAt_ASC
    createdAt_DESC
    notes_ASC
    notes_DESC
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
