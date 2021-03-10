const ShipmentService = require('../../../services/shipmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  shipmentShip(ids: [String!]!): Boolean
`;

const resolver = {
  shipmentShip: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentShip);

    await new ShipmentService(context).shipAll(
      args.ids
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
