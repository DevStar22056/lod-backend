const ShipmentService = require('../../../services/shipmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  shipmentCreate(data: ShipmentInput!): Shipment!
`;

const resolver = {
  shipmentCreate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentCreate);

    return new ShipmentService(context).create(
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
