const SkuService = require('../../../services/skuService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  skuDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  skuDestroy: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.skuDestroy);

    await new SkuService(context).destroyAll(
      args.ids
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
