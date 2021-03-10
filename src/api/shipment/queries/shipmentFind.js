const ShipmentService = require('../../../services/shipmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  shipmentFind(id: String!): Shipment!
`;

const resolver = {
  shipmentFind: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentRead);

    return new ShipmentService(context).findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
