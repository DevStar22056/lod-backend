const ShipmentService = require('../../../services/shipmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  shipmentUpdate(id: String!, data: ShipmentInput!): Shipment!
`;

const resolver = {
  shipmentUpdate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentEdit);

    return new ShipmentService(context).update(
      args.id,
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
