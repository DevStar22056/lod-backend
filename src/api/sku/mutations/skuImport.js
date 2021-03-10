const SkuService = require('../../../services/skuService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  skuImport(data: SkuInput!, importHash: String!): Boolean
`;

const resolver = {
  skuImport: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.skuImport);

    await new SkuService(context).import(
      args.data,
      args.importHash
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
