const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const SkuService = require('../../../services/skuService');

const schema = `
  skuAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  skuAutocomplete: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.skuAutocomplete);

    return new SkuService(context).findAllAutocomplete(
      args.query,
      args.limit,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
