const SkuService = require('../../../services/skuService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  skuUpdate(id: String!, data: SkuInput!): Sku!
`;

const resolver = {
  skuUpdate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.skuEdit);

    return new SkuService(context).update(
      args.id,
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
