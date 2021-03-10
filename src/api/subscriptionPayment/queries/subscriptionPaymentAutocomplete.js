const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const SubscriptionPaymentService = require('../../../services/subscriptionPaymentService');

const schema = `
  subscriptionPaymentAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  subscriptionPaymentAutocomplete: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.subscriptionPaymentAutocomplete);

    return new SubscriptionPaymentService(context).findAllAutocomplete(
      args.query,
      args.limit,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
