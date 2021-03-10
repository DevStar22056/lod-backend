const SkuService = require('../../../services/skuService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  skuCreate(data: SkuInput!): Sku!
`;

const resolver = {
  skuCreate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.skuCreate);

    return new SkuService(context).create(
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
