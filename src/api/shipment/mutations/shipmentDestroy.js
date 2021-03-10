const ShipmentService = require('../../../services/shipmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  shipmentDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  shipmentDestroy: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentDestroy);

    await new ShipmentService(context).destroyAll(
      args.ids
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
