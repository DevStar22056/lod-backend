const ShipmentService = require('../../../services/shipmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  shipmentImport(data: ShipmentInput!, importHash: String!): Boolean
`;

const resolver = {
  shipmentImport: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentImport);

    await new ShipmentService(context).import(
      args.data,
      args.importHash
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
