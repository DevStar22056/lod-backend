const SkuService = require('../../../services/skuService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
  skuList(filter: SkuFilterInput, limit: Int, offset: Int, orderBy: SkuOrderByEnum): SkuPage!
`;

const resolver = {
  skuList: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.skuRead);

    return new SkuService(context).findAndCountAll({
      ...args,
      requestedAttributes: graphqlSelectRequestedAttributes(
        info,
        'rows',
      ),
    });
  },
};

exports.schema = schema;
exports.resolver = resolver;
