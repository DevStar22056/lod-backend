const SkuService = require('../../../services/skuService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  skuFind(id: String!): Sku!
`;

const resolver = {
  skuFind: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.skuRead);

    return new SkuService(context).findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
